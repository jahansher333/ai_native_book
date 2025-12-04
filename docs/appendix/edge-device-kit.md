---
title: "Edge Device Kit"
description: "Component lists and setup guides for deploying ROS 2 to edge devices including Jetson boards, mobile robots, and embedded systems."
sidebar_position: 104
tags: ["edge-computing", "jetson", "embedded", "hardware", "deployment"]
difficulty: intermediate
estimated_minutes: 20
---

# Edge Device Kit

This guide covers hardware components and setup procedures for deploying ROS 2 to edge devices—the onboard computers that run inference, navigation, and control algorithms on physical robots.

## Overview

Edge devices form the "brain" of deployed robots, handling:

- **Onboard Perception**: Real-time vision processing, LiDAR, sensor fusion
- **Navigation & Mapping**: SLAM, path planning, obstacle avoidance
- **Local Control**: Motor control, gripper operation, safety systems
- **LLM Inference**: Voice commands, natural language understanding (smaller models)

These devices must balance:
- **Computational Power**: Handle real-time perception and ML inference
- **Thermal Management**: Sustained operation in various environments
- **Power Efficiency**: Minimize battery drain
- **Physical Space**: Fit within robot chassis constraints

---

## Tier 1: Minimal Edge (Hobbyist)

**Best For**: Learning, simulation-only transition to hardware, very cost-constrained projects

### Bill of Materials

| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| **Main Board** | Raspberry Pi 5 (8GB) | $65 | Limited ML capability |
| **PSU** | 27W USB-C | $20 | Official recommended |
| **Storage** | 128GB microSD | $15 | Fast Class 3 |
| **Cooling** | Active heatsink + fan | $25 | Required for sustained load |
| **Enclosure** | Aluminum case | $30 | Passive heat dissipation |
| **Power Distribution** | 5V/5A buck converter | $10 | Robot integration |
| **Wireless** | WiFi 6E (onboard) | - | Built into Pi 5 |
| | | **$165** | |

### Specifications

| Spec | Details |
|------|---------|
| **CPU** | Broadcom BCM2712 (8 cores, 3.0 GHz) |
| **RAM** | 8 GB LPDDR5X |
| **GPU** | VideoCore VII (4-core) |
| **Storage** | microSD slot (up to 1TB) |
| **USB** | 2x USB 3.0 + microSD |
| **Network** | WiFi 6E 802.11ax, Bluetooth 5.3 |
| **Power** | 27W typical (35W peak) |
| **Thermal** | 50-70°C typical (with cooling) |

### ROS 2 Capabilities

✅ **Supported**:
- ROS 2 Humble (native ARM64)
- Basic SLAM (cartographer-lite)
- Camera/USB sensor support
- Python node execution

⚠️ **Constrained**:
- GPU-accelerated inference (limited by VideoCore VII)
- LiDAR processing (bandwidth/CPU limited)
- Large vision models (memory constrained)

❌ **Not Suitable For**:
- Real-time dual vision streams
- Large language models (too slow)
- Complex physics simulation
- NVIDIA Isaac Sim or CUDA-dependent code

### Installation

