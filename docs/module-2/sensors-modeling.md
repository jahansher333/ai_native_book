---
title: "Sensors Modeling"
description: "Master realistic sensor simulation including cameras, LiDAR, IMU, and other robotic sensors"
module_id: "module-2"
sidebar_position: 2
tags: ["sensors", "simulation", "camera", "lidar", "imu"]
difficulty: intermediate
estimated_minutes: 30
---

# Sensors Modeling

## Learning Objectives

By the end of this section, you will be able to:
- Understand how sensors are modeled in simulation
- Configure camera and vision sensors
- Model LiDAR sensors with realistic beam patterns
- Simulate IMU (Inertial Measurement Unit) behavior
- Add noise and distortion to sensor readings
- Create realistic multi-sensor systems
- Validate sensor simulation against real hardware

## Introduction to Sensor Simulation

Realistic sensor modeling is crucial for developing algorithms that will work on real robots. Unlike ideal sensors, real sensors have noise, measurement uncertainty, limited ranges, and various physical constraints. Gazebo provides sophisticated sensor simulation capabilities that can replicate these characteristics.

### Why Accurate Sensor Simulation Matters

- **Algorithm Robustness**: Develop algorithms that handle real-world sensor imperfections
- **Data Generation**: Create synthetic training data for machine learning models
- **Risk Reduction**: Identify algorithmic failures before hardware deployment
- **Performance Prediction**: Estimate how algorithms will perform in the field
- **Edge Case Testing**: Reproduce failure scenarios that are difficult to generate in reality

## Camera Simulation

### Basic Camera Configuration

Add a camera to your robot using URDF:

```xml
<link name="camera_link">
  <inertial>
    <mass value="0.1"/>
    <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
  </inertial>
  <visual>
    <geometry>
      <box size="0.05 0.05 0.05"/>
    </geometry>
  </visual>
  <collision>
    <geometry>
      <box size="0.05 0.05 0.05"/>
    </geometry>
  </collision>
</link>

<joint name="camera_joint" type="fixed">
  <parent link="base_link"/>
  <child link="camera_link"/>
  <origin xyz="0.15 0 0.1" rpy="0 0 0"/>
</joint>
```

### Gazebo Camera Plugin

Configure the camera in SDF format within your world file:

```xml
<model name="robot">
  <link name="camera_link">
    <sensor name="camera" type="camera">
      <pose>0 0 0 0 0 0</pose>
      <camera>
        <!-- Horizontal field of view in radians -->
        <horizontal_fov>1.047</horizontal_fov>
        <!-- Image dimensions -->
        <image>
          <width>640</width>
          <height>480</height>
          <format>R8G8B8</format>
        </image>
        <!-- Clipping planes for depth -->
        <clip>
          <near>0.01</near>
          <far>100</far>
        </clip>
        <!-- Distortion model for lens effects -->
        <distortion>
          <k1>-0.0001</k1>
          <k2>0.00005</k2>
          <k3>0</k3>
          <p1>0</p1>
          <p2>0</p2>
          <center>0.5 0.5</center>
        </distortion>
      </camera>
      <!-- Noise model -->
      <noise>
        <type>gaussian</type>
        <mean>0</mean>
        <stddev>0.01</stddev>
      </noise>
      <!-- Update rate in Hz -->
      <update_rate>30</update_rate>
      <!-- ROS 2 plugin -->
      <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
        <ros>
          <remapping>~/image_raw:=/camera/image_raw</remapping>
          <remapping>~/camera_info:=/camera/camera_info</remapping>
        </ros>
        <camera_name>camera</camera_name>
        <frame_name>camera_optical_frame</frame_name>
      </plugin>
    </sensor>
  </link>
</model>
```

## LiDAR Simulation

### GPU-accelerated Lidar (Recommended)

