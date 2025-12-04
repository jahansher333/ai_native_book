---
title: "Glossary: Robotics & AI Terminology"
description: "50+ definitions of essential robotics and artificial intelligence terms used throughout the Physical AI & Humanoid Robotics course."
sidebar_position: 202
tags: ["glossary", "reference", "terminology", "definitions"]
difficulty: beginner
estimated_minutes: 30
---

# Glossary: Robotics & AI Terminology

This glossary defines key terms used throughout the Physical AI & Humanoid Robotics course. Terms are organized alphabetically with cross-references to related concepts and course modules.

---

## A

### Action Server
**Definition**: A ROS 2 component that handles long-running tasks with periodic feedback. Unlike services (request-response), actions allow clients to receive feedback during task execution and optionally cancel goals.

**Example**: A navigation action server that provides progress feedback (e.g., "30% of path traveled") as the robot moves toward a destination.

**Related**: Service, Topic, Module 1

---

### Affordance (Object Affordance)
**Definition**: The physical and spatial properties of an object that suggest how it can be manipulated. For example, a handle affords grasping, a flat surface affords placing.

**Example**: A vision system recognizes that a cup's rim affords grasping from the top (not the side).

**Related**: Grasping, Computer Vision, Module 4

---

### Actuator
**Definition**: A device that converts electrical or pneumatic energy into mechanical motion. In robotics, actuators move robot joints and end-effectors.

**Common Types**: Electric motors, pneumatic cylinders, servo motors

**Example**: A stepper motor that rotates a robot joint by precisely controlled angles.

**Related**: Motor, Joint, Module 2

---

### Autonomous System
**Definition**: A robotic or computational system capable of making decisions and executing tasks with minimal or no human intervention.

**Key Requirements**:
- Perception (sense the environment)
- Reasoning (decide what to do)
- Actuation (execute actions)

**Related**: SLAM, Nav2, Module 3

---

### Axis-Aligned Bounding Box (AABB)
**Definition**: A rectangular box (in 2D) or cuboid (in 3D) aligned with the coordinate axes used for collision detection and object localization.

**Related**: Collision Detection, Physics Engine, Module 2

---

## B

### Bounding Box
**Definition**: A rectangular region that encloses an object in an image or 3D space, typically used to localize detected objects.

**Example**: In YOLO object detection, each detected person is enclosed in a bounding box with coordinates (x, y, width, height).

**Related**: Object Detection, Computer Vision, Module 3

---

### Base Link
**Definition**: The primary reference frame of a robot, typically the main body or chassis. All other robot components are defined relative to the base link in the URDF.

**Example**: A mobile robot's base link is at the center of the chassis between the wheels.

**Related**: Link, Frame, URDF, Module 1

---

### Bearing (Mechanical)
**Definition**: A mechanical component that reduces friction and allows smooth rotation between two parts.

**Related**: Joint, Actuator, Hardware

---

## C

### Cartographer (SLAM Algorithm)
**Definition**: A graph-based SLAM algorithm developed by Google, implemented in ROS 2, that creates maps using laser scan and IMU data.

**Features**:
- Robust loop closure detection
- Real-time performance
- Flexible sensor configuration

**Related**: SLAM, Localization, Module 3

---

### Collision Detection
**Definition**: The computational process of determining if two or more objects intersect or come into contact in physical space.

**Example**: Gazebo checks if a moving robot arm collides with the environment before executing a motion command.

**Related**: Physics Engine, Simulation, Module 2

---

### Collision Geometry
**Definition**: A simplified 3D shape (box, sphere, cylinder, mesh) used for collision detection, distinct from the visual mesh of a robot.

**Purpose**: Collision geometry is often simpler than the visual mesh for computational efficiency.

**Related**: Visual Geometry, URDF, Module 1

---

### CUDA (Compute Unified Device Architecture)
**Definition**: NVIDIA's parallel computing platform and programming model that enables GPU acceleration. Critical for real-time perception in robotics.

