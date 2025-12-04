# Tasks: Physical AI & Humanoid Robotics Technical Book

**Input**: Design documents from `/specs/001-physical-ai-robotics-book/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: Tests are NOT requested for this documentation project. Tasks focus on content authoring, structure, and deployment.

**Organization**: Tasks are grouped by user story (priority order: P1 → P2 → P3) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Docusaurus project**: `docs/` for markdown content, `static/` for assets, repository root for configuration
- All paths shown below are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Docusaurus structure

- [ ] T001 Initialize Docusaurus project with TypeScript support at repository root
- [ ] T002 [P] Install dependencies: Docusaurus 3.x, Node.js 18+, React 18+, Tailwind CSS plugin
- [ ] T003 [P] Configure docusaurus.config.js with site metadata, theme, and navigation
- [ ] T004 [P] Configure tsconfig.json for strict TypeScript mode
- [ ] T005 [P] Configure tailwind.config.js for Tailwind CSS integration
- [ ] T006 [P] Create .gitignore for Node modules, build artifacts, and Docusaurus cache
- [ ] T007 [P] Create README.md at repository root with setup instructions and project overview
- [ ] T008 Create docs/ directory structure: docs/module-1/, docs/module-2/, docs/module-3/, docs/module-4/, docs/appendix/
- [ ] T009 [P] Create static/img/diagrams/ directory for SVG diagrams
- [ ] T010 [P] Create static/code-examples/ directory for downloadable ZIP archives

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and templates that MUST be complete before content authoring

**⚠️ CRITICAL**: No content authoring can begin until this phase is complete

- [ ] T011 Create sidebars.js configuration file mapping module structure to sidebar navigation
- [ ] T012 [P] Create _category_.json template for module directories (label, position, description)
- [ ] T013 [P] Create frontmatter template (title, description, module_id, sidebar_position, tags, difficulty, estimated_minutes)
- [ ] T014 [P] Configure Prism syntax highlighting themes for Python, Bash, XML (URDF), YAML, C++
- [ ] T015 [P] Setup GitHub Actions workflow in .github/workflows/deploy.yml for build and deploy to GitHub Pages
- [ ] T016 [P] Create git branches: main (published), draft (staging)
- [ ] T017 Configure docusaurus-plugin-broken-links for link validation

**Checkpoint**: Foundation ready - content authoring can now begin in parallel

---

## Phase 3: User Story 1 & 5 - Core Content Navigation & Code Examples (Priority: P1) 🎯 MVP

**Goal**: Deliver structured module content with navigation, formatting, code examples, and responsive design

**Independent Test**: Deploy Docusaurus site with all module content and verify navigation, code syntax highlighting, responsive design across devices

**Note**: US1 (Content Navigation) and US5 (Code Examples) are implemented together as they're tightly coupled - code examples are embedded within content pages.

### Content Drafting - Introduction

- [ ] T018 [P] [US1] Create docs/intro.md with frontmatter, course overview, goals, and learning outcomes
- [ ] T019 [P] [US1] Add target audience section to docs/intro.md (prerequisites, assumed knowledge)
- [ ] T020 [P] [US1] Add pedagogical approach section to docs/intro.md (conceptual + theoretical + practical)

### Content Drafting - Module 1: ROS 2

- [ ] T021 [P] [US1] Create docs/module-1/index.md with module overview and learning objectives
- [ ] T022 [P] [US1] Create docs/module-1/_category_.json (label: "Module 1: ROS 2", position: 2)
- [ ] T023 [P] [US1] [US5] Create docs/module-1/ros2-fundamentals.md with ROS 2 architecture explanation + Hello World Publisher code example (Python, showLineNumbers)
- [ ] T024 [P] [US1] [US5] Create docs/module-1/urdf-basics.md with URDF structure explanation + simple robot model code example (XML)
- [ ] T025 [P] [US1] [US5] Create docs/module-1/nodes-services.md with node communication explanation + publisher-subscriber code examples (Python)

### Content Drafting - Module 2: Digital Twin

- [ ] T026 [P] [US1] Create docs/module-2/index.md with module overview and learning objectives
- [ ] T027 [P] [US1] Create docs/module-2/_category_.json (label: "Module 2: Digital Twin", position: 3)
- [ ] T028 [P] [US1] [US5] Create docs/module-2/gazebo-simulation.md with Gazebo basics + launch file code example (XML/YAML)
- [ ] T029 [P] [US1] [US5] Create docs/module-2/unity-integration.md with Unity setup + bridge configuration code example (Python/YAML)
- [ ] T030 [P] [US1] [US5] Create docs/module-2/sensors-modeling.md with sensor plugins + camera/LiDAR URDF snippets (XML)
- [ ] T031 [P] [US1] [US5] Create docs/module-2/environment-building.md with world files + SDF examples (XML)

### Content Drafting - Module 3: Isaac AI

- [ ] T032 [P] [US1] Create docs/module-3/index.md with module overview and learning objectives
- [ ] T033 [P] [US1] Create docs/module-3/_category_.json (label: "Module 3: Isaac AI", position: 4)
- [ ] T034 [P] [US1] [US5] Create docs/module-3/isaac-sim.md with Isaac Sim setup + basic scene code example (Python)
- [ ] T035 [P] [US1] [US5] Create docs/module-3/isaac-ros.md with Isaac ROS integration + perception pipeline code example (Python)
- [ ] T036 [P] [US1] [US5] Create docs/module-3/perception.md with object detection + segmentation code examples (Python)
- [ ] T037 [P] [US1] [US5] Create docs/module-3/navigation.md with Nav2 configuration + path planning code examples (Python/YAML)

### Content Drafting - Module 4: VLA & Capstone

- [ ] T038 [P] [US1] Create docs/module-4/index.md with module overview and learning objectives
- [ ] T039 [P] [US1] Create docs/module-4/_category_.json (label: "Module 4: VLA & Capstone", position: 5)
- [ ] T040 [P] [US1] [US5] Create docs/module-4/vla-overview.md with VLA concept explanation + architecture diagram reference
- [ ] T041 [P] [US1] [US5] Create docs/module-4/llm-integration.md with LLM API integration + prompt engineering code examples (Python)
- [ ] T042 [P] [US1] [US5] Create docs/module-4/voice-commands.md with speech recognition + command parsing code examples (Python)
- [ ] T043 [P] [US1] [US5] Create docs/module-4/slam.md with SLAM configuration + mapping code examples (Python/YAML)
- [ ] T044 [P] [US1] [US5] Create docs/module-4/manipulation.md with grasp planning + manipulation code examples (Python)
- [ ] T045 [US1] Create docs/module-4/capstone-project.md with project options, requirements, deliverables, and rubric

### Metadata & Front-Matter Addition

- [ ] T046 [US1] Validate all frontmatter fields across all created markdown files (title, description, module_id, sidebar_position, tags, difficulty, estimated_minutes)
- [ ] T047 [US1] Add difficulty levels to all module pages (beginner/intermediate/advanced)
- [ ] T048 [US1] Add estimated reading times to all module pages

### Code Examples - Downloadable Archives

- [ ] T049 [P] [US5] Create static/code-examples/module-1-ros2.zip with all Module 1 code examples + README.md
- [ ] T050 [P] [US5] Create static/code-examples/module-2-gazebo.zip with all Module 2 code examples + README.md
- [ ] T051 [P] [US5] Create static/code-examples/module-3-isaac.zip with all Module 3 code examples + README.md
- [ ] T052 [P] [US5] Create static/code-examples/module-4-vla.zip with all Module 4 code examples + README.md

### Diagrams & Figures

- [ ] T053 [P] [US1] Create static/img/diagrams/fig-module1-ros2-architecture.svg (ROS 2 node communication architecture)
- [ ] T054 [P] [US1] Create static/img/diagrams/fig-module2-digital-twin-flow.svg (Gazebo/Unity simulation workflow)
- [ ] T055 [P] [US1] Create static/img/diagrams/fig-module3-isaac-pipeline.svg (Isaac perception pipeline)
- [ ] T056 [P] [US1] Create static/img/diagrams/fig-module4-vla-architecture.svg (VLA model integration)

**Checkpoint**: At this point, US1 (Core Content Navigation) and US5 (Code Examples) are fully functional - students can navigate all modules, read content, view syntax-highlighted code, and download code archives

---

## Phase 4: User Story 2 - Weekly Roadmap & Course Planning (Priority: P2)

**Goal**: Provide 13-week course roadmap with pacing, milestones, and module mappings

**Independent Test**: Create dedicated "Course Roadmap" page displaying 13-week breakdown with module mappings, prerequisites, and deliverables per week

### Content Drafting - Roadmap

- [ ] T057 [P] [US2] Create docs/roadmap.md with frontmatter and 13-week course structure
- [ ] T058 [P] [US2] Add Week 1-4 content to docs/roadmap.md (Introduction + Module 1 ROS 2)
- [ ] T059 [P] [US2] Add Week 5-7 content to docs/roadmap.md (Module 2 Digital Twin)
- [ ] T060 [P] [US2] Add Week 8-10 content to docs/roadmap.md (Module 3 Isaac AI)
- [ ] T061 [P] [US2] Add Week 11-13 content to docs/roadmap.md (Module 4 VLA + Capstone)
- [ ] T062 [US2] Add week-by-week learning objectives, deliverables, and estimated hours to docs/roadmap.md
- [ ] T063 [US2] Add prerequisite indicators (which topics must be completed before starting each week) to docs/roadmap.md

### Sidebar Integration

- [ ] T064 [US2] Update sidebars.js to include roadmap page in main navigation

**Checkpoint**: US2 (Weekly Roadmap) is complete - students and instructors can view 13-week schedule with pacing guidance

---

## Phase 5: User Story 3 - Hardware Requirements & Lab Setup (Priority: P2)

**Goal**: Provide detailed hardware specifications, vendor recommendations, cost estimates, and alternative configurations

**Independent Test**: Create Appendix pages with workstation specs, edge device kits, robot lab options, and cloud alternatives

### Content Drafting - Appendix Hardware Specs

- [ ] T065 [P] [US3] Create docs/appendix/index.md with appendix overview
- [ ] T066 [P] [US3] Create docs/appendix/_category_.json (label: "Appendix", position: 7)
- [ ] T067 [US3] Create docs/appendix/hardware-requirements.md with overview of hardware needs for the course
- [ ] T068 [US3] Create docs/appendix/workstation-specs.md with three-tier comparison table (Minimum, Recommended, Optimal) for CPU, GPU, RAM, Storage, OS, Est. Cost
- [ ] T069 [US3] Create docs/appendix/edge-device-kit.md with edge device parts list, specifications, quantities, assembly instructions, and vendor links
- [ ] T070 [US3] Create docs/appendix/robot-lab-options.md with three lab tiers: simulation-only, edge device kit, full physical robot lab (with cost ranges)
- [ ] T071 [US3] Add cloud-based alternatives section to docs/appendix/workstation-specs.md (AWS RoboMaker, Google Cloud, Azure) with cost estimates

### Hardware Tables

- [ ] T072 [US3] Build Markdown comparison table in docs/appendix/workstation-specs.md with 6 rows (CPU, GPU, RAM, Storage, OS, Est. Cost) × 3 columns (Min, Rec, Opt)
- [ ] T073 [US3] Build edge device parts table in docs/appendix/edge-device-kit.md with columns: Component, Model, Quantity, Est. Cost, Vendor Link

**Checkpoint**: US3 (Hardware Requirements) is complete - learners and institutions have clear hardware guidance for equipment procurement

---

## Phase 6: User Story 4 - Lab Architecture & System Overview (Priority: P3)

**Goal**: Provide complete system topology showing how simulation rigs, edge devices, sensors, actuators, and network infrastructure interconnect

**Independent Test**: Create Lab Architecture page with diagrams, network topology, data flow charts, and component integration explanations

### Content Drafting - Lab Architecture

- [ ] T074 [P] [US4] Create docs/appendix/lab-architecture.md with system topology overview
- [ ] T075 [US4] Add multi-user robotics lab architecture section to docs/appendix/lab-architecture.md (workstation + edge device + robot network topology)
- [ ] T076 [US4] Add sensor integration section to docs/appendix/lab-architecture.md (cameras, LiDAR, IMUs → edge devices → simulation rig data flow)
- [ ] T077 [US4] Add deployment stages section to docs/appendix/lab-architecture.md (simulation → edge testing → physical deployment)
- [ ] T078 [US4] Add security considerations section to docs/appendix/lab-architecture.md (network segmentation, data privacy, access control)

### Lab Architecture Diagrams

- [ ] T079 [P] [US4] Create static/img/diagrams/fig-appendix-lab-topology.svg (multi-user lab network topology with workstations, edge devices, robots)
- [ ] T080 [P] [US4] Create static/img/diagrams/fig-appendix-sensor-integration.svg (sensor data flow from cameras/LiDAR/IMUs through edge devices)
- [ ] T081 [P] [US4] Create static/img/diagrams/fig-appendix-deployment-stages.svg (simulation → edge → physical deployment workflow)

**Checkpoint**: US4 (Lab Architecture) is complete - lab administrators have detailed system topology for multi-user robotics lab setup

---

## Phase 7: User Story 6 - Capstone Project Guidance (Priority: P3)

**Goal**: Provide Capstone project options, requirements, submission guidelines, and grading rubrics

**Independent Test**: Verify docs/module-4/capstone-project.md includes 3-5 project options with deliverables, timelines, and rubrics

**Note**: T045 already created docs/module-4/capstone-project.md in Phase 3. This phase adds detailed content.

### Content Enhancement - Capstone

- [ ] T082 [US6] Add 3-5 project options to docs/module-4/capstone-project.md with varying complexity (beginner, intermediate, advanced)
- [ ] T083 [US6] Add deliverables section to docs/module-4/capstone-project.md (code repository, documentation, video demo, technical report)
- [ ] T084 [US6] Add evaluation rubric table to docs/module-4/capstone-project.md (technical implementation 40%, documentation 20%, creativity 20%, demo quality 20%)
- [ ] T085 [US6] Add suggested timelines section to docs/module-4/capstone-project.md (2-4 weeks breakdown)
- [ ] T086 [US6] Add resources section to docs/module-4/capstone-project.md (community forums, Discord, office hours links)

**Checkpoint**: US6 (Capstone Guidance) is complete - students have clear project options and evaluation criteria

---

## Phase 8: Glossary & Cross-Cutting Content

**Purpose**: Add glossary and cross-cutting documentation

- [ ] T087 [P] Create docs/glossary.md with robotics and AI terminology (URDF, ROS 2, SLAM, VLA, LiDAR, Isaac Sim, etc.)
- [ ] T088 Add 30-50 glossary terms to docs/glossary.md with definitions, related terms, and module references
- [ ] T089 [P] Update sidebars.js to include glossary page in main navigation

---

## Phase 9: Build & Deployment Configuration

**Purpose**: Finalize build configuration and deployment setup

- [ ] T090 Create .github/workflows/deploy.yml GitHub Actions workflow for build and deploy on push to main
- [ ] T091 Configure GitHub Pages deployment settings (branch: gh-pages, root: /)
- [ ] T092 [P] Add build script to package.json: "build": "docusaurus build"
- [ ] T093 [P] Add serve script to package.json: "serve": "docusaurus serve"
- [ ] T094 [P] Add start script to package.json: "start": "docusaurus start"
- [ ] T095 Test local build: Run `npm run build` and verify build succeeds without errors
- [ ] T096 Test local serve: Run `npm run serve` and verify site loads at http://localhost:3000
- [ ] T097 Test broken link checker: Run `npm run build` and verify no broken internal links

---

## Phase 10: Review & Quality Assurance

**Purpose**: Content review, proofreading, and validation

- [ ] T098 Proofread all Module 1 content for grammar, spelling, and technical accuracy
- [ ] T099 Proofread all Module 2 content for grammar, spelling, and technical accuracy
- [ ] T100 Proofread all Module 3 content for grammar, spelling, and technical accuracy
- [ ] T101 Proofread all Module 4 content for grammar, spelling, and technical accuracy
- [ ] T102 Proofread Introduction, Roadmap, Appendix, and Glossary for grammar and clarity
- [ ] T103 Validate all code examples run successfully in ROS 2 Humble + Gazebo + Isaac environment (Module 1-4)
- [ ] T104 Validate all internal links work correctly (click through all pages and navigation)
- [ ] T105 Test responsive design on mobile device (< 768px width) - verify no horizontal scrolling
- [ ] T106 Test responsive design on tablet device (768px - 996px width) - verify collapsible sidebar
- [ ] T107 Test responsive design on desktop device (> 996px width) - verify full sidebar + content
- [ ] T108 Validate accessibility: Run axe DevTools and Lighthouse accessibility audit (target score ≥ 90)
- [ ] T109 Validate SEO: Check all pages have proper meta descriptions, titles, and Open Graph tags

---

## Phase 11: Publish & Deploy

**Purpose**: Final deployment to GitHub Pages

- [ ] T110 Merge all content from draft branch to main branch (triggers GitHub Actions deployment)
- [ ] T111 Verify deployment succeeded: Check GitHub Actions workflow run status
- [ ] T112 Verify site is live: Visit GitHub Pages URL and confirm all content loads correctly
- [ ] T113 Verify search functionality works: Test Docusaurus search bar with sample queries
- [ ] T114 Create git tag for v1.0.0 release: `git tag -a v1.0.0 -m "Initial release of Physical AI Robotics Book"`
- [ ] T115 Push tag to remote: `git push origin v1.0.0`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all content authoring
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - Phase 3 (US1 + US5): Can start after Foundational (MVP - highest priority)
  - Phase 4 (US2): Can start after Foundational (independent of US1)
  - Phase 5 (US3): Can start after Foundational (independent of US1)
  - Phase 6 (US4): Can start after Foundational (independent of US1)
  - Phase 7 (US6): Can start after Foundational (independent of US1)
- **Glossary (Phase 8)**: Can proceed in parallel with user stories
- **Build & Deployment (Phase 9)**: Depends on content completion (at least MVP US1+US5)
- **Review & QA (Phase 10)**: Depends on content completion
- **Publish (Phase 11)**: Depends on Review & QA passing

### User Story Dependencies

- **US1 + US5 (Core Content + Code)**: No dependencies on other stories - can be MVP
- **US2 (Roadmap)**: Independent - can proceed in parallel with US1
- **US3 (Hardware Specs)**: Independent - can proceed in parallel with US1
- **US4 (Lab Architecture)**: Independent - can proceed in parallel with US1
- **US6 (Capstone)**: Logically depends on US1 (capstone content is in Module 4), but file was created in Phase 3 - enhancement can proceed independently

### Within Each Phase

- **Phase 1 (Setup)**: All tasks marked [P] can run in parallel after T001 (project init)
- **Phase 2 (Foundational)**: All tasks marked [P] can run in parallel
- **Phase 3 (US1+US5)**: Most content tasks marked [P] can run in parallel (different files) - T046-T048 (metadata validation) must come after content creation
- **Phase 4 (US2)**: Roadmap weeks (T058-T061) can run in parallel
- **Phase 5 (US3)**: Hardware spec pages (T065-T071) can run in parallel
- **Phase 6 (US4)**: Lab architecture diagrams (T079-T081) can run in parallel
- **Phase 10 (Review)**: Proofreading tasks (T098-T102) can run in parallel, validation tasks (T103-T109) must run sequentially after proofreading

---

## Parallel Execution Examples

### Phase 3: User Story 1 + 5 (Core Content + Code Examples)

**Parallel Content Authoring** (all module content can be authored simultaneously by different team members):

```bash
# Team Member 1: Module 1
Task T023: Create docs/module-1/ros2-fundamentals.md
Task T024: Create docs/module-1/urdf-basics.md
Task T025: Create docs/module-1/nodes-services.md

