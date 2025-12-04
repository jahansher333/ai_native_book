---
title: "Course Roadmap: 13-Week Schedule"
description: "Week-by-week curriculum plan with learning objectives, estimated hours, labs, and deliverables for the Physical AI & Humanoid Robotics course."
sidebar_position: 201
tags: ["roadmap", "schedule", "curriculum", "timeline"]
difficulty: beginner
estimated_minutes: 20
---

# Course Roadmap: 13-Week Schedule

This roadmap provides a detailed week-by-week breakdown for completing the Physical AI & Humanoid Robotics course. The schedule is designed for a 13-week semester (academic or self-paced) with 8-10 hours of weekly commitment.

## Quick Overview

| Phase | Weeks | Focus | Modules | Deliverables |
|-------|-------|-------|---------|--------------|
| **Foundations** | 1-4 | ROS 2 Basics | Module 1 | 3 ROS 2 packages, URDF models |
| **Simulation** | 5-7 | Digital Twins | Module 2 | Gazebo world, Unity scene |
| **Perception** | 8-10 | Isaac AI | Module 3 | Navigation stack, vision pipeline |
| **Integration** | 11-13 | VLA & Capstone | Module 4 | End-to-end robot system |

---

## WEEK 1: ROS 2 Architecture & Setup

**Theme**: Foundation of the Robotic Nervous System

### Learning Objectives

By end of week, you will:
- Understand ROS 2 architecture and advantages over ROS 1
- Have working ROS 2 development environment
- Create your first "Hello World" publisher node
- Understand DDS middleware and topics

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| ROS 2 Architecture | 1.5 hr | Concepts: nodes, topics, services, DDS |
| Installation & Setup | 1 hr | Install ROS 2 Humble, configure workspace |
| First Publisher | 1 hr | Create, build, launch first node |
| Topic Visualization | 0.5 hr | Use `ros2 topic` tools and RViz2 |

### Hands-On Labs

**Lab 1.1: Environment Setup** (1.5 hours)
- [ ] Install Ubuntu 22.04 LTS (VM or native)
- [ ] Install ROS 2 Humble Hawksbill
- [ ] Create ROS 2 workspace
- [ ] Verify installation: `ros2 --version`

**Lab 1.2: First Publisher** (1.5 hours)
- [ ] Create ROS 2 package: `ros2_fundamentals`
- [ ] Write temperature sensor publisher (Python)
- [ ] Launch node and verify topic
- [ ] Use `ros2 topic echo` to read data

**Code Example: Temperature Publisher**

