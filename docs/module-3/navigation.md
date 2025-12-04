---
title: "Navigation"
description: "Build autonomous navigation systems with SLAM, localization, and path planning"
module_id: "module-3"
sidebar_position: 4
tags: ["navigation", "slam", "path-planning", "autonomous-mobility", "localization"]
difficulty: advanced
estimated_minutes: 35
---

# Navigation

## Learning Objectives

By the end of this section, you will be able to:
- Understand SLAM (Simultaneous Localization and Mapping) fundamentals
- Implement and configure SLAM algorithms
- Build localization systems using sensor fusion
- Develop global path planning strategies
- Implement local obstacle avoidance
- Create complete navigation stacks
- Optimize navigation for real-world environments
- Debug and validate navigation performance

## Introduction to Autonomous Navigation

Autonomous navigation enables robots to move through environments independently. It requires solving several interconnected problems:

1. **Localization**: "Where am I?" - Determining robot position using sensors
2. **Mapping**: "What's around me?" - Building environmental representation
3. **Path Planning**: "How do I get there?" - Computing paths to goals
4. **Motion Control**: "How do I move?" - Executing planned paths

## SLAM Fundamentals

### What is SLAM?

SLAM (Simultaneous Localization and Mapping) solves the chicken-and-egg problem: you need a map to localize, but you need localization to build a map. SLAM algorithms interleave map building with position estimation.

```
Sensor Data (LiDAR/Camera)
    ↓
Feature Extraction & Matching
    ↓
Motion Estimation
    ├── Estimate robot movement
    └── Predict next state
    ↓
Mapping Update
    ├── Add new observations
    └── Update occupancy grid
    ↓
Loop Closure Detection
    ├── Detect previously seen locations
    └── Correct map drift
    ↓
Refined Map & Localization
```

### Visual SLAM

```python
import cv2
import numpy as np
from collections import defaultdict

class VisualSLAM:
    def __init__(self, camera_matrix):
        self.camera_matrix = camera_matrix
        self.orb = cv2.ORB_create(nfeatures=500)
        self.bf_matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)

        self.keyframes = []
        self.landmarks = []
        self.trajectory = []

    def process_frame(self, image):
        """Process single image frame"""
        # Extract features
        kp, des = self.orb.detectAndCompute(image, None)

        if not self.keyframes:
            # First frame
            self.keyframes.append({
                'image': image,
                'keypoints': kp,
                'descriptors': des,
                'pose': np.eye(4)
            })
            return np.eye(4)

        # Matching with last keyframe
        last_keyframe = self.keyframes[-1]
        matches = self.bf_matcher.knnMatch(
            last_keyframe['descriptors'],
            des,
            k=2
        )

        # Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < 0.75 * n.distance:
                    good_matches.append(m)

        if len(good_matches) < 10:
            return self.keyframes[-1]['pose']

        # Estimate motion
        src_pts = np.float32([
            last_keyframe['keypoints'][m.queryIdx].pt for m in good_matches
        ])
        dst_pts = np.float32([
            kp[m.trainIdx].pt for m in good_matches
        ])

        # Compute essential matrix
        E, mask = cv2.findEssentialMat(
            src_pts,
            dst_pts,
            self.camera_matrix,
            cv2.RANSAC,
            0.999,
            1.0
        )

        _, R, t, mask = cv2.recoverPose(
            E,
            src_pts,
            dst_pts,
            self.camera_matrix,
            mask=mask
        )

        # Build pose matrix
        current_pose = self.keyframes[-1]['pose'].copy()
        current_pose[:3, :3] = R @ current_pose[:3, :3]
        current_pose[:3, 3] += current_pose[:3, :3] @ t.flatten()

        self.trajectory.append(current_pose[:3, 3])

        return current_pose
```

### LiDAR-based SLAM

