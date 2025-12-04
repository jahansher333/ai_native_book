---
title: "Hardware Requirements Overview"
description: "Computational and physical requirements for running ROS 2, Gazebo, Isaac Sim, and physical robotics systems."
sidebar_position: 102
tags: ["hardware", "requirements", "setup", "specifications"]
difficulty: beginner
estimated_minutes: 10
---

# Hardware Requirements Overview

This guide outlines the computational resources and physical hardware needed to complete the Physical AI & Humanoid Robotics course successfully.

## Development Environment Overview

Your development environment needs to support:

1. **ROS 2 Humble** - Lightweight middleware layer
2. **Gazebo 11 or Ignition Fortress** - Physics simulation
3. **NVIDIA Isaac Sim** - Advanced photorealistic simulation
4. **Deep Learning Inference** - Vision models and LLMs

Each increases computational demands progressively.

## Tier Comparison

Quick reference for the three tiers:

| Aspect | Minimum | Recommended | Optimal |
|--------|---------|-------------|---------|
| **CPU** | i5-11400 / Ryzen 5 5600X | i7-12700 / Ryzen 7 5800X3D | i9-13900K / Ryzen 9 7950X |
| **Cores (P+E)** | 6-8 cores | 12-16 cores | 16-24 cores |
| **RAM** | 16 GB | 32 GB | 64 GB |
| **GPU** | Integrated / GTX 1050 | RTX 3060 / RTX 4070 | RTX 4090 / L40S |
| **Storage** | 256 GB SSD | 512 GB SSD | 2 TB NVMe |
| **Typical Cost** | $600-900 | $1,200-1,800 | $3,000-5,000 |

---

## Minimum Configuration

**Best For**: Simulation-only learning, understanding concepts

### Specifications

| Component | Specification | Notes |
|-----------|---------------|-------|
| **CPU** | Intel i5-11400 / AMD Ryzen 5 5600X | 6-8 cores sufficient for basic ROS 2 |
| **RAM** | 16 GB DDR4 | Tight but workable; expect page file use |
| **GPU** | Intel/AMD Integrated or NVIDIA GTX 1050 | CPU rendering acceptable for Gazebo |
| **Storage** | 256 GB SSD | Fast boot and ROS workspace loading |
| **Network** | 1 Gbps Ethernet (recommended) | Sufficient for development |

### What You Can Do

✅ Learn ROS 2 fundamentals
✅ Build URDF models and visualize in RViz2
✅ Run Gazebo simulations with simple scenes
✅ Develop Python nodes and communication patterns
✅ Complete Module 1 and most of Module 2 (Gazebo basics)

### Limitations

❌ Isaac Sim runs very slowly or not at all
❌ Large-scale simulations with many objects slow significantly
❌ Deep learning inference models run in real-time only for small networks
❌ Cannot run multiple simulations concurrently

### Example Hardware

**Laptops**: Dell XPS 13, MacBook Pro 14" (Intel/M2/M3), Lenovo ThinkPad X1 Carbon
**Desktops**: Budget gaming PC, office workstation with discrete GPU upgrade

---

## Recommended Configuration

**Best For**: Full course completion, comfortable workflow, some future headroom

### Specifications

| Component | Specification | Notes |
|-----------|---------------|-------|
| **CPU** | Intel i7-12700K / AMD Ryzen 7 5800X3D | 12-16 cores; multi-threaded ROS 2 work |
| **RAM** | 32 GB DDR4/DDR5 | Comfortable for parallel simulations |
| **GPU** | NVIDIA RTX 3060 Ti / RTX 4070 | 8-12 GB VRAM; Isaac Sim runs acceptably |
| **Storage** | 512 GB NVMe SSD | Fast asset loading for Isaac Sim |
| **Network** | 1 Gbps Ethernet + WiFi 6 | Adequate for lab robots or remote access |

### What You Can Do

✅ Complete all four modules without performance concerns
✅ Run Isaac Sim at 30+ FPS for photorealistic sim
✅ Deploy vision models (ResNet, CLIP) in real-time
✅ Run multiple ROS 2 nodes concurrently
✅ Develop on the same machine and deploy to edge device
✅ Comfortable for graduate student / professional work

### Limitations

⚠️ Large Isaac Sim scenes with many physics interactions may be slower
⚠️ LLM inference (7B+ parameter models) benefits from better GPU
⚠️ Real-time SLAM with high-res camera streams can be bandwidth-heavy

### Example Hardware

**Laptops**: MacBook Pro 16" (M2 Max/Pro), Dell XPS 15 with RTX 4070, ASUS ROG gaming laptop
**Desktops**: Mid-range gaming PC ($1200-1500), workstation with i7/Ryzen 7 + RTX 3060/4070

---

## Optimal Configuration

**Best For**: Research, production deployment, advanced experiments, real-time perception

### Specifications

