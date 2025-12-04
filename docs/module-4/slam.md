---
title: "SLAM"
description: "Advanced Simultaneous Localization and Mapping for complex environments"
module_id: "module-4"
sidebar_position: 4
tags: ["slam", "localization", "mapping", "loop-closure", "visual-slam"]
difficulty: advanced
estimated_minutes: 25
---

# SLAM

## Learning Objectives

By the end of this section, you will be able to:
- Understand advanced SLAM algorithms and their trade-offs
- Implement graph-based SLAM systems
- Handle loop closures and map optimization
- Deal with dynamic environments and moving objects
- Implement multi-robot SLAM
- Optimize SLAM for real-time performance
- Integrate SLAM with navigation and manipulation

## Advanced SLAM Concepts

### Graph-Based SLAM

Modern SLAM systems use pose graphs to represent robot trajectories and landmarks. The graph is optimized to minimize overall error while maintaining loop closure consistency.

```python
import numpy as np
import g2o

class GraphSLAM:
    def __init__(self):
        # Initialize g2o optimizer
        solver = g2o.BlockSolverSE3(g2o.LinearSolverCholmodSE3())
        solver = g2o.OptimizationAlgorithmLevenberg(solver)

        self.optimizer = g2o.SparseOptimizer()
        self.optimizer.set_algorithm(solver)

        self.vertex_id = 0
        self.vertices = {}
        self.edges = []

    def add_pose(self, pose_matrix, fixed=False):
        """
        Add pose vertex to graph

        Args:
            pose_matrix: 4x4 SE(3) transformation matrix
            fixed: Whether this vertex is fixed in optimization
        """
        # Create vertex
        v_se3 = g2o.VertexSE3Expmap()
        v_se3.set_id(self.vertex_id)

        # Convert 4x4 matrix to g2o Isometry3d
        isometry = g2o.Isometry3d(
            g2o.Quaternion(pose_matrix[:3, :3]),
            pose_matrix[:3, 3]
        )
        v_se3.set_estimate(isometry)

        if fixed:
            v_se3.set_fixed(True)

        self.optimizer.add_vertex(v_se3)
        self.vertices[self.vertex_id] = v_se3

        self.vertex_id += 1
        return self.vertex_id - 1

    def add_odometry_edge(self, vertex1_id, vertex2_id, relative_pose, information):
        """
        Add odometry constraint edge

        Args:
            vertex1_id: First pose vertex ID
            vertex2_id: Second pose vertex ID
            relative_pose: Relative pose (4x4 matrix)
            information: Information matrix (6x6)
        """
        edge = g2o.EdgeSE3Expmap()
        edge.set_id(len(self.edges))
        edge.set_vertex(0, self.vertices[vertex1_id])
        edge.set_vertex(1, self.vertices[vertex2_id])

        # Convert relative pose
        isometry = g2o.Isometry3d(
            g2o.Quaternion(relative_pose[:3, :3]),
            relative_pose[:3, 3]
        )
        edge.set_measurement(isometry)

        # Set information (inverse of covariance)
        edge.set_information(information)

        # Add robust kernel for outlier rejection
        edge.set_robust_kernel(g2o.RobustKernelHuber())

        self.optimizer.add_edge(edge)
        self.edges.append(edge)

    def add_loop_closure(self, vertex1_id, vertex2_id, relative_pose, information):
        """Add loop closure constraint"""
        self.add_odometry_edge(vertex1_id, vertex2_id, relative_pose, information)

    def optimize(self, iterations=20):
        """Optimize the pose graph"""
        self.optimizer.initialize_optimization()
        chi2 = self.optimizer.optimize(iterations)
        return chi2

    def get_poses(self):
        """Get optimized poses"""
        poses = {}
        for vertex_id, vertex in self.vertices.items():
            pose = vertex.estimate()
            pose_matrix = np.eye(4)
            pose_matrix[:3, :3] = pose.orientation().matrix()
            pose_matrix[:3, 3] = pose.position()
            poses[vertex_id] = pose_matrix

        return poses
```

