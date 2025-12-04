<!--
Sync Impact Report:
Version change: Initial → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - TypeScript-First
  - Tailwind-Only Styling
  - Backend API Standards
  - Vector & Metadata Separation
  - Authentication Integration
  - Content Structure
  - Technology Stack Constraints
  - Documentation Standards
  - Development Workflow
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md (aligned with TypeScript, Tailwind, RAG, and Auth requirements)
  ✅ spec-template.md (aligned with user story structure for personalization features)
  ✅ tasks-template.md (aligned with modular component-based development)
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. TypeScript-First

All custom React components and frontend code MUST be written in TypeScript (.tsx files). No JavaScript (.js or .jsx) files are permitted for custom components.

**Rationale**: TypeScript provides compile-time type safety, reducing runtime errors and improving maintainability for a complex educational platform with RAG integration, authentication, and personalization features.

**Enforcement**:
- All component files use .tsx extension
- Strict TypeScript compiler settings enabled
- No `any` types except in explicitly documented edge cases
- Type definitions for all API responses and data models

### II. Tailwind-Only Styling

All UI elements MUST be styled exclusively with Tailwind CSS utility classes. No custom CSS files, inline styles, or CSS-in-JS solutions are permitted.

**Rationale**: Tailwind ensures consistent design system, reduces CSS bloat, and improves developer velocity. For an educational platform with multiple interactive components (chatbot, personalization, translation), a unified styling approach prevents fragmentation.

**Enforcement**:
- No `.css`, `.scss`, or styled-components imports
- All styling via className with Tailwind utilities
- Custom design tokens configured in tailwind.config.js
- Responsive design using Tailwind breakpoint prefixes

### III. Backend API Standards

The FastAPI backend MUST follow RESTful conventions and provide clear separation between RAG, authentication, and content services.

**Rationale**: Clean API architecture enables independent development and testing of RAG chatbot, user authentication, and content personalization features.

**Requirements**:
- OpenAPI/Swagger documentation auto-generated
- Consistent error response format (status code, message, details)
- Request validation using Pydantic models
- Separate routers for `/api/rag`, `/api/auth`, `/api/content`
- Health check endpoint at `/health`

### IV. Vector & Metadata Separation

Vector embeddings MUST be stored in Qdrant Cloud, while metadata and user data MUST be stored in Neon Postgres. No duplication of data between stores.

**Rationale**: Separation of concerns optimizes performance and cost. Qdrant excels at vector similarity search, while Postgres handles relational data and user profiles efficiently.

**Requirements**:
- Qdrant stores: document embeddings, chunk vectors
- Postgres stores: text chunks (for display), user profiles, personalization settings
- Foreign key relationships maintained in Postgres
- Qdrant collection names match Postgres table conventions

### V. Authentication Integration

Authentication MUST use Better-Auth library with minimal custom implementation. All protected routes and personalization features depend on authenticated user context.

**Rationale**: Better-Auth provides battle-tested authentication flows, reducing security risks and development time for a student-facing platform.

**Requirements**:
- Sign-up captures: email, password, software experience, hardware experience
- Session management via Better-Auth defaults
- Protected API routes validate JWT tokens
- User profile stored in Postgres and linked to all personalization data

### VI. Content Structure

Docusaurus content MUST follow the specified module structure with consistent paths and metadata.

**Rationale**: Predictable content structure enables automated RAG ingestion, personalization logic, and translation features.

**Required Paths**:
- `/docs/intro` → Introduction
- `/docs/module-1` → Chapter 1: ROS 2
- `/docs/module-2` → Chapter 2: Gazebo & Unity
- `/docs/module-3` → Chapter 3: NVIDIA Isaac
- `/docs/module-4` → Chapter 4: VLA & Capstone
- `/docs/appendix` → Hardware Requirements & Lab Setup

**Metadata Requirements**:
- Each chapter has frontmatter: title, description, module_id
- Sidebar configured in sidebars.js
- Navigation order preserved in config

## Technology Stack Constraints

### Mandatory Technologies

| Category | Technology | Version/Constraint |
|----------|------------|-------------------|
| Frontend Framework | Docusaurus | Latest stable (3.x) |
| Code Language | TypeScript | ES2022+, strict mode |
| Styling | Tailwind CSS | Latest stable (3.x) |
| Backend API | FastAPI | Python 3.11+ |
| Vector DB | Qdrant Cloud | Cloud-hosted |
| Metadata DB | Neon Serverless Postgres | Postgres 15+ |
| Authentication | Better-Auth | Latest stable |
| Deployment | GitHub Pages | Static site |

### Forbidden Technologies

- No custom CSS files or CSS modules
- No JavaScript (.js/.jsx) for components
- No alternative styling libraries (styled-components, emotion, etc.)
- No alternative authentication solutions (Auth0, Firebase Auth, etc.)
- No local vector databases (FAISS, Chroma)

**Rationale**: Technology constraints ensure consistency, maintainability, and alignment with project grading criteria.

## Documentation Standards

### Code Documentation

- All TypeScript components MUST have JSDoc comments
- Complex RAG logic MUST include inline comments explaining vector retrieval strategy
- API endpoints MUST have OpenAPI docstrings

### User-Facing Documentation

- Each chapter MUST have learning objectives at the top
- Technical terms MUST link to glossary (if glossary page exists)
- Code examples MUST include language tags and line numbers

### Internal Documentation

- README.md at repository root with setup instructions
- `docs/architecture.md` explaining RAG pipeline and personalization flow
- `docs/deployment.md` with GitHub Pages deployment steps

