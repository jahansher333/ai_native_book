---
title: "ROS 2 Fundamentals"
description: "Learn ROS 2 core architecture, nodes, topics, and create your first publisher to understand the foundation of modern robotics middleware."
module_id: "module-1"
sidebar_position: 1
tags: ["ros2", "fundamentals", "nodes", "topics", "architecture"]
difficulty: beginner
estimated_minutes: 25
---

# ROS 2 Fundamentals

Robot Operating System 2 (ROS 2) is a flexible framework for writing robot software. It provides services designed for a heterogeneous computer cluster, including hardware abstraction, low-level device control, message-passing between processes, and package management.

## Learning Objectives

By the end of this section, you will be able to:

- Explain the ROS 2 architecture and its key improvements over ROS 1
- Understand nodes, topics, and the publish-subscribe pattern
- Create a simple ROS 2 publisher node in Python
- Build and run ROS 2 packages using colcon
- Use command-line tools to inspect running systems

## What is ROS 2?

ROS 2 is **not** an operating system - it's a middleware framework that sits between your application code and the operating system. Think of it as a sophisticated messaging system that allows different programs (nodes) to communicate with each other.

### Key Improvements Over ROS 1

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| **Communication** | Custom TCPROS protocol | DDS (Data Distribution Service) standard |
| **Real-Time Support** | Limited | Native real-time capabilities |
| **Security** | None | DDS-Security with encryption/authentication |
| **Multi-Robot** | Requires custom workarounds | Native multi-robot support |
| **Platform Support** | Linux only | Linux, Windows, macOS, RTOS |
| **Master Node** | Single point of failure | Fully decentralized (no master) |

## ROS 2 Architecture

![ROS 2 Node Communication](/img/diagrams/fig-module1-ros2-architecture.svg)

### Core Concepts

**Node**: An independent process that performs computation. Examples:
- Camera driver node (publishes images)
- Object detection node (subscribes to images, publishes detections)
- Motor controller node (subscribes to velocity commands)