### Loop Closure Detection

```python
from sklearn.neighbors import NearestNeighbors
import cv2

class LoopClosureDetector:
    def __init__(self, threshold=0.8):
        self.threshold = threshold
        self.keyframes = []
        self.descriptors = None
        self.feature_extractor = cv2.ORB_create(nfeatures=500)

    def extract_features(self, image):
        """Extract ORB features from image"""
        keypoints, descriptors = self.feature_extractor.detectAndCompute(
            image, None
        )
        return keypoints, descriptors

    def add_keyframe(self, frame_id, image):
        """Add keyframe and extract features"""
        _, descriptors = self.extract_features(image)

        self.keyframes.append({
            'id': frame_id,
            'image': image,
            'descriptors': descriptors
        })

        # Update descriptor database
        if self.descriptors is None:
            self.descriptors = descriptors.astype(np.float32)
        else:
            self.descriptors = np.vstack([
                self.descriptors,
                descriptors.astype(np.float32)
            ])

    def detect_loop_closure(self, current_frame_id, image):
        """
        Detect if current frame closes a loop

        Returns:
            (loop_closed, matched_frame_id, similarity)
        """
        if len(self.keyframes) < 5:
            return False, None, 0.0

        # Extract current features
        _, current_descriptors = self.extract_features(image)

        if current_descriptors is None:
            return False, None, 0.0

        # Match with previous keyframes
        bf_matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        matches = bf_matcher.knnMatch(
            self.descriptors,
            current_descriptors,
            k=2
        )

        # Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < 0.75 * n.distance:
                    good_matches.append(m)

        # Check if sufficient matches for loop closure
        if len(good_matches) < 15:
            return False, None, 0.0

        # Calculate similarity
        similarity = len(good_matches) / len(current_descriptors)

        if similarity > self.threshold:
            # Find which keyframe matched
            matched_idx = good_matches[0].queryIdx // len(self.keyframes[0]['descriptors'])
            matched_frame_id = self.keyframes[matched_idx]['id']

            return True, matched_frame_id, similarity

        return False, None, similarity
```

## Visual SLAM with Orb-SLAM3

```python
import subprocess
import json

class OrbSLAM3Wrapper:
    def __init__(self, config_file, vocabulary_file, use_gpu=True):
        """Wrapper around ORB-SLAM3"""
        self.config_file = config_file
        self.vocabulary_file = vocabulary_file
        self.use_gpu = use_gpu
        self.trajectory = []

    def process_monocular_sequence(self, image_paths, timestamps):
        """Process monocular image sequence"""
        # Build command
        cmd = [
            './Examples/Monocular/mono_tum',
            self.vocabulary_file,
            self.config_file
        ]

        # Process images
        for image_path, timestamp in zip(image_paths, timestamps):
            # Load image
            image = cv2.imread(image_path)

            # Process (simplified - actual ORB-SLAM3 integration more complex)
            pose = self._estimate_pose(image)

            self.trajectory.append({
                'timestamp': timestamp,
                'pose': pose
            })

        return self.trajectory

    def process_stereo_sequence(self, left_images, right_images, timestamps):
        """Process stereo image sequence"""
        trajectory = []

        for left_path, right_path, timestamp in zip(left_images, right_images, timestamps):
            left_img = cv2.imread(left_path, cv2.IMREAD_GRAYSCALE)
            right_img = cv2.imread(right_path, cv2.IMREAD_GRAYSCALE)

            # Stereo matching and pose estimation
            pose = self._estimate_stereo_pose(left_img, right_img)

            trajectory.append({
                'timestamp': timestamp,
                'pose': pose
            })

        return trajectory

    def _estimate_pose(self, image):
        """Estimate pose from single image"""
        # Simplified - would use actual ORB-SLAM3
        return np.eye(4)

    def _estimate_stereo_pose(self, left, right):
        """Estimate pose from stereo pair"""
        # Simplified - would use actual ORB-SLAM3
        return np.eye(4)
```