```python
# temperature_publisher.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class TemperaturePublisher(Node):
    def __init__(self):
        super().__init__('temperature_publisher')
        self.publisher_ = self.create_publisher(Float32, 'sensor/temperature', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)  # 1 Hz

    def timer_callback(self):
        msg = Float32()
        msg.data = 20.0 + random.uniform(-0.5, 0.5)  # 20°C ± 0.5°C
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: {msg.data:.2f}°C')

def main(args=None):
    rclpy.init(args=args)
    node = TemperaturePublisher()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

### Deliverables

- [ ] ROS 2 workspace created and tested
- [ ] `temperature_publisher` node working
- [ ] Screenshot of `ros2 topic echo` output
- [ ] Short explanation of DDS discovery

### Estimated Hours

- **Reading/Videos**: 2 hrs
- **Lab Work**: 3 hrs
- **Reflection/Review**: 1 hr
- **Total**: 6 hours

---

## WEEK 2: URDF Robot Modeling

**Theme**: Describing Robots in XML

### Learning Objectives

- Design robot structure using URDF
- Understand links, joints, and kinematic chains
- Visualize robots in RViz2
- Work with mesh files and collision geometries

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| URDF Basics | 1 hr | XML structure, links, joints |
| Kinematic Chains | 0.75 hr | Serial vs parallel configurations |
| Visual & Collision | 0.75 hr | Meshes, geometries, materials |
| RViz2 Visualization | 0.5 hr | Load and view URDF models |

### Hands-On Labs

**Lab 2.1: Simple 2-Link Robot Arm** (2 hours)
- [ ] Create URDF for 2-DOF arm
- [ ] Visualize in RViz2
- [ ] Add joint limits
- [ ] Create launch file

**Lab 2.2: Mobile Robot Model** (2 hours)
- [ ] Model a differential drive base
- [ ] Add a lidar (top of robot)
- [ ] Include camera frame
- [ ] Validate joint tree with `urdf_to_graphviz`

**Code Example: Simple Arm URDF**

```xml
<?xml version="1.0"?>
<robot name="simple_arm">
  <!-- Base link -->
  <link name="base">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.05"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.1 0.05"/>
      </geometry>
    </collision>
  </link>

  <!-- Link 1 -->
  <link name="link1">
    <visual>
      <geometry>
        <cylinder length="0.5" radius="0.02"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.5" radius="0.02"/>
      </geometry>
    </collision>
  </link>

  <!-- Joint 1: Revolute at base -->
  <joint name="joint1" type="revolute">
    <parent link="base"/>
    <child link="link1"/>
    <origin xyz="0 0 0.05"/>
    <axis xyz="0 0 1"/>
    <limit lower="0" upper="3.14" effort="10" velocity="1"/>
  </joint>

  <!-- Link 2 -->
  <link name="link2">
    <visual>
      <geometry>
        <cylinder length="0.4" radius="0.015"/>
      </geometry>
    </visual>
  </link>

  <!-- Joint 2: Revolute at end of link1 -->
  <joint name="joint2" type="revolute">
    <parent link="link1"/>
    <child link="link2"/>
    <origin xyz="0 0 0.5"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="5" velocity="1"/>
  </joint>
</robot>
```

### Deliverables

- [ ] 2-link arm URDF (validated, no errors)
- [ ] Mobile robot URDF with 3+ links
- [ ] Screenshot of robot in RViz2
- [ ] Joint graph visualization

### Estimated Hours

- **Reading/Tutorials**: 2 hrs
- **Lab Work**: 3.5 hrs
- **Troubleshooting/Review**: 1.5 hrs
- **Total**: 7 hours

---

## WEEK 3: Publishers, Subscribers & Services

**Theme**: Inter-Process Communication Patterns

### Learning Objectives

- Implement publisher-subscriber communication
- Create service clients and servers
- Understand different QoS profiles
- Design robust multi-node systems

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Pub-Sub Pattern | 1 hr | Asynchronous message passing |
| Services (RPC) | 0.75 hr | Request-response communication |
| QoS Profiles | 0.75 hr | Reliability, history, best-effort |
| Multi-Node Coordination | 0.5 hr | Launch files, remapping |

### Hands-On Labs

**Lab 3.1: Sensor & Actuator System** (2 hours)
- [ ] Create sensor publisher node (mock IMU)
- [ ] Create actuator subscriber node (motor controller)
- [ ] Use proper namespaces and topics
- [ ] Run both simultaneously

**Lab 3.2: Service-Based Calculator** (2 hours)
- [ ] Define custom service (add two integers)
- [ ] Create service server
- [ ] Create service client
- [ ] Test with `ros2 service call`

**Code Example: Sensor Publisher with IMU Data**

```python
# imu_publisher.py
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Imu
import numpy as np

class IMUPublisher(Node):
    def __init__(self):
        super().__init__('imu_publisher')
        self.pub = self.create_publisher(Imu, 'sensor/imu', 10)
        self.timer = self.create_timer(0.01, self.publish_imu)  # 100 Hz

    def publish_imu(self):
        msg = Imu()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.header.frame_id = 'imu_link'

        # Simulate accelerometer data
        msg.linear_acceleration.x = 0.1 * np.sin(self.get_clock().now().nanoseconds / 1e9)
        msg.linear_acceleration.y = 0.0
        msg.linear_acceleration.z = 9.81

        # Simulate gyro data
        msg.angular_velocity.x = 0.01
        msg.angular_velocity.y = 0.01
        msg.angular_velocity.z = 0.05

        self.pub.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = IMUPublisher()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

