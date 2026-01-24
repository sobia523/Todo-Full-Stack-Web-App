---
name: backend-routes
description: Build backend APIs with proper routing, request/response handling, and database connectivity.
---

# Backend API Development

## Instructions

1. **Routing**
   - Define RESTful routes (GET, POST, PUT, DELETE)
   - Group routes by resource
   - Use clear and consistent URL naming

2. **Request & Response Handling**
   - Validate incoming request data
   - Handle query params, route params, and request bodies
   - Return proper HTTP status codes
   - Send JSON responses in a consistent format

3. **Database Connection**
   - Connect backend to a database (SQL or NoSQL)
   - Perform CRUD operations
   - Handle connection errors gracefully
   - Use environment variables for DB credentials

## Best Practices
- Follow REST conventions
- Keep controllers thin and reusable
- Use async/await for DB operations
- Centralize error handling
- Never expose sensitive data in responses

## Example Structure
```js
// routes/user.routes.js
import express from "express";
import { getUsers, createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", createUser);

export default router;
