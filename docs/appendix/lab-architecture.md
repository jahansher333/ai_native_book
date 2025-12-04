---
title: "Lab Architecture & Multi-User Setup"
description: "Network topology, multi-user ROS 2 configuration, resource sharing, and deployment patterns for shared robotics labs."
sidebar_position: 106
tags: ["lab-architecture", "network", "ros2-deployment", "infrastructure"]
difficulty: advanced
estimated_minutes: 25
---

# Lab Architecture & Multi-User Setup

This document describes best practices for architecting shared robotics labs, including network topology, ROS 2 multi-user patterns, resource scheduling, and operational procedures.

## Core Principles

Successful shared robotics labs balance:

1. **Isolation**: Each user's code shouldn't crash others' experiments
2. **Sharing**: Efficient use of expensive hardware (robots, GPUs, simulation servers)
3. **Safety**: No interference with running experiments or robots
4. **Scalability**: Easy to add users, robots, or compute nodes
5. **Monitoring**: Visibility into system state and resource usage

---

## Network Topology

### Single-Lab Architecture (5-10 robots, 10-20 users)

```
┌──────────────────────────────────────────────────────────────┐
│                       Internet Gateway                        │
│                    (1 Gbps minimum)                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    [Switch 1]       [Switch 2]      [WiFi AP 1]
   (10 GbE)       (10 GbE or 1GbE)    (WiFi 6E)
        │                │                │
    ────┼────────────────┼────────────────┼────
        │                │                │
   [Server]    [Dev Workstations]   [Mobile Robots]
   (GPU)       1-10                   1-10

   [Router/Firewall]
   ├─ Managed switch (QoS configuration)
   ├─ Dual ISP failover (optional)
   └─ Centralized logging server
```

### Multi-Lab Campus Architecture (3+ labs, 50+ robots, 50+ users)

```
┌───────────────────────────────────────────────────────────┐
│            Campus Network / Internet                       │
│         (Multi-lab backbone: 10 Gbps minimum)            │
└─────────────────┬────────────────────┬────────────────────┘
                  │                    │
              [Lab 1]              [Lab 2]            [Lab 3]
              Server               Server             Server
              + Robots             + Robots          + Robots
              ├─ 5-10 robots       ├─ 5-10 robots    ├─ 5-10 robots
              ├─ Local storage     ├─ Local storage  ├─ Local storage
              └─ Dev workstations  └─ Dev stations   └─ Dev stations
                        │                │                │
                  [Firewall]         [Firewall]      [Firewall]
                        │                │                │
        ┌───────────────┴────────────────┴────────────────┐
        │        Central Services (Optional)              │
        ├─ Fleet management server                        │
        ├─ Centralized logging (ELK stack)               │
        ├─ User management (LDAP/AD)                      │
        ├─ Model/asset repository (NAS)                   │
        └─ CI/CD pipeline (GitHub Actions, Jenkins)      │
```

### Virtual LAN Segmentation (Important for Safety)

Separate networks by function and trust level:

| VLAN | Purpose | Access | QoS |
|------|---------|--------|-----|
| **VLAN 10** | Robot network | Restricted (authenticated) | High priority |
| **VLAN 20** | Dev workstations | Lab users | Medium priority |
| **VLAN 30** | Simulation server | Lab users + remote | Medium priority |
| **VLAN 40** | Guest WiFi | Public (no robot access) | Low priority |
| **VLAN 50** | Management | Admin only (out-of-band) | High priority |

**Key Rule**: Mobile robots CANNOT communicate with guest network.

---

## ROS 2 Multi-User Setup

### Naming Convention & Namespacing

To avoid conflicts, use hierarchical namespaces:

```bash
# Standard namespace structure
/lab/robot1/sensors/camera
/lab/robot1/control/drive_cmd
/lab/robot2/sensors/lidar
/lab/robot2/control/arm
/lab/sim/gazebo_state
/lab/user/alice/dev_node
/lab/user/bob/experiment_1
```