```bash
# 1. Flash Raspberry Pi OS 64-bit with Raspberry Pi Imager
# 2. Boot and SSH into device
# 3. Install ROS 2 Humble for ARM64

sudo apt update && sudo apt upgrade -y
sudo apt install curl gnupg lsb-release ubuntu-keyring -y
curl https://repo.ros2.org/ros.key | sudo apt-key add -
sudo sh -c 'echo "deb [arch=arm64] http://packages.ros2.org/ros2/ubuntu `lsb_release -cs` main" > /etc/apt/sources.list.d/ros2-latest.list'

sudo apt update
sudo apt install -y ros-humble-desktop

# 4. Configure environment
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

### Performance Metrics

| Workload | FPS / Throughput |
|----------|-----------------|
| ROS 2 node chaining (10 nodes) | 100 Hz |
| USB camera (1080p, 30 FPS) | 25-30 FPS capture |
| MobileNet v2 inference (224x224) | 5-8 FPS |
| YOLO v8 nano (320x320) | 2-3 FPS |
| Simple SLAM (cartographer-lite) | 10-15 Hz loop rate |

### Power Budget

| State | Power Draw |
|-------|-----------|
| Idle (WiFi on) | 3-5 W |
| ROS 2 nodes (no ML) | 8-12 W |
| Camera streaming | 12-15 W |
| Camera + MobileNet inference | 20-25 W |
| Peak (all subsystems) | ~35 W |

### Typical Battery Life

With 26650 battery (typical mobile robot):
- Capacity: 5000 mAh @ 3.7V = 18.5 Wh
- Duration @ 10W average: **~1.8 hours**
- Duration @ 20W average: **~0.9 hours**

---

## Tier 2: Standard Edge (Professional / Research)

**Best For**: Production robotics, research deployment, multi-sensor fusion, moderate ML inference

### Bill of Materials

| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| **Main Board** | NVIDIA Jetson Orin Nano 8GB | $249 | Excellent ROS 2 support |
| **Carrier Board** | Jetson Orin Nano Dev Kit | Included | Or custom third-party |
| **PSU** | 19V / 10A (190W) | $50 | Barrel connector |
| **Storage** | 512GB NVMe SSD (PCIe Gen3) | $50 | Much faster than eMMC |
| **Active Cooling** | Thermal pad + heatsink | $40 | Critical for sustained load |
| **Fan Controller** | PWM temperature fan | $15 | Active thermal mgmt |
| **Enclosure** | IP54 aluminum box | $80 | Environmental protection |
| **Power Distribution** | 19V to 5V/12V buck converters | $30 | Multi-voltage rail |
| **Wireless** | M.2 WiFi 6 card (RTL8852) | $25 | Upgrade from onboard 2.4GHz |
| | | **$539** | |

### Specifications

| Spec | Orin Nano 8GB |
|------|---------------|
| **CPU** | 8-core ARM64 (up to 3.5 GHz) |
| **GPU** | 1024 CUDA cores (Tegra) |
| **Tensor Cores** | Yes (64) |
| **RAM** | 8 GB 256-bit LPDDR5 |
| **Max Power** | 15W (configurable: 5-15W) |
| **Storage** | 64GB eMMC + 512GB NVMe (added) |
| **Thermal** | 60-75°C typical (with cooling) |
| **Jetpack** | 5.x (Ubuntu 22.04 base) |

### ROS 2 Capabilities

✅ **Fully Supported**:
- ROS 2 Humble with CUDA support
- GPU-accelerated perception (Isaac ROS)
- Real-time multi-sensor fusion
- Dual video streams (1080p each)
- Real-time SLAM (NVIDIA ISAAC SLAM)
- MobileNet/YOLOv8/ResNet inference (real-time)
- LLM inference (small models, 3-7B quantized)

✅ **Advanced**:
- ROS 2 Nav2 with local costmap GPU acceleration
- Isaac Manipulator (for arm control)
- Tegra VIC (video codec acceleration)
- CUTLASS for tensor operations

⚠️ **Constrained**:
- Full-size LLMs (7B+ unquantized)
- Multiple high-resolution camera streams
- Complex 3D perception pipelines (benefit from Orin NX/AGX)

### Installation

```bash
# 1. Download Jetpack 5.1.1 from NVIDIA
# https://developer.nvidia.com/embedded/jetpack-sdk-511

# 2. Flash using SDK Manager (Windows/Linux/Mac) or via USB-C

# 3. Boot Orin Nano and complete onboarding

# 4. Install ROS 2 Humble and Isaac ROS
source /opt/ros/humble/setup.bash
sudo apt update
sudo apt install ros-humble-isaac-ros-object-detection

