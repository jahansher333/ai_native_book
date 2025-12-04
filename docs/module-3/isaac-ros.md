---
title: "Isaac ROS"
description: "Deploy production-grade perception and navigation using NVIDIA Isaac ROS"
module_id: "module-3"
sidebar_position: 2
tags: ["isaac-ros", "perception", "navigation", "ros2", "deployment"]
difficulty: advanced
estimated_minutes: 35
---

# Isaac ROS

## Learning Objectives

By the end of this section, you will be able to:
- Install and configure NVIDIA Isaac ROS
- Understand the Isaac ROS node architecture
- Deploy perception pipelines for object detection
- Implement semantic segmentation and pose estimation
- Build complete perception systems with multiple nodes
- Optimize models using TensorRT
- Integrate with real sensors and hardware
- Monitor and log perception results

## Introduction to Isaac ROS

Isaac ROS is NVIDIA's suite of optimized, production-ready ROS 2 packages for robotics perception and navigation. Unlike generic ROS 2 packages, Isaac ROS components are specifically tuned for deployment on NVIDIA hardware (Jetson and x86 with GPUs) and leverage TensorRT for efficient inference.

### Isaac ROS Advantages

- **Optimized Performance**: TensorRT-accelerated inference
- **Tested Reliability**: Production-grade quality assurance
- **Hardware-Aware**: Optimized for Jetson and NVIDIA GPUs
- **Modular**: Pick and choose components you need
- **Easy Integration**: Familiar ROS 2 interfaces
- **Continuous Updates**: Regular improvements and new models

## Installation

### Prerequisites

- ROS 2 Humble or newer
- NVIDIA CUDA 11.8+
- TensorRT 8.5+
- Docker (recommended for isolation)

### Docker Installation (Recommended)

```bash
# Pull Isaac ROS development container
docker pull nvcr.io/nvidia/isaac-ros/isaac-ros-dev:humble

# Create and run container
docker run --gpus all -it --rm \
  -v ~/ros_ws:/root/ros_ws \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -e DISPLAY=$DISPLAY \
  nvcr.io/nvidia/isaac-ros/isaac-ros-dev:humble bash

# Inside container, create workspace
cd /root/ros_ws
mkdir -p src
```

### Native Installation

```bash
# Add Isaac ROS repository
echo "deb [signed-by=/usr/share/keyrings/isaac-ros.gpg] https://isaac.download.nvidia.com/isaac-ros/ubuntu/$(lsb_release -cs) $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/isaac-ros.list

# Install key
wget -qO - https://isaac.download.nvidia.com/isaac-ros/isaac-ros.asc | \
  sudo apt-key add -

# Update and install
sudo apt-get update
sudo apt-get install ros-humble-isaac-ros-common ros-humble-isaac-ros-perception
```

## Core Concepts: Nodes and Processing Graphs

### Isaac ROS Node Architecture

```
Input Source (Camera, ROS Topic)
    ↓
┌──────────────────────────┐
│  Isaac ROS DNN Image     │
│  Inference Node          │
│  (TensorRT Optimized)    │
└──────────────┬───────────┘
               ↓
    ┌──────────────────────┐
    │  Object Detection    │
    │  Results             │
    └──────────┬───────────┘
               ↓
        Output Topics
        (Detections, Segmentation, Poses)
```

## Object Detection Pipeline

### Setting Up Object Detection

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, CameraInfo
from isaac_ros_detectnet_msgs.msg import DetectionArray
from isaac_ros_tensor_rt.msg import TensorRtInput
from cv_bridge import CvBridge
import cv2

class ObjectDetectionNode(Node):
    def __init__(self):
        super().__init__('object_detection_node')
        self.bridge = CvBridge()

        # Create subscription to camera
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Create publisher for detections
        self.detection_pub = self.create_publisher(
            DetectionArray,
            '/detections',
            10
        )

        # Create subscription to detection results
        self.result_sub = self.create_subscription(
            DetectionArray,
            '/detectnet/detections',
            self.detection_callback,
            10
        )

    def image_callback(self, msg):
        """Process incoming images"""
        cv_image = self.bridge.imgmsg_to_cv2(msg)
        self.get_logger().info(f'Received image: {cv_image.shape}')

    def detection_callback(self, msg):
        """Handle detection results"""
        for detection in msg.detections:
            label = detection.label
            confidence = detection.confidence
            bbox = detection.bbox
            self.get_logger().info(
                f'Detected: {label} (conf: {confidence:.2f})'
            )

        # Forward detections
        self.detection_pub.publish(msg)
```

### Launch File for Detection

```python
# detection.launch.py
import os
from launch import LaunchDescription
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode
from ament_index_python import get_package_share_directory