**Rules**:
1. Robot name must be unique across lab
2. User code goes under `/lab/user/<username>/`
3. Shared services under `/lab/services/`
4. Simulation isolated in `/sim` namespace

### Example ROS 2 Launch File (Multi-User)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<launch>
  <!-- Global arguments -->
  <arg name="robot_name" default="robot1" />
  <arg name="user_name" default="alice" />
  <arg name="use_sim" default="false" />

  <!-- Robot namespace group -->
  <group ns="lab/$(arg robot_name)">

    <!-- Sensor nodes -->
    <include file="$(find robot_bringup)/launch/sensors.launch.xml">
      <arg name="namespace" value="$(arg robot_name)" />
    </include>

    <!-- Motor drivers -->
    <node pkg="motor_control" exec="motor_driver" name="drive_motors">
      <param name="port" value="/dev/ttyUSB0" />
    </node>

  </group>

  <!-- User-specific development node -->
  <group ns="lab/user/$(arg user_name)">
    <node pkg="my_project" exec="control_node" name="controller">
      <remap from="cmd_vel" to="/lab/$(arg robot_name)/control/drive_cmd" />
      <remap from="odom" to="/lab/$(arg robot_name)/sensors/odom" />
    </node>
  </group>

</launch>
```

### Usage

```bash
# Alice works with robot1
ros2 launch multi_user_bringup lab.launch.xml robot_name:=robot1 user_name:=alice

# Bob works with robot2
ros2 launch multi_user_bringup lab.launch.xml robot_name:=robot2 user_name:=bob

# Simulation mode (no robots)
ros2 launch multi_user_bringup lab.launch.xml use_sim:=true user_name:=charlie
```

### DDS Configuration for Multi-Lab Environments

By default, ROS 2 uses DDS which auto-discovers nodes. In multi-lab setups, you need to limit discovery scope:

**File: `dds_config.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<dds xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:noNamespaceSchemaLocation="http://github.com/ros2/ros2/blob/master/tools/dds_config.xml"
     xmlns="http://www.eprosima.com/XMLSchemas/fastRTPS_Profiles">

  <profiles xmlns="http://www.eprosima.com/XMLSchemas/fastRTPS_Profiles">
    <transport_descriptors>
      <transport_descriptor>
        <transportId>lab1_transport</transportId>
        <type>UDPv4</type>
        <interfaceWhiteList>
          <address>192.168.1.0/24</address>  <!-- Lab 1 subnet only -->
        </interfaceWhiteList>
      </transport_descriptor>
    </transport_descriptors>

    <participant_factory profile_name="lab1_participant_factory">
      <rtps>
        <userTransports>
          <transport_id>lab1_transport</transport_id>
        </userTransports>
        <builtinTransports>none</builtinTransports>
      </rtps>
    </participant_factory>
  </profiles>

</dds>
```

**Usage**:
```bash
export ROS_DOMAIN_ID=10  # Lab 1 uses domain 10
export FASTRTPS_DEFAULT_PROFILES_FILE=/etc/ros2/dds_config.xml
ros2 launch my_package my_launch.py
```

---

## Resource Scheduling & Allocation

### CPU & GPU Resource Management

For shared servers running multiple simulations:

```bash
# Container-based isolation (using Docker)

# Alice's Isaac Sim container
docker run -d \
  --name isaac_sim_alice \
  --gpus '"device=0"' \
  --cpus="8" \
  --memory="16g" \
  nvidia/isaac-sim:2023.1 \
  /app/launcher.sh

# Bob's Isaac Sim container
docker run -d \
  --name isaac_sim_bob \
  --gpus '"device=1"' \
  --cpus="8" \
  --memory="16g" \
  nvidia/isaac-sim:2023.1 \
  /app/launcher.sh

# Monitor resource usage
docker stats isaac_sim_alice isaac_sim_bob
```

### Task Scheduling (Kubernetes)

For advanced setups with many users:

```yaml
# kubernetes pod definition
apiVersion: v1
kind: Pod
metadata:
  name: gazebo-sim-alice
  namespace: lab1
