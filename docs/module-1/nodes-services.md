---
title: "Nodes, Services & Communication"
description: "Master ROS 2 communication patterns including publishers, subscribers, services, and actions for building distributed robotic systems."
module_id: "module-1"
sidebar_position: 3
tags: ["nodes", "services", "actions", "communication", "pubsub"]
difficulty: intermediate
estimated_minutes: 35
---

# Nodes, Services & Communication

ROS 2 provides multiple communication patterns for different use cases. This section covers the three primary methods: **topics** (publish-subscribe), **services** (request-response), and **actions** (long-running tasks with feedback).

## Learning Objectives

By the end of this section, you will be able to:

- Implement subscriber nodes to receive topic messages
- Create service servers and clients for synchronous communication
- Use actions for tasks requiring progress feedback
- Choose appropriate communication patterns for different scenarios
- Debug communication issues using ROS 2 CLI tools

## Communication Patterns Overview

| Pattern | Type | Use Case | Example |
|---------|------|----------|---------|
| **Topic** | Pub-Sub, Async | Streaming sensor data | Camera publishes images |
| **Service** | Request-Response, Sync | One-time queries | "Get robot pose" |
| **Action** | Goal-Feedback-Result, Async | Long tasks with status | "Navigate to waypoint" |

## Topics: Publish-Subscribe Pattern

### Subscribers

While publishers send messages, **subscribers** receive them. A topic can have multiple publishers and subscribers.

```python title="hello_subscriber.py" showLineNumbers {5-7,10-12}
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class HelloSubscriber(Node):
    def __init__(self):
        super().__init__('hello_subscriber')

        # Create subscriber: message type, topic name, callback, queue size
        self.subscription = self.create_subscription(
            String,
            'hello_topic',
            self.listener_callback,
            10)

        self.get_logger().info('Hello Subscriber has been started')

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')

def main(args=None):
    rclpy.init(args=args)
    node = HelloSubscriber()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Key Concepts**:
- **Callback function** (`listener_callback`) is triggered when new message arrives
- Callbacks should be **fast** - don't block with heavy computation
- Multiple subscribers can listen to the same topic independently

### Publisher + Subscriber Example: Echo Node

Create a node that subscribes to one topic and publishes to another:

```python title="echo_node.py" showLineNumbers
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class EchoNode(Node):
    def __init__(self):
        super().__init__('echo_node')

        self.subscription = self.create_subscription(
            String,
            'input_topic',
            self.echo_callback,
            10)

        self.publisher = self.create_publisher(String, 'output_topic', 10)

    def echo_callback(self, msg):
        # Transform message (e.g., uppercase)
        echo_msg = String()
        echo_msg.data = msg.data.upper()

        self.publisher.publish(echo_msg)
        self.get_logger().info(f'Echoed: {msg.data} → {echo_msg.data}')

def main(args=None):
    rclpy.init(args=args)
    node = EchoNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Services: Request-Response Pattern

Services provide **synchronous** communication - client sends request, waits for response. Unlike topics, services are one-to-one (one server, one client per call).

### Use Cases for Services

- Querying robot state ("What's my battery level?")
- Triggering one-time actions ("Take a photo now")
- Configuration changes ("Set max speed to 2 m/s")

### Creating a Service Server

Let's build an "AddTwoInts" service that adds two numbers:

```python title="add_server.py" showLineNumbers {4,8-11,13-17}
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddServerNode(Node):
    def __init__(self):
        super().__init__('add_server')
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_callback)
        self.get_logger().info('Add service ready')

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'Request: {request.a} + {request.b} = {response.sum}')
        return response

def main(args=None):
    rclpy.init(args=args)
    node = AddServerNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Service Definition** (`AddTwoInts.srv`):
```
int64 a
int64 b
---
int64 sum
```
(Top: request fields, Bottom: response fields)

### Creating a Service Client

```python title="add_client.py" showLineNumbers {7-9,11-16,18-21}
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddClientNode(Node):
    def __init__(self):
        super().__init__('add_client')
        self.client = self.create_client(AddTwoInts, 'add_two_ints')

        # Wait for service to become available
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting...')

    def send_request(self, a, b):
        request = AddTwoInts.Request()
        request.a = a
        request.b = b

        # Call service asynchronously
        future = self.client.call_async(request)
        return future