**Related**: GPU, Isaac ROS, Module 3

---

### Costmap
**Definition**: A 2D or 3D grid-based representation of the environment indicating traversable and occupied regions. Used by navigation algorithms to plan paths.

**Types**:
- **Global Costmap**: Large-scale map based on sensor data
- **Local Costmap**: Small region around the robot for reactive obstacle avoidance

**Related**: Nav2, SLAM, Module 3

---

## D

### DDS (Data Distribution Service)
**Definition**: The middleware layer underlying ROS 2 communication. DDS provides flexible publisher-subscriber messaging with Quality of Service (QoS) settings.

**Key Feature**: Automatic node discovery and distributed communication without a central server.

**Related**: ROS 2, Topic, QoS, Module 1

---

### Dead Reckoning
**Definition**: Estimating robot position by integrating odometry (wheel encoder) measurements. Accumulates error over time due to wheel slip.

**Limitation**: Drift increases with distance traveled; must be corrected using SLAM or GNSS.

**Related**: Odometry, SLAM, Localization, Module 3

---

### Deep Learning
**Definition**: A subset of machine learning using neural networks with multiple layers to automatically learn representations from data.

**Applications in Robotics**:
- Object detection (YOLO, ResNet)
- Semantic segmentation
- Vision-language models (CLIP, Vision-Transformers)

**Related**: Computer Vision, Neural Network, Module 4

---

### Depth Camera (RGB-D Camera)
**Definition**: A camera that captures both color (RGB) and depth information per pixel, enabling 3D perception.

**Examples**: RealSense D435, Kinect, Zed

**Related**: Sensor, 3D Perception, Computer Vision, Module 2

---

### Degrees of Freedom (DOF)
**Definition**: The number of independent ways a robot or joint can move. A revolute joint has 1 DOF (rotation). A rigid body in 3D space has 6 DOF (3 translation, 3 rotation).

**Example**: A 6-DOF robot arm can move to any position and orientation within its workspace.

**Related**: Joint, Kinematics, Module 1

---

### Differential Drive
**Definition**: A mobile robot locomotion system using two independently controlled wheels. Direction is controlled by differential wheel speeds.

**Equations**:
- Forward speed: `v = (v_left + v_right) / 2`
- Angular velocity: `ω = (v_right - v_left) / wheel_base`

**Related**: Robot Kinematics, Mobile Robot, Module 3

---

### Digital Twin
**Definition**: A digital simulation model of a physical robot or system that mirrors its behavior and structure. Used for testing and validation before deployment.

**Related**: Simulation, Gazebo, Isaac Sim, Module 2

---

### DQN (Deep Q-Network)
**Definition**: A reinforcement learning algorithm combining Q-learning with deep neural networks, enabling robots to learn control policies from high-dimensional sensory input.

**Application**: Teaching robots complex behaviors through trial-and-error.

**Related**: Reinforcement Learning, Deep Learning, Machine Learning

---

## E

### End-Effector
**Definition**: The terminal component of a robot manipulator that interacts with the environment. Examples: gripper, camera, tool.

**Related**: Manipulator, Gripper, Joint, Module 4

---

### Encoder (Rotary Encoder)
**Definition**: A sensor that measures the rotation angle of a motor shaft, providing odometry feedback for position and speed estimation.

**Types**:
- Incremental: Counts rotation pulses
- Absolute: Outputs current angle (0-360°)

**Related**: Odometry, Dead Reckoning, Module 1

---

## F

### Frame (Coordinate Frame)
**Definition**: A coordinate system (origin + axes) for defining positions and orientations of robot components. Also called a "tf" in ROS 2.

**Standard Frames**:
- `base_link`: Robot chassis
- `odom`: Odometry reference frame
- `map`: Global map frame
- `camera_link`: Camera sensor

**Related**: URDF, Transformation, Module 1

---

