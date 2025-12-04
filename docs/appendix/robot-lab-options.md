---
title: "Robot Lab Options"
description: "Three-tier lab configurations from simulation-only to full physical robot deployment, with cost estimates and setup guidance."
sidebar_position: 105
tags: ["lab-setup", "robotics", "hardware", "infrastructure"]
difficulty: intermediate
estimated_minutes: 20
---

# Robot Lab Options

This guide presents three configuration tiers for educational and research robotics labs, ranging from pure simulation to full physical deployment with multiple robots.

## Overview

The three tiers allow different budgets and pedagogical goals:

1. **Simulation-Only Lab** - Ideal for remote learning, initial concepts, budget-constrained
2. **Hybrid Lab** - Mix of simulation and physical robots, research-oriented
3. **Full Production Lab** - Complete robotic ecosystem, enterprise deployment ready

Each tier builds on previous capabilities and infrastructure.

---

## Tier 1: Simulation-Only Lab

**Best For**: Remote/online courses, initial learning, budget <$10K, concepts before hardware

### Learning Objectives

Students can complete:
- ✅ Module 1 (ROS 2 fundamentals) - 100%
- ✅ Module 2 (Digital twins) - 100%
- ✅ Module 3 (Isaac AI) - 100% simulation
- ⚠️ Module 4 (VLA) - 90% (no hardware deployment)

### Infrastructure Requirements

#### Computing Infrastructure

| Component | Specification | Qty | Notes |
|-----------|---------------|-----|-------|
| Student laptops/workstations | Recommended tier (see Workstation Specs) | 1 per student | Can be remote |
| Server (optional) | 2-4 GPU, 128GB RAM | 1 | For centralized Isaac Sim runs |
| Network | 1 Gbps Ethernet + WiFi 5+ | Required | For download/collaboration |

#### Physical Space

| Item | Specification |
|-----|--------------|
| **Classroom** | Standard computer lab (25-30 seats) |
| **Per-Desk** | Monitor + keyboard/mouse (shared monitors acceptable) |
| **Cooling** | Standard HVAC (GPU labs generate heat) |
| **Power** | 2-3 outlets per desk (monitor + laptop + charging) |
| **Networking** | WiFi + Ethernet (prefer wired during presentations) |
| **Storage** | Secure cabinet for equipment (optional) |

#### Software Stack

| Software | Version | Cost | Purpose |
|----------|---------|------|---------|
| Ubuntu 22.04 LTS | Latest | Free | Base OS |
| ROS 2 Humble | Humble | Free | Middleware |
| Gazebo 11 | Latest | Free | 3D physics sim |
| Unity 2022+ | LTS | Free (educational) | Env building |
| NVIDIA Isaac Sim | 2023.1+ | Free (non-commercial) | Photorealistic sim |
| Python 3.10+ | Latest | Free | Development |
| VS Code / PyCharm | Latest | Free/paid | IDE |

### Lab Setup

```
Simulation Lab Architecture
═════════════════════════════════════════════════════════════

┌─ Student Workstation 1
│  ├─ Ubuntu 22.04
│  ├─ ROS 2 + tools
│  ├─ Gazebo / Isaac Sim (local)
│  └─ IDE (VS Code/PyCharm)
│
├─ Student Workstation 2..30
│  └─ Same as above
│
├─ Lab Server (Optional Central Sim)
│  ├─ Powerful GPU workstation
│  ├─ Shared Isaac Sim instances
│  └─ Model/asset cache
│
└─ Network
   ├─ WiFi 6 (802.11ax)
   └─ 1 Gbps Ethernet backbone
```

### Cost Estimate

| Category | Cost | Notes |
|----------|------|-------|
| **Computing** | |
| 25 student laptops (Recommended tier) | $30,000 | $1,200 each; reusable |
| **Network** | |
| WiFi 6 APs (5 units) | $1,500 | $300 each; mesh preferred |
| Ethernet backbone (switches, cabling) | $500 | One-time investment |
| **Software** | |
| Licenses | $0 | All open-source/free tier |
| **Furniture** | |
| Desks, chairs (25 stations) | $5,000 | $200 per station |
| Cable management, power strips | $500 | |
| **Optional: Central Server** | |
| High-end GPU workstation | $5,000 | Shared Isaac Sim host |
| **Total Startup Cost** | **$42,500** | Per 25-student lab |
| **Per-Student Cost** | **$1,700** | Over 4-year amortization: $425/year |

