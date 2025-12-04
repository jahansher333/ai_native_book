---
title: "Module 1: ROS 2 - The Robotic Nervous System"
description: "Master Robot Operating System 2 fundamentals, including node architecture, URDF modeling, and inter-process communication patterns."
module_id: "module-1"
sidebar_position: 1
tags: ["ros2", "fundamentals", "architecture", "module-overview"]
difficulty: beginner
estimated_minutes: 15
---

# Module 1: ROS 2 - The Robotic Nervous System

Robot Operating System 2 (ROS 2) is the industry-standard middleware for building modular, distributed robotics applications. Just as the nervous system coordinates communication between different parts of the body, ROS 2 enables different software components (nodes) to exchange data and coordinate actions in a robotic system.

## Module Overview

This module introduces the foundational concepts and practical skills needed to build ROS 2 applications. You'll learn to create nodes, define robot models, and implement communication patterns that form the backbone of modern robotics systems.

## Learning Objectives

By the end of this module, you will be able to:

- Explain ROS 2 architecture and its advantages over ROS 1
- Create and launch ROS 2 nodes using Python and C++
- Design robot models using URDF (Unified Robot Description Format)
- Implement publishers and subscribers for asynchronous communication
- Use services and actions for synchronous request-response patterns
- Visualize robot models and sensor data in RViz2

## Topics Covered

### [ROS 2 Fundamentals](/docs/module-1/ros2-fundamentals)
- ROS 2 architecture and core concepts
- Nodes, topics, and the DDS middleware
- Creating your first "Hello World" publisher
- Package structure and workspace management

### [URDF Basics](/docs/module-1/urdf-basics)
- Robot modeling with URDF XML format
- Links, joints, and kinematic chains
- Visual vs collision geometries
- Loading and visualizing robots in RViz2

### [Nodes, Services & Communication](/docs/module-1/nodes-services)
- Publisher-subscriber pattern for streaming data
- Service clients and servers for RPC-style communication
- Action servers for long-running tasks with feedback
- Best practices for topic naming and message design

## Prerequisites

Before starting this module, ensure you have:

- **Ubuntu 22.04 LTS** installed (native or VM)
- **ROS 2 Humble Hawksbill** installed ([installation guide](https://docs.ros.org/en/humble/Installation.html))
- **Python 3.10+** with `colcon` build tool
- **Basic Linux CLI skills** (navigating directories, editing files)

### Installation Check

Verify your ROS 2 installation:

```bash
source /opt/ros/humble/setup.bash
ros2 --version
# Expected output: ros2 cli version humble.X.X
```

## Estimated Time

- **Reading & Conceptual Learning**: 3-4 hours
- **Hands-On Exercises**: 4-6 hours
- **Total Module Time**: 8-10 hours

## Hands-On Approach

Each topic in this module follows this structure:

1. **Concept Introduction**: What is this technology and why does it matter?
2. **Architecture Walkthrough**: How does it work under the hood?
3. **Code Example**: Annotated working code you can run
4. **Exercise**: Build something yourself to reinforce learning
5. **Key Takeaways**: Summary of critical concepts

## Real-World Applications

ROS 2 powers robotics systems across multiple industries:

- **Autonomous Vehicles**: Waymo, Tesla, and Aurora use ROS-based stacks
- **Industrial Automation**: Factory robots coordinating via ROS 2
- **Healthcare Robotics**: Surgical assistants and rehabilitation devices
- **Space Exploration**: NASA Mars rovers use ROS-derived systems
- **Service Robots**: Delivery robots, warehouse automation (Amazon Robotics)

## Module Roadmap

```
Week 1: ROS 2 Architecture & First Publisher
├── Install ROS 2 Humble
├── Create workspace and first package
├── Write "Hello World" publisher node
└── Lab 1: Temperature sensor publisher

Week 2: URDF Robot Modeling
├── Learn URDF XML structure
├── Model a simple 2-link robot arm
├── Visualize in RViz2
└── Lab 2: Model a mobile robot

Week 3: Advanced Communication Patterns
├── Service clients/servers
├── Action servers with feedback
├── Launch files for multi-node systems
└── Lab 3: Build a request-response robot controller
```

## Key Technologies

- **ROS 2 Humble Hawksbill** (Long-Term Support release)
- **DDS (Data Distribution Service)**: Underlying middleware
- **Python 3** and **C++17**: Primary programming languages
- **colcon**: Build system for ROS 2 workspaces
- **RViz2**: 3D visualization tool for robots and sensor data

## Module Deliverables

After completing this module, you should have:

- ✅ A ROS 2 workspace with at least 3 custom packages
- ✅ Publisher and subscriber nodes demonstrating topics
- ✅ A service-based calculator or similar request-response system
- ✅ A URDF model of a robot (arm, mobile robot, or custom design)
- ✅ Launch files to start multi-node systems

## Common Pitfalls

Watch out for these common mistakes:

- **Not sourcing setup.bash**: Always run `source /opt/ros/humble/setup.bash` or `source install/setup.bash` before ROS commands
- **Package name mismatches**: Package names in `package.xml` must match directory names
- **Topic name collisions**: Use namespaces to organize topics (e.g., `/sensors/imu` vs `/imu`)
- **Callback blocking**: Don't perform long computations in subscriber callbacks - use threads or timers

## Further Resources

- [ROS 2 Official Documentation](https://docs.ros.org/en/humble/)
- [ROS 2 Design Rationale](https://design.ros2.org/)
- [The Construct ROS 2 Tutorials](https://www.theconstructsim.com/robotigniteacademy_learnros/ros-courses-library/)
- [ROS 2 Discourse Forum](https://discourse.ros.org/)

---

## Ready to Start?

Begin with [ROS 2 Fundamentals](/docs/module-1/ros2-fundamentals) to learn the core architecture and build your first node.

**Next Steps**:
- [ROS 2 Fundamentals](/docs/module-1/ros2-fundamentals) →
- [URDF Basics](/docs/module-1/urdf-basics)
- [Nodes & Services](/docs/module-1/nodes-services)