### Forward Kinematics (FK)
**Definition**: Computing the position and orientation of a robot's end-effector given all joint angles.

**Contrast**: Inverse kinematics (IK) computes required joint angles for a desired end-effector pose.

**Related**: Kinematics, Inverse Kinematics, Module 4

---

### Frame Rate (FPS)
**Definition**: The number of complete images captured or processed per second, measured in frames per second (FPS). Higher FPS enables smoother motion tracking.

**Typical Values**:
- 30 FPS: Standard video
- 60 FPS: Smooth perception
- 100+ FPS: High-speed robotics

**Related**: Camera, Perception, Latency, Module 2

---

## G

### Gazebo
**Definition**: An open-source 3D physics simulation environment for robotics. Enables safe testing of robot control algorithms before hardware deployment.

**Features**:
- Physics simulation (gravity, friction, contacts)
- Multiple sensors (camera, LiDAR, IMU)
- ROS 2 integration

**Related**: Simulation, Digital Twin, Module 2

---

### Gripper
**Definition**: An end-effector designed to grasp and manipulate objects. Types include:
- Parallel-jaw grippers (two fingers)
- Multi-finger hands
- Vacuum grippers
- Magnetic grippers

**Related**: End-Effector, Manipulation, Module 4

---

### Grasp Planning
**Definition**: The computational process of computing where and how to grasp an object to stably pick it up and manipulate it.

**Algorithm Types**:
- Analytical grasp planning (geometric analysis)
- Machine learning-based (learned from data)

**Related**: Manipulation, Computer Vision, Module 4

---

### GPU (Graphics Processing Unit)
**Definition**: A parallel-processing chip optimized for graphics and massively parallel computations. Essential for real-time perception in modern robotics.

**Role in Robotics**:
- Accelerate vision model inference
- Physics simulation
- SLAM computation

**Related**: CUDA, Isaac ROS, Deep Learning, Module 3

---

## H

### Humanoid Robot
**Definition**: A robot designed to resemble the human body, typically with a torso, head, two arms, and two legs. Enables operation in human environments.

**Examples**: Boston Dynamics Atlas, Tesla Optimus, IHMC Valkyrie

**Related**: Biped Locomotion, Mobile Manipulation

---

## I

### IMU (Inertial Measurement Unit)
**Definition**: A sensor combining accelerometers and gyroscopes to measure linear acceleration and angular velocity, used for orientation estimation and dead reckoning.

**Typical Output**: 3D acceleration + 3D angular velocity (6-DOF)

**Related**: Sensor, Dead Reckoning, SLAM, Module 2

---

### Inverse Kinematics (IK)
**Definition**: Computing the joint angles required to move a robot's end-effector to a desired position and orientation.

**Challenge**: Multiple solutions may exist (or none), requiring optimization.

**Tools**: MoveIt 2, Orocos KDL, industrial_kinematics

**Related**: Forward Kinematics, Motion Planning, Module 4

---

### Isaac ROS
**Definition**: NVIDIA's collection of ROS 2 packages optimized for GPU-accelerated perception, enabling real-time vision processing on edge devices (Jetson).

**Key Packages**:
- `isaac_ros_dnn_image_encoder`: GPU image encoding
- `isaac_ros_object_detection`: GPU object detection
- `isaac_ros_slam`: GPU-accelerated SLAM

**Related**: GPU, ROS 2, Jetson, Module 3

---

### Isaac Sim
**Definition**: NVIDIA's photorealistic simulation platform built on Omniverse. Provides advanced graphics, physics, and sensor simulation for robotics development.

**Capabilities**:
- Photorealistic rendering
- GPU-accelerated physics
- Advanced sensor simulation
- ROS 2 integration

**Related**: Simulation, Digital Twin, Module 2

---

## J

### Joint
**Definition**: A connection between two links in a robot allowing relative motion. Common types: revolute (rotation), prismatic (linear), fixed.

