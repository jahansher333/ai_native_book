---
title: "Detailed Workstation Specifications"
description: "Comprehensive three-tier workstation configurations with component breakdowns, compatibility, and purchasing guidance."
sidebar_position: 103
tags: ["hardware", "workstation", "specifications", "components"]
difficulty: beginner
estimated_minutes: 15
---

# Detailed Workstation Specifications

This document provides comprehensive, component-level specifications for three workstation tiers, helping you build or purchase the right development environment for the course.

## Tier Comparison Matrix

| Aspect | Minimum | Recommended | Optimal |
|--------|---------|-------------|---------|
| **Use Case** | Learning basics, simulation-only | Full course, comfortable workflow | Research, production, large-scale sim |
| **Price Range** | $600-900 | $1,200-1,800 | $3,000-5,000 |
| **CPU Cores** | 6-8 | 12-16 | 16-24+ |
| **RAM** | 16 GB | 32 GB | 64-128 GB |
| **GPU VRAM** | 2-4 GB | 8-12 GB | 20-24+ GB |
| **Storage** | 256 GB SSD | 512 GB SSD | 2 TB+ NVMe |
| **Gazebo Performance** | 30-60 FPS (simple) | 60+ FPS (moderate) | 60+ FPS (complex) |
| **Isaac Sim Performance** | Not recommended | 30-45 FPS | 60+ FPS |

---

## MINIMUM TIER ($600-900)

**Recommended For**: Students, hobbyists, concept learning, ROS 2 fundamentals

### CPU

| Parameter | Specification |
|-----------|---------------|
| **Processor** | Intel Core i5-11400 / AMD Ryzen 5 5600X |
| **Architecture** | 6 cores / 12 threads (Intel) or 6C/12T (AMD) |
| **Base/Boost Clock** | 2.6-4.6 GHz (Intel) / 3.7-4.6 GHz (AMD) |
| **Cache** | 12 MB L3 cache |
| **TDP** | 65-95 W |
| **Launch Year** | 2021 |

**Why This CPU?**
- Handles ROS 2 multi-node systems smoothly
- Sufficient for Python development and basic simulations
- Good power efficiency for laptops
- Widely available and reliable

**Alternatives**:
- Intel Core i5-12400 (newer, better performance tier)
- AMD Ryzen 5 6600 (laptop variant)
- Intel Core i7-11700 (if budget allows; better multi-threading)

### RAM

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 16 GB DDR4 |
| **Speed** | 3200 MHz CAS Latency 16 |
| **Configuration** | 2x8 GB (preferred for dual-channel) |
| **Type** | Non-ECC UDIMM |

**Why 16 GB?**
- Sufficient for ROS 2 nodes (each ~100-500 MB)
- Gazebo simulations with moderate scene complexity
- Python development with small ML models
- Allows some page file spillover on SSD

**Considerations**:
- Upgrading to 32 GB later is recommended
- Check if RAM is soldered (laptops) or upgradeable (desktops)

### GPU

| Parameter | Specification |
|-----------|---------------|
| **GPU Type** | Intel Iris Xe Graphics (integrated) OR NVIDIA GTX 1050 Ti |
| **VRAM** | 2-4 GB shared (integrated) or dedicated (GTX 1050) |
| **Architecture** | Modern but entry-level discrete |
| **CUDA Cores** | N/A (integrated) or 768 (GTX 1050 Ti) |

**Why This GPU?**
- Integrated GPU: Zero cost, good for ROS 2 learning
- GTX 1050 Ti: Affordable discrete GPU, decent Gazebo performance
- Both run Gazebo acceptably (not Isaac Sim)
- Lower power consumption (laptop-friendly)

**GPU Comparison**:
| GPU | OpenGL Perf | Gazebo FPS | Isaac Sim | Cost |
|-----|-------------|-----------|----------|------|
| Intel Iris Xe (integrated) | Decent | 30-45 | No | Included |
| NVIDIA GTX 1050 Ti | Good | 40-60 | Slow | $120-180 |
| AMD Radeon RX 6600 | Good | 40-60 | No | $200-250 |

### Storage

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 256 GB |
| **Type** | SSD NVMe M.2 |
| **Speed** | 3,500+ MB/s read (PCIe 3.0) |
| **Form Factor** | M.2 2280 |