spec:
  containers:
  - name: gazebo
    image: osrf/ros:humble-gazebo
    resources:
      requests:
        memory: "8Gi"
        cpu: "4"
      limits:
        memory: "16Gi"
        cpu: "6"
  - name: ros-node
    image: my-ros-app:latest
    env:
    - name: ROS_DOMAIN_ID
      value: "10"
    volumeMounts:
    - name: shared-models
      mountPath: /models
  volumes:
  - name: shared-models
    persistentVolumeClaim:
      claimName: models-pvc
```

---

## Robot Scheduling & Access Control

### Simple Booking System (Calendar-Based)

**Tool**: Google Calendar or shared online calendar

```
┌─────────────────────────────────────────────────────┐
│  Lab Robot Schedule (Week of Jan 15)                │
├─────────────────────────────────────────────────────┤
│ Robot 1 (TurtleBot):                                │
│   Mon 9-11am: Alice (SLAM testing)                  │
│   Mon 2-4pm:  Bob (Nav2 development)                │
│   Tue 10am-12pm: Charlie (Grasp planning)           │
│   Tue 2-6pm:  Lab session (all students)            │
│   Wed-Fri: Available (first-come, first-served)     │
│                                                      │
│ Robot 2 (Arm):                                       │
│   Mon 1-5pm: David (Manipulation capstone)          │
│   Tue 9-11am: MAINTENANCE                           │
│   Tue 2-6pm: Lab session (all students)             │
│   Wed-Fri: Available / Reserved for experiments     │
└─────────────────────────────────────────────────────┘
```

### Advanced Booking System (Automation)

**Tool**: Custom reservation system with API

```python
# booking_system.py
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import json

app = Flask(__name__)
BOOKING_FILE = "/var/lib/lab/bookings.json"

@app.route("/book_robot", methods=["POST"])
def book_robot():
    data = request.json
    robot_id = data["robot"]
    user = data["user"]
    start_time = datetime.fromisoformat(data["start_time"])
    duration_hours = data["duration"]

    # Check availability
    if is_available(robot_id, start_time, duration_hours):
        add_booking(robot_id, user, start_time, duration_hours)
        return jsonify({"status": "booked"}), 200
    else:
        return jsonify({"status": "unavailable"}), 409

@app.route("/robots", methods=["GET"])
def list_robots():
    return jsonify({
        "robots": [
            {"id": "robot1", "type": "TurtleBot 3", "status": "available"},
            {"id": "robot2", "type": "Franka Panda", "status": "in_use_until_3pm"},
        ]
    })

@app.route("/bookings/<robot_id>", methods=["GET"])
def get_bookings(robot_id):
    week_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    week_start -= timedelta(days=week_start.weekday())  # Monday
    week_end = week_start + timedelta(days=7)

    bookings = load_bookings()
    robot_bookings = [b for b in bookings
                      if b["robot_id"] == robot_id and
                         week_start <= datetime.fromisoformat(b["start"]) < week_end]

    return jsonify({"bookings": robot_bookings})

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
```

**Usage**:
```bash
# Book robot1 for 2 hours starting tomorrow at 2pm
curl -X POST http://lab-server:5000/book_robot \
  -H "Content-Type: application/json" \
  -d '{
    "robot": "robot1",
    "user": "alice",
    "start_time": "2024-01-16T14:00:00",
    "duration": 2
  }'

# Check availability
curl http://lab-server:5000/robots
curl http://lab-server:5000/bookings/robot1
```

---

## Monitoring & Telemetry

### Centralized Logging Architecture

```
All Nodes
    ↓
  (ROS 2)
    ↓
Centralized Logger (ELK Stack)
├─ Elasticsearch (search & indexing)
├─ Logstash (parsing & enrichment)
└─ Kibana (visualization dashboard)
```

### Docker Compose Setup

```yaml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
    ports:
      - "5000:5000/udp"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

### ROS 2 to ELK Integration

