---
title: "Environment Building"
description: "Design and construct complex virtual worlds for robotics simulation and testing"
module_id: "module-2"
sidebar_position: 3
tags: ["environment", "world-design", "terrain", "obstacles", "simulation"]
difficulty: intermediate
estimated_minutes: 35
---

# Environment Building

## Learning Objectives

By the end of this section, you will be able to:
- Design realistic virtual environments that mirror real-world settings
- Create complex terrain models and obstacles
- Add interactive elements and dynamic objects
- Optimize world files for performance
- Import external 3D models and assets
- Configure environment physics and material properties
- Test robots in various environmental scenarios

## Introduction to World Design

A well-designed simulation environment is crucial for realistic robotics testing. The environment should not only look realistic but also have accurate physics properties, proper collision geometry, and dynamic elements that simulate real-world conditions. This section covers the principles and practices of creating compelling virtual worlds.

### Environment Considerations

When designing your simulation world, consider:
- **Scale and Proportions**: Ensure realistic dimensions that match intended use cases
- **Materials and Friction**: Different surfaces affect robot movement and sensor readings
- **Lighting**: Impacts camera sensor performance and visual clarity
- **Dynamic Elements**: Moving obstacles, doors, and other interactive objects
- **Computational Load**: Balance visual fidelity with simulation performance
- **Realism**: Mirror actual deployment environments as closely as possible

## Basic World Structure

### SDF World Template

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="warehouse_env">
    <!-- Physics configuration -->
    <physics name="default_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
    </physics>

    <!-- Global lighting -->
    <light name="sun" type="directional">
      <pose>10 10 10 0 0 0</pose>
      <diffuse>1 1 1 1</diffuse>
      <specular>1 1 1 1</specular>
      <direction>-0.5 0.1 -0.9</direction>
      <cast_shadows>true</cast_shadows>
    </light>

    <!-- Additional spotlight for task area -->
    <light name="task_light" type="point">
      <pose>5 5 5 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <range>20</range>
      <cast_shadows>false</cast_shadows>
    </light>

    <!-- Ground plane with material properties -->
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
          <surface>
            <contact>
              <collide_bitmask>0xffff</collide_bitmask>
            </contact>
            <friction>
              <ode>
                <mu>0.7</mu>
                <mu2>0.7</mu2>
              </ode>
            </friction>
          </surface>
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
            <specular>0.5 0.5 0.5 1</specular>
          </material>
        </visual>
      </link>
    </model>

    <!-- Include external models -->
    <include>
      <uri>model://warehouse_unit</uri>
      <pose>0 0 0 0 0 0</pose>
    </include>

  </world>
</sdf>
```

## Creating Obstacles and Structures

### Modular Walls

```xml
<model name="wall_segment">
  <static>true</static>
  <link name="link">
    <collision name="collision">
      <geometry>
        <box>
          <size>2.0 0.1 1.0</size>
        </box>
      </geometry>
      <surface>
        <friction>
          <ode>
            <mu>0.8</mu>
            <mu2>0.8</mu2>
          </ode>
        </friction>
      </surface>
    </collision>
    <visual name="visual">
      <geometry>
        <box>
          <size>2.0 0.1 1.0</size>
        </box>
      </geometry>
      <material>
        <ambient>0.5 0.5 0.5 1</ambient>
        <diffuse>0.7 0.7 0.7 1</diffuse>
        <specular>0.2 0.2 0.2 1</specular>
        <emissive>0 0 0 1</emissive>
      </material>
    </visual>
  </link>
</model>
```

### Ramps and Inclines

```xml
<model name="ramp">
  <static>true</static>
  <link name="link">
    <collision name="collision">
      <geometry>
        <box>
          <size>2.0 0.1 1.0</size>
        </box>
      </geometry>
    </collision>
    <visual name="visual">
      <geometry>
        <box>
          <size>2.0 0.1 1.0</size>
        </box>
      </geometry>
      <material>
        <ambient>0.8 0.6 0.3 1</ambient>
        <diffuse>1.0 0.8 0.4 1</diffuse>
      </material>
    </visual>
  </link>
  <pose>0 0 0 0 0.5236 0</pose>  <!-- 30 degree angle -->
</model>
```

### Terrain Elevation Map

```xml
<model name="heightmap_terrain">
  <static>true</static>
  <link name="link">
    <collision name="collision">
      <geometry>
        <heightmap>
          <uri>file://media/heightmaps/terrain.png</uri>
          <size>100 100 10</size>
          <pos>0 0 0</pos>
        </heightmap>
      </geometry>
    </collision>
    <visual name="visual">
      <geometry>
        <heightmap>
          <uri>file://media/heightmaps/terrain.png</uri>
          <size>100 100 10</size>
          <pos>0 0 0</pos>
          <textures>
            <texture>
              <diffuse>file://media/materials/textures/dirt_diffuse.png</diffuse>
              <normal>file://media/materials/textures/dirt_normal.png</normal>
              <size>10</size>
            </texture>
          </textures>
        </heightmap>
      </geometry>
    </visual>
  </link>