**Why This Storage?**
- Fast boot and application loading
- ROS 2 workspace compilation is disk-I/O bound
- 256 GB allows OS + tools + moderate project storage
- Expansion via external SSD recommended

**Storage Breakdown**:
```
OS (Ubuntu 22.04)          ~8 GB
ROS 2 + dependencies       ~3 GB
Gazebo + models            ~2 GB
Python/ML libraries        ~5 GB
Development projects       ~20 GB
Available/Buffer           ~218 GB (includes page file)
```

### Motherboard & Connectivity

| Parameter | Specification |
|-----------|---------------|
| **Chipset** | Intel B660 / AMD B550 |
| **RAM Slots** | 2-4 (desktop); soldered (laptop) |
| **Storage Slots** | 1-2 M.2 NVMe slots |
| **Network** | Gigabit Ethernet (1 GbE) + WiFi 5 |
| **USB** | 3x USB 3.1 Gen 1, 2x USB 3.0 |
| **Rear I/O** | Audio, HDMI, DisplayPort |

### Power Supply

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 550 W (desktop) |
| **Efficiency** | 80+ Bronze certified minimum |
| **Type** | Non-modular acceptable |
| **Protection** | OVP, OCP, SCP circuits |

### Cooling

| Parameter | Specification |
|-----------|---------------|
| **CPU Cooler** | Stock cooler (Intel) or Wraith Stealth (AMD) |
| **Case Fans** | 2x 120mm front intake + 1x 120mm rear exhaust |
| **Ambient Temp** | Up to 25°C room temperature |
| **Max CPU Temp** | 85°C under full load |

### Example Build (Desktop)

```
ComponentCost
─────────────────────────────────────
CPU: i5-11400                  $170
Motherboard (B660)              $90
RAM: 16GB DDR4 (2x8GB)         $50
GPU: GTX 1050 Ti                $150
SSD: 256GB NVMe                 $25
PSU: 550W 80+Bronze             $55
Case + Cooling                  $60
Monitor (1080p, 60Hz)          $100
Keyboard/Mouse                  $30
─────────────────────────────────────
Total (approximate)             $730
```

### Example Laptop Configuration

- **Dell XPS 13** (i5 variant, 16GB) - ~$799
- **Lenovo ThinkPad X1 Carbon Gen 10** (i5, 16GB) - ~$849
- **MacBook Air M2** (16GB) - ~$1,199 (exceeds budget but good value)
- **ASUS VivoBook 14** (Ryzen 5, 16GB) - ~$649

---

## RECOMMENDED TIER ($1,200-1,800)

**Recommended For**: Full course completion, professional developers, comfortable multi-tasking

### CPU

| Parameter | Specification |
|-----------|---------------|
| **Processor** | Intel Core i7-12700K / AMD Ryzen 7 5800X3D |
| **Cores/Threads** | 12C/20T (Intel) or 8C/16T (AMD) with 3D V-Cache |
| **Base/Boost** | 3.6-5.0 GHz (Intel) / 3.4-4.5 GHz (AMD) |
| **Cache** | 20 MB L3 (Intel) / 8MB L3 + 96MB 3D (AMD) |
| **TDP** | 95-125 W |
| **Launch Year** | 2022 (Intel K-series); 2022 (AMD X3D) |

**Why This CPU?**
- Excellent multi-threaded performance for parallel ROS 2 nodes
- Handles Isaac Sim workloads comfortably
- Future-proof for 2-3 years of development
- Good middle ground between price and performance

**Alternatives**:
- Intel i7-13700K (newer generation, ~5% better performance)
- AMD Ryzen 7 5800X (non-X3D, slightly cheaper)
- Intel i7-1280P (laptop equivalent, lower TDP)

### RAM

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 32 GB DDR4/DDR5 |
| **Speed** | 3600 MHz CAS 18 (DDR4) or 5600 MHz (DDR5) |
| **Configuration** | 2x16 GB for dual-channel performance |
| **Type** | Standard UDIMM, ECC optional |

**Why 32 GB?**
- Comfortable headroom for ROS 2 + Gazebo + background processes
- Isaac Sim scenes with moderate asset complexity
- Running multiple ROS 2 instances simultaneously
- ML model inference without memory pressure

**Usage Pattern**:
```
OS + Background      ~2-3 GB
ROS 2 stack          ~1-2 GB
Gazebo/Isaac Sim     ~8-12 GB
Python dev/IDEs      ~2-3 GB
Available buffer     ~10+ GB
```