```python
import open3d as o3d

class LiDARSLAM:
    def __init__(self, voxel_size=0.05):
        self.voxel_size = voxel_size
        self.map_cloud = None
        self.current_pose = np.eye(4)
        self.trajectory = []

        self.icp = o3d.pipelines.registration.registration_icp

    def process_scan(self, point_cloud):
        """Process LiDAR scan"""
        # Convert to Open3D format
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(point_cloud)

        # Voxel downsampling
        pcd_down = pcd.voxel_down_sample(self.voxel_size)
        pcd_down.estimate_normals(
            o3d.geometry.KDTreeSearchParamHybrid(
                radius=self.voxel_size * 2,
                max_nn=30
            )
        )

        if self.map_cloud is None:
            # First scan
            self.map_cloud = pcd_down
            self.trajectory.append(self.current_pose[:3, 3])
            return self.current_pose

        # ICP registration
        reg_result = self.icp(
            pcd_down,
            self.map_cloud,
            self.voxel_size * 2,
            np.eye(4),
            o3d.pipelines.registration.TransformationEstimationPointToPoint(),
            o3d.pipelines.registration.ICPConvergenceCriteria(
                max_iteration=50
            )
        )

        # Update pose
        self.current_pose = self.current_pose @ reg_result.transformation

        # Add scan to map
        pcd_down.transform(self.current_pose)
        self.map_cloud += pcd_down

        # Periodically downsample map
        if len(np.asarray(self.map_cloud.points)) > 1000000:
            self.map_cloud = self.map_cloud.voxel_down_sample(
                self.voxel_size * 2
            )

        self.trajectory.append(self.current_pose[:3, 3])

        return self.current_pose
```

## Navigation Stack Architecture

### ROS 2 Navigation2 Stack

```yaml
# nav2_params.yaml
amcl:
  ros__parameters:
    use_sim_time: True
    alpha1: 0.2
    alpha2: 0.2
    alpha3: 0.2
    alpha4: 0.2
    alpha5: 0.2
    base_frame_id: "base_link"
    beam_skip_distance: 0.5
    beam_skip_error_threshold: 0.9
    beam_skip_threshold: 0.3
    do_beamskip: false
    global_frame_id: "map"
    lambda_short: 0.1
    laser_likelihood_max_dist: 2.0
    laser_max_range: 100.0
    laser_min_range: 0.1
    laser_model_type: "likelihood_field"
    max_beams: 60
    max_particles: 2000
    min_particles: 500
    odom_frame_id: "odom"
    pf_err: 0.05
    pf_z: 0.99
    recovery_alpha_fast: 0.0
    recovery_alpha_slow: 0.0
    resample_interval: 1
    robot_model_type: "nav2_amcl::DifferentialMotionModel"
    save_pose_rate: 0.5
    sigma_hit: 0.2
    sigma_short: 0.05
    tf_broadcast: true
    transform_tolerance: 1.0
    update_min_a: 0.2
    update_min_d: 0.25
    z_hit: 0.5
    z_max: 0.05
    z_rand: 0.5
    z_short: 0.05

bt_navigator:
  ros__parameters:
    use_sim_time: True
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    bt_loop_duration: 10
    default_server_timeout: 20
    enable_groot_monitoring: True
    groot_zmq_publisher_port: 1666
    groot_zmq_server_port: 1667
    default_nav_through_poses_bt_xml: $(find-pkg-share nav2_bt_navigator)/behavior_trees/navigate_through_poses_w_replanning.xml
    default_nav_to_pose_bt_xml: $(find-pkg-share nav2_bt_navigator)/behavior_trees/navigate_to_pose_w_replanning.xml
    plugin_lib_names:
      - nav2_compute_path_to_pose_action_bt_node
      - nav2_compute_path_through_poses_action_bt_node
```

### Complete Navigation Launch File

```python
# navigation.launch.py
import os
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.substitutions import LaunchConfiguration
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    nav2_dir = get_package_share_directory('nav2_bringup')
    params_file = os.path.join(nav2_dir, 'params', 'nav2_params.yaml')

    return LaunchDescription([
        # AMCL (Adaptive Monte Carlo Localization)
        Node(
            package='nav2_amcl',
            executable='amcl',
            name='amcl',
            output='screen',
            parameters=[params_file],
            remappings=[
                ('scan', '/lidar/scan'),
                ('/tf', 'tf'),
                ('/tf_static', 'tf_static')
            ]
        ),

        # Map Server
        Node(
            package='nav2_map_server',
            executable='map_server',
            name='map_server',
            output='screen',
            parameters=[{
                'yaml_filename': '/path/to/map.yaml'
            }],
            remappings=[('/tf', 'tf'), ('/tf_static', 'tf_static')]
        ),

        # Planner Server
        Node(
            package='nav2_planner',
            executable='planner_server',
            name='planner_server',
            output='screen',
            parameters=[params_file],
            remappings=[('/tf', 'tf'), ('/tf_static', 'tf_static')]
        ),

        # Controller Server
        Node(
            package='nav2_controller',
            executable='controller_server',
            name='controller_server',
            output='screen',
            parameters=[params_file],
            remappings=[('/tf', 'tf'), ('/tf_static', 'tf_static')]
        ),

        # BehaviorTree Navigator
        Node(
            package='nav2_bt_navigator',
            executable='bt_navigator',
            name='bt_navigator',
            output='screen',
            parameters=[params_file],
            remappings=[('/tf', 'tf'), ('/tf_static', 'tf_static')]
        ),

        # Lifecycle Manager
        Node(
            package='nav2_lifecycle_manager',
            executable='lifecycle_manager',
            name='lifecycle_manager_navigation',
            output='screen',
            parameters=[{
                'autostart': True,
                'node_names': [
                    'map_server',
                    'amcl',
                    'planner_server',
                    'controller_server',
                    'bt_navigator'
                ]
            }]
        ),
    ])
```