### Advantages

- ✅ Low capital cost (mostly laptops, reusable elsewhere)
- ✅ No safety infrastructure needed
- ✅ Easy remote/hybrid delivery
- ✅ Students keep equipment (take-home use)
- ✅ Scales easily (add laptops = add capacity)
- ✅ Perfect for online courses

### Limitations

- ❌ No physical robot experience
- ❌ Simulation doesn't capture all real-world challenges (friction, sensor noise, timing)
- ❌ Students may feel less engaged (abstract)
- ❌ Capstone projects lack hardware validation

### Recommended Course Modifications

For Simulation-Only delivery:
1. **Module 4 Capstone**: Build most realistic digital twin possible, validate control algorithms in sim
2. **Guest Speakers**: Invite roboticists to discuss sim-to-real transfer
3. **Student Projects**: Encourage open-source ROS 2 packages (GitHub portfolio building)
4. **Competitions**: Simulate competitions (ARC, SORRT) for engagement

### Setup Timeline

- **Week 1**: Order laptops, configure OS images
- **Week 2-3**: Deploy/image machines, network setup
- **Week 4**: ROS 2 installation testing
- **Week 5**: Course launch

**Total: 4-5 weeks** (parallel procurement)

---

## Tier 2: Hybrid Lab (Simulation + 3-5 Robots)

**Best For**: Research programs, mixed student/professional projects, budget $30-80K

### Learning Objectives

Students can complete:
- ✅ Module 1 (ROS 2 fundamentals) - 100%
- ✅ Module 2 (Digital twins) - 100%
- ✅ Module 3 (Isaac AI) - 100%
- ✅ Module 4 (VLA) - 100% with hardware validation

### Physical Robots (Choose One or Mix)

#### Mobile Base Options

| Platform | Cost | Features | Best For |
|----------|------|----------|----------|
| **TurtleBot 3 Burger** | $300 | Simple, educational | Nav2 intro |
| **Clearpath Husky** | $3,000-5,000 | Rugged, outdoor-capable | Advanced nav |
| **Spot (Boston Dynamics)** | $150,000+ | Quadruped, autonomous | Research only |
| **Custom wheeled platform** | $1,000-2,000 | Custom sensing/size | Specific research |

#### Manipulator Options

| Platform | Cost | DOF | Features | Best For |
|----------|------|-----|----------|----------|
| **UR10e (Universal Robots)** | $35,000 | 6 | Collaborative, precise | Manipulation |
| **Franka Emika Panda** | $30,000 | 7 | Research arm, open-source | Grasping/SLAM |
| **DIY 6-DOF arm** | $2,000-5,000 | 6 | Custom control | Learning/research |

### Recommended Configuration

For a **research/teaching hybrid lab**:

```
3-5 Mobile Bases + Optional Arms

Configuration Option A (Budget):
  3x TurtleBot 3 + docking station = $1,000
  + 1x Franka arm = $30,000
  → Total robot hardware: $31,000

Configuration Option B (Mid-range):
  2x Clearpath Husky = $8,000
  + 1x UR10e arm = $35,000
  + 1x Jetson-based mobile manipulator = $5,000
  → Total: $48,000

Configuration Option C (Research):
  4x Custom platform (wheeled + LiDAR) = $8,000
  + 2x UR robots = $70,000
  + 1x Spot quadruped (optional) = $150,000
  → Total: $78,000-228,000
```

**Recommendation for balance**: Option A or B (~$30-50K total).

### Infrastructure

#### Physical Space

| Item | Specification |
|------|---------------|
| **Robot Lab Room** | 500-1000 sq ft (enclosed) |
| **Safety Enclosure** | 3-4m perimeter fence with E-stop buttons |
| **Flooring** | Flat, non-reflective (matte finish) |
| **Lighting** | Even, shadow-free (important for vision) |
| **Power** | 20-30A circuits, 240V option (robots) |
| **Environmental** | 18-25°C, <60% humidity (sensors sensitive) |
| **Network** | 5 GHz WiFi + wired fallback (critical) |
| **Storage** | Charging/maintenance station |
| **Workstations** | 3-5 monitoring/development desks |

#### Charging & Maintenance