def main(args=None):
    rclpy.init(args=args)
    node = AddClientNode()

    # Send request
    future = node.send_request(5, 7)

    # Wait for response
    rclpy.spin_until_future_complete(node, future)

    if future.result() is not None:
        node.get_logger().info(f'Result: {future.result().sum}')
    else:
        node.get_logger().error('Service call failed')

    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Testing**:
```bash
# Terminal 1: Start server
ros2 run your_package add_server

# Terminal 2: Call service manually
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 5, b: 7}"

# Or run client
ros2 run your_package add_client
```

## Actions: Long-Running Tasks with Feedback

**Actions** are like services but designed for tasks that take time and provide progress updates.

### Action Structure

- **Goal**: What to achieve (e.g., "Move to coordinates (5, 10)")
- **Feedback**: Progress updates (e.g., "Currently at (2, 5)")
- **Result**: Final outcome (e.g., "Success" or "Failed")

### Use Cases for Actions

- Navigation ("Go to waypoint X, send position updates")
- Manipulation ("Pick up object, report grasp status")
- Long computations ("Train model, report accuracy each epoch")

### Action Example: Fibonacci Server

```python title="fibonacci_action_server.py" showLineNumbers {3,10-13,15-30}
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from example_interfaces.action import Fibonacci

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')

        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback)

    def execute_callback(self, goal_handle):
        self.get_logger().info(f'Executing goal: order={goal_handle.request.order}')

        # Initialize feedback
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.sequence = [0, 1]

        # Generate Fibonacci sequence
        for i in range(1, goal_handle.request.order):
            # Check if canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                return Fibonacci.Result()

            # Compute next number
            feedback_msg.sequence.append(
                feedback_msg.sequence[i] + feedback_msg.sequence[i - 1])

            # Publish feedback
            goal_handle.publish_feedback(feedback_msg)
            time.sleep(0.5)  # Simulate work

        # Return result
        goal_handle.succeed()
        result = Fibonacci.Result()
        result.sequence = feedback_msg.sequence
        return result

def main(args=None):
    rclpy.init(args=args)
    node = FibonacciActionServer()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Choosing the Right Pattern

| Scenario | Use | Reason |
|----------|-----|--------|
| Camera images | **Topic** | Continuous stream, multiple consumers |
| Sensor readings | **Topic** | High-frequency data |
| "Get current pose" | **Service** | One-time query, immediate response |
| "Toggle LED" | **Service** | Simple on/off command |
| "Navigate to goal" | **Action** | Takes time, needs progress updates |
| "Grasp object" | **Action** | Can fail, requires status feedback |

## Exercise: Build a Simple Calculator Service

**Goal**: Create a calculator service that performs addition, subtraction, multiplication, and division.

**Requirements**:
1. Define custom service `Calculator.srv`:
   ```
   float64 a
   float64 b
   string operation  # "add", "subtract", "multiply", "divide"
   ---
   float64 result
   bool success
   string message
   ```

2. Implement `calculator_server.py`:
   - Handle all four operations
   - Return `success=False` for division by zero
   - Log each calculation

3. Implement `calculator_client.py`:
   - Accept command-line arguments for operation
   - Print result or error message

**Test**:
```bash
ros2 run your_package calculator_client --a 10 --b 5 --op divide
# Expected: result = 2.0
```

## Key Takeaways

- **Topics** (pub-sub): Best for continuous data streams, asynchronous, many-to-many
- **Services** (req-res): Best for one-time queries, synchronous, one-to-one
- **Actions**: Best for long-running tasks with progress feedback
- Always check if service is available before calling (`wait_for_service()`)
- Keep subscriber callbacks fast - offload heavy work to separate threads
- Use namespaces to organize topics (e.g., `/robot1/sensors/camera`)

## Next Steps

Congratulations! You've completed Module 1. Continue to [Module 2: Digital Twin](/docs/module-2) to learn simulation with Gazebo and Unity.

## Further Reading

- [Understanding Services](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Services/Understanding-ROS2-Services.html)
- [Understanding Actions](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Understanding-ROS2-Actions/Understanding-ROS2-Actions.html)
- [Writing an Action Server and Client (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Writing-an-Action-Server-Client/Py.html)