```python
# ros2_logger_node.py
import rclpy
from rclpy.node import Node
import socket
import json
from datetime import datetime

class CentralLogger(Node):
    def __init__(self):
        super().__init__('central_logger')
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.logstash_host = "lab-server"
        self.logstash_port = 5000

        # Subscribe to all topics (using bridge if needed)
        self.subscription = self.create_subscription(
            str,
            '/rosout',  # Built-in ROS 2 logging topic
            self.log_callback,
            10
        )

    def log_callback(self, msg):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "node": msg.name,
            "level": msg.level,
            "message": msg.message,
            "robot": self.get_parameter('robot_id').value,
            "lab": "Lab1"
        }

        # Send to Logstash
        self.socket.sendto(
            json.dumps(log_entry).encode(),
            (self.logstash_host, self.logstash_port)
        )

def main(args=None):
    rclpy.init(args=args)
    node = CentralLogger()
    node.declare_parameter('robot_id', 'robot1')
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```

### Monitoring Dashboard (Kibana Queries)

```
# Real-time robot status
GET /logs/_search
{
  "query": {
    "bool": {
      "must": [
        {"match": {"level": "INFO"}},
        {"match": {"robot": "robot1"}}
      ]
    }
  },
  "sort": [{"timestamp": {"order": "desc"}}],
  "size": 100
}

# Error rates by robot (last 24h)
GET /logs/_search
{
  "query": {
    "range": {
      "timestamp": {"gte": "now-24h"}
    }
  },
  "aggs": {
    "by_robot": {
      "terms": {"field": "robot"},
      "aggs": {
        "error_count": {
          "filter": {"match": {"level": "ERROR"}}
        }
      }
    }
  }
}
```

---

## Safety & Access Control

### User Authentication & Authorization

**Setup LDAP/Active Directory for centralized auth**:

```bash
# Install LDAP client
sudo apt install libnss-ldap libpam-ldap ldap-utils

# Configure /etc/ldap.conf
uri ldap://ldap.lab.local
base dc=lab,dc=local
rootbinddn cn=admin,dc=lab,dc=local

# Map LDAP users to lab roles
# /etc/sudoers
%robot_operators ALL=(ALL) /usr/local/bin/robot_control
%developers ALL=(ALL) /usr/local/bin/ros_tools
%admins ALL=(ALL) ALL
```

### Hardware Access Control

**Lock robot power via software**:

```python
# safety_manager.py - validates access before enabling motors
import rclpy
from rclpy.node import Node
from std_srvs.srv import SetBool
import os
import json

class SafetyManager(Node):
    def __init__(self):
        super().__init__('safety_manager')
        self.current_user = os.getenv('ROS_USER', 'unknown')
        self.authorized_users = self.load_authorized_users()

        self.enable_motors_service = self.create_service(
            SetBool,
            'enable_motors',
            self.enable_motors_callback
        )

    def load_authorized_users(self):
        with open('/etc/lab/authorized_users.json') as f:
            return json.load(f)

    def enable_motors_callback(self, request, response):
        if request.data:  # Enable request
            if self.current_user in self.authorized_users['motor_operators']:
                # Check no other user has active booking
                if self.check_robot_available():
                    self.get_logger().info(f"Motors enabled by {self.current_user}")
                    response.success = True
                else:
                    self.get_logger().warn(f"Motors denied: Robot in use")
                    response.success = False
            else:
                self.get_logger().error(f"Unauthorized motor access by {self.current_user}")
                response.success = False
        else:
            response.success = True  # Always allow disable

        return response

    def check_robot_available(self):
        # Query booking system
        return True  # Simplified
```

### E-Stop Network (Hardware-Level)

For critical safety, implement hardware E-stop independent of software:

```
Central E-Stop Panel
    ├─ Wireless transmitter (redundant)
    ├─ Wired kill-switch matrix
    └─ Pendant (local control)
         ↓
    [E-Stop Receiver PCBs on each robot]
    ├─ Cuts motor power relay
    ├─ Logs event
    └─ Requires manual reset
```

---

## Data Management

