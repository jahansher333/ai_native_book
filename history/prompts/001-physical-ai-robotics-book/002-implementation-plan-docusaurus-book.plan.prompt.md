---
id: 002
title: Implementation Plan Docusaurus Book
stage: plan
date: 2025-12-04
surface: agent
model: claude-opus-4-5-20251101
feature: 001-physical-ai-robotics-book
branch: 001-physical-ai-robotics-book
user: jahansher333
command: /sp.plan
labels: ["plan", "docusaurus", "folder-structure", "content-authoring", "version-control", "github-pages"]
links:
  spec: specs/001-physical-ai-robotics-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-physical-ai-robotics-book/plan.md
  - specs/001-physical-ai-robotics-book/research.md
  - specs/001-physical-ai-robotics-book/contracts/
tests:
---

## Prompt

```text
/sp.plan
The book will be implemented using Docusaurus (TypeScript support), with a folder /docs/ containing markdown files. Sidebar navigation must match the course module structure. Deployment via GitHub Pages. Use no custom plugins beyond standard Docusaurus. Generate a folder structure plan, naming conventions, and file paths. Define tasks for: content ingestion (from course details), splitting content into sections/subsections, adding metadata (front-matter), building tables for hardware specs, placeholders for diagrams/figures, and building a glossary. Include plan for version control (git), commit conventions, and branching strategy for draft vs published versions.
```

## Response snapshot

Created comprehensive implementation plan for Physical AI & Humanoid Robotics Technical Book with complete Docusaurus project structure:

**Technical Context**:
- Language: TypeScript (ES2022+) + Markdown content
- Stack: Docusaurus 3.x, Node.js 18+, React 18+, Tailwind CSS 3.x, Prism syntax highlighting
- Deployment: GitHub Pages via GitHub Actions
- Scope: 50-100 markdown pages, 4 major modules, 100+ code examples, 20+ diagrams

**Constitution Check**: ✅ ALL GATES PASSED
- Content paths align: `/docs/intro`, `/docs/module-1` through `/docs/module-4`, `/docs/appendix`
- TypeScript-first for custom components (.tsx files)
- Tailwind CSS via docusaurus-plugin-tailwindcss
- Frontmatter metadata (title, description, module_id, tags)
- Git workflow with Conventional Commits

**Folder Structure**:
```
docs/                    # Markdown content by module
├── intro.md
├── module-1/            # ROS 2 chapter (index.md + topics)
├── module-2/            # Digital Twin chapter
├── module-3/            # Isaac AI chapter
├── module-4/            # VLA chapter + capstone
├── appendix/            # Hardware specs, lab architecture
├── roadmap.md           # 13-week schedule
└── glossary.md

static/                  # Assets
├── img/diagrams/        # SVG architecture diagrams
└── code-examples/       # Downloadable ZIP archives

src/components/          # Custom React/TS components (future)
docusaurus.config.js     # Main configuration
sidebars.js              # Navigation structure
package.json             # Dependencies
```

**Phase 0: Research Decisions** (research.md created):
1. Module-based directory structure (scalability, parallel development)
2. Inline code blocks + downloadable archives (learning flow + hands-on practice)
3. SVG (Excalidraw) + Mermaid.js diagrams (scalability, accessibility)
4. Document tested versions (ROS 2 Humble, Isaac 2023.1) with update notes
5. Structured frontmatter schema (7 fields: title, description, module_id, sidebar_position, tags, difficulty, estimated_minutes)
6. Three-tier git branching: main (published) / draft (staging) / feature/* (development)
7. GitHub Actions deployment with caching
8. WCAG 2.1 AA accessibility compliance

**Phase 1: Design Artifacts** (documented in plan.md):
- Data Model: 7 entities (Module, Page, Code Example, Hardware Specification, Weekly Schedule, Diagram/Figure, Glossary Term)
- Contracts: Frontmatter JSON schema, naming conventions (file names, module IDs, figure IDs, branch names, commit format), content template
- Quickstart: Local dev setup, authoring workflow, testing, version control, deployment

**Naming Conventions**:
- Files: `{topic-slug}.md` (lowercase, hyphen-separated)
- Module IDs: `intro`, `module-1` through `module-4`, `appendix`, `roadmap`, `glossary`
- Figures: `fig-{module}-{descriptor}.svg`
- Branches: `main`, `draft`, `feature/{module-id}-{topic}`
- Commits: Conventional Commits format (`docs(module-1): add ROS 2 fundamentals`)

**Git Workflow**:
1. Feature branch from draft: `feature/module-1-urdf-basics`
2. Commit with Conventional Commits
3. PR to draft (review)
4. Weekly PR: draft → main (triggers GitHub Pages deploy)

**Content Structure** (per page):
1. Frontmatter with metadata
2. Learning objectives
3. Conceptual explanation + diagrams
4. Code examples (inline with syntax highlighting)
5. Hands-on exercise
6. Key takeaways
7. Next steps links

## Outcome

- ✅ Impact: Complete implementation plan with folder structure, naming conventions, git workflow, and content authoring standards for 50-100 page Docusaurus technical book
- 🧪 Tests: Manual content validation, Docusaurus build checks, broken link detection, responsive design testing
- 📁 Files: Created 2 files (plan.md with embedded artifacts, research.md with 8 architectural decisions)
- 🔁 Next prompts: Extract Phase 1 artifacts to separate files (data-model.md, contracts/*.json/*.md, quickstart.md), then run `/sp.tasks` for task breakdown
- 🧠 Reflection: Plan successfully bridges spec requirements (modules, roadmap, hardware specs, diagrams) with Docusaurus technical implementation. Research decisions resolve all ambiguities (code management, diagram formats, versioning, accessibility). Ready for task generation phase.

## Evaluation notes (flywheel)

- Failure modes observed: None (all constitution gates passed, no technical blockers identified)
- Graders run and results (PASS/FAIL): Constitution Check - ALL PASSED (Content Structure, TypeScript-First, Tailwind-Only, Documentation Standards, Development Workflow)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-specified implementation details (Docusaurus, TypeScript, GitHub Pages, no custom plugins)
- Next experiment (smallest change to try): Run `/sp.tasks` to generate actionable task breakdown organized by user stories (P1: Content navigation + code examples, P2: Roadmap + hardware specs, P3: Lab architecture + capstone)