### GPU

| Parameter | Specification |
|-----------|---------------|
| **GPU Type** | NVIDIA RTX 3060 Ti / RTX 4070 / RTX 4080 |
| **VRAM** | 8-16 GB GDDR6/GDDR6X |
| **CUDA Cores** | 4,864 (3060 Ti) / 5,888 (4070) |
| **Architecture** | NVIDIA Ampere (RTX 30xx) or Ada (RTX 40xx) |

**Why This GPU?**
- Handles Isaac Sim at 30-60 FPS for moderate scenes
- Sufficient VRAM for vision model inference
- CUDA support for TensorFlow/PyTorch
- Good price-to-performance ratio

**GPU Comparison**:
| GPU | VRAM | Isaac Sim | Vision Models | Cost |
|-----|------|-----------|---|------|
| RTX 3060 Ti | 8 GB | 30-45 FPS | Real-time ResNet | $300-400 |
| RTX 4070 | 12 GB | 45-60 FPS | Multiple models | $550-650 |
| RTX 4080 | 16 GB | 60+ FPS | LLM + vision | $1,100-1,300 |

**Recommendation**: RTX 4070 offers best value for this tier.

### Storage

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 512 GB (OS + tools) + 512 GB external (projects) |
| **Type** | NVMe SSD M.2 (internal); USB 3.1 Gen 2 SSD external |
| **Speed** | 5,000+ MB/s (PCIe 4.0) |
| **Form Factor** | M.2 2280 (internal) |

**Storage Strategy**:
```
Internal SSD (512 GB):
  OS + ROS 2 tools        ~20 GB
  Isaac Sim               ~50 GB
  Gazebo + models         ~10 GB
  Python environments     ~20 GB
  Active projects         ~100 GB
  Available               ~300 GB

External SSD (512 GB):
  Project archives        ~200 GB
  ML model weights        ~150 GB
  Datasets                ~100 GB
  Backups                 ~60 GB
```

### Motherboard & Connectivity

| Parameter | Specification |
|-----------|---------------|
| **Chipset** | Intel Z690 (K-series) / AMD X670 |
| **RAM Slots** | 4 DIMM slots (upgrade-friendly) |
| **Storage** | 2-3 M.2 NVMe slots (RAID optional) |
| **Network** | 2.5 GbE Ethernet + WiFi 6E |
| **USB** | 2x USB 3.2 Gen 2x2, 4x USB 3.2 Gen 1 |
| **PCIe** | PCIe 5.0 support (future-proof) |

### Power Supply

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 750 W (desktop); 240W+ (laptop PSU) |
| **Efficiency** | 80+ Gold certified |
| **Type** | Modular (cable management) |
| **Protection** | Full protection suite (OVP, OCP, SCP, UVP) |

### Cooling

| Parameter | Specification |
|-----------|---------------|
| **CPU Cooler** | 240mm AIO liquid or high-end air (~$60-120) |
| **GPU Cooler** | Stock cooler or aftermarket (GPU-dependent) |
| **Case Fans** | 3x 120mm intake + 2x 120mm exhaust |
| **Max CPU Temp** | <75°C under sustained load |
| **Max GPU Temp** | <70°C under full utilization |

### Example Build (Desktop)

```
Component                      Cost
─────────────────────────────────────
CPU: i7-12700K                $400
Motherboard (Z690)            $180
RAM: 32GB DDR4 (2x16GB)       $100
GPU: RTX 4070                 $600
SSD: 512GB NVMe               $50
External SSD: 512GB USB3.1    $60
PSU: 750W 80+Gold            $100
Case + Cooling (AIO)         $150
Monitor (1440p, 144Hz)       $300
Keyboard/Mouse/Mousepad       $80
─────────────────────────────────────
Total (approximate)         $2,020
```

### Example Laptop Configuration

- **MacBook Pro 16" M2 Max** (12C CPU, 32GB, Pro GPU) - ~$1,999
- **Dell XPS 15 Plus** (i7, 32GB, RTX 4070) - ~$1,799
- **ASUS ProBook Workstation** (i7, 32GB, RTX 4070) - ~$1,599
- **Lenovo ThinkPad P14s** (i7, 32GB, RTX 5880 Ada) - ~$1,899

---

## OPTIMAL TIER ($3,000-5,000+)

**Recommended For**: Research, production, advanced experiments, large-scale simulations