## Path Planning Algorithms

### Dijkstra's Algorithm

```python
import heapq
import numpy as np

class PathPlanner:
    def __init__(self, costmap):
        self.costmap = costmap
        self.height, self.width = costmap.shape

    def dijkstra(self, start, goal):
        """Plan path using Dijkstra's algorithm"""
        # Initialize distances and visited set
        distances = np.full(self.costmap.shape, np.inf)
        distances[start] = 0
        visited = set()

        # Priority queue: (distance, (x, y))
        pq = [(0, start)]
        parents = {}

        while pq:
            current_dist, (x, y) = heapq.heappop(pq)

            if (x, y) in visited:
                continue

            visited.add((x, y))

            if (x, y) == goal:
                return self._reconstruct_path(parents, start, goal)

            # Check neighbors (4-connected)
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx, ny = x + dx, y + dy

                if 0 <= nx < self.height and 0 <= ny < self.width:
                    if (nx, ny) not in visited:
                        # Cost includes terrain
                        cost = current_dist + \
                               self.costmap[nx, ny] + 1

                        if cost < distances[nx, ny]:
                            distances[nx, ny] = cost
                            parents[(nx, ny)] = (x, y)
                            heapq.heappush(pq, (cost, (nx, ny)))

        return None  # No path found

    def _reconstruct_path(self, parents, start, goal):
        """Reconstruct path from parents dictionary"""
        path = [goal]
        current = goal

        while current != start:
            if current not in parents:
                return None
            current = parents[current]
            path.append(current)

        path.reverse()
        return path
```

### RRT (Rapidly-exploring Random Tree)

```python
class RRT:
    def __init__(self, costmap, step_size=1.0):
        self.costmap = costmap
        self.step_size = step_size
        self.nodes = []

    def plan_path(self, start, goal, max_iterations=5000):
        """Plan path using RRT"""
        self.nodes = [start]

        for _ in range(max_iterations):
            # Random point in space
            rand_point = self._random_point()

            # Nearest node
            nearest = self._nearest_node(rand_point)

            # New node
            new_node = self._steer(nearest, rand_point)

            # Check collision
            if not self._collision_free(nearest, new_node):
                continue

            self.nodes.append(new_node)

            # Check goal
            if np.linalg.norm(
                np.array(new_node) - np.array(goal)
            ) < self.step_size:
                path = self._extract_path(goal)
                return path

        return None

    def _random_point(self):
        """Generate random point in configuration space"""
        return (
            np.random.uniform(0, self.costmap.shape[0]),
            np.random.uniform(0, self.costmap.shape[1])
        )

    def _nearest_node(self, point):
        """Find nearest node to point"""
        distances = [
            np.linalg.norm(np.array(node) - np.array(point))
            for node in self.nodes
        ]
        return self.nodes[np.argmin(distances)]

    def _steer(self, from_node, to_point):
        """Create new node steering toward point"""
        direction = np.array(to_point) - np.array(from_node)
        distance = np.linalg.norm(direction)

        if distance < self.step_size:
            return tuple(to_point)

        direction = direction / distance
        new_node = np.array(from_node) + direction * self.step_size

        return tuple(new_node)
```

## Local Path Planning (Obstacle Avoidance)

### Dynamic Window Approach (DWA)