def generate_launch_description():
    """Create launch description for detection pipeline"""

    # Get package directory
    isaac_ros_detectnet_path = get_package_share_directory(
        'isaac_ros_detectnet'
    )

    return LaunchDescription([
        ComposableNodeContainer(
            name='detection_container',
            namespace='',
            package='rclcpp_components',
            executable='component_container_mt',
            composable_node_descriptions=[
                # DNN Inference Node
                ComposableNode(
                    package='isaac_ros_dnn_image_encoder',
                    plugin='nvidia::isaac_ros::dnn_image_encoder::DnnImageEncoderNode',
                    name='image_encoder',
                    remappings=[
                        ('image', '/camera/image_raw'),
                        ('camera_info', '/camera/camera_info')
                    ]
                ),
                # DetectNet Node
                ComposableNode(
                    package='isaac_ros_detectnet',
                    plugin='nvidia::isaac_ros::detectnet::DetectnetNode',
                    name='detectnet',
                    parameters=[{
                        'model_name': 'peoplenet',
                        'model_repository_paths': [
                            '/opt/nvidia/isaac_ros_assets/models'
                        ]
                    }],
                    remappings=[
                        ('encoded_image', 'image_encoder/encoded_image'),
                    ]
                ),
            ]
        )
    ])
```

## Semantic Segmentation

### Implementing Segmentation

```python
from isaac_ros_segmentation.msg import SegmentationImage
import numpy as np

class SemanticSegmentationNode(Node):
    def __init__(self):
        super().__init__('semantic_segmentation_node')

        # Subscribe to raw image
        self.image_sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        # Subscribe to segmentation results
        self.seg_sub = self.create_subscription(
            SegmentationImage,
            '/segmentation',
            self.segmentation_callback,
            10
        )

        # Publish colored segmentation
        self.seg_pub = self.create_publisher(
            Image,
            '/segmentation_colored',
            10
        )

    def segmentation_callback(self, msg):
        """Process segmentation results"""
        # Convert segmentation to colored image
        seg_array = np.frombuffer(msg.data, dtype=np.uint8)
        seg_array = seg_array.reshape((msg.height, msg.width))

        # Create colored output
        colored = self._colorize_segmentation(seg_array)

        # Publish
        ros_image = self.bridge.cv2_to_imgmsg(colored, encoding='rgb8')
        self.seg_pub.publish(ros_image)

    def _colorize_segmentation(self, seg_array):
        """Convert grayscale segmentation to colored image"""
        # Create color palette
        palette = {
            0: (0, 0, 0),        # Background
            1: (255, 0, 0),      # Person
            2: (0, 255, 0),      # Vehicle
            3: (0, 0, 255),      # Road
        }

        colored = np.zeros((seg_array.shape[0], seg_array.shape[1], 3),
                          dtype=np.uint8)

        for label, color in palette.items():
            mask = seg_array == label
            colored[mask] = color

        return colored
```

## 3D Pose Estimation

### Implementing Pose Estimation

```python
from geometry_msgs.msg import PoseArray, Pose
from isaac_ros_pose_estimation_3d.msg import DetectionArray3D

class PoseEstimationNode(Node):
    def __init__(self):
        super().__init__('pose_estimation_node')

        # Subscribe to detections
        self.detection_sub = self.create_subscription(
            DetectionArray,
            '/detections',
            self.detection_callback,
            10
        )

        # Subscribe to 3D poses
        self.pose_sub = self.create_subscription(
            DetectionArray3D,
            '/poses_3d',
            self.pose_callback,
            10
        )

        # Publish as PoseArray for visualization
        self.pose_pub = self.create_publisher(
            PoseArray,
            '/poses_array',
            10
        )

    def pose_callback(self, msg):
        """Process 3D pose results"""
        pose_array = PoseArray()
        pose_array.header = msg.header

        for detection in msg.detections:
            pose = Pose()
            pose.position.x = detection.pose.position.x
            pose.position.y = detection.pose.position.y
            pose.position.z = detection.pose.position.z
            pose.orientation = detection.pose.orientation

            pose_array.poses.append(pose)

        self.pose_pub.publish(pose_array)

        self.get_logger().info(
            f'Estimated poses for {len(msg.detections)} objects'
        )
```

## Multi-Node Perception Pipeline

### Complete Perception Graph

```python
# perception_pipeline.launch.py
from launch import LaunchDescription
from launch_ros.actions import ComposableNodeContainer
from launch_ros.descriptions import ComposableNode