| Component | Specification | Notes |
|-----------|---------------|-------|
| **CPU** | Intel i9-13900K / AMD Ryzen 9 7950X | 24 cores+; extreme multi-threading |
| **RAM** | 64-128 GB DDR5 | Multiple large models and datasets in memory |
| **GPU** | NVIDIA RTX 4090 / L40S | 24 GB VRAM; maximum throughput |
| **Storage** | 2-4 TB NVMe RAID SSD | Dataset caching, fast model loading |
| **Network** | 10 Gbps Ethernet | Lab or cloud integration |
| **Cooling** | Liquid cooling / high-end air | Sustained performance under load |

### What You Can Do

✅ **Everything** in recommended tier, plus:
✅ Real-time 7B+ parameter LLM inference
✅ Batch process large robotics datasets
✅ Deploy multi-model perception pipelines
✅ Run 5+ simultaneous Isaac Sim instances
✅ High-fidelity photorealistic simulation with advanced physics
✅ Train vision models locally
✅ Research-grade experimentation

### Ideal Use Cases

- Research labs deploying cutting-edge perception
- Production robotics companies
- Competitive robotics teams with extensive simulation needs
- Digital twin development for large-scale systems

### Example Hardware

**Desktops**: High-end gaming PCs ($3,500+), professional workstations (Dell Precision, Lenovo ThinkStation)
**Servers**: GPU servers for on-premises research (8-10x GPU, 256GB+ RAM)

---

## Operating System Requirements

### Strongly Recommended

**Ubuntu 22.04 LTS**
- Best ROS 2 support
- All examples tested on this version
- Latest kernel and drivers
- 5-year support horizon

### Acceptable Alternatives

**Ubuntu 20.04 LTS**
- ROS 2 Humble compatible
- Works but older kernel
- Use only if upgrading is problematic

**Windows 11 + WSL2**
- Simulation-only work
- Install Ubuntu 22.04 inside WSL2
- GPU acceleration limited (WSL2 NVIDIA GPU support is improving)
- Recommended for developers already on Windows

**macOS (Intel/Apple Silicon)**
- Limited toolchain support
- Simulation-only (no Isaac Sim fully native)
- Use Docker or VM for best results
- Acceptable for learning concepts

### Not Recommended

❌ **Windows (native)** - No native ROS 2 support
❌ **CentOS/RHEL** - Different package ecosystem
❌ **Older Ubuntu versions** - Missing dependencies

---

## Network Requirements

### For Individual Development

- **Minimum**: 1 Mbps stable connection (for ROS 2 communication)
- **Recommended**: 100 Mbps+ (for downloading Isaac Sim assets, model weights)
- **Optimal**: 1 Gbps Ethernet direct connection (lab setup)

### For Lab Deployment (Multi-Robot)

See [Lab Architecture](/docs/appendix/lab-architecture) for detailed networking.

Quick summary:
- **Robot Network**: Isolated 2.4/5 GHz WiFi or Ethernet for real robots
- **Development Network**: Separate from robot network
- **Cloud Integration**: 10 Mbps+ for remote monitoring (optional)

---

## Storage Requirements

### Bare Minimum

| Component | Size | Notes |
|-----------|------|-------|
| Ubuntu 22.04 LTS | 5 GB | Base OS |
| ROS 2 + build tools | 2 GB | colcon, dependencies |
| Gazebo 11 | 1 GB | Simulation engine |
| Course materials | 500 MB | Code examples, models |
| **Total** | **~10 GB** | Tight but possible |

### Comfortable (Recommended)

| Component | Size |
|-----------|------|
| Ubuntu + full dev tools | 10 GB |
| ROS 2 + multiple pkgs | 5 GB |
| Gazebo + assets | 3 GB |
| Isaac Sim (with assets) | 50-80 GB |
| Python ML libraries | 10 GB |
| Course materials + projects | 5 GB |
| **Total** | **~100-150 GB** |

### Optimal (Research/Production)

| Component | Size |
|-----------|------|
| Full development stack | 30 GB |
| Isaac Sim + extensive libraries | 100-150 GB |
| ML models (LLMs, vision) | 50-100 GB |
| Simulation datasets | 100-500 GB |
| Project outputs | 50-100 GB |
| **Total** | **500 GB - 2 TB+** |

**Recommendation**: Use external SSD for Isaac Sim and model storage; keep OS/ROS on internal NVMe.

---

## Physical Hardware (Optional, for Real Robots)

If deploying to actual robots (not just simulation):

### Minimum Robot Setup

| Component | Cost | Purpose |
|-----------|------|---------|
| Mobile base (e.g., Clearpath Husky) | $1,000-2,000 | Platform for algorithms |
| Edge computer (Jetson Orin) | $500-800 | Onboard inference |
| Sensor kit (camera, LiDAR, IMU) | $500-1,500 | Perception |
| **Subtotal** | ~$2,500 | Single robot |