### Shared Storage Architecture

```
Shared NAS (10 TB+)
├─ /models
│  ├─ URDF definitions
│  ├─ meshes/
│  └─ simulators/gazebo_worlds/
│
├─ /datasets
│  ├─ rosbag recordings
│  ├─ camera calibrations
│  └─ sensor_profiles/
│
├─ /user_projects
│  ├─ alice/
│  │  ├─ slam_tuning/
│  │  └─ capstone_2024/
│  └─ bob/
│      └─ arm_control/
│
└─ /backups
   ├─ daily_snapshots/
   └─ robot_configurations/
```

### Network-Mounted Filesystems

```bash
# Mount shared NAS on all workstations/robots
# /etc/fstab
192.168.1.100:/shared/models    /shared/models   nfs  defaults,_netdev  0 0
192.168.1.100:/shared/datasets  /shared/datasets nfs  defaults,_netdev  0 0
192.168.1.100:/shared/projects  /shared/projects nfs  defaults,_netdev  0 0

# Test mount
mount -a
```

### ROS Bag Collection (Multi-Robot)

```bash
# Collect rosbag data from all robots in one session
ros2 bag record \
  /lab/robot1/sensors/camera \
  /lab/robot1/sensors/lidar \
  /lab/robot2/sensors/camera \
  /lab/robot2/control/trajectory \
  --output-dir /shared/datasets/experiment_001
```

---

## Deployment Patterns

### Pattern 1: Local Single-Robot Development

```
Developer Workstation
    ↓
ssh to robot edge device
    ↓
Develop + test directly on hardware
    ↓
Use local ROS domain ID (isolated from other robots)
```

**Pros**: Direct hardware interaction, simple
**Cons**: No backup if robot lost, limited parallelism

### Pattern 2: Simulation-First, Hardware-Validate

```
Developer Workstation
    ├─ Simulate locally in Gazebo
    ├─ Test control algorithms
    └─ Record test rosbag
         ↓
    Deploy to hardware
    ├─ Run same bag file
    ├─ Compare sensor outputs
    └─ Validate sim-to-real transfer
```

**Pros**: Safe testing, validation, reproducibility
**Cons**: Requires digital twin maintenance

### Pattern 3: Cloud-Assisted Fleet Management

```
Developer Workstation
    ↓
    Push code to Git
    ↓
    CI/CD pipeline (GitHub Actions/Jenkins)
    ├─ Run unit tests
    ├─ Simulation tests
    └─ Build Docker image
         ↓
    Push image to registry
         ↓
    Fleet management server
    ├─ Schedule deployment
    ├─ Update robots incrementally
    └─ Monitor new version
         ↓
    Robot pod updates
    ├─ Download image
    ├─ Validate health checks
    └─ Switchover (zero-downtime)
```

**Pros**: Scalable, automated, safe
**Cons**: Complex setup, requires infrastructure

---

## Operations & Runbooks

### Daily Startup Checklist

```
┌─────────────────────────────────────────┐
│  Lab Startup (8:00 AM)                  │
├─────────────────────────────────────────┤
│ 1. Power on central server              │ 5 min
│    - Check all services (docker ps)     │
│ 2. Check robot battery levels           │ 5 min
│    - Charge any below 50%               │
│ 3. Verify WiFi network availability     │ 2 min
│    - Test connectivity (ping)           │
│ 4. Launch shared services               │ 3 min
│    - ROS 2 master (if using)            │
│    - Logging server                     │
│ 5. Run diagnostics                      │ 5 min
│    - ros2 doctor (check all nodes)      │
│ 6. Check lab calendar for bookings      │ 2 min
│    - Alert staff of high-load times     │
│ Total time: ~20 minutes                 │
└─────────────────────────────────────────┘
```

### Incident Response Playbook

