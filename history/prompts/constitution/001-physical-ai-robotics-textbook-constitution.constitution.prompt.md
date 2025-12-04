---
id: 001
title: Physical AI Robotics Textbook Constitution
stage: constitution
date: 2025-12-04
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: jahansher333
command: /sp.constitution
labels: ["constitution", "docusaurus", "typescript", "tailwind", "fastapi", "rag", "authentication", "personalization"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
---

## Prompt

```text
Physical AI & Humanoid Robotics Textbook 1. Project Objective Final Output: A unified, production-ready Docusaurus book project deployed to GitHub Pages, integrating a full-stack RAG Chatbot, custom authentication, and advanced content personalization features.Source Content: The provided Physical AI & Humanoid Robotics course details.Tool Usage: Use Spec-Kit Plus to generate all necessary code, specifications, and project architecture.2. Technology Stack & Constraints  (components) :CategoryTechnologyConstraintFrontend/BookDocusaurusBase framework.Code LanguageReact.js & TypeScript (TS)All custom components MUST use TypeScript (.tsx).StylingTailwind CSSAll UI elements MUST be styled exclusively with Tailwind CSS utility classes.Backend/APIFastAPIREST API for all RAG and Authentication services.Vector DBQdrant CloudVector storage for content embeddings (RAG).Metadata DBNeon Serverless PostgresStoring text chunks and user profile data.AuthenticationBetter-Auth (https://www.better-auth.com/)For all Sign-up/Sign-in functionality.3. Required Content Structure Docusaurus :Docusaurus PathContent Section/docs/introIntroduction: (Overview, Goals, Learning Outcomes)/docs/module-1Chapter 1: The Robotic Nervous System (ROS 2)/docs/module-2Chapter 2: The Digital Twin (Gazebo & Unity)/docs/module-3Chapter 3: The AI-Robot Brain (NVIDIA Isaac™)/docs/module-4Chapter 4: Vision-Language-Action (VLA) & Capstone/docs/appendixAppendix: Hardware Requirements & Lab Setup (Detailed technical specs).4. Core Deliverables ,DeliverableRequirementBook Setup & StylingGenerate docusaurus.config.js to configure Docusaurus with TypeScript support and full Tailwind CSS integration.RAG System (Backend)Design the FastAPI service for data ingestion (Neon + Qdrant) and retrieval.RAG Chatbot (Frontend)Create a custom RAGChatbot.tsx component. It must be styled using Tailwind CSS.Chatbot FunctionalityMust be able to answer questions based on the full book content, AND answer questions based ONLY on user-selected text snippets (contextual RAG).5. Bonus Deliverables (Up to 200 Extra Points)5.1. Reusable Intelligence ,Agent Skill Specification: Define the create_ros_pkg_scaffold skill to generate boilerplate code for a Python ROS 2 package.Subagent Specification: Define the AudienceContextualizer Subagent which is used to automatically adjust the complexity of technical text based on a user's known background (e.g., simplifying hardware specs).5.2. Authentication and Personalization ,Auth Implementation: Integrate Sign-up/Sign-in functionality using Better-Auth.Profile Form: Create a UserProfileForm.tsx (React/TS/Tailwind) for sign-up, capturing the user's background:Software Experience: (Beginner, Intermediate, Expert)Hardware Experience: (Limited, Good, Professional)Content Personalization:Implement a PersonalizationButton.tsx (React/TS/Tailwind) at the start of every chapter.The chapter content must dynamically adapt (e.g., show/hide/rephrase sections) based on the logged-in user's profile data when the button is pressed.5.3. Urdu Translation (50 Points)Translation Component: Implement a UrduTranslationButton.tsx (React/TS/Tailwind) at the start of every chapter.Functionality: When pressed, the entire chapter content must be translated into Urdu..
```

## Response snapshot

Created comprehensive project constitution (v1.0.0) for Physical AI & Humanoid Robotics Textbook project with the following key principles:

**Core Principles Established:**
1. TypeScript-First: All React components must use .tsx with strict typing
2. Tailwind-Only Styling: Exclusive use of Tailwind CSS utility classes
3. Backend API Standards: FastAPI with RESTful conventions, separated RAG/Auth/Content services
4. Vector & Metadata Separation: Qdrant for embeddings, Neon Postgres for metadata/user profiles
5. Authentication Integration: Better-Auth library for sign-up/sign-in with experience capture
6. Content Structure: Docusaurus with defined module paths (/docs/intro, /docs/module-1-4, /docs/appendix)

**Technology Stack Constraints:**
- Mandatory: Docusaurus 3.x, TypeScript ES2022+, Tailwind 3.x, FastAPI Python 3.11+, Qdrant Cloud, Neon Postgres, Better-Auth, GitHub Pages
- Forbidden: Custom CSS, JavaScript for components, alternative auth/styling/vector DB solutions

**Additional Sections:**
- Documentation Standards (code/user-facing/internal)
- Development Workflow (branching, testing, commits, code review gates)
- RAG System Requirements (ingestion, retrieval, chatbot UX)
- Personalization Requirements (user profile schema, logic, adaptation strategy)
- Translation Requirements (UrduTranslationButton.tsx specifications)
- Reusable Intelligence (create_ros_pkg_scaffold skill, AudienceContextualizer subagent)
- Governance (amendment process, versioning semantics, compliance review, conflict resolution)

**Files Modified:**
- .specify/memory/constitution.md (complete rewrite from template)

**Template Alignment:**
- plan-template.md: Aligned with TypeScript, Tailwind, RAG, and Auth requirements
- spec-template.md: Aligned with user story structure for personalization features
- tasks-template.md: Aligned with modular component-based development

**Version Information:**
- Version: 1.0.0 (initial ratification)
- Ratification Date: 2025-12-04
- Last Amended: 2025-12-04

## Outcome

- ✅ Impact: Established complete governance framework for Physical AI & Humanoid Robotics Textbook project with 6 core principles, technology constraints, RAG/Auth/Personalization requirements, and governance procedures
- 🧪 Tests: N/A (constitution document, no tests required)
- 📁 Files: Created/updated 1 file (.specify/memory/constitution.md)
- 🔁 Next prompts: Run /sp.specify to create feature specification, then /sp.plan for implementation planning
- 🧠 Reflection: Constitution successfully captures all mandatory requirements (TypeScript, Tailwind, FastAPI, Qdrant, Neon, Better-Auth) and bonus features (personalization, translation, reusable intelligence) from project brief. Governance section ensures maintainability and alignment with grading rubric. Ready for feature specification phase.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (constitution creation, not graded yet)
- Prompt variant (if applicable): Standard /sp.constitution command
- Next experiment (smallest change to try): Validate constitution alignment with templates by running /sp.specify for first feature (e.g., "RAG Chatbot Component")