| Component | Details | Cost |
|-----------|---------|------|
| Charging dock | Auto-docking or manual | $1,000-3,000 |
| Battery chargers | Per-robot + spares | $500-1,000 |
| Power distribution | Central breaker + UPS | $2,000-3,000 |
| Maintenance bench | Tools, spare parts | $1,000 |

#### Safety Systems

| System | Details | Cost |
|--------|---------|------|
| **E-stop buttons** | Wall-mounted + pendant | $500 |
| **Safety enclosure** | Fencing + gates | $2,000-5,000 |
| **Wireless kill-switch** | Per-robot remote off | $500 |
| **First aid station** | Accident response kit | $100 |
| **Fire suppression** | For Lithium battery fires | $500 |
| **Incident log** | Documentation system | Free |

### Computing Infrastructure

| Component | Qty | Cost | Purpose |
|-----------|-----|------|---------|
| Central server (4x GPU) | 1 | $8,000 | Isaac Sim, centralized sim-to-real |
| Development workstations | 3-5 | $7,500 | Student/researcher development |
| Edge devices (Jetson Orin Nano) | 5 | $2,500 | On-robot compute |
| Network infrastructure | As needed | $2,000 | 10 GbE switches, WiFi 6E mesh |

### Network Topology

```
Hybrid Lab Network Architecture
═════════════════════════════════════════════════════════════

Internet Gateway
    │
    ├─ Central Server (GPU workstation, Isaac Sim)
    │  ├─ Simulation environment
    │  ├─ ROS 2 master (optional)
    │  └─ Model library
    │
    ├─ WiFi 5/6 Mesh Network
    │  │
    │  ├─ Mobile Robot 1 (TurtleBot 3)
    │  │  └─ Jetson Nano (edge compute)
    │  │
    │  ├─ Mobile Robot 2 (TurtleBot 3)
    │  │  └─ Jetson Nano (edge compute)
    │  │
    │  ├─ Robot Arm (UR10e or Franka)
    │  │  └─ Arm controller + Jetson Orin NX
    │  │
    │  └─ Workstations 1-5
    │     └─ Student development machines
    │
    └─ 10 GbE Wired Backbone
       └─ For large file transfers, heavy simulation
```

### Lab Budget Estimate

| Category | Cost | Notes |
|----------|------|-------|
| **Robot Hardware** | $30-50K | Mobile bases + arms (see config above) |
| **Compute Infrastructure** | $17,500 | Central server + workstations + edge |
| **Network/Safety** | $10,000 | Enclosure, switches, mesh APs, E-stop |
| **Power/Charging** | $3,000 | Charging dock, power distribution, UPS |
| **Furniture/Misc** | $2,000 | Shelving, storage, cable management |
| **Software Licenses** | $0 | All open-source |
| **Contingency (10%)** | $6,250 | Unexpected issues |
| **Total Startup** | **$68,750** | Over 3-5 year lifespan |
| **Maintenance/Year** | **$3,000-5,000** | Battery replacement, repairs, parts |

### Advantages

- ✅ Students experience real hardware challenges (sim-to-real gap)
- ✅ Capstone projects can deploy on physical robots
- ✅ Research-grade experimentation
- ✅ Industry-relevant experience
- ✅ Mix of simulation and deployment in single curriculum

### Limitations

- ❌ Significant cost (budget $50-100K all-in)
- ❌ Safety coordination required (training, protocols)
- ❌ Maintenance burden (batteries, repairs)
- ❌ Space constraints (need dedicated room)
- ❌ Scheduling complexity (shared robot time)

### Lab Operation Model

#### Scheduling

Option 1: **Dedicated Labs**
- Monday/Wednesday: Simulation work
- Tuesday/Thursday: Hardware labs
- Friday: Open lab / projects

Option 2: **Shared Queue**
- Central booking system (Google Calendar or Doodle)
- 2-hour slots per group
- First-come, first-served

Option 3: **Long-term Projects**
- 3-4 permanent projects assigned a robot
- 1-2 shared robots for rotations

#### Safety Protocol

1. **Mandatory Training**: All users must complete safety orientation
2. **Supervision**: Senior student/TA must be present during hardware sessions
3. **E-stop Requirement**: Everyone within 3 feet of running robot must know location
4. **Incident Log**: Document all collisions, sensor failures, safety events
5. **Regular Inspection**: Weekly robot health checks (charge cycles, mechanical wear)

#### Maintenance Schedule