**Code Example: Motor Controller Subscriber**

```python
# motor_controller.py
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class MotorController(Node):
    def __init__(self):
        super().__init__('motor_controller')
        self.sub = self.create_subscription(
            Twist, 'cmd_vel', self.cmd_vel_callback, 10)

    def cmd_vel_callback(self, msg: Twist):
        # Extract velocities
        linear_x = msg.linear.x  # Forward/backward
        angular_z = msg.angular.z  # Rotation

        # Calculate wheel speeds (simplified differential drive)
        left_wheel = linear_x - angular_z * 0.5
        right_wheel = linear_x + angular_z * 0.5

        self.get_logger().info(
            f'Left: {left_wheel:.2f} m/s, Right: {right_wheel:.2f} m/s'
        )
        # In real system, send to motor drivers here

def main(args=None):
    rclpy.init(args=args)
    node = MotorController()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

### Deliverables

- [ ] IMU publisher + motor subscriber working
- [ ] Custom service definition (`.srv` file)
- [ ] Service server + client implementation
- [ ] Screenshot of `ros2 service call` output
- [ ] Launch file coordinating all nodes

### Estimated Hours

- **Conceptual Learning**: 2 hrs
- **Lab Implementation**: 3.5 hrs
- **Testing & Debugging**: 1.5 hrs
- **Total**: 7 hours

---

## WEEK 4: Advanced ROS 2 & Project Review

**Theme**: Multi-Node Systems & Module 1 Integration

### Learning Objectives

- Design complex multi-node architectures
- Debug ROS 2 systems
- Review Module 1 concepts
- Prepare for Module 2

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Launch Files | 0.5 hr | Parameter passing, node grouping |
| Actions (Long-Running Tasks) | 1 hr | Feedback-enabled async operations |
| Debugging Tools | 0.75 hr | rosgraph, logging, runtime inspection |
| System Architecture | 0.75 hr | Composition, modularity |

### Hands-On Labs

**Lab 4.1: Action Server (Goal-Oriented Robot)** (2 hours)
- [ ] Define custom action (Navigate to goal)
- [ ] Create action server with feedback
- [ ] Create action client
- [ ] Test with multiple goals

**Lab 4.2: Module 1 Capstone - Integrated Robot System** (2 hours)
- [ ] Combine URDF model with pub/sub nodes
- [ ] Launch all components together
- [ ] Test inter-node communication
- [ ] Document system architecture

**Code Example: Action Server**

```python
# navigation_action_server.py
import rclpy
from rclpy.action import ActionServer
from rclpy.node import Node
from example_interfaces.action import NavigateToPose
import math

class NavigationActionServer(Node):
    def __init__(self):
        super().__init__('navigation_server')
        self.action_server = ActionServer(
            self, NavigateToPose, 'navigate', self.execute_callback)

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing navigation...')

        goal = goal_handle.request
        feedback_msg = NavigateToPose.Feedback()

        # Simulate navigation progress
        for i in range(11):
            feedback_msg.progress = float(i) / 10.0
            goal_handle.publish_feedback(feedback_msg)
            self.get_logger().info(f'Progress: {feedback_msg.progress:.1%}')
            time.sleep(1)

        goal_handle.succeed()
        result = NavigateToPose.Result()
        result.success = True
        return result

def main(args=None):
    rclpy.init(args=args)
    server = NavigationActionServer()
    rclpy.spin(server)

if __name__ == '__main__':
    main()
