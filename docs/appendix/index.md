---
title: "Appendix: Resources and References"
description: "Comprehensive reference materials, hardware specifications, and setup guides for Physical AI and Humanoid Robotics course."
sidebar_position: 101
tags: ["appendix", "reference", "hardware", "resources"]
difficulty: beginner
estimated_minutes: 5
---

# Appendix: Resources and References

This appendix provides essential reference materials, hardware specifications, and setup guidance to support your journey through the Physical AI & Humanoid Robotics course.

## Overview

The appendix contains practical resources organized into the following sections:

### Hardware & Lab Setup

- **[Hardware Requirements](/docs/appendix/hardware-requirements)** - Overview of computational and physical requirements
- **[Workstation Specifications](/docs/appendix/workstation-specs)** - Three-tier comparison of system configurations
- **[Edge Device Kit](/docs/appendix/edge-device-kit)** - Component lists for running ROS 2 on edge devices
- **[Robot Lab Options](/docs/appendix/robot-lab-options)** - Three-tier lab setups from simulation to full deployment
- **[Lab Architecture](/docs/appendix/lab-architecture)** - Network topology and multi-user lab configurations

### Learning & Reference

- **[Course Roadmap](/docs/roadmap)** - Week-by-week 13-week schedule with deliverables
- **[Glossary](/docs/glossary)** - 50+ robotics and AI terminology definitions

## Quick Navigation

### For Individual Learners

If you're learning self-paced:

1. Start with [Workstation Specifications](/docs/appendix/workstation-specs) to size your development machine
2. Reference [Edge Device Kit](/docs/appendix/edge-device-kit) if deploying to edge hardware
3. Check [Course Roadmap](/docs/roadmap) to pace yourself
4. Use [Glossary](/docs/glossary) to understand new terms

### For Instructors Setting Up a Lab

If you're running this as a course:

1. Review [Robot Lab Options](/docs/appendix/robot-lab-options) for your tier selection
2. Implement [Lab Architecture](/docs/appendix/lab-architecture) for network setup
3. Customize [Course Roadmap](/docs/roadmap) for your semester
4. Reference [Hardware Requirements](/docs/appendix/hardware-requirements) for purchasing

### For Educators Delivering Remotely

For remote or hybrid delivery:

1. Choose **Simulation-Only** tier in [Robot Lab Options](/docs/appendix/robot-lab-options)
2. Direct students to [Workstation Specifications](/docs/appendix/workstation-specs)
3. Use [Course Roadmap](/docs/roadmap) for synchronous session structure

## Hardware Decision Tree

```
Do you have dedicated lab space?
├─ YES: Review Robot Lab Options (3 tiers)
└─ NO: Use simulation-only (see Workstation Specs for laptop sizing)

Do you want to deploy to physical hardware?
├─ YES: See Edge Device Kit and recommended tier
└─ NO: Recommended or Minimum workstation specs sufficient

Do you need GPU acceleration?
├─ YES: Choose Optimal or Recommended with RTX GPU
└─ NO: Minimum specs for simulation-only work
```

## Cost Estimates

### Development Workstation

| Tier | CPU | RAM | GPU | Approximate Cost |
|------|-----|-----|-----|------------------|
| Minimum | i5/Ryzen 5 | 16 GB | Integrated | $600-900 |
| Recommended | i7/Ryzen 7 | 32 GB | RTX 3060 | $1,200-1,800 |
| Optimal | i9/Ryzen 9 | 64 GB | RTX 4090 | $3,000-5,000 |

### Physical Robot Hardware (per unit)

| Category | Components | Cost Range |
|----------|-----------|------------|
| Mobile Base | Wheeled platform + sensors | $500-2,000 |
| Robotic Arm | 6+ DOF + gripper | $1,000-10,000 |
| Sensor Suite | Cameras, LiDAR, IMU | $500-3,000 |
| Edge Computer | Jetson Orin or similar | $300-1,000 |

See individual appendix files for detailed breakdowns.

## Software Stack Summary

### Core Technologies

All software used in this course is **open-source and free**:

- **ROS 2 Humble** - Middleware and robotics framework
- **Gazebo** - Physics-based simulation
- **Unity** - 3D environment building (free tier available)
- **NVIDIA Isaac Sim** - Photorealistic simulation (free for non-commercial)
- **Python 3.10+** - Primary programming language
- **C++17** - Performance-critical components

### Supported Operating Systems

- **Ubuntu 22.04 LTS** (strongly recommended)
- **Ubuntu 20.04 LTS** (legacy support with caveats)
- **Windows 11 with WSL2** (acceptable for simulation-only)
- **macOS** (limited support, simulation-only)

## Getting Help

### Documentation Resources

- [ROS 2 Official Docs](https://docs.ros.org/en/humble/)
- [Gazebo Tutorials](https://gazebosim.org/docs)
- [NVIDIA Isaac Docs](https://docs.omniverse.nvidia.com/isaacsim/latest/)
- [Python Robotics Documentation](https://pythonrobotics.org/)

### Community Support

- [ROS Discourse Forum](https://discourse.ros.org/) - Active community
- [GitHub Issues](https://github.com/) - Report bugs and request features
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ros) - Tag: `ros` or `ros2`
- Discord Communities - Check README for links

## Troubleshooting Index

### Common Issues by Module

| Issue | Solution Location |
|-------|-------------------|
| ROS 2 installation fails | Hardware Requirements, Glossary (installation) |
| Simulation runs slowly | Workstation Specs (GPU requirements) |
| Network communication issues | Lab Architecture (network setup) |
| Robot arm kinematics problems | Module 3 (Navigation/Manipulation) |
| LLM integration failing | Module 4 (VLA Integration) |

## Recommended Reading Order

For comprehensive understanding, read the appendix in this sequence:

1. **Hardware Requirements** (5 min) - Understand your constraints
2. **Workstation Specifications** (10 min) - Choose your setup
3. **Course Roadmap** (10 min) - Plan your schedule
4. **Glossary** (reference) - Look up terms as needed
5. **Robot Lab Options** (10 min) - If planning hardware deployment
6. **Lab Architecture** (15 min) - If setting up a shared lab

## Keeping Resources Updated

This course is actively maintained. Check back for:

- Updated hardware recommendations (GPUs, boards)
- New vendor partnerships and discounts
- Community-contributed resources and examples
- Corrections and clarifications

**Last Updated**: 2024-Q4

---

**Ready to get started?** Begin with [Hardware Requirements](/docs/appendix/hardware-requirements) or jump to [Module 1](/docs/module-1) if you already have your environment set up.