| Task | Frequency | Owner | Time |
|------|-----------|-------|------|
| Battery charge cycle | Daily/weekly | Lab manager | 30 min |
| Sensor calibration | Weekly | Tech staff | 1-2 hr |
| Mechanical inspection | Monthly | Lab manager | 2 hr |
| Firmware updates | Quarterly | Tech lead | 3 hr |
| Deep maintenance (bearing, motor) | Semi-annual | Service provider | 4-8 hr |

### Timeline

- **Month 1-2**: Procure robots, safety equipment
- **Month 2-3**: Build lab space, safety infrastructure
- **Month 3-4**: Network setup, server deployment
- **Month 4-5**: Robot commissioning, ROS 2 bringup
- **Month 5-6**: Staff training, protocol finalization
- **Month 6+**: Course launch

**Total: 6 months** planning to operational.

---

## Tier 3: Full Production Lab

**Best For**: Enterprise deployment, production robotics, advanced research, budget $200K+

### Characteristics

- ✅ 10-50+ robots in coordinated fleet
- ✅ Autonomous charging/maintenance
- ✅ Real-time telemetry and monitoring
- ✅ Cloud integration (data logging, analysis)
- ✅ Multi-user remote access
- ✅ Industrial-grade safety systems

### Example Configurations

#### High-Volume Warehouse Automation

```
50x Mobile Manipulators (custom platforms)
  + 1x Central AI server (GPU cluster)
  + 1x Fleet management system
  + Automated charging grid
  + IoT-based monitoring
  + Cloud integration for distributed tasks
```

**Estimated Investment**: $500K-1M (hardware + integration)

#### University Robotics Center

```
5-8 Research Robots
  + 2-3 Simulation servers
  + 20+ Development workstations
  + Cleanroom for precision work
  + Multiple lab spaces (mobile, manipulation, humanoid)
  + Network data center
  + VR teleoperation suite
```

**Estimated Investment**: $300K-800K (depending on robot tier)

#### Autonomous Delivery Fleet

```
20x Outdoor Mobile Bases
  + 1x Central dispatcher (cloud-based)
  + Real-time SLAM/mapping
  + GPS + vision fallback
  + 4G/5G connectivity per unit
  + Weather-resistant enclosures
  + Solar charging stations
```

**Estimated Investment**: $800K-2M (depending on base cost and scale)

### Infrastructure Requirements

#### Space

| Requirement | Specification |
|-------------|---------------|
| **Total Area** | 2,000-10,000 sq ft (depending on fleet size) |
| **Charging Zone** | Auto-docking stations (1 per 5-10 robots) |
| **Maintenance Bay** | 500-1000 sq ft with hydraulic lifts |
| **Staging Area** | Test zone for new deployments |
| **Control Center** | Climate-controlled monitoring room |
| **Network Hub** | Server room with redundant cooling |

#### Networking

| Component | Specification | Purpose |
|-----------|---------------|---------|
| **Primary Network** | 10 Gbps Ethernet backbone | Robot-to-cloud communication |
| **Wireless** | 5G + WiFi 6E mesh | Mobile robot connectivity |
| **Backup Cellular** | LTE/4G (per robot) | Field fallback |
| **Cloud Gateway** | Direct cloud connection | AWS/GCP/Azure integration |
| **Redundancy** | Dual ISP, failover routing | 99.9% uptime SLA |

#### Computing (Fleet Scale)

| System | Specification | Cost |
|--------|---------------|------|
| **Central AI Server** | 8x H100 GPU, 512GB RAM, 100TB NVMe | $100K-150K |
| **Fleet Management** | Kubernetes cluster (3-5 nodes) | $30K-50K |
| **Monitoring/Telemetry** | InfluxDB + Grafana + ELK stack | $10K |
| **Cloud Integration** | Dedicated AWS/GCP account | $1K-5K/month |

### Fleet Management Software

| Component | Function |
|-----------|----------|
| **Dispatcher** | Assign tasks to available robots, route optimization |
| **Monitoring** | Real-time health, battery, location tracking |
| **Logging** | Centralized telemetry (1-5 TB/month for 50 robots) |
| **Maintenance Planner** | Predictive maintenance based on usage patterns |
| **Safety System** | Geofencing, collision avoidance, emergency stop |

### Total Cost Estimate (50-Robot Fleet)