# Team Member 2: Module 2
Task T028: Create docs/module-2/gazebo-simulation.md
Task T029: Create docs/module-2/unity-integration.md
Task T030: Create docs/module-2/sensors-modeling.md
Task T031: Create docs/module-2/environment-building.md

# Team Member 3: Module 3
Task T034: Create docs/module-3/isaac-sim.md
Task T035: Create docs/module-3/isaac-ros.md
Task T036: Create docs/module-3/perception.md
Task T037: Create docs/module-3/navigation.md

# Team Member 4: Module 4
Task T040: Create docs/module-4/vla-overview.md
Task T041: Create docs/module-4/llm-integration.md
Task T042: Create docs/module-4/voice-commands.md
Task T043: Create docs/module-4/slam.md
Task T044: Create docs/module-4/manipulation.md
Task T045: Create docs/module-4/capstone-project.md

# Team Member 5: Code Archives
Task T049: Create module-1-ros2.zip
Task T050: Create module-2-gazebo.zip
Task T051: Create module-3-isaac.zip
Task T052: Create module-4-vla.zip

# Team Member 6: Diagrams
Task T053: Create fig-module1-ros2-architecture.svg
Task T054: Create fig-module2-digital-twin-flow.svg
Task T055: Create fig-module3-isaac-pipeline.svg
Task T056: Create fig-module4-vla-architecture.svg
```

### Phase 2: Foundational (All can run in parallel after Phase 1)

```bash
# Multiple tasks can be completed simultaneously:
Task T012: Create _category_.json template
Task T013: Create frontmatter template
Task T014: Configure Prism syntax highlighting
Task T015: Setup GitHub Actions workflow
Task T016: Create git branches
Task T017: Configure broken link checker
```

---

## Implementation Strategy

### MVP First (User Story 1 + 5 Only)

**Minimal Viable Product scope**:

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 + 5 (Core Content Navigation + Code Examples)
4. **STOP and VALIDATE**: Test MVP independently
   - Deploy to GitHub Pages
   - Navigate all modules (Intro, Module 1-4, Appendix index)
   - Verify code syntax highlighting works
   - Test responsive design on mobile/tablet/desktop
5. **Deploy/demo MVP**

**MVP Delivers**:
- Structured book website with all 4 modules + Introduction
- Navigation via sidebar (Intro → Module 1 → Module 2 → Module 3 → Module 4)
- Code examples with syntax highlighting
- Responsive design
- Downloadable code archives
- Architecture diagrams

**What's NOT in MVP**:
- Weekly roadmap (US2)
- Detailed hardware specs tables (US3)
- Lab architecture diagrams (US4)
- Enhanced Capstone rubrics (US6)
- Glossary

### Incremental Delivery

**Iteration 1: MVP (US1 + US5)**
- Tasks: T001-T056
- Deliverable: Browsable book with all modules and code examples
- Test: US1 + US5 acceptance scenarios pass
- Deploy to GitHub Pages

**Iteration 2: Add Roadmap (US2)**
- Tasks: T057-T064
- Deliverable: 13-week course schedule page
- Test: US2 acceptance scenarios pass
- Deploy update to GitHub Pages

**Iteration 3: Add Hardware Specs (US3)**
- Tasks: T065-T073
- Deliverable: Complete Appendix with hardware requirements
- Test: US3 acceptance scenarios pass
- Deploy update

**Iteration 4: Add Lab Architecture (US4)**
- Tasks: T074-T081
- Deliverable: Lab topology diagrams and setup guidance
- Test: US4 acceptance scenarios pass
- Deploy update

**Iteration 5: Enhance Capstone (US6)**
- Tasks: T082-T086
- Deliverable: Detailed project options and rubrics
- Test: US6 acceptance scenarios pass
- Deploy update

**Iteration 6: Polish & Publish v1.0.0**
- Tasks: T087-T115 (Glossary, Build, Review, Deploy)
- Deliverable: Complete v1.0.0 release on GitHub Pages
- Test: All acceptance scenarios pass, accessibility/SEO validated

### Parallel Team Strategy

With multiple content authors:

1. Team completes Setup + Foundational together (T001-T017)
2. Once Foundational is done:
   - **Author 1**: Module 1 content (T023-T025)
   - **Author 2**: Module 2 content (T028-T031)
   - **Author 3**: Module 3 content (T034-T037)
   - **Author 4**: Module 4 content (T040-T045)
   - **Author 5**: Roadmap (T057-T063)
   - **Author 6**: Hardware specs (T065-T073)
   - **Diagram Designer**: All diagrams (T053-T056, T079-T081)
3. Content review proceeds in parallel (T098-T102)
4. Final integration, QA, and publish (T103-T115)

---

## Task Summary

**Total Tasks**: 115 tasks

**Tasks per Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (US1 + US5 - MVP): 39 tasks
- Phase 4 (US2): 8 tasks
- Phase 5 (US3): 9 tasks
- Phase 6 (US4): 8 tasks
- Phase 7 (US6): 5 tasks
- Phase 8 (Glossary): 3 tasks
- Phase 9 (Build & Deploy): 8 tasks
- Phase 10 (Review & QA): 12 tasks
- Phase 11 (Publish): 6 tasks

**Parallel Opportunities**: 63 tasks marked [P] can run in parallel (55% of total tasks)

**Independent Test Criteria**:
- US1 + US5: Deploy site, navigate all modules, verify code highlighting, test responsive design
- US2: Verify 13-week roadmap page displays all weeks with objectives and deliverables
- US3: Verify hardware spec tables and lab options are complete with cost estimates
- US4: Verify lab architecture diagrams show network topology and component integration
- US6: Verify Capstone section includes project options, rubrics, and timelines

**Suggested MVP Scope**: Phases 1-3 (T001-T056) delivers fully functional book website with all modules and code examples

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] labels**: Map tasks to specific user stories for traceability
- Each user story phase is independently completable and testable
- Commit after each task or logical group using Conventional Commits format
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