</model>
```

## Dynamic Objects

### Moving Obstacle with Script

```xml
<model name="moving_obstacle">
  <link name="link">
    <inertial>
      <mass>5.0</mass>
      <inertia>
        <ixx>0.5</ixx>
        <ixy>0</ixy>
        <ixz>0</ixz>
        <iyy>0.5</iyy>
        <iyz>0</iyz>
        <izz>0.5</izz>
      </inertia>
    </inertial>
    <collision name="collision">
      <geometry>
        <box>
          <size>1.0 0.5 1.0</size>
        </box>
      </geometry>
    </collision>
    <visual name="visual">
      <geometry>
        <box>
          <size>1.0 0.5 1.0</size>
        </box>
      </geometry>
      <material>
        <ambient>1 0 0 1</ambient>
      </material>
    </visual>
  </link>

  <!-- Animation plugin for repetitive motion -->
  <plugin name="animate_plugin" filename="libAnimationPlugin.so">
    <target>0 0 0</target>
    <duration>5.0</duration>
    <cycle>true</cycle>
  </plugin>
</model>
```

### Doors and Articulated Objects

```xml
<model name="sliding_door">
  <!-- Door frame (static) -->
  <link name="frame">
    <inertial>
      <mass>10.0</mass>
    </inertial>
    <collision name="collision">
      <geometry>
        <box>
          <size>1.0 0.1 2.0</size>
        </box>
      </geometry>
    </collision>
    <visual name="visual">
      <geometry>
        <box>
          <size>1.0 0.1 2.0</size>
        </box>
      </geometry>
      <material>
        <ambient>0.5 0.5 0.5 1</ambient>
      </material>
    </visual>
  </link>

  <!-- Door panel (sliding) -->
  <link name="panel">
    <inertial>
      <mass>5.0</mass>
      <inertia>
        <ixx>0.1</ixx>
        <iyy>0.1</iyy>
        <izz>0.1</izz>
      </inertia>
    </inertial>
    <collision name="collision">
      <geometry>
        <box>
          <size>1.0 0.05 2.0</size>
        </box>
      </geometry>
    </collision>
    <visual name="visual">
      <geometry>
        <box>
          <size>1.0 0.05 2.0</size>
        </box>
      </geometry>
      <material>
        <ambient>0.3 0.3 0.3 1</ambient>
      </material>
    </visual>
  </link>

  <!-- Prismatic joint for sliding motion -->
  <joint name="slide_joint" type="prismatic">
    <parent link="frame"/>
    <child link="panel"/>
    <axis>
      <xyz>1 0 0</xyz>
      <limit>
        <lower>0</lower>
        <upper>1</upper>
        <effort>100</effort>
        <velocity>0.5</velocity>
      </limit>
    </axis>
  </joint>
</model>
```

## Importing External Models

### Using Gazebo Model Library

```xml
<!-- Include a pre-made model from Gazebo's model database -->
<include>
  <uri>model://aws_robomaker_warehouse_WallB_01</uri>
  <pose>0 0 0 0 0 0</pose>
</include>

<!-- Position multiple instances of the same model -->
<include>
  <uri>model://warehouse_unit</uri>
  <pose>10 0 0 0 0 0</pose>
  <name>warehouse_unit_1</name>
</include>

<include>
  <uri>model://warehouse_unit</uri>
  <pose>20 0 0 0 0 0</pose>
  <name>warehouse_unit_2</name>
</include>
```

### Creating Custom Models

Create a reusable model in a package:

```bash
mkdir -p catkin_ws/src/my_models/models/custom_object
cd catkin_ws/src/my_models/models/custom_object
```

Create `model.sdf`:

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <model name="custom_object">
    <link name="link">
      <inertial>
        <mass>1.0</mass>
      </inertial>
      <collision name="collision">
        <geometry>
          <mesh>
            <uri>model://custom_object/meshes/object.stl</uri>
            <scale>1 1 1</scale>
          </mesh>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <mesh>
            <uri>model://custom_object/meshes/object.stl</uri>
            <scale>1 1 1</scale>
          </mesh>
        </geometry>
        <material>
          <ambient>0.8 0.8 0.8 1</ambient>
          <diffuse>0.9 0.9 0.9 1</diffuse>
        </material>
      </visual>
    </link>
  </model>
</sdf>
```

## Material Properties

### Friction and Surface Properties