## RGB-D SLAM

```python
class RGBDSlam:
    def __init__(self, intrinsic_matrix):
        """
        RGB-D SLAM using depth and color images

        Args:
            intrinsic_matrix: 3x3 camera intrinsic matrix
        """
        self.K = intrinsic_matrix
        self.keyframes = []
        self.point_cloud = None
        self.current_pose = np.eye(4)

    def add_frame(self, rgb_image, depth_image, frame_id):
        """Add RGB-D frame"""
        # Extract features from RGB
        orb = cv2.ORB_create(nfeatures=500)
        keypoints, descriptors = orb.detectAndCompute(rgb_image, None)

        # Create keyframe
        keyframe = {
            'id': frame_id,
            'rgb': rgb_image,
            'depth': depth_image,
            'keypoints': keypoints,
            'descriptors': descriptors,
            'pose': self.current_pose.copy()
        }

        self.keyframes.append(keyframe)

        # Update point cloud
        self._update_point_cloud(rgb_image, depth_image, self.current_pose)

    def _update_point_cloud(self, rgb, depth, pose):
        """Update 3D point cloud"""
        h, w = depth.shape

        # Create point cloud from depth
        points = []
        colors = []

        for y in range(0, h, 4):  # Downsample for speed
            for x in range(0, w, 4):
                d = depth[y, x] / 1000.0  # Convert to meters

                if d > 0:  # Valid depth
                    # Back-project
                    X = (x - self.K[0, 2]) * d / self.K[0, 0]
                    Y = (y - self.K[1, 2]) * d / self.K[1, 1]
                    Z = d

                    point = np.array([X, Y, Z, 1])
                    point_world = pose @ point

                    points.append(point_world[:3])
                    colors.append(rgb[y, x])

        if points:
            points = np.array(points)
            colors = np.array(colors)

            if self.point_cloud is None:
                self.point_cloud = (points, colors)
            else:
                old_points, old_colors = self.point_cloud
                self.point_cloud = (
                    np.vstack([old_points, points]),
                    np.vstack([old_colors, colors])
                )

    def track_frame(self, rgb_image, depth_image):
        """Track new frame"""
        if not self.keyframes:
            self.add_frame(rgb_image, depth_image, 0)
            return True

        # Match with last keyframe
        last_keyframe = self.keyframes[-1]

        orb = cv2.ORB_create(nfeatures=500)
        _, descriptors = orb.detectAndCompute(rgb_image, None)

        if descriptors is None:
            return False

        # BFMatcher
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
        matches = bf.knnMatch(last_keyframe['descriptors'], descriptors, k=2)

        # Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < 0.75 * n.distance:
                    good_matches.append(m)

        if len(good_matches) < 10:
            return False

        # Estimate motion using PnP
        src_pts = np.array([
            last_keyframe['keypoints'][m.queryIdx].pt for m in good_matches
        ])
        dst_pts = np.array([
            last_keyframe['keypoints'][m.trainIdx].pt for m in good_matches
        ])

        # Get 3D points
        object_points = []
        image_points = []

        for m in good_matches:
            x, y = last_keyframe['keypoints'][m.queryIdx].pt
            d = last_keyframe['depth'][int(y), int(x)] / 1000.0

            if d > 0:
                X = (x - self.K[0, 2]) * d / self.K[0, 0]
                Y = (y - self.K[1, 2]) * d / self.K[1, 1]
                object_points.append([X, Y, d])

                x_new, y_new = dst_pts[len(object_points)-1]
                image_points.append([x_new, y_new])

        if len(object_points) < 4:
            return False

        # Solve PnP
        success, rvec, tvec = cv2.solvePnP(
            np.array(object_points),
            np.array(image_points),
            self.K,
            np.zeros(4)
        )

        if success:
            R, _ = cv2.Rodrigues(rvec)
            T = np.eye(4)
            T[:3, :3] = R
            T[:3, 3] = tvec.flatten()

            self.current_pose = self.current_pose @ T
            return True

        return False
```