### CPU

| Parameter | Specification |
|-----------|---------------|
| **Processor** | Intel Core i9-13900K / AMD Ryzen 9 7950X |
| **Cores/Threads** | 24C/32T (Intel) / 16C/32T (AMD) |
| **Base/Boost** | 3.0-5.8 GHz (Intel) / 4.5-5.7 GHz (AMD) |
| **Cache** | 36 MB L3 (Intel) / 32 MB L3 (AMD) |
| **TDP** | 125-170 W |
| **Launch Year** | 2022-2023 |

**Why This CPU?**
- Extreme multi-threading for 20+ concurrent ROS 2 nodes
- Excellent compilation times for large codebases
- Future-proofing for 4-5 years
- Research-grade performance

**Alternatives**:
- Intel Xeon w9-3595X (workstation Xeon, even more cores/threads)
- AMD Ryzen 9 7900X (slightly lower tier, ~$400 cheaper)
- AMD Threadripper Pro (content creation focus; overkill for robotics)

### RAM

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 64-128 GB DDR5 |
| **Speed** | 5600 MHz CAS 22+ |
| **Configuration** | 4x16GB or 4x32GB quad-channel |
| **Type** | High-quality UDIMM, ECC optional but recommended |

**Why 64-128 GB?**
- Caching large datasets in memory
- Running multiple Isaac Sim instances concurrently
- Deep learning model training on CPU fallback
- Server-grade workload support

**Advanced Scenarios**:
- 7B parameter LLM in memory: ~14 GB
- Large scene dataset caching: ~30-50 GB
- Multiple concurrent instances: ~15-20 GB each
- OS + tools + buffer: ~10-20 GB

### GPU

| Parameter | Specification |
|-----------|---------------|
| **GPU Type** | NVIDIA RTX 4090 / L40 / L40S / H100 (research) |
| **VRAM** | 24 GB (4090) / 48 GB (L40S) / 80 GB (H100) |
| **CUDA Cores** | 16,384 (4090) / 18,176 (L40S) |
| **Architecture** | NVIDIA Ada or Hopper |

**GPU Comparison**:
| GPU | VRAM | Use Case | Cost |
|-----|------|----------|------|
| RTX 4090 | 24 GB | Real-time 7B LLM + perception | $1,500-1,700 |
| RTX 6000 Ada | 48 GB | Production inference | $6,800 |
| L40S | 48 GB | Workstation rendering + compute | $8,500 |
| H100 | 80 GB | Research/training (overkill) | $35,000+ |

**Recommendation**: RTX 4090 offers best performance-per-dollar for this tier.

### Storage

| Parameter | Specification |
|-----------|---------------|
| **Primary** | 2 TB NVMe SSD (OS + active projects) |
| **Secondary** | 2 TB external NVMe SSD (USB 3.1 Gen 2) |
| **Backup** | 4 TB external HDD (long-term archive) |
| **Network** | NAS (optional, for multi-user labs) |

**Storage Strategy**:
```
Internal SSD (2 TB):
  OS + development tools    ~30 GB
  Isaac Sim + assets        ~150 GB
  Python/ML libraries       ~30 GB
  Active projects           ~300 GB
  Model weights (cached)    ~200 GB
  Available/Buffer          ~1,290 GB

External NVMe (2 TB):
  Historical projects       ~400 GB
  ML models library         ~600 GB
  Datasets (replicated)     ~500 GB
  Backups + archives        ~400 GB

NAS (optional, 10TB):
  Lab-wide shared models    ~1 TB
  Simulation results        ~3 TB
  Backup replica            ~2 TB
  Cold archive              ~4 TB
```

### Motherboard & Connectivity

| Parameter | Specification |
|-----------|---------------|
| **Chipset** | Intel Z790 (enthusiast) / AMD TRX50 (Threadripper) |
| **RAM Slots** | 4-8 DIMM slots |
| **Storage** | 4+ M.2 NVMe slots (some RAID-capable) |
| **Network** | 10 GbE Ethernet (optional but recommended) + WiFi 6E |
| **USB** | Thunderbolt 3/4 + multiple USB 3.2 Gen 2x2 |
| **Expansion** | PCIe 5.0 full support |

### Power Supply