**Joint Configuration**:
```xml
<joint name="joint1" type="revolute">
  <parent link="base_link"/>
  <child link="link1"/>
  <axis xyz="0 0 1"/>  <!-- Rotation axis -->
  <limit lower="0" upper="3.14"/>  <!-- Angle limits -->
</joint>
```

**Related**: Link, URDF, Degrees of Freedom, Module 1

---

### Jetson (NVIDIA Jetson)
**Definition**: NVIDIA's series of edge AI computing modules (Xavier, Orin, Orin Nano) designed for robotics and embedded AI applications.

**Key Models**:
- **Jetson Orin Nano**: $249, 8GB RAM (entry-level edge)
- **Jetson Orin NX**: $749, 16GB RAM (professional)

**Related**: Edge Computing, GPU, Isaac ROS, Module 3

---

## K

### Kinematics
**Definition**: The study of robot motion without considering forces or torques. Includes forward kinematics (FK) and inverse kinematics (IK).

**Related**: Forward Kinematics, Inverse Kinematics, Motion Planning, Module 4

---

### Kinematic Chain
**Definition**: A series of connected links and joints forming a path from the base of a robot to an end-effector. Serial chains are simpler; parallel chains are more complex.

**Example**: A 6-DOF robot arm with 6 revolute joints forming a serial kinematic chain.

**Related**: Link, Joint, URDF, Module 1

---

## L

### LiDAR (Light Detection and Ranging)
**Definition**: An active sensor that measures distance by emitting laser light and measuring the time for reflections to return. Creates detailed 3D point clouds.

**Common Configurations**:
- 2D LiDAR: Single plane, low cost, good for mobile SLAM
- 3D LiDAR: Multiple planes, higher cost, rich data (Velodyne, Sick)

**Related**: Sensor, 3D Perception, SLAM, Module 2

---

### Link
**Definition**: A rigid component in a robot model. Links are connected by joints. Each link has position, orientation, mass, and collision properties.

**URDF Definition**:
```xml
<link name="base_link">
  <visual>...</visual>
  <collision>...</collision>
  <inertial>...</inertial>
</link>
```

**Related**: Joint, URDF, Kinematic Chain, Module 1

---

### Loop Closure (SLAM)
**Definition**: The detection of previously visited locations in SLAM, enabling correction of accumulated drift by closing loops in the pose graph.

**Significance**: Critical for long-term SLAM accuracy.

**Related**: SLAM, Localization, Mapping, Module 3

---

### LLM (Large Language Model)
**Definition**: A deep learning model trained on vast text corpora to understand and generate human language. Examples: GPT-4, LLaMA, Mistral.

**Robotics Application**: Natural language command interpretation, task planning, human-robot dialogue.

**Related**: Deep Learning, Natural Language Processing, Module 4

---

## M

### Manipulator
**Definition**: The arm and gripper subsystem of a robot designed for grasping and manipulating objects. Typically includes a series of joints and an end-effector.

**Examples**: 6-DOF industrial arms (KUKA, ABB), collaborative robots (UR10e, Franka Emika Panda)

**Related**: Robot Arm, End-Effector, Kinematics, Module 4

---

### Mapping
**Definition**: The process of creating a spatial model (map) of an environment. Combined with localization in SLAM.

**Output**: Occupancy grid, feature map, or 3D point cloud

**Related**: SLAM, Localization, Nav2, Module 3

---

### Motion Planning
**Definition**: Algorithms that compute collision-free paths for a robot from start to goal configuration.

**Common Approaches**:
- RRT (Rapidly-Exploring Random Trees)
- Dijkstra's algorithm
- A* search
- Trajectory optimization

**Tool**: MoveIt 2

**Related**: Path Planning, Collision Detection, Module 4

---

### Mobile Robot
**Definition**: A robot capable of autonomous or remote-controlled locomotion through an environment (wheeled, legged, or flying).

**Examples**: Differential-drive robots, quadcopters, humanoids, wheeled platforms