## Multi-Robot SLAM

```python
class MultiRobotSLAM:
    def __init__(self, robot_ids):
        """Manage SLAM for multiple robots"""
        self.robots = {rid: GraphSLAM() for rid in robot_ids}
        self.global_map = None
        self.inter_robot_constraints = []

    def add_robot_pose(self, robot_id, pose, fixed=False):
        """Add pose for specific robot"""
        return self.robots[robot_id].add_pose(pose, fixed)

    def add_inter_robot_observation(self, robot1_id, robot2_id, relative_pose, information):
        """
        Add constraint between robots' observations

        Used when robots see the same landmark or each other
        """
        self.inter_robot_constraints.append({
            'robot1': robot1_id,
            'robot2': robot2_id,
            'relative_pose': relative_pose,
            'information': information
        })

    def optimize_global_map(self):
        """Optimize map considering all robots"""
        # First optimize individual robot maps
        for robot in self.robots.values():
            robot.optimize()

        # Then add inter-robot constraints
        # Implementation: add edges connecting different robots' graphs
        pass

    def fuse_maps(self):
        """Fuse individual maps into global map"""
        global_poses = {}

        for robot_id, slam in self.robots.items():
            poses = slam.get_poses()
            global_poses[robot_id] = poses

        return global_poses
```

## Dynamic Environment SLAM

```python
class DynamicEnvironmentSLAM:
    def __init__(self):
        self.static_map = None
        self.dynamic_objects = []
        self.motion_history = {}

    def detect_moving_objects(self, current_frame, previous_frame):
        """Detect objects moving in the scene"""
        # Optical flow to detect motion
        flow = cv2.calcOpticalFlowFarneback(
            cv2.cvtColor(previous_frame, cv2.COLOR_BGR2GRAY),
            cv2.cvtColor(current_frame, cv2.COLOR_BGR2GRAY),
            None, 0.5, 3, 15, 3, 5, 1.2, 0
        )

        # Magnitude and angle
        magnitude, angle = cv2.cartToPolar(flow[..., 0], flow[..., 1])

        # Threshold for motion
        motion_mask = magnitude > 2

        # Connected component analysis
        _, labels = cv2.connectedComponents(motion_mask.astype(np.uint8))

        moving_objects = []
        for label in np.unique(labels):
            if label == 0:  # Background
                continue

            mask = labels == label
            if np.sum(mask) > 100:  # Minimum size
                moving_objects.append({
                    'label': label,
                    'mask': mask,
                    'centroid': np.array(np.where(mask)).mean(axis=1)
                })

        return moving_objects

    def filter_moving_points(self, point_cloud, moving_objects):
        """Remove moving objects from point cloud"""
        static_points = []

        for point in point_cloud:
            x, y = int(point[0]), int(point[1])

            is_moving = False
            for obj in moving_objects:
                if obj['mask'][y, x]:
                    is_moving = True
                    break

            if not is_moving:
                static_points.append(point)

        return np.array(static_points)
```

## Key Takeaways

- Graph-based SLAM efficiently handles large-scale mapping with loop closure
- Loop closure detection prevents map drift and improves consistency
- RGB-D SLAM leverages depth information for faster convergence
- Multi-robot SLAM enables collaborative mapping of large environments
- Dynamic environment handling maintains robust performance with moving objects
- Real-time SLAM requires careful optimization and feature selection

## Next Steps

1. [Master Manipulation](./manipulation.md) - Combine SLAM with object interaction
2. [Build Capstone Project](./capstone-project.md) - Full autonomous system

## Further Reading

- [ORB-SLAM3 Paper](https://arxiv.org/abs/2007.11898)
- [Graph-Based SLAM Tutorial](https://www.youtube.com/watch?v=TY3b0jYTOc0)
- [RGB-D SLAM Best Practices](https://github.com/introlab/rtabmap)
- [Visual SLAM Course](https://github.com/gaoxiang12/slambook2)