| Parameter | Specification |
|-----------|---------------|
| **Capacity** | 1000-1200 W |
| **Efficiency** | 80+ Platinum certified |
| **Type** | Modular for clean cable management |
| **Protection** | Enterprise-grade protection |
| **UPS Backup** | Recommended for research environments |

### Cooling

| Parameter | Specification |
|-----------|---------------|
| **CPU Cooler** | 360mm AIO liquid or high-end custom loop |
| **GPU Cooler** | Custom water loop or high-performance air |
| **Case Fans** | 6+ 120/140mm fans with smart control |
| **Max CPU Temp** | <60°C under sustained workload |
| **Max GPU Temp** | <65°C under full utilization |
| **Room AC** | Recommended for heat dissipation |

### Example Build (Workstation)

```
Component                           Cost
─────────────────────────────────────────
CPU: i9-13900K                    $600
Motherboard (Z790 high-end)       $350
RAM: 64GB DDR5 (4x16GB)          $400
GPU: RTX 4090                   $1,600
SSD: 2TB NVMe (primary)           $150
External SSD: 2TB USB3.1          $120
PSU: 1000W 80+Platinum            $250
Case (full tower)                 $200
Cooling (360mm AIO + GPU block)   $300
Monitor (4K IPS, 60Hz)            $400
Dual Monitor Arms                 $100
Keyboard/Mouse (mechanical)       $150
Thunderbolt dock (10Gbps)         $200
UPS Backup (2000VA)               $250
─────────────────────────────────────────
Total (approximate)             $4,670
```

### Recommended Server Configuration (Multi-User Lab)

For shared research environments, consider:

```
CPU:                   2x Intel Xeon Platinum 8480 (112 cores total)
Motherboard:           Dual-socket LGA4189
RAM:                   512 GB DDR5 ECC RDIMM
GPUs:                  4x NVIDIA L40S (48GB VRAM each)
Storage (Primary):     8TB NVMe SSD RAID 1 (OS + tools)
Storage (Secondary):   24TB SSD RAID 6 (projects + models)
Network:               10 GbE + InfiniBand for high-speed comms
PSU:                   Redundant 3000W PSUs
Cooling:               Liquid-cooled rear door
Cost:                  ~$80,000-120,000
```

---

## Platform-Specific Recommendations

### Windows (with WSL2)

| Aspect | Specification |
|--------|---------------|
| **OS** | Windows 11 Pro/Enterprise with WSL2 |
| **Distro** | Ubuntu 22.04 LTS on WSL2 |
| **GPU** | RTX 30xx/40xx with WSL2 NVIDIA support |
| **Storage** | Allocate 50+ GB for WSL2 filesystem |
| **Network** | Port forwarding for ROS 2 nodes |

**Pros**: Familiar Windows interface, easy IDE setup
**Cons**: Slight performance overhead, GPU support maturing

### macOS (Intel / Apple Silicon)

| Aspect | Intel | Apple Silicon (M1/M2/M3) |
|--------|-------|--------------------------|
| **CPU** | Core i7/i9 | M1/M2/M3 Pro/Max |
| **Tier Equivalent** | Recommended-Optimal | Recommended |
| **Simulation** | Gazebo (Docker) | Gazebo (Docker) |
| **Isaac Sim** | Not supported natively | Not fully supported |
| **Best Use** | ROS 2 dev, local learning | ROS 2 dev, portable learning |

**Setup**: Use Docker containers for simulation environments.

### Linux (Ubuntu 22.04 Native)

| Aspect | Specification |
|--------|---------------|
| **OS** | Ubuntu 22.04 LTS Desktop |
| **Desktop** | GNOME 42 (default) or lightweight alternative |
| **Kernel** | 5.15+ |
| **GPU Drivers** | NVIDIA CUDA Toolkit 12.0+ (RTX) or Mesa (open-source) |

**Pros**: Best compatibility, full ROS 2 support
**Cons**: Driver installation requires some Linux knowledge

---

## Performance Expectations

### Benchmark Results by Tier

**Task: Gazebo simulation with 10-body robot + environment**

| Metric | Minimum | Recommended | Optimal |
|--------|---------|-------------|---------|
| **Startup Time** | 8-10s | 3-5s | 2-3s |
| **Physics FPS** | 40-50 | 60 | 60+ |
| **Render FPS** | 30-45 | 50-60 | 60+ |
| **Memory Usage** | 1.2-1.5 GB | 2-2.5 GB | 1.5-2 GB |

**Task: Isaac Sim with photorealistic environment**

