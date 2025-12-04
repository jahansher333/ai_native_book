---
title: "Isaac Sim"
description: "Master NVIDIA Isaac Sim for photorealistic simulation and synthetic data generation"
module_id: "module-3"
sidebar_position: 1
tags: ["isaac-sim", "simulation", "synthetic-data", "nvidia", "photorealistic"]
difficulty: advanced
estimated_minutes: 35
---

# Isaac Sim

## Learning Objectives

By the end of this section, you will be able to:
- Install and configure NVIDIA Isaac Sim
- Understand the Omniverse platform and USD format
- Create photorealistic scenes and environments
- Implement domain randomization for robust training data
- Generate synthetic datasets at scale
- Integrate Isaac Sim with ROS 2
- Optimize simulation for real-time performance
- Deploy simulation results for real-world applications

## Introduction to Isaac Sim

NVIDIA Isaac Sim is a powerful robotics simulator built on the Omniverse platform. Unlike traditional physics-only simulators, Isaac Sim combines accurate physics with photorealistic rendering, GPU-accelerated simulation, and advanced AI capabilities. It's designed specifically for training deep learning models with synthetic data that transfers well to real-world deployments.

### Why Isaac Sim?

- **Photorealistic Rendering**: RTX-based graphics for training data that looks like real sensor feeds
- **GPU Acceleration**: Simulate up to 4,000 robots simultaneously on a single GPU
- **Domain Randomization**: Automatically vary environments to improve model robustness
- **TensorRT Integration**: Direct deployment of trained models
- **ROS 2 Native**: Full integration with ROS 2 ecosystem
- **USD Standard**: Leverage ecosystem of 3D models and assets

## Installation and Setup

### System Requirements

- NVIDIA RTX GPU (RTX 3090, A5000, or better)
- 32GB+ GPU VRAM (64GB+ recommended for large scenarios)
- 128GB+ system RAM
- 500GB+ SSD storage
- Ubuntu 20.04 or 22.04 LTS

### Installation Steps

```bash
# 1. Install NVIDIA drivers (if not already installed)
sudo apt-get install nvidia-driver-530

# 2. Install CUDA and cuDNN
sudo apt-get install nvidia-cuda-toolkit

# 3. Download Isaac Sim from NVIDIA
# Visit: https://developer.nvidia.com/isaac/sim
# Download the appropriate version for your OS

# 4. Extract and install
mkdir -p ~/omniverse
cd ~/omniverse
tar -xzf isaac-sim-*.tar.gz

# 5. Set environment variables
echo "export PATH=~/omniverse/isaac-sim/bin:\$PATH" >> ~/.bashrc
echo "export LD_LIBRARY_PATH=~/omniverse/isaac-sim/lib:\$LD_LIBRARY_PATH" >> ~/.bashrc
source ~/.bashrc

# 6. Verify installation
isaacsim --version
```

### Running Isaac Sim Headless

```bash
# Launch Isaac Sim without GUI for faster simulation
./isaac_sim.sh --headless

# Or with specific scene
./isaac_sim.sh --headless --offline --asset-root <path>
```

## Understanding USD and Stage Hierarchy

### USD (Universal Scene Description) Basics

Isaac Sim uses USD for scene representation. A USD file organizes 3D data hierarchically:

```
Stage (Root)
├── World
│   ├── Robot
│   │   ├── Base
│   │   ├── Arm
│   │   └── Gripper
│   └── Environment
│       ├── Ground
│       ├── Table
│       └── Objects
```

### Creating a Simple Scene

```python
from omni.isaac.kit import SimulationApp
import omni.usd
from pxr import Usd, UsdGeom, Gf

# Initialize the app
simulation_app = SimulationApp({"headless": False})

# Access the stage
stage = omni.usd.get_context().get_stage()

# Create a simple cube
cube_path = "/World/Cube"
cube = UsdGeom.Cube.Define(stage, cube_path)
cube.GetSizeAttr().Set(1.0)

# Set cube position
cube_prim = stage.GetPrimAtPath(cube_path)
xform = UsdGeom.Xformable(cube_prim)
xform.AddTranslateOp().Set(Gf.Vec3f(0, 0, 1))

# Save the stage
stage.Export("my_scene.usd")

# Cleanup
simulation_app.close()
```

## Setting Up Physics Simulation

### Physics Scene Configuration