# 5. Configure Jetpack power mode
sudo /usr/sbin/nvpmodel -m 0  # Maximum performance
# Or: -m 1 (15W power envelope)
```

### Performance Metrics

| Workload | Performance |
|----------|-------------|
| YOLO v8 inference (640x480) | 15-20 FPS |
| ResNet-50 inference | 10-15 FPS |
| MobileNet v2 inference | 30-40 FPS |
| Real-time SLAM | 30 Hz loop rate |
| Dual camera (1080p each, 30 FPS) | 25-30 FPS sustained |
| LLM inference (3B Quantized) | 10-15 tokens/sec |
| ROS 2 node density | 50-100 concurrent nodes |

### Power Budget

| State | Power (W) |
|-------|-----------|
| Idle (CPU parked) | 1-2 W |
| ROS 2 nodes (no ML) | 4-6 W |
| Video capture (1080p) | 6-8 W |
| MobileNet inference | 10-12 W |
| ResNet-50 inference | 12-14 W |
| Peak (multi-model) | ~15 W |

### Battery Considerations

With 6S 10000 mAh battery (37V nominal, 370 Wh total):
- Voltage stepdown to 19V gives ~19.5A capacity @ 19V
- Duration @ 10W: **~37 hours** (unrealistic sustained, thermal bound)
- Duration @ 12W: **~31 hours** effective
- Practical continuous operation: **4-6 hours** (thermal/mission bound)

---

## Tier 3: High-Performance Edge (Research / AGX)

**Best For**: Advanced research, multi-robot coordination, real-time perception suites, production deployment

### Bill of Materials

| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| **Main Board** | NVIDIA Jetson Orin NX 16GB | $749 | Or Orin AGX for extreme |
| **Carrier Board** | Official developer kit or third-party | $200-500 | Robotics-focused carriers available |
| **PSU** | 19V / 20A (380W) | $100 | Higher capacity |
| **Storage** | 1TB NVMe SSD + 512GB backup | $150 | Redundancy + dataset caching |
| **Cooling** | Liquid cooler or advanced HSF | $150 | Sustained peak performance |
| **Thermal Interface** | Graphite thermal pads | $30 | Superior heat conductivity |
| **Enclosure** | Custom aluminum chassis | $200-500 | Application-specific |
| **Power Distribution** | Multi-output PSU module | $80 | 5V, 12V, 19V rails |
| **Wireless** | Dual WiFi cards (band + LTE) | $80 | LTE fallback for field deployment |
| **Monitoring** | PMBus current/voltage sensors | $50 | Thermal-aware load balancing |
| | | **$1,789** | (mid-range estimate) |

### Specifications (Orin NX 16GB)

| Spec | Details |
|------|---------|
| **CPU** | 8-core ARM64 Cortex-A78AE (3.5 GHz) |
| **GPU** | 8-core NVIDIA CUDA GPU (1024 cores) |
| **Tensor Cores** | 256 tensor cores |
| **RAM** | 16 GB 256-bit LPDDR5X (133 GB/s bandwidth) |
| **Max Power** | 25W (configurable: 5-25W) |
| **Storage** | 512GB eMMC + 1TB NVMe |
| **Thermal** | 50-70°C sustainable |
| **Jetpack** | 5.x (Ubuntu 22.04) |

### ROS 2 Capabilities

✅ **Everything from Tier 2, plus**:
- Multiple real-time perception pipelines
- LLM inference (7B models efficiently)
- SLAM + Nav2 with GPU acceleration
- Real-time dual-arm robot control
- Distributed computing (gateway node)
- Complex sensor fusion (10+ sensors)
- Video encoding/streaming (H.264, H.265)

✅ **Advanced Deployments**:
- Fleet management (multi-robot coordination)
- Cloud offloading with local fallback
- Continuous learning on device
- Real-time video analytics

### Installation

```bash
# Similar to Orin Nano, but with higher memory and compute headroom
# Jetpack 5.1.1 (Ubuntu 22.04-based)

# Enable maximum performance
sudo /usr/sbin/nvpmodel -m 0

# Install development headers
sudo apt install -y nvidia-cuda-dev nvidia-cudnn

