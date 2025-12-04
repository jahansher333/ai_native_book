---
title: "Gazebo Simulation"
description: "Learn to set up realistic physics simulations using Gazebo with ROS 2 integration"
module_id: "module-2"
sidebar_position: 1
tags: ["gazebo", "simulation", "physics", "ros2"]
difficulty: intermediate
estimated_minutes: 25
---

# Gazebo Simulation

## Learning Objectives

By the end of this section, you will be able to:
- Understand Gazebo architecture and simulation components
- Set up a basic Gazebo simulation environment
- Create and configure robot models in simulation
- Interact with Gazebo through ROS 2 services and topics
- Troubleshoot common simulation issues
- Optimize simulation performance for real-time operations

## Introduction to Gazebo

Gazebo is the industry-standard, open-source robotics simulator used by researchers, educators, and industry professionals worldwide. It provides high-fidelity physics simulation, realistic sensor modeling, and seamless ROS 2 integration, making it ideal for developing and testing robotics applications before deployment to physical hardware.

### Why Gazebo?

Gazebo stands out for several reasons:
- **Accurate Physics**: Built on the ODE (Open Dynamics Engine) or Bullet physics engine
- **ROS 2 Native**: Designed with tight integration with ROS 2
- **Extensible**: Plugins allow custom physics, sensor behaviors, and world dynamics
- **Multi-Robot Support**: Simulate multiple robots interacting in shared environments
- **Headless Operation**: Run simulations without graphics for faster computation
- **Community**: Large ecosystem with pre-built models and plugins

## Gazebo Architecture

Gazebo follows a modular architecture with three core components:

### 1. Gazebo Server (gzserver)
The computational engine that runs the physics simulation, updates entity states, and processes sensor data. It operates independently of visualization.

### 2. Gazebo Client (gzclient)
The graphical user interface for visualizing the simulation. You can run multiple clients connected to a single server.

### 3. ROS 2 Bridge
Connects Gazebo with ROS 2, allowing you to publish sensor data to topics and subscribe to actuator commands. This enables seamless integration with existing ROS 2 software.

## Setting Up Your First Gazebo Simulation

### Installation

```bash
sudo apt-get update
sudo apt-get install ros-humble-gazebo-ros-pkgs ros-humble-gazebo-plugins
```

### Creating a Simple World

Gazebo uses SDF (Simulation Description Format) files to define worlds. Create a basic world file:

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="simple_world">
    <!-- Physics engine configuration -->
    <physics name="default_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>

    <!-- Lighting -->
    <light name="sun" type="directional">
      <pose>0 0 10 0 0 0</pose>
      <diffuse>1 1 1 1</diffuse>
      <direction>-0.5 0.1 -0.9</direction>
    </light>

    <!-- Ground plane -->
    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <material>
            <ambient>0.8 0.8 0.8 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
          </material>
        </visual>
      </link>
    </model>

    <!-- A simple box obstacle -->
    <model name="box_obstacle">
      <pose>5 0 0.5 0 0 0</pose>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
          <material>
            <ambient>1 0 0 1</ambient>
          </material>
        </visual>
        <inertial>
          <mass>1.0</mass>
        </inertial>
      </link>
    </model>
  </world>
</sdf>
```

### Launching Gazebo with ROS 2

Create a launch file `gazebo_world.launch.py`:

```python
import os
from launch import LaunchDescription
from launch.actions import ExecuteProcess
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Path to your world file
    world_file = os.path.join(
        get_package_share_directory('your_package'),
        'worlds',
        'simple_world.sdf'
    )

    return LaunchDescription([
        ExecuteProcess(
            cmd=['gazebo', '--verbose', world_file],
            output='screen'
        )
    ])