| Metric | Minimum | Recommended | Optimal |
|--------|---------|-------------|---------|
| **Supported** | No | Yes (30-45 FPS) | Yes (60+ FPS) |
| **Startup** | N/A | 15-20s | 10-12s |
| **Scene Complexity** | N/A | Moderate | Full fidelity |
| **VRAM Usage** | N/A | 6-8 GB | 3-5 GB (headroom) |

**Task: Real-time vision model inference (640x480 RGB)**

| Model | Minimum | Recommended | Optimal |
|-------|---------|-------------|---------|
| **MobileNet v2** | 30 FPS | 60+ FPS | 60+ FPS |
| **ResNet-50** | 8-10 FPS | 30-45 FPS | 60+ FPS |
| **YOLO v8** | 5-8 FPS | 20-30 FPS | 45-60 FPS |
| **CLIP (image)** | 2-3 FPS | 10-15 FPS | 25-35 FPS |

---

## Upgrade Path Recommendations

### Minimum → Recommended

Priority upgrades:
1. GPU: Integrated → RTX 3060 Ti ($300-400)
2. RAM: 16 GB → 32 GB ($50-100)
3. Storage: Add external SSD ($60-100)

**Estimated additional cost**: $400-600

### Recommended → Optimal

Priority upgrades:
1. GPU: RTX 4070 → RTX 4090 ($800-1,000)
2. CPU: i7-12700 → i9-13900K ($200-250)
3. RAM: 32 GB → 64 GB ($200-300)
4. Storage: Add secondary NVMe ($100-150)

**Estimated additional cost**: $1,300-1,700

---

## Purchasing Tips

### Desktop vs Laptop

| Aspect | Desktop | Laptop |
|--------|---------|--------|
| **Performance** | Higher for same price | 10-15% lower |
| **Upgradability** | Excellent | Limited (RAM/SSD) |
| **Portability** | None | Excellent |
| **Longevity** | 5-7 years | 3-5 years |
| **Repair** | Easier, cheaper | Harder, expensive |
| **Total Cost of Ownership** | Lower | Higher |

**Recommendation**: Desktop for home lab; laptop for flexibility.

### New vs Refurbished

| Category | Recommendation |
|----------|-----------------|
| **CPUs** | Safe to buy refurbished (5+ year warranty common) |
| **GPUs** | Risky refurbished (mining damage common); buy new |
| **SSDs** | Risky (wear unknown); buy new or from trusted seller |
| **RAM** | Safe to buy refurbished if tested |
| **PSU** | New only (safety critical) |
| **Laptops** | Risky (battery degradation); prefer manufacturer refurb with warranty |

### Retailers

**Recommended**:
- B&H Photo Video (excellent customer service)
- Newegg (large selection, competitive pricing)
- Amazon (fast shipping, easy returns)
- Micro Center (local pickup, price match)
- Manufacturer direct (Dell, HP, ASUS official stores)

**Avoid**:
- Unknown eBay sellers
- Suspicious Amazon third-party sellers
- Wholesale sites without consumer protections

---

## Summary Table: At-a-Glance Build

### Quick Comparison

```
MINIMUM              RECOMMENDED           OPTIMAL
─────────────────────────────────────────────────────────
i5-11400             i7-12700K            i9-13900K
$170                 $400                 $600

16GB DDR4            32GB DDR4/5          64GB DDR5
$50                  $100                 $400

GTX 1050 Ti          RTX 4070             RTX 4090
$150                 $600                 $1,600

256GB SSD            512GB SSD + ext      2TB SSD + ext
$25                  $110                 $270

550W PSU             750W Gold PSU        1200W Platinum PSU
$55                  $100                 $250

Stock Cooler         AIO 240mm            AIO 360mm + GPU block
$0                   $120                 $300

Total: $730          Total: $2,020        Total: $4,670
```

---

## Next Steps

1. **Decide Your Tier**: Budget and use case
2. **Choose Platform**: Desktop or laptop
3. **Select Form Factor**: Prebuilt, custom build, or laptop
4. **Purchase**: Use recommended retailers
5. **Setup**: Follow installation guides in Module 1

---

**Related Resources**:
- [Hardware Requirements Overview](/docs/appendix/hardware-requirements)
- [Edge Device Kit](/docs/appendix/edge-device-kit)
- [Course Roadmap](/docs/roadmap)