def generate_launch_description():
    """Create complete perception pipeline"""
    return LaunchDescription([
        ComposableNodeContainer(
            name='perception_container',
            namespace='',
            package='rclcpp_components',
            executable='component_container_mt',
            composable_node_descriptions=[
                # Image encoder
                ComposableNode(
                    package='isaac_ros_dnn_image_encoder',
                    plugin='nvidia::isaac_ros::dnn_image_encoder::DnnImageEncoderNode',
                    name='encoder',
                    remappings=[
                        ('image', '/camera/image_raw'),
                        ('camera_info', '/camera/camera_info')
                    ]
                ),

                # Object detection
                ComposableNode(
                    package='isaac_ros_detectnet',
                    plugin='nvidia::isaac_ros::detectnet::DetectnetNode',
                    name='detectnet',
                    parameters=[{
                        'model_name': 'peoplenet'
                    }],
                    remappings=[
                        ('encoded_image', 'encoder/encoded_image'),
                    ]
                ),

                # Semantic segmentation
                ComposableNode(
                    package='isaac_ros_segmentation',
                    plugin='nvidia::isaac_ros::segmentation::SegmentationNode',
                    name='segmentation',
                    parameters=[{
                        'model_name': 'unet'
                    }],
                    remappings=[
                        ('encoded_image', 'encoder/encoded_image'),
                    ]
                ),

                # Pose estimation
                ComposableNode(
                    package='isaac_ros_pose_estimation_3d',
                    plugin='nvidia::isaac_ros::pose_estimation_3d::PoseEstimationNode',
                    name='pose_estimator',
                    remappings=[
                        ('detections', 'detectnet/detections'),
                    ]
                ),
            ]
        )
    ])
```

## Model Optimization with TensorRT

### Exporting Models to TensorRT

```bash
# Using NVIDIA's trtexec tool
trtexec --onnx=model.onnx \
        --saveEngine=model.trt \
        --workspace=4096 \
        --precision=fp16 \
        --avgRuns=100

# With INT8 quantization
trtexec --onnx=model.onnx \
        --saveEngine=model_int8.trt \
        --int8 \
        --calib=calibration_data.cache
```

### Using Optimized Models in Isaac ROS

```python
class OptimizedInferenceNode(Node):
    def __init__(self):
        super().__init__('optimized_inference')
        self.get_logger().info('Loading TensorRT model...')

        # TensorRT model will be automatically loaded
        # by Isaac ROS node if properly formatted

def generate_launch_description():
    return LaunchDescription([
        ComposableNodeContainer(
            composable_node_descriptions=[
                ComposableNode(
                    package='isaac_ros_detectnet',
                    plugin='nvidia::isaac_ros::detectnet::DetectnetNode',
                    parameters=[{
                        'model_name': 'peoplenet',
                        'model_repository_paths': [
                            '/path/to/optimized/models'
                        ],
                        'use_tensorrt': True,
                        'precision': 'fp16'  # or 'int8'
                    }]
                ),
            ]
        )
    ])
```

## Performance Monitoring

### Benchmarking and Profiling

```python
import time
from rclpy.time import Time

class PerformanceMonitor(Node):
    def __init__(self):
        super().__init__('performance_monitor')
        self.processing_times = []
        self.inference_times = []

        self.sub = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.detection_sub = self.create_subscription(
            DetectionArray,
            '/detections',
            self.detection_callback,
            10
        )

    def image_callback(self, msg):
        self.image_timestamp = time.time()

    def detection_callback(self, msg):
        """Calculate latency"""
        current_time = time.time()
        latency = current_time - self.image_timestamp
        self.processing_times.append(latency)

        if len(self.processing_times) % 100 == 0:
            avg_latency = sum(self.processing_times) / len(self.processing_times)
            self.get_logger().info(
                f'Average latency: {avg_latency*1000:.2f} ms'
            )

    def get_stats(self):
        """Return performance statistics"""
        if not self.processing_times:
            return {}

        times = self.processing_times
        return {
            'mean': sum(times) / len(times),
            'min': min(times),
            'max': max(times),
            'count': len(times)
        }
```

## Deploying to Jetson

### Container-Based Deployment

```bash
# Build Jetson-optimized container
docker build \
  --build-arg BASE_IMAGE=nvcr.io/nvidia/l4t-ml:r35.2.1 \
  -t my-isaac-ros:jetson .

# Run on Jetson
docker run --gpus all -it --rm \
  --network host \
  -v /dev/input:/dev/input \
  my-isaac-ros:jetson bash

# Inside container, launch perception
ros2 launch perception_pipeline.launch.py
```

## Key Takeaways

- Isaac ROS provides production-ready, optimized perception components
- TensorRT optimization dramatically improves inference speed
- Modular design allows flexible pipeline composition
- GPU acceleration enables real-time perception on edge devices
- Performance monitoring helps optimize deployment
- Docker containers ensure reproducibility across devices

## Next Steps

1. [Implement Custom Perception](./perception.md) - Build specialized perception systems
2. [Add Navigation](./navigation.md) - Combine with autonomous navigation
3. [Explore Advanced Features](../module-4/index.md) - Integration with VLA systems

## Further Reading

- [Isaac ROS GitHub Repository](https://github.com/isaac-ros)
- [TensorRT Documentation](https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/)
- [NVIDIA Jetson Documentation](https://docs.nvidia.com/jetson/)
- [ROS 2 Best Practices](https://docs.ros.org/en/humble/The-ROS2-Project/Contributing/Developer-Guide.html)