| Category | Cost |
|----------|------|
| **Robots (50 units)** | $200K-500K (depends on platform) |
| **Edge Compute (per robot)** | $50K (Jetson Orin NX × 50) |
| **Compute Infrastructure** | $200K (central server + K8s cluster) |
| **Charging/Maintenance** | $50K (docking stations, lifts) |
| **Networking** | $30K (switches, fiber, cellular) |
| **Safety Systems** | $20K (geofencing, E-stop network) |
| **Software Development** | $100K-200K (dispatch, monitoring, integration) |
| **Facility Preparation** | $100K (space, power, network drops) |
| **Contingency (15%)** | $125K-205K |
| **Total** | **$875K-1.5M** |
| **Amortized (5-year)** | **$175K-300K/year** |

---

## Comparison Summary

| Aspect | Simulation-Only | Hybrid | Full Production |
|--------|-----------------|--------|-----------------|
| **Lab Size** | 25-30 workstations | 5 robots + 5 desks | 50+ robots + ops center |
| **Space Required** | Standard computer lab | 500-1000 sq ft | 2000-10000 sq ft |
| **Initial Cost** | $40-50K | $70-100K | $800K-2M |
| **Annual Maintenance** | $2K-3K (software) | $5K-10K (batteries, repairs) | $50K-100K (fleet ops) |
| **Safety Training Required** | None | Mandatory | Extensive (ISO 10218, etc) |
| **Instructor Load** | Low (IT support) | Medium (lab scheduling) | High (ops management) |
| **Student Experience** | Theoretical | Mixed theory + practice | Real-world professional |
| **IP/Patents** | Possible | Likely | Probable |
| **Industry Partnerships** | Possible | Likely | Expected |

---

## Choosing Your Tier

### Decision Matrix

**Ask yourself**:

1. **What's your budget?**
   - <$50K → Simulation-Only
   - $50K-150K → Hybrid
   - >$150K → Full Production

2. **Do students need physical hardware experience?**
   - No → Simulation-Only
   - Yes, some → Hybrid
   - Yes, extensive → Full Production

3. **Do you have dedicated space?**
   - No → Simulation-Only
   - Yes, 500-1000 sq ft → Hybrid
   - Yes, 2000+ sq ft → Full Production

4. **How many students?**
   - 20-50 → Simulation-Only (easy to scale)
   - 50-100 → Hybrid (shared robot time)
   - 100+ → Full Production (multiple cohorts)

5. **Is this for teaching or research?**
   - Teaching → Simulation-Only or Hybrid
   - Research → Hybrid or Full Production
   - Both → Full Production (highest value)

### Recommended Path

**Start Small, Scale Gradually**:

Year 1: Deploy **Simulation-Only** lab
- Low cost, quick ROI
- Gather student feedback
- Establish curriculum

Year 2: Add **3-5 robots** (Hybrid mode)
- Validate concepts with hardware
- Build expertise
- Student research projects

Year 3+: Scale to **Full Production** (if warranted)
- Matured curriculum and operations
- Industry partnerships established
- Research funding secured

---

## Lab Policies & Procedures

### Access Control

1. **Training**: Mandatory orientation (2 hours, signed waiver)
2. **Badges**: Lab access card (electronic lock)
3. **Scheduling**: Shared calendar (Google Calendar or dedicated system)
4. **Supervision**: All hardware sessions require TA/supervisor present

### Incident Reporting

- **Minor**: Sensor malfunction, software crash (document, continue)
- **Moderate**: Collision, temporary communication loss (shut down, investigate)
- **Severe**: Robot collision with person, safety system failure (immediate shutdown, incident review)

### Maintenance Responsibilities

- **Daily**: Charge batteries, visual inspection
- **Weekly**: Calibrate sensors, firmware update checks
- **Monthly**: Deep clean, mechanical inspection
- **Quarterly**: Bearing/motor inspection, parameter tuning

---

## Next Steps

1. **Evaluate your constraints**: Budget, space, students
2. **Choose tier**: Use decision matrix above
3. **Draft budget**: See cost estimates for your tier
4. **Create timeline**: Plan procurement and deployment
5. **Build safety plan**: Document procedures and training
6. **Launch**: Start with one module, expand iteratively

---

**Related Resources**:
- [Hardware Requirements](/docs/appendix/hardware-requirements)
- [Edge Device Kit](/docs/appendix/edge-device-kit)
- [Lab Architecture](/docs/appendix/lab-architecture)
- [Course Roadmap](/docs/roadmap)