| Incident | Symptoms | Response |
|----------|----------|----------|
| **Robot unresponsive** | No ping, no ROS topics | 1. Check WiFi 2. Hard reset 3. Check battery |
| **Motor failure** | Movement commands ignored | 1. Kill motors 2. Inspect 3. Call repair |
| **Sensor malfunction** | Bad data / no data | 1. Recalibrate 2. Check connection 3. Replace |
| **Network outage** | All robots offline | 1. Check switch 2. Restart firewall 3. Call IT |
| **ROS master crash** | Topic discovery broken | 1. Restart central server 2. Reconnect robots |

### Maintenance Log Template

```
Date: 2024-01-15
Time: 10:00 AM
Robot: robot1
Technician: John

Task Performed:
  - Battery replaced (was 20% capacity)
  - Wheel bearings inspected (OK)
  - Camera recalibrated (new intrinsic params logged)

Issues Found:
  - Wheel 3 bearing slightly worn (monitor)
  - Motor 2 drawing 5% more current (investigate)

Next Maintenance: 2 weeks
```

---

## Performance Tuning

### Network Optimization

```bash
# Increase network buffer sizes (ROS 2 best practice)
sysctl net.core.rmem_max=2097152
sysctl net.core.wmem_max=2097152

# QoS for robotics (20 ms latency target)
ros2 run demo_nodes_py talker --qos-profile=sensor_data
ros2 run demo_nodes_py listener --qos-profile=sensor_data
```

### CPU Affinity (Pin processes to cores)

```bash
# Robot control node runs on cores 0-3, isolated from OS tasks
taskset -c 0-3 ros2 run my_robot robot_controller
```

### GPU Sharing (Multiple simulations)

```bash
# Use GPU time-slicing for virtual GPUs
sudo nvidia-smi -c COMPUTE
```

---

## Scaling Guidelines

| Users | Robots | Central GPU | Network | Monitoring |
|-------|--------|------------|---------|-----------|
| 5-10 | 1-3 | 1x RTX 3060 | 1 Gbps | Basic (Kibana) |
| 20-30 | 3-10 | 2x RTX 4070 | 10 Gbps | ELK + custom |
| 50+ | 10+ | GPU cluster | 10+ Gbps | Kubernetes + observability |

---

## Troubleshooting Common Issues

### Issue: Robots Interfering (Cross-Talk)

**Symptoms**: Topics from robot2 appearing on robot1 subscription

**Solution**:
```bash
# Check ROS_DOMAIN_ID
echo $ROS_DOMAIN_ID

# Each robot should have unique domain
export ROS_DOMAIN_ID=10  # Robot 1
export ROS_DOMAIN_ID=11  # Robot 2
```

### Issue: Network Congestion

**Symptoms**: Packet loss, increased latency, connection timeouts

**Solution**:
```bash
# Check network load
iftop -n

# Reduce sensor data rates
ros2 param set /camera/camera frame_rate 15  # Reduce from 30 FPS
```

### Issue: Shared Storage Slowdown

**Symptoms**: Slow file operations, timeouts

**Solution**:
```bash
# Move hot data to local SSD cache
rsync -av /shared/models/my_robot /local/cache/models

# Use local cache path in code
export GAZEBO_MODEL_PATH=/local/cache/models:/shared/models
```

---

## Summary Checklist for Lab Setup

- [ ] Network topology documented (VLAN, subnets, QoS)
- [ ] ROS 2 naming convention established (namespaces)
- [ ] User authentication system deployed (LDAP/AD)
- [ ] Robot booking system operational
- [ ] Centralized logging (ELK) running
- [ ] Monitoring dashboard accessible
- [ ] Hardware E-stop functional and tested
- [ ] Backup & disaster recovery plan documented
- [ ] Incident response procedures in place
- [ ] Staff trained on safety and procedures
- [ ] Performance baseline established
- [ ] Scaling roadmap defined

---

**Related Resources**:
- [ROS 2 Multi-Machine Setup](https://docs.ros.org/en/humble/Tutorials/Advanced/Security/Access-Control.html)
- [DDS Configuration](https://design.ros2.org/articles/ros_middleware_interface.html)
- [Kubernetes for Robotics](https://kubernetes.io/)