# ROS 2 + Isaac ROS with GPU acceleration
source /opt/ros/humble/setup.bash
sudo apt install ros-humble-isaac-ros-dev
```

### Performance Metrics

| Workload | Performance |
|----------|-------------|
| YOLO v8x inference (640x480) | 20-30 FPS |
| ResNet-152 inference | 15-25 FPS |
| Dual SLAM streams | 30 Hz each |
| Quad camera (1080p) | 20-25 FPS aggregate |
| LLM inference (7B quantized) | 20-25 tokens/sec |
| Real-time depth fusion | 15-30 FPS |
| ROS 2 node density | 100+ concurrent nodes |

### Power Budget

| State | Power (W) |
|-------|-----------|
| Idle | 2-3 W |
| ROS 2 nodes | 6-8 W |
| Single model inference | 12-15 W |
| Multiple models (YOLO + ResNet) | 18-22 W |
| Peak multi-model + SLAM | ~25 W |

---

## Comparison Table: All Tiers

| Aspect | Tier 1 (Pi 5) | Tier 2 (Orin Nano) | Tier 3 (Orin NX) |
|--------|--------------|-------------------|-----------------|
| **Cost** | $165 | $539 | $1,789 |
| **GPU VRAM** | Shared system RAM | 8 GB | 16 GB |
| **CUDA Cores** | 0 | 1024 | 1024 |
| **Peak Power** | 35 W | 15 W | 25 W |
| **SLAM Real-Time** | Limited | Yes (30 Hz) | Yes (30+ Hz) |
| **Vision Inference** | Basic | Real-time | Real-time+ |
| **LLM Capable** | No | Small quantized | 7B quantized |
| **Production Ready** | No | Yes | Yes |
| **Battery Duration (typical)** | 2-3 hours | 4-6 hours | 4-6 hours |

---

## Generic Components (Any Tier)

Regardless of edge tier, these components are universally needed:

### Sensors

| Sensor | Cost | Bus | Notes |
|--------|------|-----|-------|
| RGB Camera | $20-100 | USB 3.0 / CSI | Start with USB for compatibility |
| Depth Camera (RealSense) | $100-300 | USB 3.0 | Good Intel ROS 2 support |
| LiDAR 2D (RPLIDAR) | $100-200 | USB / Serial | Classic SLAM sensor |
| LiDAR 3D (Velodyne Puck) | $500-1000 | Ethernet | Professional grade |
| IMU (9-DOF) | $20-50 | I2C / SPI | Sensor fusion critical |
| Magnetometer | $10-30 | I2C | Heading reference |

### Power Management

| Component | Cost | Purpose |
|-----------|------|---------|
| LiPo battery (5S 10000mAh) | $80-150 | Main power storage |
| XT60 connectors | $5-10 | High-amperage connections |
| Battery management system (BMS) | $20-50 | Cell balancing, cutoff |
| Power distribution board (PDB) | $15-30 | Multiple voltage rails |
| Current sensors (ACS712) | $5-10/ea | Monitoring per subsystem |
| Buck converters (12V, 5V) | $10-20/ea | Voltage regulation |

### Motor Control

| Component | Cost | Robot Type |
|-----------|------|-----------|
| Motor drivers (L298N / TB6612) | $5-15/ea | DC motor control |
| Servo controller | $20-40 | Arm/gripper actuation |
| PWM frequency controller | $15-30 | Smooth speed control |
| Encoder interface board | $10-25 | Odometry feedback |

### Network & Communication

| Component | Cost | Notes |
|-----------|------|-------|
| WiFi 6 M.2 card | $20-40 | Significantly better throughput |
| Ethernet cable (shielded, long) | $20-50 | Reduces EMI from motors |
| Serial converter (USB-UART) | $5-10 | Legacy sensor integration |
| CAN transceiver | $15-30 | Multi-robot coordination |

---

## Setup Workflow

### Step 1: Choose Your Tier

```
Learning / Hobby?     → Tier 1 (Raspberry Pi 5)
Research / Deployment?  → Tier 2 (Jetson Orin Nano)
Production / Multi-Sensor? → Tier 3 (Jetson Orin NX)
```

### Step 2: Procure Core Board

Purchase from authorized distributors:
- NVIDIA: Direct from official Jetson site
- Raspberry Pi: Pi resellers (Official store, Adafruit, Sparkfun)
- Third-party carriers: Check robotics forums for recommendations

### Step 3: Assemble Support Hardware

1. Flash OS (Jetpack for NVIDIA, Raspberry Pi OS for Pi)
2. Connect cooling solution (heatsink + fan)
3. Install storage (NVMe SSD via adapter)
4. Wire power management (PSU → buck converters → board)
5. Connect wireless (WiFi antenna, optional cellular)

### Step 4: Install ROS 2

Follow distribution-specific installation (see tier sections above).

### Step 5: Sensor Integration

```bash
# Example: Connect RealSense depth camera
sudo apt install ros-humble-realsense2-camera
ros2 launch realsense2_camera rs_launch.py

# Example: Connect LiDAR
sudo apt install ros-humble-rplidar-ros
ros2 launch rplidar_ros rplidar_a1_launch.py
```

### Step 6: Thermal Testing

Run sustained load and monitor temperatures:

```bash
# Monitor CPU/GPU temperature (Jetson)
while true; do
  cat /sys/devices/virtual/thermal/thermal_zone0/temp
  sleep 1
done

