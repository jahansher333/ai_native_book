# Research: Physical AI Robotics Book Implementation

**Date**: 2025-12-04
**Feature**: Physical AI & Humanoid Robotics Technical Book
**Purpose**: Document architectural decisions and best practices for Docusaurus-based technical book implementation

## Decision 1: Content Organization Strategy

**Chosen**: Module-based directory structure (`/docs/module-1/`, `/docs/module-2/`, etc.)

**Rationale**: Clear separation of learning units, supports independent navigation, aligns with 13-week roadmap structure defined in spec. Each module is a self-contained learning unit with prerequisites clearly defined. Enables parallel content development by different authors.

**Alternatives Considered**:
- Flat structure (`/docs/ros2-fundamentals.md`, `/docs/gazebo-simulation.md`, etc.)
- Single-file modules (one large file per module)

**Rejected Because**:
- Flat structure: Scales poorly as content grows (50-100+ pages), difficult to maintain logical grouping, sidebar navigation becomes unwieldy
- Single-file modules: Hurts navigability (students can't bookmark specific topics), creates merge conflicts with multiple authors, makes progressive disclosure impossible

**Implementation Notes**:
- Each module directory contains `index.md` (module overview) + topic-specific pages
- `_category_.json` in each module directory configures sidebar metadata
- Subdirectories for subsections if needed (e.g., `/docs/module-4/capstone/`)

---

## Decision 2: Code Example Management

**Chosen**: Inline code blocks with syntax highlighting + downloadable ZIP archives in `/static/code-examples/`

**Rationale**: Inline examples aid learning flow (students read theory → see code → understand concept without context switching). Downloadable archives support hands-on practice (students can run examples locally). Dual approach serves both quick learners (inline only) and hands-on learners (download + experiment).

**Alternatives Considered**:
- External GitHub repository only (students clone separate repo)
- Embedded CodeSandbox/Repl.it (run code in browser)

**Rejected Because**:
- External GitHub repo: Breaks reading flow, requires students to context-switch between book and IDE, examples become disconnected from explanations
- Embedded CodeSandbox: Requires online access (fails offline use case), adds external dependency, doesn't work for ROS 2/Gazebo (requires local installation), limited by sandbox environment constraints

**Implementation Notes**:
- Inline code blocks use Docusaurus syntax: ```python title="file.py" showLineNumbers {5-7}
- Code highlighting uses Prism (built into Docusaurus) with themes for Python, Bash, XML (URDF), YAML (ROS configs), C++
- Downloadable archives organized by module: `module-1-ros2.zip`, `module-2-gazebo.zip`
- Each ZIP contains README.md with setup instructions and file structure explanation

---

## Decision 3: Diagram Format

**Chosen**: SVG for architecture diagrams (created with Excalidraw/draw.io), Mermaid.js for simple flowcharts

**Rationale**: SVG scales infinitely without pixelation (critical for mobile + zoom accessibility), editable source files can be version-controlled alongside content. Mermaid.js renders natively in Docusaurus from markdown syntax (no separate tool needed), ideal for simple flowcharts and sequence diagrams.

**Alternatives Considered**:
- PNG/JPG raster images for all diagrams
- External embed services (LucidChart, Figma, Miro)
- Exclusively Mermaid.js (no external diagram tools)

**Rejected Because**:
- PNG/JPG: Pixelate on zoom, not accessibility-friendly (screen readers can't parse), large file sizes, requires export every time diagram changes
- External embeds: Require authentication, break when service changes API, create external dependency, content not portable
- Exclusively Mermaid.js: Insufficient for complex system architectures (e.g., lab topology with hardware components), limited styling options for technical schematics

**Implementation Notes**:
- Architecture diagrams: Use Excalidraw (open-source, web-based, exports SVG with editable .excalidraw source)
- Store editable sources: `/static/img/diagrams/source/diagram-name.excalidraw`
- Export SVGs: `/static/img/diagrams/fig-{module}-{descriptor}.svg`
- Mermaid diagrams: Embedded directly in markdown using ```mermaid code blocks
- Diagram accessibility: All diagrams have alt text and descriptive captions

---

## Decision 4: Technology Versioning Strategy

**Chosen**: Document specific tested versions (ROS 2 Humble Hawksbill, Isaac Sim 2023.1, Gazebo Classic 11/Ignition Fortress) with update notes for newer versions

**Rationale**: Balances maintainability with student needs. Documenting tested versions prevents "works on my machine" issues (students know exactly which version to install). Update notes provide migration guidance for students using newer versions without requiring complete content rewrites. Aligns with constitution risk mitigation (technology obsolescence).

**Alternatives Considered**:
- Track and maintain multiple parallel versions of the book (e.g., ROS 2 Humble edition, ROS 2 Iron edition)
- Lock to initial versions indefinitely with no update notes
- Continuously update all content to latest versions as they're released

**Rejected Because**:
- Multiple parallel versions: Unsustainable maintenance burden (content must be duplicated and diverge over time), confuses students (which version to use?), fragments community
- Lock to initial versions: Becomes obsolete as ecosystem evolves, students with newer systems can't use the book, misses important bug fixes and features
- Continuous updates: Breaks students mid-course (dependencies change), requires constant testing and rework, introduces regression risks

**Implementation Notes**:
- Frontmatter includes `tested_versions: ["ROS 2 Humble", "Gazebo Classic 11"]`
- Update notes appear in admonition boxes: `:::info Version Note ... :::`
- Version compatibility table in Introduction and Appendix
- Annual review cycle: Check if major version updates require content revisions

**Example Update Note**:
```markdown
:::info ROS 2 Iron (2023) Update
If you're using ROS 2 Iron instead of Humble, note that the default QoS profile changed. Update your publisher to explicitly set QoS reliability...
:::
```

---

## Decision 5: Frontmatter Schema

**Chosen**:
```yaml
---
title: "Page Title"
description: "Brief description"
module_id: "module-1"
sidebar_position: 1
tags: ["ros2", "urdf", "fundamentals"]
difficulty: beginner
estimated_minutes: 15
---
```

**Rationale**: Consistent metadata enables:
- Search functionality (tags, descriptions)
- Navigation ordering (sidebar_position)
- Future RAG chatbot ingestion (module_id for scoping, tags for semantic retrieval)
- Student planning (estimated_minutes helps time management)
- Content filtering (difficulty level for adaptive learning paths)

Aligns with constitution requirement for metadata in frontmatter.

**Alternatives Considered**:
- Minimal frontmatter (title and description only)
- No frontmatter (rely on Docusaurus defaults)
- Extended frontmatter (add author, date, prerequisites, learning_objectives)

**Rejected Because**:
- Minimal: Loses discoverability (no tags), manual sidebar ordering (error-prone), no time estimates (students can't plan)
- No frontmatter: Breaks Docusaurus features (auto-generated navigation, SEO), inconsistent metadata, no extensibility for future features
- Extended: Clutters frontmatter (learning objectives belong in content body), creates maintenance overhead (updating author/date for every edit), redundant information (prerequisites better shown in navigation)

**Implementation Notes**:
- JSON schema validates frontmatter: `contracts/frontmatter-schema.json`
- Pre-commit hook checks frontmatter compliance (optional)
- Tags follow controlled vocabulary: Define allowed tags in `docs/glossary.md` appendix
- Sidebar position gaps allowed (e.g., 1, 2, 5, 10) for future insertions

**Tag Categories**:
- Technology: `ros2`, `gazebo`, `unity`, `isaac`, `llm`
- Concept: `architecture`, `fundamentals`, `advanced`, `simulation`, `perception`
- Content Type: `tutorial`, `reference`, `exercise`, `capstone`

---

## Decision 6: Git Branching and Review Workflow

**Chosen**: Three-tier branching: `main` (published), `draft` (staging), `feature/{module-id}-{topic}` (development)

**Rationale**: Separates stable published content (`main` auto-deploys to GitHub Pages) from work-in-progress (`draft` for review) and active development (`feature/` branches). Enables continuous deployment (merge to `main` triggers build) while maintaining quality gates (PR reviews before merging).

**Alternatives Considered**:
- Two-tier: `main` + `feature/` (no draft staging)
- GitHub Flow: `main` + short-lived feature branches (direct merge to main)
- GitFlow: `main`, `develop`, `release/*`, `hotfix/*`, `feature/*`

**Rejected Because**:
- Two-tier: No staging area for content review (merge conflicts on main), risky direct-to-production deploys
- GitHub Flow: Too aggressive for educational content (no review stage), students may see half-finished content
- GitFlow: Overengineered for documentation (release branches unnecessary), complex for content contributors

**Workflow**:
1. Author creates `feature/module-1-urdf-basics` from `draft`
2. Author commits using Conventional Commits: `docs(module-1): add URDF basics`
3. Author creates PR: `feature/module-1-urdf-basics` → `draft`
4. Reviewer checks technical accuracy, writing quality, code examples
5. Merge to `draft` after approval
6. Weekly: Create PR `draft` → `main` for batch publishing
7. Merge to `main` triggers GitHub Actions deployment

**Branch Protection Rules**:
- `main`: Require 1 approval, status checks must pass (Docusaurus build, broken link check)
- `draft`: Require 1 approval (can be same reviewer as feature PR)
- `feature/*`: No restrictions (author freedom)

---

## Decision 7: GitHub Pages Deployment Configuration

**Chosen**: GitHub Actions workflow with build caching, deploy on push to `main`

**Rationale**: Automated deployment reduces manual errors (no forgotten builds), caching speeds up builds (5-10min → 2-3min), branch protection ensures only reviewed content deploys. GitHub Pages is free for public repos and integrates seamlessly with GitHub Actions.

**Alternatives Considered**:
- Manual deployment (run `npm run build && npm run deploy` locally)
- Netlify or Vercel (third-party hosting)
- Self-hosted GitHub Pages runner

**Rejected Because**:
- Manual: Error-prone (forgotten steps), inconsistent (different build environments), slow (no caching), requires maintainer access
- Netlify/Vercel: Adds external dependency, costs for private repos, overkill for static site, complicates custom domain setup
- Self-hosted: Unnecessary complexity for static site, requires infrastructure maintenance

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Docusaurus site
        run: npm run build

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

**Performance Optimizations**:
- `npm ci` instead of `npm install` (faster, reproducible)
- Node.js cache (avoids re-downloading packages)
- Build artifact caching (future: cache `.docusaurus` folder)
- Conditional deploy (only on `main`, not PRs)

**Custom Domain** (optional):
- Add `CNAME` file to `static/` directory: `docs.physical-ai-robotics.com`
- Configure DNS: `CNAME` record pointing to `username.github.io`

---

## Decision 8: Accessibility and Responsive Design

**Chosen**: Follow WCAG 2.1 AA guidelines, use Docusaurus responsive defaults, test on mobile/tablet/desktop

**Rationale**: Educational content must be accessible to all learners (screen readers, keyboard navigation, color contrast). Responsive design ensures usability on mobile devices (students studying on phones/tablets). Docusaurus provides good defaults but custom components (future RAG chatbot, hardware tables) require explicit accessibility testing.

**Implementation Checklist**:
- ✅ All images have descriptive alt text
- ✅ Diagrams include captions and long descriptions (for complex visuals)
- ✅ Code blocks have language labels (for screen reader context)
- ✅ Headings follow semantic hierarchy (h1 → h2 → h3, no skipping levels)
- ✅ Links have descriptive text (not "click here")
- ✅ Color contrast ≥ 4.5:1 for text (use Docusaurus default theme or custom theme with validated colors)
- ✅ Keyboard navigation works for all interactive elements
- ✅ Tables have proper headers (`<th>` tags) for hardware specs

**Testing Tools**:
- axe DevTools (browser extension for accessibility audits)
- Lighthouse (Chrome DevTools → Accessibility score)
- Manual testing: Navigate site using only keyboard (Tab, Enter, Arrows)

**Responsive Breakpoints** (Docusaurus defaults):
- Mobile: < 768px (single column, hamburger menu)
- Tablet: 768px - 996px (two columns, collapsible sidebar)
- Desktop: > 996px (full sidebar + content)

---

## Summary of Key Decisions

| Decision Area | Chosen Approach | Primary Rationale |
|---------------|----------------|-------------------|
| Content Organization | Module-based directories | Scalability, navigation clarity, parallel development |
| Code Examples | Inline + downloadable archives | Learning flow + hands-on practice |
| Diagrams | SVG (Excalidraw) + Mermaid.js | Scalability, accessibility, version control |
| Technology Versions | Document tested versions + update notes | Balance maintainability and student needs |
| Frontmatter Schema | Structured metadata (7 fields) | Search, navigation, future RAG integration |
| Git Workflow | Main/draft/feature branching | Quality gates, continuous deployment |
| Deployment | GitHub Actions + Pages | Automation, caching, simplicity |
| Accessibility | WCAG 2.1 AA compliance | Inclusive education, mobile support |

---

## Open Questions / Future Research

**None identified** - All technical decisions resolved for initial implementation.

**Post-MVP Enhancements** (not blocking current implementation):
- Advanced search (Algolia DocSearch integration)
- Progress tracking (localStorage or backend)
- Interactive code playgrounds (for simple Python snippets)
- RAG chatbot integration (see constitution bonus features)
- Content personalization (difficulty level adaptation)
- Urdu translation (see constitution bonus features)

These enhancements require separate specification and planning phases.

---

**Research Complete**: All architectural decisions documented. Ready to proceed to Phase 1 (Data Model, Contracts, Quickstart).