**Related**: Locomotion, Navigation, Autonomous System, Module 3

---

### MoveIt 2
**Definition**: A ROS 2 motion planning framework providing collision-aware arm control, grasp planning, and trajectory execution.

**Components**:
- Kinematics solvers (IK)
- Motion planners (RRT, Dijkstra)
- Trajectory execution
- Visualization (MoveIt RViz Plugin)

**Related**: Motion Planning, Inverse Kinematics, Manipulation, Module 4

---

## N

### Nav2
**Definition**: The Navigation 2 software stack for ROS 2, providing autonomous navigation including path planning, obstacle avoidance, and behavior trees.

**Components**:
- Planner (global path)
- Controller (local obstacle avoidance)
- Behavior Tree (high-level logic)
- Recovery behaviors (stuck detection)

**Related**: Autonomous Navigation, Costmap, SLAM, Module 3

---

### Node (ROS 2 Node)
**Definition**: An executable ROS 2 process that performs a specific function (sensing, processing, control). Nodes communicate via topics, services, and actions.

**Example**: A camera driver node publishes images; a perception node subscribes to images and publishes detections.

**Related**: Topic, Service, Publisher, Subscriber, Module 1

---

### Namespace (ROS 2 Namespace)
**Definition**: A hierarchical naming scheme for organizing ROS 2 topics, services, and parameters to avoid conflicts.

**Example**:
```
/robot1/sensors/camera/image_raw
/robot2/sensors/camera/image_raw
/lab/user/alice/debug_topic
```

**Related**: Topic, ROS 2 Architecture, Module 1

---

## O

### Occupancy Grid
**Definition**: A 2D or 3D probabilistic map dividing space into cells, each marked as occupied, free, or unknown.

**Use**: Navigation algorithms use occupancy grids to plan collision-free paths.

**Related**: SLAM, Costmap, Mapping, Module 3

---

### Odometry
**Definition**: Estimation of robot position and orientation based on incremental motion measurements (typically from wheel encoders or visual odometry).

**Characteristic**: Accumulates drift over time.

**Related**: Dead Reckoning, Localization, SLAM, Module 3

---

### Optimization (Trajectory Optimization)
**Definition**: Mathematical minimization of robot motion cost (time, energy, smoothness) subject to kinematic and dynamic constraints.

**Example**: MoveIt 2 optimizes joint trajectories for smoothness and collision avoidance.

**Related**: Motion Planning, Control Theory, Module 4

---

## P

### Path Planning
**Definition**: Computing a sequence of waypoints or trajectories for a robot to reach a goal while avoiding obstacles.

**Difference from Motion Planning**: Path planning often uses 2D simplifications; motion planning handles full 3D configuration space.

**Related**: Motion Planning, Nav2, Collision Detection, Module 3

---

### Perception
**Definition**: The computational interpretation of sensor data (camera, LiDAR, depth) to understand the environment.

**Typical Pipeline**: Raw sensor data → Preprocessing → Feature extraction → Object detection/segmentation → Decision

**Related**: Computer Vision, Sensor, Deep Learning, Module 3

---

### Physics Engine
**Definition**: Software that simulates physical phenomena (gravity, friction, collisions) enabling realistic robot simulation.

**Examples**: Gazebo uses ODE or Bullet; Isaac Sim uses Nvidia PhysX

**Related**: Simulation, Gazebo, Isaac Sim, Module 2

---

### Point Cloud
**Definition**: A set of 3D points (x, y, z) representing the surface of objects in a scene, typically generated by LiDAR or depth cameras.

**Processing**: Downsampling, filtering, registration (aligning multiple clouds)

**Related**: LiDAR, 3D Perception, SLAM, Module 2

---

### Publisher (ROS 2)
**Definition**: A node component that periodically sends messages on a topic. Other nodes subscribe to receive these messages.

**Example**:
```python
pub = self.create_publisher(Float32, 'temperature', 10)
pub.publish(msg)
```

