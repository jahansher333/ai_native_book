---
title: "URDF Basics"
description: "Learn to model robots using URDF (Unified Robot Description Format), including links, joints, and visualization in RViz2."
module_id: "module-1"
sidebar_position: 2
tags: ["urdf", "robot-modeling", "rviz", "visualization"]
difficulty: beginner
estimated_minutes: 30
---

# URDF Basics

The **Unified Robot Description Format (URDF)** is an XML format for representing robot models in ROS. URDF describes the robot's physical structure, visual appearance, collision geometry, and kinematic relationships between components.

## Learning Objectives

By the end of this section, you will be able to:

- Explain the purpose and structure of URDF files
- Define links and joints to create kinematic chains
- Differentiate between visual and collision geometries
- Load and visualize URDF models in RViz2
- Use launch files to spawn robots in simulation

## Why URDF?

URDF serves multiple purposes in robotics:

- **Visualization**: Display robot models in RViz2 and Gazebo
- **Kinematics**: Calculate forward/inverse kinematics for motion planning
- **Collision Detection**: Prevent robot from hitting itself or obstacles
- **Simulation**: Provide physics engine with inertial properties

## URDF Structure

A URDF file consists of:

1. **Links**: Rigid bodies (chassis, wheels, arms, sensors)
2. **Joints**: Connections between links defining motion constraints
3. **Properties**: Visual, collision, and inertial attributes

### Basic Syntax

```xml title="simple_robot.urdf" showLineNumbers
<?xml version="1.0"?>
<robot name="simple_robot">

  <!-- Base link (reference frame) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.5 0.3 0.1"/>
      </geometry>
    </collision>
  </link>

</robot>
```

## Links: The Building Blocks

Links represent rigid bodies. Each link has three optional components:

### Visual Geometry

Defines what the link looks like in visualizers:

```xml
<visual>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <cylinder radius="0.05" length="0.3"/>
  </geometry>
  <material name="red">
    <color rgba="1 0 0 1"/>
  </material>
</visual>
```

Supported geometries:
- `<box size="x y z"/>`
- `<cylinder radius="r" length="l"/>`
- `<sphere radius="r"/>`
- `<mesh filename="package://path/to/mesh.stl"/>`

### Collision Geometry

Simplified shapes for collision detection (computationally cheaper):

```xml
<collision>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <geometry>
    <cylinder radius="0.05" length="0.3"/>
  </geometry>
</collision>
```

Often collision geometry is simpler than visual (e.g., boxes instead of detailed meshes).

### Inertial Properties

Required for physics simulation:

```xml
<inertial>
  <mass value="1.0"/>
  <inertia ixx="0.01" ixy="0.0" ixz="0.0"
           iyy="0.01" iyz="0.0"
           izz="0.02"/>
</inertial>
```

## Joints: Connecting Links

Joints define how links move relative to each other.

### Joint Types

| Type | Description | DOF | Use Case |
|------|-------------|-----|----------|
| `fixed` | No motion | 0 | Sensors attached to robot body |
| `revolute` | Rotation with limits | 1 | Robot arm joints, wheels |
| `continuous` | Unlimited rotation | 1 | Continuous wheels, turrets |
| `prismatic` | Linear sliding | 1 | Linear actuators, grippers |
| `floating` | 6 DOF (unconstrained) | 6 | Floating base (humanoids) |
| `planar` | 2D motion in plane | 2 | Mobile robots |

### Joint Definition

```xml title="robot_arm.urdf" showLineNumbers {5,8-10}
<joint name="shoulder_joint" type="revolute">
  <parent link="base_link"/>
  <child link="upper_arm"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>  <!-- Rotate around Y-axis -->
  <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
</joint>

<link name="upper_arm">
  <visual>
    <geometry>
      <cylinder radius="0.03" length="0.4"/>
    </geometry>
    <material name="gray">
      <color rgba="0.7 0.7 0.7 1"/>
    </material>
  </visual>
  <collision>
    <geometry>
      <cylinder radius="0.03" length="0.4"/>
    </geometry>
  </collision>
</link>
```

**Key Elements**:
- **parent/child**: Links connected by this joint
- **origin**: Position and orientation offset
- **axis**: Direction of motion (for revolute/prismatic)
- **limit**: Motion bounds (for revolute/prismatic)

## Example: 2-Link Robot Arm

Let's build a simple 2-DOF robot arm:

