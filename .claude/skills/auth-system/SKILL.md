---
name: auth-system
description: Implement secure authentication systems including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication System Skill

## Instructions

1. **User Registration (Signup)**
   - Validate user input (email, password)
   - Hash passwords before storing
   - Prevent duplicate accounts
   - Store user securely in database

2. **User Login (Signin)**
   - Verify credentials
   - Compare hashed passwords
   - Handle invalid login attempts
   - Return authentication token on success

3. **Password Security**
   - Use strong hashing algorithms (bcrypt, argon2)
   - Add salt to passwords
   - Never store plain-text passwords

4. **JWT Authentication**
   - Generate JWT on login
   - Include user ID and claims
   - Set token expiration
   - Verify token on protected routes

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Connect auth middleware
   - Manage sessions and tokens
   - Enable secure refresh flows

## Best Practices
- Enforce strong password rules
- Use HTTPS only
- Store JWT in httpOnly cookies
- Set short token expiry with refresh tokens
- Rate-limit auth endpoints
- Log auth events securely

## Example Structure
```js
// signup
POST /auth/signup

// signin
POST /auth/signin

// protected route
GET /profile (JWT required)