```

Launch it with:
```bash
ros2 launch your_package gazebo_world.launch.py
```

## Integrating Robots with URDF

Robot models are defined using URDF (Unified Robot Description Format). Gazebo automatically converts URDF to SDF for simulation:

```xml
<?xml version="1.0"?>
<robot name="mobile_robot">
  <!-- Base link -->
  <link name="base_link">
    <inertial>
      <mass value="5.0"/>
      <origin rpy="0 0 0" xyz="0 0 0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
    <visual>
      <origin rpy="0 0 0" xyz="0 0 0"/>
      <geometry>
        <box size="0.4 0.3 0.2"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <origin rpy="0 0 0" xyz="0 0 0"/>
      <geometry>
        <box size="0.4 0.3 0.2"/>
      </geometry>
    </collision>
  </link>

  <!-- Wheel joint example -->
  <joint name="left_wheel_joint" type="revolute">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <axis xyz="0 1 0"/>
    <limit effort="10" lower="0" upper="0" velocity="10"/>
    <origin rpy="0 0 0" xyz="0 0.2 0"/>
  </joint>

  <link name="left_wheel">
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.01" iyz="0" izz="0.01"/>
    </inertial>
    <visual>
      <geometry>
        <cylinder length="0.1" radius="0.1"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.1" radius="0.1"/>
      </geometry>
    </collision>
  </link>
</robot>
```

## ROS 2 Integration

Once your robot is in Gazebo, control it through ROS 2:

### Subscribe to Joint States
```python
from rclpy.node import Node
from sensor_msgs.msg import JointState

class RobotMonitor(Node):
    def __init__(self):
        super().__init__('robot_monitor')
        self.subscription = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_callback,
            10
        )

    def joint_callback(self, msg):
        for i, name in enumerate(msg.name):
            self.get_logger().info(
                f'{name}: position={msg.position[i]:.2f}, '
                f'velocity={msg.velocity[i]:.2f}'
            )
```

### Publish Actuator Commands
```python
from std_msgs.msg import Float64MultiArray

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')
        self.publisher = self.create_publisher(
            Float64MultiArray,
            '/forward_position_controller/commands',
            10
        )

    def send_command(self, positions):
        msg = Float64MultiArray()
        msg.data = positions
        self.publisher.publish(msg)
```

## Physics Configuration

Fine-tune simulation physics for accuracy and performance:

```xml
<physics name="default_physics" type="ode">
  <!-- Simulation timestep in seconds -->
  <max_step_size>0.001</max_step_size>

  <!-- Real-time factor: 1.0 = real-time, >1.0 = faster, <1.0 = slower -->
  <real_time_factor>1.0</real_time_factor>

  <!-- Real-time update rate in Hz -->
  <real_time_update_rate>1000</real_time_update_rate>

  <!-- ODE-specific settings -->
  <ode>
    <solver>
      <type>quick</type>
      <iters>50</iters>
      <sor>1.3</sor>
    </solver>
    <constraints>
      <cfm>0</cfm>
      <erp>0.2</erp>
      <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
      <contact_surface_layer>0.001</contact_surface_layer>
    </constraints>
  </ode>
</physics>
```

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Robot falls through ground | Ensure ground plane collision geometry is correct; increase contact_surface_layer |
| Simulation runs slow | Reduce physics update rate; increase max_step_size; disable unnecessary visualization |
| Erratic robot behavior | Reduce max_step_size for better accuracy; check inertia values; validate joint constraints |
| ROS 2 communication fails | Verify DomainID matches; check topic names; ensure Gazebo plugins are loaded |

## Performance Optimization

- **Headless Mode**: Run `gzserver` without GUI for faster computation
- **Update Rates**: Balance accuracy and speed with appropriate physics timesteps
- **Level of Detail**: Disable shadows, reduce texture resolution for complex scenes
- **Parallel Processing**: Use multiple CPU cores for physics calculations

## Key Takeaways

- Gazebo provides accurate physics simulation with tight ROS 2 integration
- SDF files define world geometry, physics, and initial conditions
- URDF models are automatically converted to SDF for use in Gazebo
- ROS 2 topics and services enable seamless communication with simulated robots
- Physics parameters must be tuned for simulation accuracy and performance
- Headless mode and optimization strategies improve simulation speed

## Next Steps

1. [Model Sensors](./sensors-modeling.md) - Add realistic sensor simulation to your robots
2. [Build Environments](./environment-building.md) - Create complex virtual worlds
3. [Explore Unity Integration](./unity-integration.md) - Enhance visualization with high-fidelity graphics

## Further Reading

- [Gazebo Tutorials](https://gazebosim.org/docs/fortress/tutorials)
- [ROS 2 Gazebo Integration](https://docs.ros.org/en/humble/Tutorials/Advanced/Simulators/Gazebo/index.html)
- [SDF Reference](http://sdformat.org/)
