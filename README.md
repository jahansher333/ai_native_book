# Physical AI & Humanoid Robotics Technical Book

A comprehensive technical guide to building intelligent physical systems using ROS 2, digital twins, NVIDIA Isaac, and vision-language-action models.

## Overview

This book provides hands-on education in Physical AI - artificial intelligence systems that interact with and operate in the physical world. Through four progressive modules, you'll master the full stack of modern robotics development.

### Modules

1. **ROS 2 - The Robotic Nervous System**: Master Robot Operating System 2 fundamentals, URDF modeling, and inter-process communication
2. **Digital Twin - Simulation Environments**: Build virtual replicas using Gazebo and Unity for safe testing before hardware deployment
3. **Isaac AI - NVIDIA Robotics Platform**: Explore Isaac Sim for photorealistic simulation and Isaac ROS for GPU-accelerated perception
4. **VLA - Vision-Language-Action Models**: Integrate large language models with robotic systems for natural language control

## Quick Start

### Prerequisites

- **Ubuntu 22.04 LTS** (native or VM)
- **Node.js 18+** and npm
- **ROS 2 Humble Hawksbill** (for hands-on exercises)
- **Modern GPU recommended** (NVIDIA RTX 3060+ for Isaac modules)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/physical-ai-robotics-book.git
   cd physical-ai-robotics-book
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000` with live reload.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Generates static files in `build/` directory.

5. **Serve production build locally**:
   ```bash
   npm run serve
   ```

## Project Structure

```
├── docs/                     # All markdown content
│   ├── intro.md              # Introduction
│   ├── module-1/             # ROS 2 fundamentals
│   ├── module-2/             # Digital Twin simulation
│   ├── module-3/             # Isaac AI platform
│   ├── module-4/             # VLA integration & capstone
│   ├── appendix/             # Hardware specs, lab setup
│   ├── roadmap.md            # 13-week course schedule
│   └── glossary.md           # Robotics terminology
├── static/                   # Static assets
│   ├── img/diagrams/         # SVG architecture diagrams
│   └── code-examples/        # Downloadable code archives
├── src/                      # Custom React/TS components
│   └── css/custom.css        # Tailwind imports
├── docusaurus.config.js      # Site configuration
├── sidebars.js               # Navigation structure
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind CSS config
└── .github/workflows/        # GitHub Actions deployment
```

## Documentation Content

- **50+ Pages**: Comprehensive coverage across 4 modules
- **45+ Code Examples**: Python, C++, ROS 2, TensorFlow/PyTorch
- **Hardware Guides**: 3-tier workstation specs, edge device kits, lab setup
- **13-Week Roadmap**: Semester-based course schedule with labs
- **50+ Glossary Terms**: Robotics and AI terminology reference

## Course Information

### Target Audience

- **Engineering Students**: Senior undergrad or graduate level (CS, robotics, mechatronics)
- **Professional Developers**: Software engineers transitioning to robotics
- **Researchers**: Academic and industry researchers in Physical AI
- **Makers & Enthusiasts**: Hobbyists building advanced robotics projects

### Learning Path

- **Duration**: 13 weeks (8-10 hours/week)
- **Prerequisites**: Python proficiency, Linux basics, linear algebra
- **Deliverables**: 3 hands-on labs per module + capstone project
- **Format**: Self-paced or instructor-led

### Hardware Requirements

#### Minimum (Simulation-Only)
- Intel i5/AMD Ryzen 5, 16GB RAM, integrated graphics
- Cost: ~$800-1,000

#### Recommended (Full Stack)
- Intel i7/AMD Ryzen 7, 32GB RAM, NVIDIA RTX 3060+
- Cost: ~$1,500-2,000

#### Optimal (Isaac Sim + Real-Time)
- Intel i9/AMD Ryzen 9, 64GB RAM, NVIDIA RTX 4080+
- Cost: ~$3,000-4,000

See [Hardware Requirements](docs/appendix/hardware-requirements.md) for details.

## Technology Stack

- **Docusaurus 3.x**: Static site generator for documentation
- **TypeScript ES2022+**: Custom components (strict mode)
- **Tailwind CSS 3.x**: Styling framework
- **ROS 2 Humble**: Robot Operating System (tested version)
- **Python 3.10+** & **C++17**: Primary programming languages
- **Gazebo Classic 11 / Ignition Fortress**: Physics simulation
- **Unity 2022 LTS**: Advanced 3D simulation (optional)
- **NVIDIA Isaac Sim 2023.1**: Photorealistic robotics simulation

## Contributing

### Content Authoring

1. **Create feature branch**:
   ```bash
   git checkout -b feature/module-X-new-topic
   ```

2. **Add markdown file** in appropriate module directory with frontmatter:
   ```yaml
   ---
   title: "Topic Title"
   description: "Brief description"
   module_id: "module-1"
   sidebar_position: 5
   tags: ["ros2", "example"]
   difficulty: intermediate
   estimated_minutes: 20
   ---
   ```

3. **Follow content template**: See `specs/001-physical-ai-robotics-book/contracts/content-template.md`

4. **Test locally**: Run `npm start` and verify content renders correctly

5. **Submit PR**: Push branch and create pull request to `draft` branch

### Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
docs(module-1): add ROS 2 service tutorial
docs(appendix): update workstation specs for 2025
fix(typo): correct URDF syntax in example
feat(diagrams): add Isaac Sim architecture diagram
```

## Deployment

### GitHub Pages (Automated)

Deployment is automated via GitHub Actions:

1. **Push to main branch** triggers build workflow
2. **Build succeeds** → Site deployed to GitHub Pages
3. **Live URL**: `https://your-org.github.io/physical-ai-robotics-book/`

### Manual Deployment

```bash
npm run build
npm run serve  # Test locally first
# Deploy build/ directory to your hosting service
```

## License

This project is licensed under the [MIT License](LICENSE).

## Support & Community

- **Issues**: [GitHub Issues](https://github.com/your-org/physical-ai-robotics-book/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/physical-ai-robotics-book/discussions)
- **ROS Discourse**: [ROS Discourse Forum](https://discourse.ros.org/)

## Acknowledgments

- ROS 2 community and maintainers
- NVIDIA Isaac team
- Gazebo/Ignition developers
- Open Robotics contributors

---

**Built with** [Docusaurus](https://docusaurus.io/) | **Powered by** [ROS 2](https://docs.ros.org/en/humble/)