```python
class DWA:
    def __init__(self, robot_config):
        self.max_speed = robot_config['max_speed']
        self.max_accel = robot_config['max_accel']
        self.v_resolution = robot_config['v_resolution']
        self.w_resolution = robot_config['w_resolution']
        self.dt = robot_config['dt']

    def calculate_trajectory(self, current_velocity, goal_direction):
        """Calculate optimal trajectory given goal"""
        # Dynamic window
        dw = self._calc_dynamic_window(current_velocity)

        # Simulate trajectories
        best_trajectory = None
        best_score = -np.inf

        for v in np.arange(dw[0], dw[1], self.v_resolution):
            for w in np.arange(dw[2], dw[3], self.w_resolution):
                # Simulate trajectory
                trajectory = self._simulate_trajectory(
                    current_velocity,
                    (v, w)
                )

                # Evaluate trajectory
                score = self._evaluate_trajectory(
                    trajectory,
                    goal_direction
                )

                if score > best_score:
                    best_score = score
                    best_trajectory = trajectory

        return best_trajectory

    def _calc_dynamic_window(self, current_velocity):
        """Calculate dynamic window"""
        v, w = current_velocity

        min_v = max(-self.max_speed, v - self.max_accel * self.dt)
        max_v = min(self.max_speed, v + self.max_accel * self.dt)
        min_w = max(-np.pi, w - self.max_accel * self.dt)
        max_w = min(np.pi, w + self.max_accel * self.dt)

        return (min_v, max_v, min_w, max_w)

    def _evaluate_trajectory(self, trajectory, goal_direction):
        """Score trajectory based on goal and obstacles"""
        # Distance to goal
        final_pos = trajectory[-1][:2]
        distance_score = 1.0 / np.linalg.norm(final_pos)

        # Heading difference
        final_angle = trajectory[-1][2]
        heading_diff = abs(final_angle - goal_direction)
        heading_score = 1.0 - (heading_diff / np.pi)

        # Obstacle clearance
        obstacle_score = self._calc_clearance(trajectory)

        # Combined score
        score = (distance_score * 1.0 +
                heading_score * 1.0 +
                obstacle_score * 2.0)

        return score
```

## Navigation Node Implementation

### Complete Navigation System

```python
import rclpy
from geometry_msgs.msg import Twist, PoseStamped
from nav_msgs.msg import Odometry
from sensor_msgs.msg import LaserScan

class NavigationController(rclpy.node.Node):
    def __init__(self):
        super().__init__('navigation_controller')

        self.current_pose = None
        self.goal_pose = None

        # Subscribers
        self.create_subscription(
            Odometry,
            '/odom',
            self.odom_callback,
            10
        )

        self.create_subscription(
            PoseStamped,
            '/goal_pose',
            self.goal_callback,
            10
        )

        self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        # Publisher
        self.cmd_vel_pub = self.create_publisher(
            Twist,
            '/cmd_vel',
            10
        )

        # Initialize planners
        self.global_planner = GlobalPlanner()
        self.local_planner = DWA(self.robot_config)
        self.current_path = None

        # Main loop timer
        self.create_timer(0.1, self.navigate)

    def odom_callback(self, msg):
        """Update robot odometry"""
        self.current_pose = (
            msg.pose.pose.position.x,
            msg.pose.pose.position.y
        )

    def goal_callback(self, msg):
        """Set navigation goal"""
        self.goal_pose = (
            msg.pose.position.x,
            msg.pose.position.y
        )
        self.get_logger().info(f'Goal set to: {self.goal_pose}')

    def scan_callback(self, msg):
        """Process laser scan for obstacle avoidance"""
        self.latest_scan = msg

    def navigate(self):
        """Main navigation loop"""
        if self.current_pose is None or self.goal_pose is None:
            return

        # Global path planning
        if self.current_path is None:
            self.current_path = self.global_planner.plan(
                self.current_pose,
                self.goal_pose
            )

        if not self.current_path:
            self.get_logger().error('No path found!')
            return

        # Local trajectory planning
        trajectory = self.local_planner.calculate_trajectory(
            self.current_velocity,
            self.goal_pose
        )

        # Execute
        cmd_vel = self._trajectory_to_velocity(trajectory)
        self.cmd_vel_pub.publish(cmd_vel)
```

## Key Takeaways

- SLAM enables autonomous robots to map unknown environments while localizing
- Navigation requires integration of localization, planning, and control
- Path planning algorithms balance optimality, computation, and real-world constraints
- Local obstacle avoidance ensures reactive collision avoidance
- Multi-level architecture (global + local) provides both flexibility and responsiveness
- ROS 2 Navigation2 stack provides production-ready navigation components

## Next Steps

1. [Explore VLA Systems](../module-4/vla-overview.md) - Add reasoning and manipulation
2. [Integrate with Voice Commands](../module-4/voice-commands.md) - Enable human interaction
3. [Build Capstone Project](../module-4/capstone-project.md) - Complete autonomous system

## Further Reading

- [Navigation2 Documentation](https://navigation.ros.org/)
- [SLAM Survey](https://arxiv.org/abs/1808.00747)
- [Path Planning Algorithms](https://arxiv.org/abs/1604.01038)
- [Motion Planning State of the Art](https://arxiv.org/abs/2105.13385)
