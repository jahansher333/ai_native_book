# Implementation Plan: Physical AI & Humanoid Robotics Technical Book

**Branch**: `001-physical-ai-robotics-book` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-physical-ai-robotics-book/spec.md`

## Summary

Build a comprehensive technical book on Physical AI & Humanoid Robotics using Docusaurus. The book covers 4 core modules (ROS 2, Digital Twins, Isaac AI, Vision-Language-Action), with Introduction, Appendix, weekly roadmap, and lab architecture sections. Content is delivered as markdown files with consistent structure, code examples, diagrams, and hardware specifications. Deployment via GitHub Pages with version control for draft vs. published content.

## Technical Context

**Language/Version**: TypeScript (ES2022+, strict mode) for Docusaurus customization, Markdown for content
**Primary Dependencies**: Docusaurus 3.x, Node.js 18+, React 18+, Tailwind CSS 3.x (via plugin), Prism for syntax highlighting
**Storage**: Git repository (file-based content), static site generation (no database)
**Testing**: Manual content validation, Docusaurus build validation, broken link checking (docusaurus-plugin-broken-links), responsive design testing
**Target Platform**: Web browsers (desktop, tablet, mobile), GitHub Pages static hosting
**Project Type**: Static documentation site (single project)
**Performance Goals**: < 3s initial page load, < 1s navigation between pages, < 50ms search results
**Constraints**: No custom plugins beyond Docusaurus ecosystem, GitHub Pages deployment (static only), no backend services (content-only site)
**Scale/Scope**: ~50-100 markdown pages, 4 major modules + appendices, 100+ code examples, 20+ diagrams/figures, 13-week course structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Content Structure (Constitution Principle VI)

✅ **PASS**: Docusaurus content paths align with constitutional requirements:
- `/docs/intro` → Introduction
- `/docs/module-1` → Chapter 1: ROS 2
- `/docs/module-2` → Chapter 2: Gazebo & Unity
- `/docs/module-3` → Chapter 3: NVIDIA Isaac
- `/docs/module-4` → Chapter 4: VLA & Capstone
- `/docs/appendix` → Hardware Requirements & Lab Setup

✅ **PASS**: Metadata requirements met via frontmatter (title, description, module_id in each .md file)

### TypeScript-First (Constitution Principle I)

✅ **PASS**: Custom Docusaurus components (if any) will use `.tsx` with TypeScript strict mode

**Note**: Docusaurus project includes TypeScript configuration by default. Custom components for future enhancements (RAG chatbot, personalization, translation - see constitution bonus features) will follow TypeScript-first principle.

### Tailwind-Only Styling (Constitution Principle II)

✅ **PASS**: Tailwind CSS integration via `docusaurus-plugin-tailwindcss` or `@docusaurus/preset-classic` with custom CSS limited to Tailwind utilities

**Note**: Docusaurus has default styling. For custom components, Tailwind will be configured via `tailwind.config.js`.

### Documentation Standards (Constitution Section)

✅ **PASS**:
- Each chapter will have learning objectives in frontmatter
- Code examples will use language tags (```python, ```bash, ```xml for URDF)
- README.md at root with setup instructions
- Internal docs for deployment (`docs/deployment.md`)

### Development Workflow (Constitution Section)

✅ **PASS**:
- Git version control with branching strategy (draft vs. published)
- Conventional Commits format (`docs(module-1): add ROS 2 fundamentals`)
- Content review before merging to main (published)

**Gate Result**: ✅ **ALL CHECKS PASSED** - Proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-physical-ai-robotics-book/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output: Content authoring best practices
├── data-model.md        # Phase 1 output: Content entity structure
├── quickstart.md        # Phase 1 output: Local development setup guide
├── contracts/           # Phase 1 output: Frontmatter schemas, naming conventions
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Docusaurus Static Site Structure
docs/                           # All markdown content (Docusaurus convention)
├── intro.md                    # Introduction page
├── module-1/                   # ROS 2 Chapter
│   ├── index.md                # Module overview
│   ├── ros2-fundamentals.md
│   ├── urdf-basics.md
│   ├── nodes-services.md
│   └── _category_.json         # Sidebar category config
├── module-2/                   # Digital Twin Chapter
│   ├── index.md
│   ├── gazebo-simulation.md
│   ├── unity-integration.md
│   ├── sensors-modeling.md
│   └── _category_.json
├── module-3/                   # Isaac AI Chapter
│   ├── index.md
│   ├── isaac-sim.md
│   ├── isaac-ros.md
│   ├── perception.md
│   ├── navigation.md
│   └── _category_.json
├── module-4/                   # VLA Chapter
│   ├── index.md
│   ├── vla-overview.md
│   ├── llm-integration.md
│   ├── voice-commands.md
│   ├── slam.md
│   ├── manipulation.md
│   ├── capstone-project.md
│   └── _category_.json
├── appendix/                   # Appendix sections
│   ├── hardware-requirements.md
│   ├── workstation-specs.md
│   ├── edge-device-kit.md
│   ├── robot-lab-options.md
│   ├── lab-architecture.md
│   └── _category_.json
├── roadmap.md                  # 13-week course schedule
└── glossary.md                 # Robotics & AI terms