```python
from omni.isaac.core import World
from omni.isaac.core.physics_context import PhysicsContext

# Create world with physics
world = World(stage_units_in_meters=1.0)

# Configure physics
physics_context = world.get_physics_context()
physics_context.set_gravity(Gf.Vec3f(0, 0, -9.81))

# Set simulation parameters
physics_context.set_physics_dt(1/60.0)  # 60 Hz
physics_context.enable_gpu_dynamics(True)  # Use GPU acceleration
physics_context.set_solver_type("TGS")  # TGS or PGS

# Step simulation
for i in range(1000):
    world.step(render=True)

world.close()
```

## Loading Robot Models

### Importing URDF Models

```python
from omni.isaac.core.robots import Robot
from omni.isaac.core.utils.stage import add_reference_to_stage

# Method 1: Using high-level API
robot_path = "/World/Robot"
robot = Robot(
    prim_path=robot_path,
    name="my_robot",
    usd_path="/home/user/models/robot.usd"
)

# Method 2: Convert URDF to USD
from omni.isaac.urdf import importer
importer.import_robot(
    urdf_path="/path/to/robot.urdf",
    import_inertia_properties=True
)
```

## Domain Randomization

### Randomizing Visual Properties

```python
import random
from pxr import UsdGeom, Sdf

def randomize_material_color(prim_path, stage):
    """Randomize material color for domain randomization"""
    prim = stage.GetPrimAtPath(prim_path)
    appearance = UsdGeom.Material(prim)

    # Random RGB color
    color = [random.random() for _ in range(3)]
    appearance.GetInput("diffuse_color").Set(color)

def randomize_lighting(stage):
    """Randomize scene lighting"""
    light_path = "/World/Lights/Sun"
    light = stage.GetPrimAtPath(light_path)

    # Random light intensity
    intensity = random.uniform(0.5, 2.0)
    light.GetAttribute("intensity").Set(intensity)

    # Random light angle
    angle_x = random.uniform(-45, 45)
    angle_z = random.uniform(0, 360)
    xform = UsdGeom.Xformable(light)
    ops = xform.GetOrderedXformOps()
    # Apply rotations

def randomize_object_pose(prim_path, stage):
    """Randomize object position and rotation"""
    prim = stage.GetPrimAtPath(prim_path)
    xform = UsdGeom.Xformable(prim)

    # Random position
    pos = [random.uniform(-1, 1) for _ in range(3)]
    xform.AddTranslateOp().Set(pos)

    # Random rotation
    rot_angle = random.uniform(0, 360)
    xform.AddRotateXYZOp().Set((rot_angle, 0, 0))
```

### Systematic Domain Randomization

```python
class DomainRandomizer:
    def __init__(self, stage, config):
        self.stage = stage
        self.config = config

    def randomize_scene(self):
        """Apply all randomizations"""
        if self.config.get("randomize_colors"):
            self._randomize_colors()
        if self.config.get("randomize_lighting"):
            self._randomize_lighting()
        if self.config.get("randomize_textures"):
            self._randomize_textures()
        if self.config.get("randomize_object_poses"):
            self._randomize_object_poses()

    def _randomize_colors(self):
        """Randomize object colors"""
        for obj_path in self.config["object_paths"]:
            randomize_material_color(obj_path, self.stage)

    def _randomize_lighting(self):
        """Randomize lighting conditions"""
        randomize_lighting(self.stage)

    def _randomize_textures(self):
        """Randomize surface textures"""
        # Implementation for texture randomization
        pass

    def _randomize_object_poses(self):
        """Randomize object positions"""
        for obj_path in self.config["object_paths"]:
            randomize_object_pose(obj_path, self.stage)
```

## Generating Synthetic Datasets

### Rendering Ground Truth Data

```python
from omni.isaac.sensor import Camera
import numpy as np

class SyntheticDataGenerator:
    def __init__(self, world, output_dir):
        self.world = world
        self.output_dir = output_dir

        # Create camera
        self.camera = Camera(
            prim_path="/World/Camera",
            resolution=(640, 480),
            position=np.array([0, 0, 1]),
            orientation=np.array([1, 0, 0, 0])
        )

    def generate_dataset(self, num_samples=1000):
        """Generate synthetic dataset with annotations"""
        for i in range(num_samples):
            # Randomize scene
            self._randomize_scene()

            # Step simulation
            self.world.step()

            # Capture RGB image
            rgb = self.camera.get_rgb()

            # Capture depth
            depth = self.camera.get_depth()

            # Get object poses (ground truth)
            poses = self._get_object_poses()

            # Save data
            self._save_sample(i, rgb, depth, poses)

            if i % 100 == 0:
                print(f"Generated {i}/{num_samples} samples")

    def _randomize_scene(self):
        """Randomize scene elements"""
        # Implementation using DomainRandomizer
        pass

    def _get_object_poses(self):
        """Extract ground truth object poses"""
        poses = {}
        # Query object positions from stage
        return poses

    def _save_sample(self, idx, rgb, depth, poses):
        """Save RGB, depth, and annotations"""
        # Save RGB
        rgb.save(f"{self.output_dir}/rgb_{idx:06d}.png")

        # Save depth
        np.save(f"{self.output_dir}/depth_{idx:06d}.npy", depth)

        # Save annotations (JSON)
        import json
        with open(f"{self.output_dir}/anno_{idx:06d}.json", 'w') as f:
            json.dump(poses, f)
```

