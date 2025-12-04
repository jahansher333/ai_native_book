---
title: "Perception"
description: "Build advanced computer vision and AI-based perception systems for robotics"
module_id: "module-3"
sidebar_position: 3
tags: ["perception", "computer-vision", "object-detection", "semantic-segmentation", "pose-estimation"]
difficulty: advanced
estimated_minutes: 35
---

# Perception

## Learning Objectives

By the end of this section, you will be able to:
- Understand computer vision fundamentals for robotics
- Implement object detection systems for various applications
- Build semantic and instance segmentation pipelines
- Create 3D pose estimation systems
- Develop multi-sensor perception fusion systems
- Train custom perception models
- Deploy and optimize perception on edge devices
- Debug and evaluate perception performance

## Introduction to Robotics Perception

Perception is the robot's ability to understand its environment. It bridges raw sensor data (images, depth, LiDAR) to actionable understanding (objects, boundaries, poses). Modern robotics perception relies heavily on deep learning models trained on large annotated datasets.

### Perception Pipeline Architecture

```
Raw Sensors
├── RGB Camera
├── Depth Camera
├── LiDAR
└── Thermal

    ↓ (Data Preprocessing)

Detection/Segmentation
├── Object Detection (What and Where)
├── Semantic Segmentation (Pixel-level Classification)
└── Instance Segmentation (Individual Objects)

    ↓ (3D Reconstruction)

3D Perception
├── Point Cloud Processing
├── 3D Bounding Boxes
└── Pose Estimation

    ↓ (Sensor Fusion)

Fused Understanding
└── Scene Representation
```

## Object Detection Fundamentals

### Deep Learning Detection Models

Modern object detection uses convolutional neural networks (CNNs):

```
Input Image (640x480x3)
    ↓
Feature Extraction (Backbone)
    ├── ResNet50 / MobileNet / EfficientNet
    ↓
Neck (Feature Pyramid)
    ├── FPN / PANet / BiFPN
    ↓
Head (Detection)
    ├── Bounding Box Regression
    ├── Class Probability
    └── Confidence Score

Output: [x, y, width, height, class, confidence]
```

### Training Object Detection Models

```python
import torch
import torchvision
from torch.utils.data import DataLoader
from torchvision.models.detection import fasterrcnn_resnet50_fpn

class ObjectDetectionTrainer:
    def __init__(self, dataset_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.model.to(self.device)

        # Modify model for custom classes
        num_classes = 10  # background + 9 classes
        in_features = self.model.roi_heads.box_predictor.cls_score.in_features
        self.model.roi_heads.box_predictor = \
            torchvision.ops.misc.FastRCNNPredictor(in_features, num_classes)

        self.optimizer = torch.optim.SGD(
            self.model.parameters(),
            lr=0.005,
            momentum=0.9,
            weight_decay=0.0005
        )

    def train_epoch(self, train_loader):
        """Train for one epoch"""
        self.model.train()
        total_loss = 0

        for images, targets in train_loader:
            images = [img.to(self.device) for img in images]
            targets = [{k: v.to(self.device) for k, v in t.items()} for t in targets]

            loss_dict = self.model(images, targets)
            losses = sum(loss for loss in loss_dict.values())

            self.optimizer.zero_grad()
            losses.backward()
            self.optimizer.step()

            total_loss += losses.item()

        return total_loss / len(train_loader)

    def evaluate(self, test_loader):
        """Evaluate model on test set"""
        self.model.eval()
        total_ap = 0

        with torch.no_grad():
            for images, targets in test_loader:
                images = [img.to(self.device) for img in images]

                predictions = self.model(images)
                # Calculate AP (Average Precision)
                # Implementation details...

        return total_ap / len(test_loader)
```

## Semantic Segmentation

### Semantic Segmentation Architecture

```python
import torch
import torch.nn as nn

class SemanticSegmentationModel(nn.Module):
    def __init__(self, num_classes):
        super().__init__()

        # Encoder (downsampling)
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
        )

        # Decoder (upsampling)
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2),
            nn.ReLU(inplace=True),

            nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2),
            nn.ReLU(inplace=True),

            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.ReLU(inplace=True),
        )

        # Output layer
        self.classifier = nn.Conv2d(32, num_classes, kernel_size=1)

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        logits = self.classifier(decoded)
        return logits
```

### Semantic Segmentation in ROS 2