static/                         # Static assets (Docusaurus convention)
├── img/                        # Images, diagrams, logos
│   ├── diagrams/
│   │   ├── ros2-architecture.svg
│   │   ├── digital-twin-flow.svg
│   │   ├── isaac-pipeline.svg
│   │   └── lab-topology.svg
│   └── hardware/
│       └── component-photos/
└── code-examples/              # Downloadable code archives (optional)
    ├── module-1-ros2.zip
    ├── module-2-gazebo.zip
    └── module-3-isaac.zip

src/                            # Custom React/TS components (future)
├── components/
│   ├── CodeBlock.tsx           # Enhanced code blocks
│   ├── HardwareTable.tsx       # Hardware specs tables
│   └── DiagramViewer.tsx       # Interactive diagrams
├── css/
│   └── custom.css              # Tailwind imports only
└── theme/                      # Docusaurus theme overrides (if needed)

docusaurus.config.js            # Main Docusaurus configuration
sidebars.js                     # Sidebar navigation structure
package.json                    # Node dependencies
tsconfig.json                   # TypeScript configuration
tailwind.config.js              # Tailwind CSS configuration
README.md                       # Project setup instructions
.gitignore                      # Git ignore patterns

# Version Control Structure
.git/
├── branches/
│   ├── main                    # Published version (deployed)
│   ├── draft                   # Work-in-progress content
│   └── feature/*               # Individual content sections

# GitHub Pages Deployment
.github/
└── workflows/
    └── deploy.yml              # GitHub Actions for auto-deployment
```

**Structure Decision**: Selected **Docusaurus static site structure** (single project). This is the standard pattern for documentation sites. All content resides in `/docs/` as markdown files. Sidebar navigation is configured via `sidebars.js` and `_category_.json` files. Custom components (if needed for enhanced UX) go in `/src/components/` as TypeScript React components. Static assets (diagrams, images) in `/static/`. Deployment via GitHub Actions workflow to GitHub Pages.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. Project aligns with all constitutional principles.

---

## Phase 0: Research & Content Strategy

### Research Areas

1. **Docusaurus Best Practices for Technical Books**
   - Multi-module content organization
   - Sidebar configuration for nested chapters
   - Code block syntax highlighting for Python, XML (URDF), YAML (ROS configs)
   - Frontmatter standards for metadata

2. **Content Authoring Conventions**
   - Markdown style guide (headings, lists, tables, admonitions)
   - Code example formatting (language tags, line numbers, annotations)
   - Diagram integration (Mermaid.js for flowcharts, external SVG for architecture)
   - Internal linking conventions (`[text](./page.md)` for relative links)

3. **Hardware Specification Tables**
   - Markdown table format for specs (CPU, GPU, RAM, Storage, Cost)
   - Multi-tier comparison tables (Minimum, Recommended, Optimal)
   - Vendor link formatting (affiliate-safe, accessibility-compliant)

4. **Version Control Strategy for Content**
   - Git branching: `main` (published), `draft` (WIP), `feature/module-X` (individual modules)
   - Commit conventions: `docs(module-1): add ROS 2 publisher example`
   - Review workflow: Draft → Review → Merge to main → Auto-deploy
   - Tagging for content versions: `v1.0.0` (initial release), `v1.1.0` (Module updates)

5. **GitHub Pages Deployment**
   - GitHub Actions workflow for build and deploy
   - Custom domain setup (optional: docs.physical-ai-robotics.com)
   - Build artifact caching for faster deploys
   - Branch protection rules (main requires review)

### Research Deliverable: `research.md`

**Format**:
```markdown
# Research: Physical AI Robotics Book Implementation

## Decision 1: Content Organization Strategy
**Chosen**: Module-based directory structure (`/docs/module-1/`, `/docs/module-2/`, etc.)
**Rationale**: Clear separation of learning units, supports independent navigation, aligns with 13-week roadmap
**Alternatives Considered**: Flat structure (`/docs/ros2-fundamentals.md`), single-file modules
**Rejected Because**: Flat structure scales poorly, single-file modules hurt navigability

## Decision 2: Code Example Management
**Chosen**: Inline code blocks with syntax highlighting + downloadable ZIP archives in `/static/code-examples/`
**Rationale**: Inline examples aid learning flow, downloadable archives support hands-on practice
**Alternatives Considered**: External GitHub repository only, embedded CodeSandbox
**Rejected Because**: External repo breaks reading flow, CodeSandbox requires online access

## Decision 3: Diagram Format
**Chosen**: SVG for architecture diagrams (Excalidraw/draw.io), Mermaid.js for simple flowcharts
**Rationale**: SVG scales well, Mermaid.js renders natively in Docusaurus
**Alternatives Considered**: PNG/JPG raster images, external embed (LucidChart)
**Rejected Because**: Raster images pixelate on zoom, external embeds require authentication

## Decision 4: Versioning Strategy
**Chosen**: Document specific tested versions (ROS 2 Humble, Isaac 2023.1) with update notes for newer versions
**Rationale**: Balances maintainability with student needs, prevents "works on my machine" issues
**Alternatives Considered**: Track multiple parallel versions, lock to initial versions indefinitely
**Rejected Because**: Multiple versions create unsustainable maintenance, locked versions become obsolete

## Decision 5: Frontmatter Schema
**Chosen**:
\```yaml
---
title: "Page Title"
description: "Brief description"
module_id: "module-1"
sidebar_position: 1
tags: ["ros2", "urdf", "fundamentals"]
---
\```
**Rationale**: Consistent metadata enables search, navigation, and future RAG ingestion
**Alternatives Considered**: Minimal frontmatter (title only), no frontmatter
**Rejected Because**: Minimal metadata limits discoverability, no frontmatter breaks Docusaurus features
```

---

## Phase 1: Design Artifacts

### A. Data Model: `data-model.md`

**Entities and Structure**:

```markdown
# Data Model: Physical AI Robotics Book Content

## Entity: Module
**Purpose**: Represents a major learning unit (Introduction, Module 1-4, Appendix, Roadmap, Glossary)

**Attributes**:
- `module_id` (string, unique): `intro`, `module-1`, `module-2`, `module-3`, `module-4`, `appendix`, `roadmap`, `glossary`
- `title` (string): Human-readable name (e.g., "Module 1: The Robotic Nervous System")
- `description` (string): Brief overview (1-2 sentences)
- `sidebar_position` (integer): Order in navigation (1-8)
- `estimated_hours` (integer): Study time estimate
- `prerequisites` (array of module_ids): `["intro"]` for module-1, `["module-1"]` for module-2, etc.

**Files**:
- Directory: `/docs/{module_id}/`
- Index file: `/docs/{module_id}/index.md`
- Child pages: `/docs/{module_id}/{topic-slug}.md`
- Category config: `/docs/{module_id}/_category_.json`

**Example**:
\```json
{
  "label": "Module 1: ROS 2 Nervous System",
  "position": 2,
  "link": {
    "type": "generated-index",
    "description": "Learn ROS 2 fundamentals, URDF, nodes, and services."
  }
}
\```

---

## Entity: Page (Section/Subsection)
**Purpose**: Individual markdown file representing a specific topic within a module

**Attributes**:
- `title` (string): Page title (displayed in browser, sidebar)
- `description` (string): SEO and preview description
- `module_id` (string): Parent module reference
- `sidebar_position` (integer): Order within module
- `tags` (array of strings): Keywords for search and filtering
- `difficulty` (enum): `beginner`, `intermediate`, `advanced`
- `estimated_minutes` (integer): Reading time

**Frontmatter Schema**:
\```yaml
---
title: "ROS 2 Fundamentals"
description: "Introduction to Robot Operating System 2: nodes, topics, and architecture."
module_id: "module-1"
sidebar_position: 1
tags: ["ros2", "architecture", "fundamentals"]
difficulty: beginner
estimated_minutes: 15
---
\```

**Content Structure**:
1. Learning objectives (bullet list at top)
2. Conceptual explanation (text + diagrams)
3. Code examples (inline with annotations)
4. Hands-on exercise (step-by-step instructions)
5. Key takeaways (summary box)
6. Next steps (link to next topic)

---

## Entity: Code Example
**Purpose**: Runnable code snippet embedded in page content

**Attributes**:
- `language` (string): `python`, `bash`, `xml`, `yaml`, `cpp`
- `title` (string, optional): Example name (e.g., "Hello World Publisher")
- `filename` (string, optional): Suggested save name (e.g., `publisher.py`)
- `line_numbers` (boolean): Show line numbers (default: true)
- `highlights` (array of line ranges): `[5-7, 12]` to emphasize key lines

**Markdown Syntax**:
\```python title="publisher.py" showLineNumbers {5-7,12}
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class HelloPublisher(Node):
    def __init__(self):
        super().__init__('hello_publisher')
        self.publisher_ = self.create_publisher(String, 'hello_topic', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello, ROS 2!'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Published: {msg.data}')

def main(args=None):
    rclpy.init(args=args)
    node = HelloPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
\```

---

## Entity: Hardware Specification
**Purpose**: Structured data for workstation, edge device, and robot lab specs

**Attributes**:
- `tier` (enum): `minimum`, `recommended`, `optimal`
- `component_type` (string): `cpu`, `gpu`, `ram`, `storage`, `os`, `network`
- `specification` (string): Human-readable spec (e.g., "Intel i7-12700K")
- `vendor_links` (array of URLs): Purchase links (optional)
- `estimated_cost` (string): Price range (e.g., "$300-400")

**Markdown Table Format**:
| Component | Minimum | Recommended | Optimal |
|-----------|---------|-------------|---------|
| CPU | Intel i5-11400 / AMD Ryzen 5 5600 | Intel i7-12700K / AMD Ryzen 7 5800X | Intel i9-13900K / AMD Ryzen 9 7950X |
| GPU | Integrated graphics | NVIDIA RTX 3060 (12GB VRAM) | NVIDIA RTX 4080 (16GB VRAM) |
| RAM | 16GB DDR4 | 32GB DDR4/DDR5 | 64GB DDR5 |
| Storage | 256GB SSD | 1TB NVMe SSD | 2TB NVMe SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Est. Cost | $800-1000 | $1500-2000 | $3000-4000 |

---

## Entity: Weekly Schedule
**Purpose**: Maps modules/topics to 13-week semester calendar

**Attributes**:
- `week_number` (integer): 1-13
- `topics` (array of strings): Topics covered this week
- `module_ids` (array): Corresponding modules
- `learning_objectives` (array): Week-specific goals
- `deliverables` (array): Assignments, labs, quizzes
- `estimated_hours` (integer): Weekly study time

**Markdown Format**:
### Week 1: Introduction & ROS 2 Basics
- **Topics**: Course overview, ROS 2 installation, first node
- **Modules**: Introduction, Module 1 (sections 1-2)
- **Learning Objectives**:
  - Understand Physical AI landscape
  - Install ROS 2 Humble on Ubuntu 22.04
  - Create and run a basic ROS 2 publisher
- **Deliverables**: Lab 1 - Hello ROS 2 Publisher
- **Estimated Hours**: 8-10 hours

---

## Entity: Diagram/Figure
**Purpose**: Visual aid for complex concepts (system architecture, data flow, network topology)

**Attributes**:
- `figure_id` (string, unique): `fig-ros2-architecture`, `fig-lab-topology`
- `title` (string): Caption text
- `format` (enum): `svg`, `png`, `mermaid`
- `file_path` (string): `/static/img/diagrams/{figure_id}.svg`
- `alt_text` (string): Accessibility description

**Markdown Syntax**:
![ROS 2 Architecture](./static/img/diagrams/ros2-architecture.svg "ROS 2 Node Communication Architecture")
*Figure 1.1: ROS 2 node communication via topics and services*

---

## Entity: Glossary Term
**Purpose**: Define robotics and AI terminology

**Attributes**:
- `term` (string): Term name (e.g., "URDF")
- `definition` (string): Brief explanation
- `related_terms` (array): Cross-references
- `module_references` (array): Where term appears

**Markdown Format**:
### URDF (Unified Robot Description Format)
XML-based format for describing robot kinematics, dynamics, and visual properties. Used in ROS 2 and Gazebo for robot modeling.

**Related Terms**: SDF (Simulation Description Format), Xacro
**Appears in**: Module 1, Module 2
```

---

### B. Contracts: `/contracts/`

**Purpose**: Define schemas, naming conventions, and validation rules for consistent content creation.

#### File: `contracts/frontmatter-schema.json`
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Docusaurus Page Frontmatter",
  "type": "object",
  "required": ["title", "description", "module_id"],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 5,
      "maxLength": 100,
      "description": "Page title displayed in browser and sidebar"
    },
    "description": {
      "type": "string",
      "minLength": 20,
      "maxLength": 200,
      "description": "SEO and preview description"
    },
    "module_id": {
      "type": "string",
      "enum": ["intro", "module-1", "module-2", "module-3", "module-4", "appendix", "roadmap", "glossary"],
      "description": "Parent module identifier"
    },
    "sidebar_position": {
      "type": "integer",
      "minimum": 1,
      "description": "Order within module sidebar"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Keywords for search and filtering"
    },
    "difficulty": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"],
      "description": "Content difficulty level"
    },
    "estimated_minutes": {
      "type": "integer",
      "minimum": 5,
      "description": "Estimated reading time in minutes"
    }
  }
}
```

#### File: `contracts/naming-conventions.md`
```markdown
# Naming Conventions

## File Names
- **Format**: `{topic-slug}.md` (lowercase, hyphen-separated)
- **Examples**:
  - `ros2-fundamentals.md`
  - `gazebo-simulation.md`
  - `isaac-ros-integration.md`
  - `voice-commands.md`

## Module IDs
- **Format**: `module-{number}` or special names
- **Valid Values**: `intro`, `module-1`, `module-2`, `module-3`, `module-4`, `appendix`, `roadmap`, `glossary`

## Figure IDs
- **Format**: `fig-{module}-{descriptor}`
- **Examples**:
  - `fig-module1-ros2-architecture`
  - `fig-module2-gazebo-workflow`
  - `fig-appendix-lab-topology`

## Code Example Filenames
- **Format**: `{language}-{descriptor}.{ext}`
- **Examples**:
  - `python-publisher.py`
  - `urdf-robot-model.xml`
  - `yaml-launch-config.yaml`

## Branch Names
- **main**: Published, deployed version
- **draft**: Work-in-progress content
- **feature/{module-id}-{topic}**: Individual topic branches (e.g., `feature/module-1-urdf-basics`)

## Commit Message Format (Conventional Commits)
- **docs(module-1)**: Add/update Module 1 content
- **docs(appendix)**: Add/update Appendix content
- **fix(typo)**: Fix typos or grammar
- **feat(diagrams)**: Add new diagrams
- **chore(build)**: Update build configuration
```

#### File: `contracts/content-template.md`
```markdown
---
title: "[Topic Title]"
description: "[1-2 sentence description of what this page covers]"
module_id: "[module-X]"
sidebar_position: [N]
tags: ["tag1", "tag2", "tag3"]
difficulty: [beginner|intermediate|advanced]
estimated_minutes: [N]
---

# [Topic Title]

## Learning Objectives

By the end of this section, you will be able to:
- [Objective 1]
- [Objective 2]
- [Objective 3]

## Introduction

[Brief context and motivation for this topic. Why is it important?]

## Conceptual Overview

[Explain the "what" and "why" before diving into details]

### Key Concept 1

[Explanation with diagrams if needed]

![Diagram Title](./path/to/diagram.svg)

### Key Concept 2

[Explanation]

## Hands-On Example

[Introduce the practical example]

\```python title="example-name.py" showLineNumbers
# Code example with comments
# Line-by-line explanation where helpful
\```

**What this code does**:
1. [Step 1 explanation]
2. [Step 2 explanation]
3. [Step 3 explanation]

## Exercise: [Exercise Title]

**Goal**: [What the student will build/achieve]

**Prerequisites**: [Required tools, installations, prior knowledge]

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Output**:
\```bash
# Show expected terminal output or results
\```

## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

## Next Steps

Continue to [Next Topic](./next-topic.md) to learn about [brief description].

## Further Reading

- [External Resource 1](https://url.com)
- [External Resource 2](https://url.com)
```

---

### C. Quickstart Guide: `quickstart.md`

```markdown
# Quickstart: Local Development Setup

This guide helps you set up the Physical AI & Humanoid Robotics book locally for content authoring and testing.

## Prerequisites

- **Node.js**: v18.0 or higher ([download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **Git**: For version control
- **Code Editor**: VS Code recommended (with Markdown extensions)

## Installation

### 1. Clone the Repository

\```bash
git clone https://github.com/your-org/physical-ai-robotics-book.git
cd physical-ai-robotics-book
\```

### 2. Install Dependencies

\```bash
npm install
# or
yarn install
\```

This installs Docusaurus and all plugins.

### 3. Start Development Server

\```bash
npm start
# or
yarn start
\```

The site opens at `http://localhost:3000`. Changes to markdown files hot-reload automatically.

## Project Structure

\```
docs/               # All markdown content
├── intro.md
├── module-1/
├── module-2/
├── module-3/
├── module-4/
├── appendix/
├── roadmap.md
└── glossary.md

static/             # Images, diagrams, downloadable files
├── img/
└── code-examples/

docusaurus.config.js  # Site configuration
sidebars.js          # Navigation structure
\```

## Content Authoring Workflow

### Adding a New Page

1. Create a markdown file in the appropriate module directory:
   \```bash
   touch docs/module-1/new-topic.md
   \```

2. Add frontmatter:
   \```yaml
   ---
   title: "New Topic Title"
   description: "Brief description"
   module_id: "module-1"
   sidebar_position: 5
   tags: ["ros2", "example"]
   difficulty: beginner
   estimated_minutes: 10
   ---
   \```

3. Write content following the [content template](./contracts/content-template.md)

4. Verify it appears in the sidebar navigation

### Adding Diagrams

1. Create SVG diagram using Excalidraw, draw.io, or similar tool
2. Export as SVG
3. Save to `static/img/diagrams/fig-{module}-{descriptor}.svg`
4. Reference in markdown:
   \```markdown
   ![Diagram Title](/img/diagrams/fig-module1-architecture.svg)
   \```

### Adding Code Examples

Inline code blocks:
\```python title="example.py" showLineNumbers {5-7}
# Your code here
\```

For downloadable archives, place ZIP files in:
\```
static/code-examples/module-1-examples.zip
\```

Reference with download link:
\```markdown
[Download Module 1 Code Examples](/code-examples/module-1-examples.zip)
\```

## Testing

### Build for Production

\```bash
npm run build
# or
yarn build
\```

This generates static files in `build/` directory.

### Serve Production Build Locally

\```bash
npm run serve
# or
yarn serve
\```

Verifies the production build works correctly.

### Check for Broken Links

\```bash
npm run check-links
# (requires docusaurus-plugin-broken-links configured)
\```

## Version Control

### Branching Strategy

- **main**: Published version (auto-deploys to GitHub Pages)
- **draft**: Work-in-progress content
- **feature/{module-id}-{topic}**: Individual topic branches

### Creating a Feature Branch

\```bash
git checkout draft
git pull origin draft
git checkout -b feature/module-1-urdf-basics
\```

### Committing Changes

Use Conventional Commits format:

\```bash
git add docs/module-1/urdf-basics.md
git commit -m "docs(module-1): add URDF basics section"
git push origin feature/module-1-urdf-basics
\```

### Merging to Draft

1. Create pull request from `feature/{branch}` → `draft`
2. Request review from content team
3. Merge after approval

### Publishing to Main

1. Create pull request from `draft` → `main`
2. Final review and approval
3. Merge triggers GitHub Actions deployment to GitHub Pages

## Deployment

Deployment is automated via GitHub Actions (see `.github/workflows/deploy.yml`).

**Trigger**: Push to `main` branch
**Action**: Build Docusaurus site → Deploy to GitHub Pages
**URL**: `https://your-org.github.io/physical-ai-robotics-book/`

## Troubleshooting

### Port 3000 Already in Use

\```bash
npm start -- --port 3001
\```

### Build Fails with Broken Links

Check the error output for broken internal links. Fix references in markdown files.

### Sidebar Not Updating

Clear cache and restart:
\```bash
rm -rf .docusaurus
npm start
\```

## Further Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
```

---

## Phase 2: Reserved for `/sp.tasks`

Tasks generation will be performed by the `/sp.tasks` command after this plan is approved.

---

## Summary

**Generated Artifacts**:
1. ✅ `plan.md` (this file) - Complete implementation plan with folder structure, naming conventions, file paths
2. ⏳ `research.md` (Phase 0) - Content authoring best practices, Docusaurus configuration decisions
3. ⏳ `data-model.md` (Phase 1) - Content entity definitions (Module, Page, Code Example, Hardware Spec, etc.)
4. ⏳ `contracts/` (Phase 1) - Frontmatter schema, naming conventions, content template
5. ⏳ `quickstart.md` (Phase 1) - Local development setup guide

**Next Steps**:
1. Approve this plan
2. Generate Phase 0 research document (resolve any remaining technical decisions)
3. Generate Phase 1 design artifacts (data model, contracts, quickstart)
4. Run `/sp.tasks` to create actionable task breakdown for content authoring and Docusaurus setup