**Related**: Topic, Subscriber, Message, Module 1

---

## Q

### QoS (Quality of Service)
**Definition**: Settings governing ROS 2 message delivery: reliability (best-effort vs reliable), history (keep last vs all), and other parameters.

**Use Case**: Different QoS for different data types:
- **Sensor data**: Best-effort, smallest buffer (low latency)
- **Critical commands**: Reliable, larger buffer

**Related**: DDS, ROS 2 Communication, Module 1

---

### Quaternion
**Definition**: A 4-tuple (x, y, z, w) representing 3D rotation, more compact and computationally efficient than Euler angles or rotation matrices.

**Advantage**: Avoids gimbal lock; smooth interpolation (slerp)

**Related**: Orientation, Transformation, Kinematics, Module 1

---

## R

### ROS 2 (Robot Operating System 2)
**Definition**: A flexible, distributed middleware framework for building robotics applications. Primary platform for this course.

**Key Concepts**: Nodes, topics, services, packages, launch files

**Core Difference from ROS 1**: Decentralized (no master), DDS middleware, better real-time support

**Related**: Middleware, DDS, Node, Topic, Module 1

---

### ROS Bag (ROSbag)
**Definition**: A file format for recording and playing back ROS 2 topic data, enabling offline analysis and reproduction of robot experiments.

**Usage**:
```bash
ros2 bag record -a  # Record all topics
ros2 bag play rosbag2_0  # Replay
```

**Related**: ROS 2, Debugging, Testing, Module 1

---

### RViz2 (ROS Visualization)
**Definition**: A 3D visualization tool for displaying robot models, sensor data (point clouds, images), and TF transforms.

**Features**: Load URDF, visualize topics, interactive markers, trajectory playback

**Related**: ROS 2, Visualization, URDF, Module 1

---

### Reinforcement Learning
**Definition**: A machine learning paradigm where an agent learns to make decisions by interacting with an environment and receiving rewards/penalties.

**Robotics Application**: Learning robot control policies through trial-and-error.

**Related**: Deep Learning, Machine Learning, DQN

---

### Revolute Joint
**Definition**: A joint allowing continuous or bounded rotation around a single axis.

**Example**: Robot shoulder joint rotating around the vertical axis

**Related**: Joint, Prismatic Joint, Degrees of Freedom, Module 1

---

## S

### SLAM (Simultaneous Localization and Mapping)
**Definition**: The combined process of building a map of an environment while simultaneously determining a robot's position within that map.

**Algorithms**: Cartographer (graph-based), LOAM (feature-based), Visual SLAM

**Challenge**: Maintaining consistency despite sensor noise and accumulated drift

**Related**: Localization, Mapping, Navigation, Module 3

---

### Sensor
**Definition**: A device that measures physical quantities and outputs data to a robot. Common types: camera, LiDAR, IMU, encoder, depth camera.

**Related**: Perception, Hardware, Module 2

---

### Service (ROS 2)
**Definition**: A request-response communication pattern where a client sends a request and waits for a server to respond. Unlike topics (streaming), services are synchronous.

**Use Case**: Configuration changes, computation requests

**Related**: Topic, Action, Client-Server, Module 1

---

### Sim-to-Real Transfer
**Definition**: The challenge and process of transferring learned robot behaviors from simulation to physical hardware, addressing the simulation-reality gap.

**Domain Randomization**: A technique adding noise/variation to simulation to improve generalization to real world.

**Related**: Simulation, Digital Twin, Deployment, Module 2

---

### Simulation
**Definition**: The computational recreation of a robot and environment, enabling safe testing before hardware deployment.

**Advantages**: Speed, repeatability, safety, cost

**Tools**: Gazebo, Isaac Sim, V-REP, CoppeliaSim, Unity

**Related**: Digital Twin, Physics Engine, Module 2

---

### Subscriber (ROS 2)
**Definition**: A node component that receives messages published on a topic, typically via a callback function.

