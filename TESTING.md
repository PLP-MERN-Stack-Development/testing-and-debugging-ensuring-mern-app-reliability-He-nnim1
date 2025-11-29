# Testing & Debugging Strategy

This document outlines the testing approach, debugging techniques, and commands to run tests for the MERN application.

## Overview

The project uses **Jest** for unit and integration tests, **Cypress** for end-to-end testing (optional scaffold), and **Winston** for structured logging. A global Express error handler ensures consistent error responses and logging.

## Testing Pyramid

1. **Unit Tests** (`server/tests/unit/`, `client/src/tests/unit/`)
   - Fast, isolated tests for utilities, middleware, and components
   - Example: testing JWT token generation, React component rendering

2. **Integration Tests** (`server/tests/integration/`)
   - Tests API endpoints with a real MongoDB instance (in-memory during tests)
   - Uses Supertest to make HTTP requests to the Express app
   - Example: POST /api/posts → verify response and database state

3. **End-to-End Tests** (`cypress/e2e/` — optional)
   - Full user flows via browser automation
   - Requires running server and real/test database
   - Example: create post → read → update → delete via UI/API

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Run All Tests (with Coverage Report)
```bash
npm test
```
- Runs Jest in both `client` and `server` projects
- Generates `coverage/` directory with HTML reports
- Open `coverage/index.html` in a browser to view coverage breakdown

### 3. Run Tests by Category

**Unit Tests Only:**
```bash
npm run test:unit
```

**Integration Tests Only:**
```bash
npm run test:integration
```

**E2E Tests (Cypress):**
```bash
npm run test:e2e
```
(Requires Cypress to be installed and server running; see E2E section below)

## Coverage Report

After running `npm test`, open the coverage report:
```bash
# Windows (PowerShell)
Start-Process coverage/index.html

# macOS/Linux
open coverage/index.html
```

**Current Coverage:**
- Target: ≥ 70% for server utilities and client components
- The coverage HTML includes per-file breakdowns showing lines, branches, and functions

## Debugging Techniques

### 1. Structured Logging (Winston)

The server uses **Winston** for structured, timestamped logs. Example output:
```json
{"level":"info","message":"POST /api/posts","timestamp":"2025-11-28T10:00:00.000Z"}
{"level":"error","message":"Unhandled error: ...","stack":"...","timestamp":"2025-11-28T10:00:00.000Z"}
```

**Control log level:**
```bash
LOG_LEVEL=debug npm --prefix server run start
```

### 2. Global Error Handler

File: `server/src/middleware/errorHandler.js`

All errors thrown in async handlers are caught and logged via the Express error handler, then returned as JSON:
```json
{ "error": "Error message here" }
```

Example flow:
- Handler throws `new Error("Invalid post")`
- Middleware catches it via `next(err)`
- Error handler logs the full stack
- Client receives `{ "error": "Invalid post" }` with 500 status

### 3. React Error Boundary

File: `client/src/components/ErrorBoundary.jsx`

Catches and displays component errors gracefully during development.

### 4. Test Debugging

**Print logs during test runs:**
```bash
# Increase Jest verbosity
npm test -- --verbose
```

**Run a single test file:**
```bash
npm test -- server/tests/integration/posts.test.js
```

**Run tests matching a pattern:**
```bash
npm test -- --testNamePattern="creates a post"
```

## Running the Server Locally

To start the development server (for E2E or manual testing):

```bash
npm --prefix server run start
```

**Expected output:**
```
{"level":"info","message":"Connected to MongoDB","timestamp":"..."}
{"level":"info","message":"Server listening on port 5000","timestamp":"..."}
```

**Environment Variables:**
- `PORT` (default: 5000) — server listening port
- `MONGO_URI` (default: `mongodb://localhost:27017/mern-testing-e2e`) — MongoDB connection string
- `LOG_LEVEL` (default: `info`) — Winston log level (debug, info, warn, error)

**Example with custom database:**
```powershell
# Windows PowerShell
$env:MONGO_URI = 'mongodb://127.0.0.1:27017/my-test-db'
npm --prefix server run start
```

## End-to-End Testing (Cypress)

### Setup

1. **Install Cypress:**
   ```bash
   npm install --save-dev cypress
   ```

2. **Add Cypress scripts to root `package.json`** (if not present):
   ```json
   {
     "scripts": {
       "test:e2e": "cypress run",
       "cypress:open": "cypress open"
     }
   }
   ```

3. **Create `cypress.config.js`:**
   ```javascript
   const { defineConfig } = require('cypress');
   
   module.exports = defineConfig({
     e2e: {
       baseUrl: 'http://localhost:5000',
       specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
     },
   });
   ```

4. **Create E2E spec** (`cypress/e2e/posts.cy.js`):
   ```javascript
   describe('Posts API E2E', () => {
     it('creates and reads posts', () => {
       cy.request({
         method: 'POST',
         url: '/api/posts',
         body: { title: 'Test Post', content: 'Content' },
       }).then((res) => {
         expect(res.status).to.equal(201);
         const id = res.body._id;
         
         cy.request(`/api/posts/${id}`).then((getRes) => {
           expect(getRes.body.title).to.equal('Test Post');
         });
       });
     });
   });
   ```

### Run E2E Tests

**Headless (CI/automated):**
```bash
# Start server in background first
npm --prefix server run start &

# Then run Cypress
npm run test:e2e
```

**Interactive UI:**
```bash
npm run cypress:open
# Select "E2E Testing", then choose a spec file
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests fail with "Cannot find module 'X'" | Run `npm run install-all` to install dependencies |
| Coverage below threshold | Add unit tests for uncovered files in `server/tests/unit/` or `client/src/tests/unit/` |
| Server won't start | Ensure MongoDB is running on `localhost:27017` or set `MONGO_URI` env var |
| Cypress tests timeout | Increase `baseUrl` timeout or ensure server is running on the correct port |
| ESM/CommonJS conflicts | Check `babel.config.js` and `jest.config.js` for proper transform rules |

## Files Reference

- **Jest Config:** `jest.config.js` (root) — configures client (jsdom) and server (node) environments
- **Babel Config:** `babel.config.js` (root) — transforms JSX for Jest
- **Logger:** `server/src/utils/logger.js` — Winston configuration
- **Error Handler:** `server/src/middleware/errorHandler.js` — global Express error middleware
- **Auth Util:** `server/src/utils/auth.js` — JWT token generation and verification
- **Coverage:** `coverage/index.html` — interactive HTML coverage report

## Next Steps

1. Run `npm test` to verify all tests pass
2. Check `coverage/index.html` for coverage gaps
3. Start the server: `npm --prefix server run start`
4. (Optional) Install Cypress and run E2E tests
5. Monitor logs during development using Winston's structured output