## Development Workflow

### Branching Strategy

- `main` branch for production-ready code
- Feature branches: `feature/<feature-name>`
- Hotfix branches: `hotfix/<issue>`
- Pull requests required for merging to main

### Testing Requirements

- Unit tests for utility functions (Python pytest, TypeScript Jest)
- Integration tests for RAG pipeline (end-to-end retrieval)
- Contract tests for API endpoints (FastAPI TestClient)
- Manual testing for personalization and translation features

**Note**: TDD (Test-First) is recommended but not mandatory for UI components.

### Commit Standards

- Conventional Commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Scopes: `frontend`, `backend`, `rag`, `auth`, `content`, `deploy`

### Code Review Gates

- TypeScript compilation passes (no errors)
- Tailwind class names valid (no undefined utilities)
- API contracts match OpenAPI spec
- No hardcoded secrets or API keys
- All components responsive (mobile, tablet, desktop)

## RAG System Requirements

### Ingestion Pipeline

- Must chunk Docusaurus content into 512-token segments
- Must generate embeddings using OpenAI text-embedding-3-small (or equivalent)
- Must store embeddings in Qdrant with metadata: module_id, chunk_index, page_title
- Must store original text chunks in Postgres with foreign keys to Qdrant IDs

### Retrieval Logic

- **Full-book mode**: Query all chunks across all modules
- **Contextual mode**: Query only chunks from user-selected text snippets
- Top-k retrieval: k=5 (configurable)
- Similarity threshold: 0.7 (configurable)
- Re-ranking: Optional (NICE-TO-HAVE bonus)

### Chatbot UX

- RAGChatbot.tsx component renders in a fixed position (bottom-right corner)
- Chat history persisted in browser localStorage (or Postgres for logged-in users)
- Typing indicators during API calls
- Error messages for failed retrievals
- Citations: show source module and page for each answer

## Personalization Requirements

### User Profile Schema

```typescript
interface UserProfile {
  id: string;
  email: string;
  software_experience: 'Beginner' | 'Intermediate' | 'Expert';
  hardware_experience: 'Limited' | 'Good' | 'Professional';
  created_at: Date;
  updated_at: Date;
}
```

### Personalization Logic

- **PersonalizationButton.tsx** at the start of each chapter
- On button click: fetch user profile → adjust content complexity
- Adjustments:
  - Beginner Software: Show step-by-step code explanations, hide advanced ROS 2 patterns
  - Expert Software: Show concise code, emphasize optimization techniques
  - Limited Hardware: Simplify hardware specs, provide analogies
  - Professional Hardware: Show detailed datasheets, advanced configurations

### Content Adaptation Strategy

- Use conditional rendering in React components
- Map user profile to content variant IDs stored in Postgres
- Cache adapted content per user session

## Translation Requirements (Bonus)

### UrduTranslationButton.tsx

- Button at the start of each chapter
- On click: translate entire chapter content to Urdu
- Translation API: Google Translate API or OpenAI GPT-4 translation
- Preserve Markdown formatting and code blocks (do not translate code)
- Store translations in browser cache to avoid re-translation

### Translation Constraints

- Technical terms remain in English (e.g., "ROS 2", "Gazebo")
- Code examples not translated
- Sidebar navigation remains in English

## Reusable Intelligence (Bonus)

### Agent Skill: create_ros_pkg_scaffold

**Purpose**: Generate boilerplate for a Python ROS 2 package.

**Inputs**:
- package_name: string
- dependencies: list of ROS 2 packages (e.g., ['rclpy', 'std_msgs'])

**Outputs**:
- Directory structure: `<package_name>/package.xml`, `setup.py`, `<package_name>/__init__.py`
- Template node file: `<package_name>/node.py`

**Usage**: Invoked by students via chatbot command: "/scaffold ros2 my_package"

### Subagent: AudienceContextualizer

**Purpose**: Automatically adjust technical text complexity based on user profile.

**Inputs**:
- raw_content: markdown text
- user_profile: UserProfile object

**Outputs**:
- adapted_content: markdown text with adjusted complexity

**Logic**:
- Detect technical terms and jargon
- For Beginner: add definitions inline
- For Expert: remove redundant explanations
- For Limited Hardware: replace datasheets with simplified specs

## Governance

### Amendment Process

1. Propose amendment via GitHub issue
2. Discuss in issue comments (minimum 3 business days)
3. Create pull request updating this constitution
4. Require 2 approvals from project maintainers
5. Update `CONSTITUTION_VERSION` following semantic versioning
6. Update `LAST_AMENDED_DATE` to today's date
7. Propagate changes to plan-template.md, spec-template.md, tasks-template.md

### Version Semantics

- **MAJOR**: Backward-incompatible changes (e.g., removing TypeScript requirement)
- **MINOR**: New principle added (e.g., adding a new technology constraint)
- **PATCH**: Clarifications, typo fixes, wording improvements

### Compliance Review

- All pull requests MUST verify constitution compliance
- Pre-commit hooks check TypeScript compilation and Tailwind validity
- CI/CD pipeline runs tests and OpenAPI schema validation
- Monthly review of constitution relevance by project team

### Conflict Resolution

If constitution conflicts with project requirements or grading rubric:
1. Rubric takes precedence (this is a graded project)
2. Document conflict in GitHub issue
3. Propose amendment to align constitution with rubric
4. Implement amendment before proceeding with conflicting work

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