**Example**:
```python
self.create_subscription(Image, 'camera/image', self.image_callback, 10)
```

**Related**: Topic, Publisher, Callback, Module 1

---

## T

### Tensor
**Definition**: A multi-dimensional array of numbers. Scalar (0D), vector (1D), matrix (2D), volume (3D). Used extensively in neural networks.

**Related**: Deep Learning, Neural Network, Machine Learning

---

### Topic (ROS 2)
**Definition**: A named channel for asynchronous, publisher-subscriber communication. Multiple nodes can publish/subscribe to the same topic.

**Naming Convention**: `/robot/sensors/camera/image_raw`

**Message Types**: Defined in `.msg` files (e.g., `sensor_msgs/Image`)

**Related**: Publisher, Subscriber, Node, DDS, Module 1

---

### Trajectory
**Definition**: A time-parameterized sequence of robot configurations (positions, velocities) from start to goal.

**Generation**: Motion planning algorithms generate trajectories respecting kinematic/dynamic constraints.

**Related**: Motion Planning, Control, Module 4

---

### Transformation (TF)
**Definition**: Spatial relationship (translation + rotation) between coordinate frames. ROS 2 maintains a tree of transformations (`tf2`).

**Example**: Transform from `base_link` to `camera_link` describing camera location on robot

**Related**: Frame, Quaternion, URDF, Module 1

---

### Tuning (Parameter Tuning)
**Definition**: Adjusting algorithm parameters (e.g., PID gains, planner speeds) for optimal performance on a specific robot/task.

**Approach**: Start with defaults, incrementally adjust based on observed behavior.

**Related**: Control, Optimization, Module 3

---

## U

### URDF (Unified Robot Description Format)
**Definition**: An XML-based format describing robot structure (links, joints, sensors) used across ROS 2 tools for visualization and simulation.

**Components**: Links (rigid bodies), joints (connections), sensors, plugins

**Related**: Link, Joint, Robot Model, Module 1

---

## V

### Vector
**Definition**: A 1D array of numbers representing direction and magnitude. In robotics, commonly used for positions, velocities, forces.

**Example**: 3D velocity vector [vx, vy, vz]

**Related**: Tensor, Linear Algebra, Module 1

---

### Vision-Language Model (VLM)
**Definition**: A deep learning model trained on both images and text, enabling tasks like visual question answering and image captioning.

**Example**: CLIP (Contrastive Language-Image Pre-training) for image-text matching

**Related**: Deep Learning, Perception, Computer Vision, Module 4

---

### Visual Geometry
**Definition**: The 3D mesh representation of a robot component used for rendering/visualization (distinct from collision geometry).

**Format**: STL, DAE, OBJ files

**Related**: Collision Geometry, URDF, Visualization, Module 1

---

## W

### Workspace
**Definition**: The set of positions and orientations reachable by a robot's end-effector. Limited by joint ranges and link lengths.

**Related**: Kinematics, Degrees of Freedom, Manipulator, Module 4

---

### Wheeled Locomotion
**Definition**: Robot movement via wheels or tracks. Common in mobile robots.

**Types**:
- Differential drive (2 wheels, direction via speed difference)
- Ackermann steering (4+ wheels, like cars)
- Omnidirectional (holonomic wheels)

**Related**: Mobile Robot, Navigation, Module 3

---

## X-Y-Z (Coordinate System)

### X-Axis
**Definition**: Typically the forward direction in a robot coordinate frame (right-hand rule).

**Related**: Coordinate Frame, Transformation

---

### Y-Axis
**Definition**: Typically the leftward direction in a robot coordinate frame.

**Related**: Coordinate Frame, Transformation

---

### Z-Axis
**Definition**: Typically the upward direction in a robot coordinate frame.

**Related**: Coordinate Frame, Transformation

---

## Y

### YOLO (You Only Look Once)
**Definition**: A popular real-time object detection neural network that predicts bounding boxes and class labels in a single forward pass.