```xml title="two_link_arm.urdf" showLineNumbers
<?xml version="1.0"?>
<robot name="two_link_arm">

  <!-- Fixed base -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.05"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
  </link>

  <!-- Shoulder joint (revolute) -->
  <joint name="shoulder_joint" type="revolute">
    <parent link="base_link"/>
    <child link="upper_arm"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
  </joint>

  <!-- Upper arm link -->
  <link name="upper_arm">
    <visual>
      <origin xyz="0 0 0.15" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.02" length="0.3"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
  </link>

  <!-- Elbow joint (revolute) -->
  <joint name="elbow_joint" type="revolute">
    <parent link="upper_arm"/>
    <child link="forearm"/>
    <origin xyz="0 0 0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-2.0" upper="2.0" effort="10" velocity="1.0"/>
  </joint>

  <!-- Forearm link -->
  <link name="forearm">
    <visual>
      <origin xyz="0 0 0.12" rpy="0 0 0"/>
      <geometry>
        <cylinder radius="0.015" length="0.24"/>
      </geometry>
      <material name="red">
        <color rgba="1 0 0 1"/>
      </material>
    </visual>
  </link>

</robot>
```

## Visualizing in RViz2

### Step 1: Install Dependencies

```bash
sudo apt install ros-humble-joint-state-publisher-gui ros-humble-robot-state-publisher
```

### Step 2: Create Launch File

Create `display.launch.py`:

```python title="display.launch.py" showLineNumbers
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare

def generate_launch_description():
    urdf_file = PathJoinSubstitution([
        FindPackageShare('your_package'),
        'urdf',
        'two_link_arm.urdf'
    ])

    return LaunchDescription([
        Node(
            package='robot_state_publisher',
            executable='robot_state_publisher',
            name='robot_state_publisher',
            parameters=[{'robot_description': open(urdf_file).read()}]
        ),
        Node(
            package='joint_state_publisher_gui',
            executable='joint_state_publisher_gui',
            name='joint_state_publisher_gui'
        ),
        Node(
            package='rviz2',
            executable='rviz2',
            name='rviz2',
            arguments=['-d', PathJoinSubstitution([
                FindPackageShare('your_package'),
                'config',
                'display.rviz'
            ])]
        )
    ])
```

### Step 3: Launch

```bash
ros2 launch your_package display.launch.py
```

This spawns:
- **robot_state_publisher**: Publishes robot transforms based on URDF
- **joint_state_publisher_gui**: GUI sliders to control joint angles
- **RViz2**: 3D visualizer

In RViz2:
1. Add → RobotModel
2. Use sliders in joint_state_publisher_gui to move joints

## Common Patterns

### Adding a Sensor (Fixed Joint)

```xml
<joint name="camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.2 0 0.1" rpy="0 0 0"/>
</joint>

<link name="camera_link">
  <visual>
    <geometry>
      <box size="0.05 0.05 0.03"/>
    </geometry>
    <material name="black">
      <color rgba="0.1 0.1 0.1 1"/>
    </material>
  </visual>
</link>
```

### Mobile Robot with Wheels

```xml
<!-- Continuous wheel joint (rolls indefinitely) -->
<joint name="left_wheel_joint" type="continuous">
  <parent link="base_link"/>
  <child link="left_wheel"/>
  <origin xyz="0 0.15 0" rpy="-1.57 0 0"/>  <!-- Rotate 90° to align axis -->
  <axis xyz="0 0 1"/>
</joint>

<link name="left_wheel">
  <visual>
    <geometry>
      <cylinder radius="0.1" length="0.05"/>
    </geometry>
    <material name="black">
      <color rgba="0.1 0.1 0.1 1"/>
    </material>
  </visual>
</link>
```

## Exercise: Model a Mobile Robot

**Goal**: Create a URDF for a differential drive robot (2 wheels + caster).

**Requirements**:
- Rectangular base (0.4m × 0.3m × 0.1m)
- Two continuous wheels (radius 0.1m, width 0.05m)
- One caster wheel (sphere, radius 0.05m) as fixed joint
- Visualize in RViz2

**Steps**:
1. Create `mobile_robot.urdf`
2. Define base_link
3. Add left_wheel and right_wheel joints (continuous)
4. Add caster joint (fixed) at back center
5. Launch with `robot_state_publisher` and RViz2

## Key Takeaways

- URDF models robots using **links** (rigid bodies) and **joints** (connections)
- **Visual** geometry is for display, **collision** is for physics
- Joint types: `fixed`, `revolute`, `continuous`, `prismatic`
- `robot_state_publisher` converts URDF + joint states into TF transforms
- RViz2 visualizes robots in 3D with interactive joint control

## Next Steps

Continue to [Nodes & Services](/docs/module-1/nodes-services) to learn about ROS 2 communication patterns.

## Further Reading

- [URDF Official Documentation](http://wiki.ros.org/urdf)
- [URDF Tutorials](https://docs.ros.org/en/humble/Tutorials/Intermediate/URDF/URDF-Main.html)
- [Building a Visual Robot Model with URDF](https://docs.ros.org/en/humble/Tutorials/Intermediate/URDF/Building-a-Visual-Robot-Model-with-URDF-from-Scratch.html)