# Or use nvidia-smi (GPU stats)
watch -n 1 nvidia-smi
```

Target: Stay below 75°C continuous; peak <85°C acceptable.

### Step 7: Battery Integration

Verify power draw matches battery capacity:
```
Battery Capacity (Wh) / Average Power (W) = Runtime (hours)
```

Example: 370 Wh battery, 10W average = 37 hour theoretical max
Practical: 60-70% of theoretical (losses, thermal limits) = 4-6 hours

---

## Thermal Management Best Practices

### Passive Cooling

- Quality thermal pads (not cheap ones)
- Heatsink with sufficient fin area (>20 cm²)
- Chassis ventilation (convection paths)
- Placement away from heat sources (motors)

Achievable: 60-70°C sustained @ 10-15W workload

### Active Cooling

- 50-60mm PWM fan (temperature-controlled)
- Duct airflow optimization
- Thermal interface material (graphite pads superior to tape)

Achievable: 50-60°C sustained @ 15W workload

### Liquid Cooling (Extreme)

- Custom loop for high-end deployments
- Significant weight/volume penalty
- Overkill for typical Tier 2/3 robotics

Achievable: 40-50°C sustained @ 25W+ workload

---

## Power Efficiency Tips

1. **CPU Clock Scaling**: Use `cpufreq` to scale down when not needed
2. **GPU Power Gating**: Enable low-power cores only when necessary
3. **WiFi Duty Cycling**: Reduce transmit power if range permits
4. **Sensor Batching**: Request data at minimum necessary rate
5. **Precision Reduction**: Use FP16 inference instead of FP32 where possible

Example power savings:
- Clock scaling: 5-10% reduction
- GPU sleep mode: 20-30% reduction
- Sensor batching: 10-15% reduction
- FP16 inference: 30-40% reduction (plus 2x speed improvement)

---

## Troubleshooting

### Issue: Thermal Throttling (Performance Drops)

**Symptoms**: FPS drop, ROS 2 lag, inference speed decrease
**Cause**: Temperature exceeds ~80°C
**Solution**:
1. Improve cooling (upgrade heatsink/fan)
2. Reduce power envelope (set nvpmodel to lower mode)
3. Add ventilation (ensure airflow, avoid enclosure sealing)

### Issue: Brownout / Power Reset

**Symptoms**: Device randomly reboots or freezes
**Cause**: Insufficient current from PSU during peak load
**Solution**:
1. Upgrade PSU (add 50% headroom)
2. Add bulk capacitance (470µF+) near power input
3. Use quality XT60 connectors (resistance causes voltage drop)

### Issue: Wireless Dropouts

**Symptoms**: Intermittent ROS 2 topic losses
**Cause**: WiFi interference or weak signal
**Solution**:
1. Switch band (2.4 GHz → 5 GHz)
2. Improve antenna placement
3. Use shielded Ethernet cable instead if stationary

### Issue: Sensor Communication Timeout

**Symptoms**: Camera/LiDAR nodes fail to start
**Cause**: USB bus current limit or driver issue
**Solution**:
1. Use powered USB hub (5V 2A per port)
2. Verify device firmware is current
3. Check dmesg for kernel errors: `dmesg | grep -i usb`

---

## Field Deployment Checklist

Before deploying edge device to physical robot:

- [ ] Thermal testing completed (sustained load stable)
- [ ] Battery life verified (real-world mission duration)
- [ ] All sensors calibrated and communicating
- [ ] ROS 2 launch files tested (5+ consecutive starts)
- [ ] Network connectivity verified (WiFi + fallback)
- [ ] Power management script deployed (auto-shutdown on low battery)
- [ ] Logs configured (roslog directory with rotation)
- [ ] Safety E-stop wired and functional
- [ ] Enclosure sealed (IP54 minimum if outdoor)
- [ ] Documentation created (device config, wake-up sequence)

---

## Cost Summary

### Total Cost to Deploy (Single Robot)

| Component | Tier 1 | Tier 2 | Tier 3 |
|-----------|--------|--------|--------|
| Main board | $65 | $249 | $749 |
| Support (PSU, cooling, storage) | $100 | $290 | $880 |
| Sensors (camera, LiDAR, IMU) | $200-500 | $500-800 | $500-1500 |
| Motors & actuators | $200-400 | $300-600 | $500-1000 |
| Power management (battery, BMS) | $150-250 | $150-250 | $200-300 |
| Chassis & enclosure | $100-300 | $200-500 | $300-800 |
| **Total** | **$815-1,715** | **$1,689-3,189** | **$2,529-5,529** |

Most projects at this level have 3-5 robots, multiplying total lab cost by 3-5x.

---

## Next Steps

1. **Choose Tier**: Based on application (learning vs. deployment)
2. **Procure Hardware**: Order main board + support components
3. **Assemble**: Follow tier-specific setup instructions
4. **Test Thermal**: Verify cooling under load
5. **Integrate Sensors**: Connect and calibrate
6. **Deploy**: See [Lab Architecture](/docs/appendix/lab-architecture) for multi-robot setup

---

**Related Resources**:
- [NVIDIA Jetson Developer Documentation](https://developer.nvidia.com/embedded/learn)
- [Raspberry Pi Official Guide](https://www.raspberrypi.com/documentation/)
- [ROS 2 Hardware Compatibility](https://docs.ros.org/en/humble/)