**Versions**: YOLOv3, YOLOv5, YOLOv8 (increasingly accurate and fast)

**Robotics Use**: Real-time object detection for picking, navigation, inspection

**Related**: Object Detection, Deep Learning, Computer Vision, Module 3

---

## Z

### Zero-G Compensation
**Definition**: Control algorithms that counteract gravity in robot manipulators, allowing smooth movements without joint acceleration.

**Method**: Measure gravitational load, apply equal opposing torque

**Related**: Control, Dynamics, Manipulation, Module 4

---

## Cross-References by Topic

### ROS 2 Concepts
- Action Server
- DDS
- Node
- Publisher
- Subscriber
- Service
- Topic
- Namespace
- QoS

### Robot Mechanics
- Actuator
- Degrees of Freedom
- End-Effector
- Forward Kinematics
- Inverse Kinematics
- Joint
- Kinematics
- Link
- Workspace

### Sensors
- Camera
- Depth Camera
- Encoder
- IMU
- LiDAR
- Sensor

### Simulation & Digital Twins
- Collision Detection
- Collision Geometry
- Digital Twin
- Gazebo
- Isaac Sim
- Physics Engine
- Simulation
- Visual Geometry

### Navigation & Localization
- SLAM
- Localization
- Mapping
- Nav2
- Odometry
- Path Planning
- Costmap
- Occupancy Grid

### Perception & Vision
- Bounding Box
- Computer Vision
- Deep Learning
- Neural Network
- Object Detection
- Perception
- Point Cloud
- YOLO

### Manipulation & Control
- Grasp Planning
- Gripper
- Manipulator
- Motion Planning
- MoveIt 2
- Trajectory
- Inverse Kinematics

### AI & Learning
- Reinforcement Learning
- Deep Learning
- LLM
- Vision-Language Model
- Neural Network

### Hardware
- GPU
- Jetson
- CUDA
- Edge Computing

---

## How to Use This Glossary

1. **Search by Term**: Use Ctrl+F to find definitions alphabetically
2. **Follow Cross-References**: Related concepts are listed for deeper learning
3. **Module Links**: See which module covers each term in depth
4. **Pronunciation**: Terms are written phonetically where helpful

---

## Suggested Reading Order

**Beginner** (Start here):
1. Node, Topic, Publisher, Subscriber
2. Link, Joint, URDF
3. Sensor, Perception
4. SLAM, Localization

**Intermediate** (After Module 1-2):
1. DDS, QoS, Namespace
2. Kinematics, Forward Kinematics
3. Gazebo, Physics Engine
4. Nav2, Costmap

**Advanced** (After Module 3-4):
1. Inverse Kinematics, Motion Planning
2. Deep Learning, Neural Network
3. Reinforcement Learning
4. Vision-Language Model

---

## Terminology by Course Module

### Module 1: ROS 2 Fundamentals
- Action Server
- DDS
- Frame
- Joint
- Link
- Namespace
- Node
- Publisher
- Subscriber
- Service
- Topic
- URDF

### Module 2: Digital Twins & Simulation
- Collision Detection
- Digital Twin
- Gazebo
- Physics Engine
- Point Cloud
- Sensor
- Simulation
- Visual Geometry

### Module 3: Isaac AI & Perception
- Computer Vision
- CUDA
- Deep Learning
- GPU
- Isaac ROS
- Isaac Sim
- Jetson
- LiDAR
- SLAM
- Nav2
- Object Detection
- Perception
- YOLO

### Module 4: VLA & Integration
- End-Effector
- Grasp Planning
- Gripper
- Inverse Kinematics
- LLM
- Manipulator
- Motion Planning
- MoveIt 2
- Trajectory
- Vision-Language Model

---

**Need a term explained?** Check above or refer to the specific module covering that concept.

**Still confused?** Post on [ROS Discourse](https://discourse.ros.org/) or your course forum.