```

### Deliverables

- [ ] Action server & client implementation
- [ ] Complete launch file with 5+ nodes
- [ ] System architecture diagram
- [ ] Module 1 review document

### Estimated Hours

- **Advanced Topics**: 2 hrs
- **Lab Work**: 3 hrs
- **System Integration**: 2 hrs
- **Total**: 7 hours

### **Module 1 Milestone Checklist**

- ✅ ROS 2 workspace with 3+ packages
- ✅ URDF models for at least 2 robots
- ✅ Publishers and subscribers implemented
- ✅ Services demonstrating RPC patterns
- ✅ Launch files for multi-node coordination
- ✅ System diagram documented

---

## WEEK 5: Gazebo Simulation & Digital Twins

**Theme**: From Real to Virtual - Building Digital Twins

### Learning Objectives

- Set up Gazebo physics simulator
- Model environments and objects
- Create sensor plugins
- Simulate robot behavior

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Gazebo Basics | 1 hr | Worlds, models, plugins |
| Physics Configuration | 0.75 hr | Gravity, friction, damping |
| Sensors (Camera, LiDAR) | 0.75 hr | Sensor simulation and noise |
| Importing Models | 0.5 hr | Finding and using community models |

### Hands-On Labs

**Lab 5.1: Indoor Environment** (2 hours)
- [ ] Create Gazebo world with walls and furniture
- [ ] Import robotic model into environment
- [ ] Configure physics engine
- [ ] Launch simulation

**Lab 5.2: Sensor Simulation** (2 hours)
- [ ] Add camera to robot
- [ ] Add LiDAR sensor
- [ ] Configure noise models
- [ ] Visualize sensor output

### Deliverables

- [ ] Custom Gazebo world with environment
- [ ] Robot with simulated sensors in Gazebo
- [ ] Screenshot of simulation running
- [ ] Documented world file with comments

### Estimated Hours

- **Gazebo Tutorials**: 2 hrs
- **Lab Implementation**: 3 hrs
- **Experimentation**: 2 hrs
- **Total**: 7 hours

---

## WEEK 6: Unity & Advanced Simulation

**Theme**: Photorealistic Digital Twins

### Learning Objectives

- Build environments in Unity
- Export to URDF/SDF
- Create realistic sensor simulation
- Integrate with ROS 2

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Unity Basics | 1 hr | Scene, assets, physics |
| ROS 2 - Unity Bridge | 1 hr | Real-time ros2_unity integration |
| Lighting & Rendering | 0.75 hr | Photorealism for vision algorithms |
| Asset Library | 0.25 hr | Finding and importing 3D models |

### Hands-On Labs

**Lab 6.1: Create Indoor Environment in Unity** (2.5 hours)
- [ ] Design room layout
- [ ] Add realistic lighting
- [ ] Place interactive objects
- [ ] Export to usable format

**Lab 6.2: ROS 2 Bridge & Robot Deployment** (1.5 hours)
- [ ] Connect robot to Unity via ROS 2
- [ ] Control robot from ROS 2 nodes
- [ ] Capture camera imagery

### Deliverables

- [ ] Unity scene with realistic environment
- [ ] Working ROS 2 - Unity integration
- [ ] Camera feed from simulated robot

### Estimated Hours

- **Learning**: 2 hrs
- **Lab Work**: 4 hrs
- **Polish/Documentation**: 1 hr
- **Total**: 7 hours

---

## WEEK 7: Module 2 Integration & Testing

**Theme**: Simulation Pipeline Validation

### Learning Objectives

- Compare Gazebo vs Unity simulation
- Validate sim-to-real fidelity
- Create reproducible test environments
- Document simulation parameters

### Projects

**Project 2: "My First Digital Twin"** (4 hours)
- Create complete digital twin of a simple robot
- Simulate navigation in environment
- Record rosbag and analyze data
- Write technical report

### Deliverables

- [ ] Complete digital twin (Gazebo + Unity)
- [ ] Rosbag recordings of simulation
- [ ] Comparison report: Gazebo vs Unity
- [ ] Simulation parameter documentation

### **Module 2 Milestone Checklist**

- ✅ Gazebo world with robot and sensors
- ✅ Unity environment with robot
- ✅ Sensor simulation (camera, LiDAR)
- ✅ ROS 2 integration verified
- ✅ Baseline data collected

---

## WEEK 8: NVIDIA Isaac Platform Intro

**Theme**: GPU-Accelerated Perception

### Learning Objectives

- Understand Isaac Sim photorealistic simulation
- GPU-accelerated perception
- Isaac ROS optimization
- Benchmark vs Gazebo

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Isaac Sim Overview | 1 hr | Capabilities, GPU requirements |
| Isaac ROS Perception | 0.75 hr | GPU-accelerated vision |
| Jetson Integration | 0.75 hr | Real-time inference |
| Benchmarking | 0.5 hr | Performance metrics |

### Hands-On Labs

**Lab 8.1: Isaac Sim First Run** (2 hours)
- [ ] Install Isaac Sim
- [ ] Create simple scene
- [ ] Import robot
- [ ] Verify GPU acceleration

**Lab 8.2: Vision-Based Perception** (2 hours)
- [ ] Add camera to robot
- [ ] Implement object detection
- [ ] Measure FPS and latency

### Deliverables

- [ ] Isaac Sim running with GPU acceleration
- [ ] Benchmark report: Isaac vs Gazebo
- [ ] Object detection pipeline

### Estimated Hours

- **Installation & Setup**: 1 hr
- **Lab Work**: 4 hrs
- **Benchmarking**: 2 hrs
- **Total**: 7 hours

---

## WEEK 9: Navigation & Path Planning

**Theme**: Autonomous Robot Motion

### Learning Objectives

- Implement SLAM for mapping
- Use Nav2 for autonomous navigation
- Understand costmaps and planners
- Tune navigation parameters

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| SLAM Fundamentals | 1 hr | Simultaneous Localization & Mapping |
| Nav2 Stack | 1 hr | Navigation 2 overview |
| Costmaps & Planners | 0.75 hr | Local/global costmaps, RRT vs Dijkstra |
| Parameter Tuning | 0.25 hr | Optimization for your robot |

### Hands-On Labs

**Lab 9.1: Mapping** (2 hours)
- [ ] Run SLAM algorithm in simulation
- [ ] Generate occupancy map
- [ ] Save and load map

**Lab 9.2: Autonomous Navigation** (2 hours)
- [ ] Set Nav2 parameters
- [ ] Send navigation goals
- [ ] Observe path planning
- [ ] Tune for performance

### Deliverables

- [ ] Generated map file
- [ ] Navigation demo video
- [ ] Parameter configuration file

### Estimated Hours

- **Learning**: 2 hrs
- **Lab Implementation**: 4 hrs
- **Tuning/Optimization**: 1 hr
- **Total**: 7 hours

---

## WEEK 10: Advanced Perception & Module 3 Integration

**Theme**: Complex Sensor Fusion

### Learning Objectives

- Multi-sensor fusion
- Real-time vision algorithms
- Depth processing
- Performance optimization

### Projects

**Project 3: "Autonomous Navigation Challenge"** (4 hours)
- Design navigation scenario
- Tune Nav2 for optimal performance
- Handle obstacles and dynamic environments

### Deliverables

- [ ] Navigation benchmark results
- [ ] Tuned Nav2 configuration
- [ ] Performance analysis

### **Module 3 Milestone Checklist**

- ✅ SLAM working in simulation
- ✅ Nav2 autonomous navigation verified
- ✅ Vision perception pipeline
- ✅ Isaac Sim integration

---

## WEEK 11: LLM Integration & Voice Control

**Theme**: Natural Language Robot Interaction

### Learning Objectives

- Integrate LLMs with ROS 2
- Voice command processing
- Intent understanding
- Task planning from language

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| LLM Basics | 0.75 hr | Models, quantization, inference |
| Voice-to-Text | 0.75 hr | Speech recognition integration |
| Command Parsing | 0.75 hr | Intent extraction from language |
| Task Execution | 0.75 hr | Mapping language to robot actions |

### Hands-On Labs

**Lab 11.1: Voice-Controlled Robot** (2 hours)
- [ ] Integrate speech recognition
- [ ] Add LLM for command understanding
- [ ] Map commands to robot actions

**Lab 11.2: Complex Task Planning** (2 hours)
- [ ] Create task hierarchy
- [ ] Plan multi-step operations
- [ ] Error handling and recovery

### Deliverables

- [ ] Voice-to-action pipeline working
- [ ] LLM integration tested
- [ ] Demo video of voice commands

### Estimated Hours

- **Learning & Setup**: 2 hrs
- **Lab Implementation**: 3 hrs
- **Testing**: 2 hrs
- **Total**: 7 hours

---

## WEEK 12: Manipulation & Grasping

**Theme**: Robot Arms and End-Effectors

### Learning Objectives

- Grasp planning algorithms
- Inverse kinematics
- Motion planning for arms
- Gripper control

### Topics

| Topic | Duration | Details |
|-------|----------|---------|
| Arm Kinematics | 1 hr | Forward & inverse kinematics |
| Grasp Planning | 0.75 hr | Grasp analysis, planning |
| Motion Planning | 0.75 hr | MoveIt 2 for arm control |
| Gripper Control | 0.5 hr | Actuation patterns |

### Hands-On Labs

**Lab 12.1: IK Solver & Motion Planning** (2 hours)
- [ ] Test IK on simulated arm
- [ ] Plan collision-free paths
- [ ] Execute planned motions

**Lab 12.2: Grasping & Manipulation** (2 hours)
- [ ] Identify graspable objects
- [ ] Plan grasp approach
- [ ] Execute pick-and-place operation

### Deliverables

- [ ] IK solver working
- [ ] Grasp planning algorithm
- [ ] Pick-and-place demo

### Estimated Hours

- **Theory**: 2 hrs
- **Lab Work**: 4 hrs
- **Troubleshooting**: 1 hr
- **Total**: 7 hours

---

## WEEK 13: Capstone Project & Final Integration

**Theme**: End-to-End Physical AI System

### Learning Objectives

- Integrate all modules
- Build complete robotic system
- Deploy to hardware (if available)
- Present results

### Major Projects

**Capstone Project: "Your Physical AI System"** (6-8 hours)

Choose one:

1. **Autonomous Delivery Robot**
   - SLAM + Navigation to destination
   - Vision-based obstacle detection
   - Voice commands for task assignment

2. **Mobile Manipulation Robot**
   - Navigation to object location
   - Vision-based object recognition
   - Grasping and placement

3. **Research Project**
   - Your own design
   - Combines multiple modules
   - Novel application

### Project Scope

- Minimum requirements:
  - Digital twin in simulation
  - At least 2 modules integrated
  - Documentation and video demo
  - Code on GitHub

- Bonus points:
  - Hardware deployment
  - LLM integration
  - Advanced perception
  - Novel contribution

### Deliverables

- [ ] Source code (GitHub)
- [ ] Simulation demo (video)
- [ ] Technical report (5-10 pages)
- [ ] Presentation (10-15 minutes)
- [ ] Hardware demo (if applicable)

### Presentation Outline

1. **Problem Statement** (1-2 min)
   - What are you building? Why?

2. **Technical Approach** (4-5 min)
   - Which modules did you use?
   - Architecture diagram
   - Key algorithms

3. **Experimental Results** (2-3 min)
   - Simulation performance
   - Hardware results (if applicable)
   - Benchmarks

4. **Lessons Learned** (1-2 min)
   - Challenges faced
   - Solutions found
   - Future work

### Estimated Time

- **Planning & Design**: 1-2 hrs
- **Implementation**: 4-6 hrs
- **Testing & Debugging**: 2-3 hrs
- **Documentation & Presentation**: 1-2 hrs
- **Total**: 8-13 hours

### **Final Module Milestone Checklist**

- ✅ Capstone project complete
- ✅ Code on GitHub with README
- ✅ Simulation working end-to-end
- ✅ Documentation complete
- ✅ Presentation prepared

---

## Course Completion Checklist

### Module 1: ROS 2 Fundamentals
- ✅ 3 ROS 2 packages created
- ✅ Publishers/subscribers implemented
- ✅ Services and actions working
- ✅ URDF models for 2 robots

### Module 2: Digital Twins
- ✅ Gazebo world created
- ✅ Unity environment built
- ✅ Sensor simulation working
- ✅ ROS 2 integration verified

### Module 3: Perception & Navigation
- ✅ SLAM working in simulation
- ✅ Nav2 autonomous navigation
- ✅ Vision perception pipeline
- ✅ Isaac Sim GPU acceleration

### Module 4: VLA & Integration
- ✅ LLM integration working
- ✅ Voice control implemented
- ✅ Manipulation planning
- ✅ Capstone project complete

---

## Tips for Success

### Time Management

- **Week 1-4**: Allocate more time to fundamentals
- **Week 5-10**: Mix theory + hands-on in equal parts
- **Week 11-13**: Focus on integration and polish

### Study Strategy

1. **Read ahead** (30 min before class/lab)
2. **Work through examples** (coding along with tutorials)
3. **Experiment** (try variations on provided code)
4. **Debug** (use ROS 2 tools to understand issues)
5. **Document** (comment code, take notes)

### Getting Help

- **Stuck?** Check the [Glossary](/docs/glossary) for terminology
- **Error message?** Search [ROS Discourse](https://discourse.ros.org/)
- **Installation issue?** See [Hardware Requirements](/docs/appendix/hardware-requirements)
- **Lab not working?** Check [Lab Architecture](/docs/appendix/lab-architecture)

### Customizing the Schedule

**For Accelerated Pace** (8 weeks):
- Combine weeks 1-2, 5-6, 8-9
- Focus on essential labs only
- Capstone simplified to one integration task

**For Extended Learning** (18 weeks):
- Add 1 week per module for deep dives
- Include advanced topics (embedded systems, ML training)
- Extended capstone with hardware deployment

**For Self-Paced**:
- Take what you need from each week
- Repeat modules as necessary
- Build projects incrementally

---

## Self-Paced Timeline

If learning on your own schedule:

| Milestone | Suggested Timeline |
|-----------|-------------------|
| Complete Module 1 (4 weeks of material) | Weeks 1-6 of self-study |
| Complete Module 2 (3 weeks of material) | Weeks 7-11 of self-study |
| Complete Module 3 (3 weeks of material) | Weeks 12-17 of self-study |
| Complete Module 4 & Capstone (3 weeks + project) | Weeks 18-26+ of self-study |
| **Total self-study time** | **3-4 months at 8-10 hrs/week** |

---

## Resources by Week

### Week 1-4 (Module 1)
- [Module 1: ROS 2 Fundamentals](/docs/module-1)
- [ROS 2 Official Docs](https://docs.ros.org/en/humble/)
- [The Construct ROS Courses](https://www.theconstructsim.com/)

### Week 5-7 (Module 2)
- [Module 2: Digital Twins](/docs/module-2)
- [Gazebo Tutorials](https://gazebosim.org/docs)
- [Unity Robotics Hub](https://github.com/Unity-Technologies/Unity-Robotics-Hub)

### Week 8-10 (Module 3)
- [Module 3: Isaac AI](/docs/module-3)
- [NVIDIA Isaac Docs](https://docs.omniverse.nvidia.com/isaacsim/latest/)
- [Isaac ROS Repositories](https://github.com/NVIDIA-ISAAC-ROS)

### Week 11-13 (Module 4)
- [Module 4: VLA Integration](/docs/module-4)
- [ROS 2 MoveIt 2](https://moveit.ros.org/)
- [LLaMA/Ollama](https://ollama.ai/)

---

## Next Steps After Course Completion

### Recommended Paths

**Path 1: Deeper AI/ML**
- Deep learning for robotics
- Computer vision specialization
- Reinforcement learning applications

**Path 2: Hardware Deployment**
- Work with real robots (Franka, TurtleBot)
- Sim-to-real transfer techniques
- Production robotics systems

**Path 3: Research**
- PhD programs in robotics
- Research publications
- Contributing to ROS 2 ecosystem

**Path 4: Industry**
- Robotics companies (Boston Dynamics, Tesla, etc.)
- Autonomous vehicles
- Industrial automation

---

**Ready to start?** Begin with [Week 1: ROS 2 Architecture](/docs/module-1/ros2-fundamentals)

**Questions?** Check [Glossary](/docs/glossary) or [Lab Architecture](/docs/appendix/lab-architecture)