**Topic**: A named bus over which nodes exchange messages. Topics use anonymous publish-subscribe pattern:
- One-to-many, many-to-one, or many-to-many communication
- Asynchronous (publishers don't wait for subscribers)

**Message**: Data structure defining the format of information sent over topics

**Package**: A directory containing nodes, libraries, configuration files, etc.

**Workspace**: A directory structure containing one or more packages

## Your First ROS 2 Node: Hello World Publisher

Let's create a simple node that publishes "Hello, ROS 2!" messages.

### Step 1: Create a Workspace and Package

```bash title="Terminal" showLineNumbers
# Create workspace directory
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# Create a new package
ros2 pkg create --build-type ament_python hello_robot --dependencies rclpy std_msgs

# Navigate to package
cd hello_robot/hello_robot
```

### Step 2: Write the Publisher Node

Create a file `hello_publisher.py`:

```python title="hello_publisher.py" showLineNumbers {5-7,12,19}
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class HelloPublisher(Node):
    def __init__(self):
        super().__init__('hello_publisher')  # Node name

        # Create publisher: message type, topic name, queue size
        self.publisher_ = self.create_publisher(String, 'hello_topic', 10)

        # Create timer: period in seconds, callback function
        self.timer = self.create_timer(1.0, self.timer_callback)

        self.counter = 0
        self.get_logger().info('Hello Publisher has been started')

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello, ROS 2! Count: {self.counter}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.counter += 1

def main(args=None):
    rclpy.init(args=args)
    node = HelloPublisher()

    try:
        rclpy.spin(node)  # Keep node running
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**What this code does**:

1. **Lines 5-7**: Define `HelloPublisher` class inheriting from `Node`
2. **Line 10**: Create publisher for `String` messages on `hello_topic` with queue size 10
3. **Line 12**: Create timer that triggers `timer_callback()` every 1.0 second
4. **Lines 18-22**: Publish message and log to console
5. **Line 29**: `rclpy.spin()` keeps the node alive to process callbacks

### Step 3: Configure Package Files

Edit `setup.py` to add the entry point:

```python title="setup.py" {5-7}
entry_points={
    'console_scripts': [
        'hello_publisher = hello_robot.hello_publisher:main',
    ],
},
```

### Step 4: Build and Run

```bash title="Terminal" showLineNumbers
# Navigate to workspace root
cd ~/ros2_ws

# Build the package
colcon build --packages-select hello_robot

# Source the workspace
source install/setup.bash

# Run the node
ros2 run hello_robot hello_publisher
```

**Expected Output**:
```bash
[INFO] [hello_publisher]: Hello Publisher has been started
[INFO] [hello_publisher]: Publishing: "Hello, ROS 2! Count: 0"
[INFO] [hello_publisher]: Publishing: "Hello, ROS 2! Count: 1"
[INFO] [hello_publisher]: Publishing: "Hello, ROS 2! Count: 2"
...
```

## Inspecting the System

While the publisher is running, open a new terminal and explore:

### List Running Nodes
```bash
ros2 node list
# Output: /hello_publisher
```

### List Active Topics
```bash
ros2 topic list
# Output: /hello_topic, /parameter_events, /rosout
```

### Echo Topic Messages
```bash
ros2 topic echo /hello_topic
# Output: Live stream of messages
```

### Show Topic Info
```bash
ros2 topic info /hello_topic
# Output: Type, publisher count, subscriber count
```

### Inspect Message Structure
```bash
ros2 interface show std_msgs/msg/String
# Output:
# string data
```

## Key Concepts Explained

### Quality of Service (QoS)

QoS policies control how messages are delivered:

- **Reliability**: `RELIABLE` (guaranteed delivery) vs `BEST_EFFORT` (may drop)
- **Durability**: `TRANSIENT_LOCAL` (late subscribers get last message) vs `VOLATILE` (no history)
- **History**: Keep last N messages (`KEEP_LAST`) or all (`KEEP_ALL`)

Example with custom QoS:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy

qos_profile = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    history=HistoryPolicy.KEEP_LAST,
    depth=10
)

self.publisher_ = self.create_publisher(String, 'hello_topic', qos_profile)
```

### Node Lifecycle

Nodes typically follow this lifecycle:

1. **Initialize**: `rclpy.init()` sets up ROS 2 context
2. **Create**: Instantiate node, publishers, subscribers, timers
3. **Spin**: `rclpy.spin()` processes callbacks (messages, timers, services)
4. **Shutdown**: `destroy_node()` and `rclpy.shutdown()` clean up resources

## Exercise: Temperature Sensor Publisher

**Goal**: Create a node that publishes simulated temperature readings.

**Requirements**:
- Publish `Float32` messages on `/sensors/temperature` topic
- Generate random temperature between 20.0 and 30.0 Celsius
- Publish at 2 Hz (every 0.5 seconds)
- Log temperature readings to console

**Hints**:
- Use `std_msgs.msg.Float32` instead of `String`
- Import `random` for `random.uniform(20.0, 30.0)`
- Timer period = 0.5 for 2 Hz

**Solution Template**:

```python title="temperature_publisher.py" showLineNumbers
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class TemperaturePublisher(Node):
    def __init__(self):
        super().__init__('temperature_publisher')
        self.publisher_ = self.create_publisher(Float32, '/sensors/temperature', 10)
        self.timer = self.create_timer(0.5, self.timer_callback)  # 2 Hz

    def timer_callback(self):
        msg = Float32()
        msg.data = random.uniform(20.0, 30.0)
        self.publisher_.publish(msg)
        self.get_logger().info(f'Temperature: {msg.data:.2f}°C')

def main(args=None):
    rclpy.init(args=args)
    node = TemperaturePublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Key Takeaways

- ROS 2 uses a **decentralized** architecture with no single point of failure
- **Nodes** are independent processes that communicate via **topics**
- **Publishers** send messages asynchronously to topics
- **Subscribers** receive messages from topics they're interested in
- `colcon build` compiles packages, `source install/setup.bash` activates them
- ROS 2 CLI tools (`ros2 node`, `ros2 topic`, etc.) are essential for debugging

## Next Steps

Continue to [URDF Basics](/docs/module-1/urdf-basics) to learn how to model robots.

## Further Reading

- [ROS 2 Concepts Overview](https://docs.ros.org/en/humble/Concepts.html)
- [Understanding Nodes](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Nodes/Understanding-ROS2-Nodes.html)
- [Understanding Topics](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Topics/Understanding-ROS2-Topics.html)
- [About Quality of Service](https://docs.ros.org/en/humble/Concepts/About-Quality-of-Service-Settings.html)