```python
import rclpy
from sensor_msgs.msg import Image
from std_msgs.msg import Header
from cv_bridge import CvBridge
import torch
import torchvision.transforms as transforms

class SemanticSegmentationNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('semantic_segmentation_node')

        # Load model
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = torch.hub.load(
            'pytorch/vision:v0.10',
            'deeplabv3_resnet101',
            pretrained=True
        ).to(self.device)
        self.model.eval()

        self.bridge = CvBridge()
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        # Subscribers and publishers
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.publisher = self.create_publisher(
            Image,
            '/segmentation_mask',
            10
        )

    def image_callback(self, msg):
        """Process incoming image"""
        # Convert ROS image to CV2
        cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='rgb8')

        # Preprocess
        tensor = self.transform(cv_image).unsqueeze(0).to(self.device)

        # Inference
        with torch.no_grad():
            output = self.model(tensor)['out']

        # Get class predictions
        class_predictions = torch.argmax(output, dim=1)[0].cpu().numpy()

        # Colorize for visualization
        colored_seg = self._colorize_segmentation(class_predictions)

        # Publish result
        seg_msg = self.bridge.cv2_to_imgmsg(colored_seg, encoding='rgb8')
        seg_msg.header = msg.header
        self.publisher.publish(seg_msg)

    def _colorize_segmentation(self, seg_map):
        """Convert class indices to RGB image"""
        palette = self._get_coco_palette()
        colored = palette[seg_map]
        return colored.astype('uint8')

    def _get_coco_palette(self):
        """COCO dataset class palette"""
        palette = torch.tensor([
            [0, 0, 0],          # 0: background
            [128, 0, 0],        # 1: person
            [0, 128, 0],        # 2: bicycle
            # ... (more classes)
        ])
        return palette
```

## 3D Pose Estimation

### RGB-D Based Pose Estimation

```python
import cv2
import numpy as np
from scipy.spatial.transform import Rotation

class PoseEstimator:
    def __init__(self, camera_matrix, dist_coeffs):
        self.camera_matrix = camera_matrix
        self.dist_coeffs = dist_coeffs

    def estimate_pose_from_keypoints(self, image_points, world_points):
        """
        Estimate 6D pose from 2D-3D correspondence

        Args:
            image_points: 2D keypoints in image (N, 2)
            world_points: 3D keypoints in world frame (N, 3)

        Returns:
            rotation: 3x3 rotation matrix
            translation: 3x1 translation vector
        """
        success, rvec, tvec = cv2.solvePnP(
            world_points,
            image_points,
            self.camera_matrix,
            self.dist_coeffs
        )

        if not success:
            return None, None

        # Convert rotation vector to matrix
        rotation_matrix, _ = cv2.Rodrigues(rvec)

        return rotation_matrix, tvec

    def estimate_pose_from_detection(self, detection, depth_image):
        """
        Estimate pose from 2D detection and depth image

        Args:
            detection: Bounding box [x, y, w, h]
            depth_image: Depth map from RGB-D camera
        """
        x, y, w, h = detection

        # Get depth at center of bounding box
        center_x = int(x + w / 2)
        center_y = int(y + h / 2)
        depth_z = depth_image[center_y, center_x] / 1000.0  # mm to m

        # Back-project to 3D
        fx = self.camera_matrix[0, 0]
        fy = self.camera_matrix[1, 1]
        cx = self.camera_matrix[0, 2]
        cy = self.camera_matrix[1, 2]

        x_world = (center_x - cx) * depth_z / fx
        y_world = (center_y - cy) * depth_z / fy
        z_world = depth_z

        translation = np.array([[x_world], [y_world], [z_world]])
        rotation = np.eye(3)  # Assuming upright orientation

        return rotation, translation
```

## Point Cloud Processing

### LiDAR Point Cloud Analysis

```python
import open3d as o3d
import numpy as np
from sensor_msgs_py import point_cloud2 as pc2

class PointCloudProcessor:
    def __init__(self):
        self.voxel_size = 0.05  # 5cm voxels

    def process_point_cloud(self, cloud_msg):
        """Convert ROS PointCloud2 to Open3D and process"""
        # Convert ROS message to numpy
        points = np.array(list(pc2.read_points(
            cloud_msg,
            field_names=('x', 'y', 'z'),
            skip_nans=True
        )))

        # Create Open3D point cloud
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(points)

        # Preprocessing
        pcd = self._preprocess_cloud(pcd)

        # Detect planes (floor, walls, etc.)
        planes = self._detect_planes(pcd)

        # Cluster remaining points (objects)
        objects = self._cluster_objects(pcd)

        return planes, objects

    def _preprocess_cloud(self, pcd):
        """Remove noise and downsample"""
        # Remove outliers
        pcd, inliers = pcd.remove_statistical_outlier(
            nb_neighbors=20,
            std_ratio=2.0
        )

        # Voxel downsampling
        pcd = pcd.voxel_down_sample(self.voxel_size)

        return pcd

    def _detect_planes(self, pcd, iterations=1000, distance_threshold=0.01):
        """RANSAC-based plane detection"""
        planes = []

        remaining = pcd
        for _ in range(3):  # Detect up to 3 planes
            plane_model, inliers = remaining.segment_plane(
                distance_threshold,
                3,
                iterations
            )

            if len(inliers) > 100:
                plane_cloud = remaining.select_by_index(inliers)
                planes.append({
                    'model': plane_model,
                    'cloud': plane_cloud,
                    'inliers': len(inliers)
                })

                # Remove plane from point cloud
                remaining = remaining.select_by_index(
                    inliers,
                    invert=True
                )

        return planes

    def _cluster_objects(self, pcd, eps=0.1, min_points=10):
        """Euclidean clustering"""
        labels = np.array(pcd.cluster_dbscan(
            eps=eps,
            min_points=min_points
        ))

        clusters = []
        for label in set(labels):
            if label == -1:
                continue

            cluster_cloud = pcd.select_by_index(np.where(labels == label)[0])
            clusters.append({
                'label': label,
                'cloud': cluster_cloud,
                'centroid': np.asarray(cluster_cloud.get_center()),
                'size': len(cluster_cloud.points)
            })

        return clusters
```