```xml
<sensor name="gpu_lidar" type="gpu_lidar">
  <pose>0 0 0.1 0 0 0</pose>
  <topic>scan</topic>
  <update_rate>10</update_rate>

  <ray>
    <!-- Number of laser rays -->
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>0</min_angle>
        <max_angle>6.283185307</max_angle>
      </horizontal>
      <vertical>
        <samples>16</samples>
        <resolution>1</resolution>
        <min_angle>0</min_angle>
        <max_angle>0.2617993878</max_angle>
      </vertical>
    </scan>

    <!-- Measurement range -->
    <range>
      <min>0.08</min>
      <max>50</max>
      <resolution>0.01</resolution>
    </range>

    <!-- Noise characteristics -->
    <noise>
      <type>gaussian</type>
      <mean>0</mean>
      <stddev>0.01</stddev>
    </noise>
  </ray>

  <plugin name="gpu_lidar" filename="libgazebo_ros_ray_sensor.so">
    <ros>
      <remapping>~/out:=scan</remapping>
    </ros>
    <output_type>sensor_msgs/LaserScan</output_type>
    <frame_name>lidar_link</frame_name>
  </plugin>
</sensor>
```

### Realistic Range Measurement Noise

```python
import numpy as np

class LidarNoiseModel:
    def __init__(self, systematic_error=0.02, random_stddev=0.01):
        """
        systematic_error: Constant bias in range measurements (meters)
        random_stddev: Standard deviation of Gaussian noise (meters)
        """
        self.systematic_error = systematic_error
        self.random_stddev = random_stddev

    def apply_noise(self, ranges):
        """Apply realistic noise to LiDAR measurements"""
        noisy_ranges = ranges.copy()

        # Apply systematic error
        noisy_ranges += self.systematic_error

        # Apply random noise
        noisy_ranges += np.random.normal(0, self.random_stddev, len(ranges))

        # Clamp to valid range
        noisy_ranges = np.clip(noisy_ranges, 0.08, 50.0)

        return noisy_ranges
```

## IMU Simulation

### IMU Configuration

```xml
<sensor name="imu" type="imu">
  <pose>0 0 0 0 0 0</pose>
  <update_rate>100</update_rate>

  <imu>
    <!-- Accelerometer specification -->
    <accelerometer>
      <x>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.01</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.001</bias_stddev>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.01</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.001</bias_stddev>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.01</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.001</bias_stddev>
      </z>
    </accelerometer>

    <!-- Gyroscope specification -->
    <gyroscope>
      <x>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.001</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.0001</bias_stddev>
      </x>
      <y>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.001</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.0001</bias_stddev>
      </y>
      <z>
        <noise type="gaussian">
          <mean>0</mean>
          <stddev>0.001</stddev>
        </noise>
        <bias_mean>0</bias_mean>
        <bias_stddev>0.0001</bias_stddev>
      </z>
    </gyroscope>
  </imu>

  <plugin name="imu_plugin" filename="libgazebo_ros_imu_sensor.so">
    <ros>
      <remapping>~/out:=/imu/data</remapping>
    </ros>
    <initial_orientation_as_reference>true</initial_orientation_as_reference>
  </plugin>
</sensor>
```

### IMU Bias and Drift Simulation

```python
class IMUNoiseModel:
    def __init__(self, accel_noise_stddev=0.01, gyro_noise_stddev=0.001):
        self.accel_noise_stddev = accel_noise_stddev
        self.gyro_noise_stddev = gyro_noise_stddev

        # Bias drift (simulates bias instability)
        self.accel_bias = np.zeros(3)
        self.gyro_bias = np.zeros(3)
        self.bias_walk = 0.0001

    def update(self, true_accel, true_gyro, dt):
        """Simulate IMU measurements with noise and bias"""
        # Update bias walk
        self.accel_bias += np.random.normal(0, self.bias_walk, 3) * np.sqrt(dt)
        self.gyro_bias += np.random.normal(0, self.bias_walk, 3) * np.sqrt(dt)

        # Add noise and bias
        meas_accel = true_accel + self.accel_bias + \
                     np.random.normal(0, self.accel_noise_stddev, 3)
        meas_gyro = true_gyro + self.gyro_bias + \
                    np.random.normal(0, self.gyro_noise_stddev, 3)

        return meas_accel, meas_gyro
```

## Distance Sensors (Sonar/Infrared)

```xml
<sensor name="ultrasonic" type="ray">
  <pose>0.1 0 0 0 0 0</pose>
  <update_rate>20</update_rate>

  <ray>
    <scan>
      <horizontal>
        <samples>1</samples>
        <min_angle>0</min_angle>
        <max_angle>0</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.02</min>
      <max>4.0</max>
      <resolution>0.01</resolution>
    </range>
    <noise>
      <type>gaussian</type>
      <mean>0</mean>
      <stddev>0.05</stddev>
    </noise>
  </ray>

  <plugin name="ultrasonic" filename="libgazebo_ros_ray_sensor.so">
    <ros>
      <remapping>~/out:=sonar/range</remapping>
    </ros>
    <output_type>sensor_msgs/Range</output_type>
  </plugin>
</sensor>
```