```xml
<surface>
  <contact>
    <!-- Collision bitmask for selective collision -->
    <collide_bitmask>0xffff</collide_bitmask>
    <!-- Contact properties -->
    <max_contacts>20</max_contacts>
  </contact>
  <friction>
    <ode>
      <!-- Coefficient of friction -->
      <mu>0.5</mu>
      <mu2>0.5</mu2>
      <!-- Friction coefficients in different directions -->
      <fdir1>0 1 0</fdir1>
      <slip1>0.01</slip1>
      <slip2>0.01</slip2>
    </ode>
  </friction>
  <bounce>
    <!-- Coefficient of restitution (bounciness) -->
    <restitution_coefficient>0.3</restitution_coefficient>
    <threshold>0.1</threshold>
  </bounce>
</surface>
```

## Performance Optimization

### LOD (Level of Detail) Models

```xml
<model name="optimized_warehouse">
  <!-- High-detail mesh for close viewing -->
  <link name="link">
    <visual name="visual_high">
      <meta>
        <layer>1</layer>
      </meta>
      <geometry>
        <mesh>
          <uri>model://warehouse/meshes/high_detail.dae</uri>
        </mesh>
      </geometry>
    </visual>

    <!-- Low-detail mesh for distant viewing -->
    <visual name="visual_low">
      <meta>
        <layer>0</layer>
      </meta>
      <geometry>
        <mesh>
          <uri>model://warehouse/meshes/low_detail.dae</uri>
        </mesh>
      </geometry>
    </visual>
  </link>
</model>
```

### Culling and Rendering Optimization

```xml
<!-- Disable shadows for non-critical objects -->
<light name="sun" type="directional">
  <cast_shadows>false</cast_shadows>
</light>

<!-- Use simpler collision geometry than visual geometry -->
<link name="complex_visual">
  <visual name="visual">
    <geometry>
      <mesh>
        <uri>model://complex_object/mesh_high_poly.dae</uri>
      </mesh>
    </geometry>
  </visual>
  <collision name="collision">
    <geometry>
      <box>  <!-- Simplified collision shape -->
        <size>1 1 1</size>
      </box>
    </geometry>
  </collision>
</link>
```

## Testing Environments

### Python Script for Environment Configuration

```python
import rclpy
from gazebo_msgs.srv import SpawnModel, DeleteModel
from geometry_msgs.msg import Pose

class EnvironmentManager:
    def __init__(self):
        self.node = rclpy.create_node('environment_manager')
        self.spawn_client = self.node.create_client(SpawnModel, '/spawn_entity')
        self.delete_client = self.node.create_client(DeleteModel, '/delete_entity')

    def spawn_obstacle(self, name, x, y, z):
        """Dynamically spawn obstacles during simulation"""
        while not self.spawn_client.wait_for_service(timeout_sec=1.0):
            print('Service not available')

        pose = Pose()
        pose.position.x = x
        pose.position.y = y
        pose.position.z = z

        request = SpawnModel.Request()
        request.model_name = name
        request.model_xml = self._get_box_sdf()
        request.robot_namespace = ''
        request.initial_pose = pose
        request.reference_frame = 'world'

        self.spawn_client.call_async(request)

    def _get_box_sdf(self):
        return """<?xml version="1.0"?>
<sdf version="1.9">
  <model name="box">
    <link name="link">
      <collision name="collision">
        <geometry><box><size>0.5 0.5 0.5</size></box></geometry>
      </collision>
      <visual name="visual">
        <geometry><box><size>0.5 0.5 0.5</size></box></geometry>
      </visual>
    </link>
  </model>
</sdf>"""
```

## Key Takeaways

- Well-designed environments are critical for realistic robotics simulation and testing
- SDF provides flexible world definition with physics, lighting, and model configuration
- Material properties and friction models directly impact robot behavior
- Dynamic objects and scripted events simulate real-world complexity
- Level of detail and optimization techniques maintain simulation performance
- External models can be imported and reused across multiple environments
- Terrain and obstacle placement should mirror intended deployment scenarios

## Next Steps

1. [Explore Sensors](./sensors-modeling.md) - Add realistic sensors to robots in your environments
2. [Discover Unity Integration](./unity-integration.md) - Enhance visualization with high-fidelity graphics
3. [Move to Module 3](../module-3/index.md) - Explore NVIDIA Isaac Sim for advanced simulation

## Further Reading

- [Gazebo World Format Documentation](http://sdformat.org/)
- [Building Custom Models](https://gazebosim.org/docs/fortress/building_models/)
- [Physics Optimization Tips](https://gazebosim.org/docs/fortress/physics_params/)
- [Gazebo Model Database](https://app.ignitionrobotics.org/openrobotics/fuel)