## Multi-Sensor Fusion

### Sensor Fusion Pipeline

```python
class SensorFusionNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('sensor_fusion_node')

        self.latest_rgb = None
        self.latest_depth = None
        self.latest_lidar = None

        # Synchronized subscriptions
        self.rgb_sub = self.create_subscription(
            Image, '/camera/rgb/image_raw', self.rgb_callback, 10
        )
        self.depth_sub = self.create_subscription(
            Image, '/camera/depth/image_raw', self.depth_callback, 10
        )
        self.lidar_sub = self.create_subscription(
            PointCloud2, '/lidar/points', self.lidar_callback, 10
        )

        self.fusion_pub = self.create_publisher(
            Detection3DArray,
            '/fused_detections',
            10
        )

    def rgb_callback(self, msg):
        self.latest_rgb = self.bridge.imgmsg_to_cv2(msg)

    def depth_callback(self, msg):
        self.latest_depth = self.bridge.imgmsg_to_cv2(msg)

    def lidar_callback(self, msg):
        """Process LiDAR and fuse with RGB/Depth"""
        if self.latest_rgb is None or self.latest_depth is None:
            return

        # Get RGB detections
        rgb_detections = self._detect_rgb_objects(self.latest_rgb)

        # Get LiDAR clusters
        lidar_clusters = self._get_lidar_clusters(msg)

        # Fuse detections
        fused = self._fuse_detections(
            rgb_detections,
            lidar_clusters,
            self.latest_depth
        )

        # Publish fused detections
        self._publish_detections(fused)

    def _fuse_detections(self, rgb_det, lidar_det, depth):
        """Combine RGB and LiDAR detections"""
        fused_detections = []

        for rgb in rgb_det:
            # Find nearest LiDAR cluster
            nearest_lidar = self._find_nearest_lidar(rgb, lidar_det)

            if nearest_lidar:
                # Combine information
                fused = {
                    'class': rgb['class'],
                    'confidence': rgb['confidence'] * 0.5 + \
                                  nearest_lidar['confidence'] * 0.5,
                    'bbox_2d': rgb['bbox'],
                    'position_3d': nearest_lidar['centroid'],
                    'size': nearest_lidar['size']
                }
                fused_detections.append(fused)

        return fused_detections
```

## Evaluation Metrics

### Evaluating Detection Performance

```python
class PerceptionEvaluator:
    def __init__(self):
        self.detections = []
        self.ground_truth = []

    def compute_iou(self, box1, box2):
        """Intersection over Union"""
        x1_min, y1_min, x1_max, y1_max = box1
        x2_min, y2_min, x2_max, y2_max = box2

        intersection_x_min = max(x1_min, x2_min)
        intersection_y_min = max(y1_min, y2_min)
        intersection_x_max = min(x1_max, x2_max)
        intersection_y_max = min(y1_max, y2_max)

        if intersection_x_max < intersection_x_min or \
           intersection_y_max < intersection_y_min:
            return 0.0

        intersection_area = (intersection_x_max - intersection_x_min) * \
                           (intersection_y_max - intersection_y_min)

        box1_area = (x1_max - x1_min) * (y1_max - y1_min)
        box2_area = (x2_max - x2_min) * (y2_max - y2_min)

        union_area = box1_area + box2_area - intersection_area

        return intersection_area / union_area if union_area > 0 else 0

    def compute_map(self, iou_threshold=0.5):
        """Mean Average Precision"""
        precisions = []
        recalls = []

        for gt in self.ground_truth:
            best_iou = 0
            best_det = None

            for det in self.detections:
                if det['class'] != gt['class']:
                    continue

                iou = self.compute_iou(det['bbox'], gt['bbox'])
                if iou > best_iou:
                    best_iou = iou
                    best_det = det

            if best_iou >= iou_threshold:
                precisions.append(1.0)
            else:
                precisions.append(0.0)

        return np.mean(precisions) if precisions else 0.0
```

## Key Takeaways

- Perception is essential for robots to understand their environment
- Deep learning models (CNN) enable robust object detection and segmentation
- Multi-sensor fusion combines strengths of different sensor modalities
- Point cloud processing enables 3D scene understanding
- Proper evaluation metrics validate perception system performance
- Deployment optimization makes real-time perception feasible on edge devices

## Next Steps

1. [Implement Navigation](./navigation.md) - Use perception for autonomous navigation
2. [Explore Advanced Systems](../module-4/index.md) - Combine perception with reasoning and control

## Further Reading

- [Object Detection Survey](https://arxiv.org/abs/2012.12556)
- [Semantic Segmentation Methods](https://arxiv.org/abs/2110.02711)
- [3D Object Detection Survey](https://arxiv.org/abs/2012.09165)
- [Point Cloud Processing Library](https://www.open3d.org/)