## Multi-Sensor Integration

### Complete Robot with Multiple Sensors

```xml
<model name="mobile_robot_complete">
  <link name="base_link">
    <!-- ... base link definition ... -->
  </link>

  <!-- Camera sensor -->
  <link name="camera_link">
    <sensor name="camera" type="camera">
      <!-- camera configuration -->
    </sensor>
  </link>

  <!-- LiDAR sensor -->
  <link name="lidar_link">
    <sensor name="lidar" type="gpu_lidar">
      <!-- lidar configuration -->
    </sensor>
  </link>

  <!-- IMU sensor -->
  <link name="imu_link">
    <sensor name="imu" type="imu">
      <!-- imu configuration -->
    </sensor>
  </link>

  <!-- Joint definitions for all sensors -->
  <joint name="camera_joint" type="fixed">
    <parent link="base_link"/>
    <child link="camera_link"/>
    <origin xyz="0.15 0 0.1" rpy="0 0 0"/>
  </joint>

  <joint name="lidar_joint" type="fixed">
    <parent link="base_link"/>
    <child link="lidar_link"/>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
  </joint>

  <joint name="imu_joint" type="fixed">
    <parent link="base_link"/>
    <child link="imu_link"/>
    <origin xyz="0 0 0" rpy="0 0 0"/>
  </joint>
</model>
```

## Validating Sensor Simulation

### Comparing Simulated vs. Real Data

```python
import rclpy
from sensor_msgs.msg import LaserScan, Imu
from cv_bridge import CvBridge
from sensor_msgs.msg import Image
import cv2
import numpy as np

class SensorValidator(rclpy.node.Node):
    def __init__(self):
        super().__init__('sensor_validator')

        # Subscribe to simulated sensors
        self.create_subscription(LaserScan, '/scan', self.lidar_callback, 10)
        self.create_subscription(Imu, '/imu/data', self.imu_callback, 10)
        self.create_subscription(Image, '/camera/image_raw', self.camera_callback, 10)

        self.bridge = CvBridge()
        self.lidar_data = []
        self.imu_data = []

    def lidar_callback(self, msg):
        # Analyze LiDAR statistics
        ranges = np.array(msg.ranges)
        valid_ranges = ranges[(ranges > msg.range_min) & (ranges < msg.range_max)]

        self.get_logger().info(
            f'LiDAR: mean={np.mean(valid_ranges):.3f}, '
            f'std={np.std(valid_ranges):.3f}'
        )

    def imu_callback(self, msg):
        accel = msg.linear_acceleration
        self.get_logger().info(
            f'IMU Accel: x={accel.x:.3f}, y={accel.y:.3f}, z={accel.z:.3f}'
        )

    def camera_callback(self, msg):
        image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
        # Analyze image properties
        mean_intensity = np.mean(image)
        self.get_logger().info(f'Camera mean intensity: {mean_intensity:.1f}')
```

## Key Takeaways

- Realistic sensor modeling is essential for developing robust robotics algorithms
- Gazebo provides built-in support for cameras, LiDAR, IMU, and range sensors
- Sensor noise, bias, and drift must be carefully modeled based on hardware specifications
- Multi-sensor systems require proper coordinate frame definitions and synchronization
- Synthetic sensor data enables algorithm validation before hardware deployment
- Sensor parameters should be calibrated to match real hardware when possible

## Next Steps

1. [Build Environments](./environment-building.md) - Create realistic virtual worlds for your sensors
2. [Explore Unity Integration](./unity-integration.md) - Visualize sensor data with high-fidelity graphics
3. [Advance to Module 3](../module-3/index.md) - Work with NVIDIA Isaac Sim for even more advanced simulation

## Further Reading

- [Gazebo Sensor Plugins](https://gazebosim.org/docs/fortress/plugins_world/)
- [ROS 2 Sensor Messages](https://docs.ros.org/en/humble/Concepts/About-Domain-ID.html)
- [Realistic Sensor Modeling Best Practices](https://github.com/gazebosim/gz-sim/wiki/Sensor-Best-Practices)
