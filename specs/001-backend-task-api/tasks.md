---
description: "Task list for backend API & database implementation"
---

# Tasks: Backend API & Database for Todo Full-Stack Web Application

**Input**: Design documents from `/specs/001-backend-task-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `backend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure with src/ and tests/ directories
- [X] T002 [P] Initialize Python project with FastAPI, SQLModel, and Pydantic dependencies
- [X] T003 [P] Configure pytest for testing framework

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup database models for User and Task entities in backend/src/models/
- [X] T005 [P] Implement database engine configuration in backend/src/database/engine.py
- [X] T006 [P] Create database base class in backend/src/database/base.py
- [X] T007 Create dependency injection module for database sessions in backend/src/api/deps.py
- [X] T008 Setup main application entry point in backend/src/main.py
- [X] T009 Configure environment variables for database connection

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---
## Phase 3: User Story 1 - Create and Manage Personal Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, view, update, and delete their personal tasks through the application

**Independent Test**: The system can be fully tested by creating tasks for a user, listing them, updating individual tasks, toggling completion status, and deleting tasks. This delivers the complete core value proposition of a todo application.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Contract test for GET /api/{user_id}/tasks endpoint in backend/tests/integration/test_api/test_tasks.py
- [X] T011 [P] [US1] Contract test for POST /api/{user_id}/tasks endpoint in backend/tests/integration/test_api/test_tasks.py
- [X] T012 [P] [US1] Contract test for GET /api/{user_id}/tasks/{id} endpoint in backend/tests/integration/test_api/test_tasks.py
- [X] T013 [P] [US1] Contract test for PUT /api/{user_id}/tasks/{id} endpoint in backend/tests/integration/test_api/test_tasks.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Create User model in backend/src/models/user.py
- [X] T015 [P] [US1] Create Task model in backend/src/models/task.py
- [X] T016 [US1] Create Task service in backend/src/services/task_service.py
- [X] T017 [US1] Create User service in backend/src/services/user_service.py
- [X] T018 [US1] Implement GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T019 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [X] T020 [US1] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T021 [US1] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T022 [US1] Add validation and error handling for all US1 endpoints
- [X] T023 [US1] Add logging for US1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---
## Phase 4: User Story 2 - Toggle Task Completion Status (Priority: P2)

**Goal**: Allow users to mark tasks as complete or incomplete to track their progress

**Independent Test**: A user can create a task, mark it as complete, verify it shows as complete, mark it as incomplete again, and verify the status change is persisted.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T024 [P] [US2] Contract test for PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/tests/integration/test_api/test_tasks.py

### Implementation for User Story 2

- [X] T025 [US2] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py
- [X] T026 [US2] Add toggle completion method to Task service in backend/src/services/task_service.py
- [X] T027 [US2] Add validation for completion toggle endpoint

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---
## Phase 5: User Story 3 - Delete Unwanted Tasks (Priority: P3)

**Goal**: Allow users to remove tasks they no longer need to keep their task list organized

**Independent Test**: A user can create a task, delete it, and verify that it no longer appears in their task list.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T028 [P] [US3] Contract test for DELETE /api/{user_id}/tasks/{id} endpoint in backend/tests/integration/test_api/test_tasks.py

### Implementation for User Story 3

- [X] T029 [US3] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [X] T030 [US3] Add delete method to Task service in backend/src/services/task_service.py
- [X] T031 [US3] Add validation for delete endpoint

**Checkpoint**: All user stories should now be independently functional

---
## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T032 [P] Documentation updates in backend/README.md
- [X] T033 Code cleanup and refactoring
- [X] T034 Performance optimization across all stories
- [X] T035 [P] Additional unit tests in backend/tests/unit/
- [X] T036 Security hardening for user isolation
- [X] T037 Run quickstart.md validation

---
## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on models from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on models from US1

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---
## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---
## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence