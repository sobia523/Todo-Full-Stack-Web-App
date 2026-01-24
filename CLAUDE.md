# Claude Code Rules - Todo Full-Stack Web Application

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD) for a Todo Full-Stack Web Application. Your primary goal is to build a modern multi-user web application with persistent storage using the specified technology stack.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.
- Successfully implement all 5 Basic Level features as a web application with authentication and persistent storage.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Technology Stack and Agent Usage
You will utilize the following specialized agents for specific tasks in the Todo Full-Stack Web Application:

- **Auth Agent**: For authentication implementation including user signup/signin using Better Auth
- **Frontend Agent**: For frontend development using Next.js 16+ (App Router)
- **DB Agent**: For database design and operations using Neon Serverless PostgreSQL with SQLModel ORM
- **Backend Agent**: For FastAPI development and API endpoint creation

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.
- Implement all 5 Basic Level features as a web application with authentication and persistent storage
- Use JWT tokens for authentication between frontend and backend services
- Follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for the Todo Full-Stack Web Application. Address each of the following thoroughly with focus on the technology stack: Next.js 16+, Python FastAPI, SQLModel ORM, Neon Serverless PostgreSQL, and Better Auth.

1. Scope and Dependencies:
   - In Scope: Modern multi-user web application with all 5 Basic Level features, RESTful API endpoints, responsive frontend, persistent storage, authentication
   - Out of Scope: Mobile native apps, desktop applications, third-party integrations beyond Better Auth
   - External Dependencies: Neon Serverless PostgreSQL, Better Auth service, Node.js runtime, Python runtime

2. Key Decisions and Rationale:
   - Options Considered: Different authentication providers, database options, frontend frameworks, backend frameworks
   - Trade-offs: Better Auth vs custom auth, Neon PostgreSQL vs other DBs, Next.js vs React/Vue, FastAPI vs Flask/Django
   - Rationale: Better Auth for JWT support, Neon for serverless scalability, Next.js for full-stack capabilities, FastAPI for async performance
   - Principles: measurable, reversible where possible, smallest viable change

3. Interfaces and API Contracts:
   - Public APIs: RESTful endpoints for todo CRUD operations, authentication endpoints, user management
   - Versioning Strategy: Standard API versioning in URL paths (/api/v1/)
   - Idempotency, Timeouts, Retries: Implemented where appropriate for reliability
   - Error Taxonomy with status codes: Consistent error responses with appropriate HTTP status codes

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency under 500ms for API calls, responsive UI
   - Reliability: SLOs of 99% uptime, error budgets with proper fallbacks
   - Security: JWT-based AuthN/AuthZ, secure data handling, secrets management, audit trails
   - Cost: Serverless pricing model with Neon PostgreSQL for cost efficiency

5. Data Management and Migration:
   - Source of Truth: Neon Serverless PostgreSQL database with SQLModel ORM
   - Schema Evolution: Proper migration strategies using Alembic or similar
   - Migration and Rollback: Automated migration scripts with rollback capabilities
   - Data Retention: Policies for user data based on privacy requirements

6. Operational Readiness:
   - Observability: Logs, metrics, traces for both frontend and backend
   - Alerting: Thresholds for performance and error monitoring
   - Runbooks: Common operational tasks and troubleshooting guides
   - Deployment and Rollback strategies: CI/CD pipeline with safe deployment practices
   - Feature Flags: Configuration management for gradual rollouts

7. Risk Analysis and Mitigation:
   - Top 3 Risks: Security vulnerabilities, data loss, performance bottlenecks
   - Blast radius assessment for each risk
   - Kill switches and guardrails: Circuit breakers, rate limiting, graceful degradation

8. Evaluation and Validation:
   - Definition of Done: All 5 Basic Level features implemented, authenticated, tested
   - Output Validation for format/requirements/safety: Input validation, output sanitization

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it, particularly for tech stack choices.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles
- `specs/<feature>/spec.md` — Feature requirements
- `specs/<feature>/plan.md` — Architecture decisions
- `specs/<feature>/tasks.md` — Testable tasks with cases
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/` — SpecKit Plus templates and scripts
- `backend/` — Python FastAPI application with SQLModel ORM
- `frontend/` — Next.js 16+ application (App Router)
- `auth/` — Better Auth configuration for JWT-based authentication
- `database/` — Neon Serverless PostgreSQL schema and migrations

## Code Standards
See `.specify/memory/constitution.md` for code quality, testing, performance, security, and architecture principles.

## Technology Stack Reference

- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Spec-Driven Development**: Claude Code + Spec-Kit Plus

## Development Workflow
Follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code.
Use the appropriate specialized agents:
- Auth Agent for authentication features
- Frontend Agent for UI/UX development
- DB Agent for database schema and operations
- Backend Agent for API development