### Recommended Lab Setup (3-5 robots)

- Multiple robot platforms: $4,000-8,000
- Charging dock and maintenance: $1,000-2,000
- Network infrastructure: $1,000-2,000
- Safety systems (enclosure, E-stop): $500-1,000
- **Total**: $7,000-13,000

See [Robot Lab Options](/docs/appendix/robot-lab-options) for detailed tier configurations.

---

## Network Bandwidth for Sensors

Real-time sensor data streams require sufficient bandwidth:

| Sensor | Bandwidth | Notes |
|--------|-----------|-------|
| LiDAR (16-channel, 10 Hz) | 10-20 Mbps | High bandwidth |
| RGB Camera (1080p, 30 FPS) | 30-100 Mbps | Compressed helpful |
| Depth Camera (640x480, 30 FPS) | 10-50 Mbps | Moderate bandwidth |
| IMU (100 Hz) | 1-2 Mbps | Minimal |

**Key Insight**: If multiple robots stream data to a central processing node, ensure network capacity (1 Gbps Ethernet minimum for 3+ robots with full sensors).

---

## Power Supply Considerations

### Development Machine

| Tier | TDP | PSU Recommendation |
|------|-----|-------------------|
| Minimum | 65-125 W | 550-650 W |
| Recommended | 150-250 W | 750-850 W |
| Optimal | 350-500 W | 1000-1200 W |

**Tip**: Use `nvidia-smi` (GPU) and `sensors` or `lm-sensors` (CPU) to monitor actual power consumption.

### Real Robots

- **Mobile base**: 12-48V LiPo batteries, 5,000-20,000 mAh
- **Jetson Orin**: 12-19V 10A PSU recommended
- **Charging infrastructure**: Plan for 4-8 hour charge times

---

## Thermal Considerations

### Development Machine

| Tier | CPU Temp | GPU Temp | Case Type | Cooling |
|------|----------|----------|-----------|---------|
| Minimum | <85°C | <80°C | Standard tower | Stock cooler + case fans |
| Recommended | <75°C | <70°C | Mid-tower | Aftermarket air or AIO |
| Optimal | <60°C | <65°C | Full-tower | Liquid cooling recommended |

### Edge Devices (Jetson Orin)

- Typical operating: 50-70°C
- Passive heatsink + small case fan adequate
- Active cooling (5V fan) beneficial in warm environments

---

## Summary: Quick Decision Matrix

**Ask yourself**:

1. **Do I have a budget of $600-900?** → Use **Minimum** tier
2. **Do I have a budget of $1,200-1,800?** → Use **Recommended** tier
3. **Do I have a budget of $3,000+?** → Use **Optimal** tier

**Follow-up**:

4. **Am I deploying physical robots?** → Add edge hardware cost (~$2,500-3,000 per robot)
5. **Am I setting up a lab for 5+ students?** → See [Lab Architecture](/docs/appendix/lab-architecture)

---

## Vendor Recommendations

This course avoids affiliate links but recommends purchasing from:

### Computers & Components

- **B&H Photo Video** - Reliable, competitive pricing
- **Micro Center** - Local pickup options
- **Amazon** - Fast shipping, good return policy
- **Newegg** - Component-level selection
- **Dell/HP/Lenovo Official Sites** - Direct warranty support

### Robotics Hardware

- **Clearpath Robotics** - Professional platforms (Husky, Warthog)
- **Universal Robots** - Collaborative arms
- **Pal Robotics** - Research-grade bipeds
- **Boston Dynamics** - Spot quadruped (advanced)
- **Community projects** - DIY platforms on GitHub

### Edge Devices

- **NVIDIA Jetson Developer Kits** - Official source for Orin, Xavier
- **Arrow Electronics** - Authorized NVIDIA distributor
- **Local system integrators** - Custom Jetson systems

---

## Checking Your Current System

Run these commands to assess your current machine:

```bash
# CPU info
lscpu

# RAM info
free -h

# GPU info (if NVIDIA)
nvidia-smi

# Disk space
df -h

# Ubuntu version
lsb_release -a
```

Compare output to the tiers above. Most modern laptops (2019+) meet **Minimum** requirements.

---

## Getting Started

Once you've sized your hardware:

1. **Minimum tier?** → Start with [Module 1: ROS 2 Fundamentals](/docs/module-1) (simulation-only)
2. **Recommended tier?** → Full course path, including Isaac Sim in [Module 3](/docs/module-3)
3. **Optimal tier?** → Consider research applications; read [Advanced Robotics Patterns](/docs/module-4)

---

**Next Steps**:
- [Workstation Specifications](/docs/appendix/workstation-specs) - Detailed hardware components
- [Edge Device Kit](/docs/appendix/edge-device-kit) - Deploy to robots
- [Course Roadmap](/docs/roadmap) - Plan your learning journey