## ROS 2 Integration

### Setting Up ROS 2 Bridge

```python
from omni.isaac.core import World
from omni.isaac.ros2_bridge import ROS2Bridge

# Create world
world = World()

# Create ROS 2 bridge
ros2_bridge = ROS2Bridge(world)

# Publish joint states to ROS 2
ros2_bridge.publish_joint_states("/joint_states")

# Subscribe to control commands
ros2_bridge.subscribe_joint_commands("/joint_commands")

# Step simulation
for i in range(10000):
    world.step()
    ros2_bridge.step()
```

### Sensor Data Publishing

```python
import rclpy
from sensor_msgs.msg import Image, PointCloud2
from geometry_msgs.msg import TransformStamped

class IsaacSimROS2Node:
    def __init__(self, camera, lidar):
        self.node = rclpy.create_node('isaac_sim_publisher')
        self.camera = camera
        self.lidar = lidar

        # Create publishers
        self.image_pub = self.node.create_publisher(
            Image, '/camera/image_raw', 10
        )
        self.depth_pub = self.node.create_publisher(
            Image, '/camera/depth', 10
        )
        self.cloud_pub = self.node.create_publisher(
            PointCloud2, '/lidar/points', 10
        )

    def publish_sensor_data(self):
        """Publish sensor data to ROS 2"""
        # Capture from Isaac Sim
        rgb = self.camera.get_rgb()
        depth = self.camera.get_depth()
        cloud = self.lidar.get_point_cloud()

        # Convert to ROS 2 messages
        rgb_msg = self._numpy_to_image_msg(rgb)
        depth_msg = self._numpy_to_image_msg(depth)
        cloud_msg = self._numpy_to_pointcloud_msg(cloud)

        # Publish
        self.image_pub.publish(rgb_msg)
        self.depth_pub.publish(depth_msg)
        self.cloud_pub.publish(cloud_msg)
```

## Performance Optimization

### GPU Acceleration

```python
from omni.isaac.core.physics_context import PhysicsContext

# Enable GPU dynamics
physics_context = world.get_physics_context()
physics_context.enable_gpu_dynamics(True)

# Use GPU-accelerated rendering
physics_context.set_gravity(Gf.Vec3f(0, 0, -9.81))

# Reduce collision complexity for speed
# Use simpler collision primitives instead of meshes
```

### Multi-Robot Simulation

```python
from omni.isaac.core.robots import Robot

world = World()

# Create 100 robots on GPU
robots = []
for i in range(100):
    robot = Robot(
        prim_path=f"/World/Robot_{i}",
        name=f"robot_{i}",
        usd_path="/path/to/robot.usd",
        position=np.array([i % 10, i // 10, 0])
    )
    robots.append(robot)

# Simulate all robots simultaneously
for step in range(1000):
    world.step()
```

## Key Takeaways

- Isaac Sim leverages GPU acceleration and photorealistic rendering for advanced simulation
- USD provides a standardized format for scene representation and asset management
- Domain randomization creates robust training data from simulation
- Synthetic data generation enables large-scale dataset creation
- ROS 2 integration allows seamless transition between simulation and real hardware
- GPU-accelerated physics enables simulation of complex multi-robot scenarios
- Real-time photorealistic rendering improves perception model training

## Next Steps

1. [Explore Isaac ROS](./isaac-ros.md) - Deploy perception and navigation pipelines
2. [Implement Perception](./perception.md) - Build vision-based AI systems
3. [Build Navigation](./navigation.md) - Create autonomous navigation systems

## Further Reading

- [NVIDIA Isaac Sim Documentation](https://docs.omniverse.nvidia.com/isaacsim/latest/)
- [USD Format Specification](https://graphics.pixar.com/usd/docs/index.html)
- [Domain Randomization Papers](https://arxiv.org/abs/1810.03779)
- [NVIDIA Isaac ROS GitHub](https://github.com/isaac-ros)
