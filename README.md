# � Todo App - CI/CD Pipeline Project

**A full-stack educational project demonstrating complete CI/CD pipeline implementation with automated testing, security scanning, and deployment.**

---

## 🎯 Project Overview

This project is an example of a **professional CI/CD pipeline** implementation featuring:

- ✅ **Backend API** - Express.js REST API with validation
- ✅ **Frontend** - Vanilla JavaScript with security best practices  
- ✅ **Unit Tests** - 9 comprehensive unit tests
- ✅ **Integration Tests** - 5 E2E tests for API workflows
- ✅ **CI/CD Pipeline** - GitHub Actions with 7 automated jobs
- ✅ **Security Scanning** - XSS prevention & vulnerability detection
- ✅ **Code Quality** - Linting, formatting, coverage reports
- ✅ **Auto Deployment** - Automated deploy to Render

---

## 📂 Project Structure

```
todo-pro/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express server setup
│   │   ├── controllers/
│   │   │   └── todoController.js   # Business logic
│   │   ├── routes/
│   │   │   └── todoRoutes.js       # API endpoints
│   │   └── models/
│   │       └── Todo.js              # Data model
│   ├── tests/
│   │   ├── todo.unit.test.js       # Unit tests (9 tests)
│   │   └── todo.integration.test.js# Integration tests (5 tests)
│   └── package.json
│
├── frontend/
│   ├── index.html                  # Main HTML
│   ├── script.js                   # DOM manipulation
│   └── style.css                   # Styling
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions pipeline
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- Git

### Backend Setup

```bash
cd backend
npm install
npm start          # Run server on port 3000
```

### Testing

```bash
cd backend
npm test           # Run all tests (unit + integration) - 14 tests pass ✅
```

### Frontend
Open `frontend/index.html` in your browser.

---

## 🧪 Test Coverage

### Unit Tests (9 tests - `todo.unit.test.js`)
✅ Empty title validation
✅ Whitespace-only validation
✅ Successful todo creation (201)
✅ Get todos list (200)
✅ Delete non-existent ID (404)
✅ Handle long titles (1000 chars)
✅ Handle XSS special characters
✅ Trim whitespace from title
✅ Performance check (< 5ms)

### Integration Tests (5 tests - `todo.integration.test.js`)
✅ GET /todos - Retrieve todo list
✅ POST /todos - Create new todo
✅ POST /todos - Validation error check
✅ DELETE /todos/:id - Delete and verify
✅ Workflow consistency - Add then delete

**All 14 tests PASS ✅ | Time: 0.964s**

---

## 🔄 CI/CD Pipeline (7 Jobs)

### Job 1: LINT - Code Style Check
- Node 18.x setup
- ESLint/Prettier check
- **Blocks if failed** (continue-on-error: false)

### Job 2: TEST-BACKEND - Multi-Version Testing
- Tests on Node 16.x, 18.x, 20.x (Matrix strategy)
- Jest with coverage
- Timeout: 10 minutes
- Uploads coverage to Codecov
- **Blocks if failed**

### Job 3: BUILD-FRONTEND - Security Scan
- File existence verification
- XSS detection (eval, innerHTML)
- Parallel with backend test

### Job 4: SECURITY - Dependency Audit
- npm audit (--audit-level=moderate)
- Dependency listing
- **Blocks if vulnerability found**

### Job 5: INTEGRATION-TESTS - E2E Tests
- Depends on: [backend tests, frontend build]
- Tests real API workflows
- **Blocks if failed**

### Job 6: DEPLOY - Render Deployment
- **Only on `main` branch + `push` event**
- Skipped on `develop` and PRs
- Render webhook trigger
- Timeout: 5 minutes

### Job 7: NOTIFY - Pipeline Summary
- Markdown status table
- Always runs (even on failure)
- Results in GitHub Actions Summary

---

## 📊 Pipeline Execution Flow

```
[PUSH/PR to main or develop]
    ↓
[1. LINT - Code Style Check]
    ├─ Fail → 🛑 STOP PIPELINE
    └─ Pass ↓
    ├─────────────────────────────┐
    │ 2. BACKEND TEST (3 versions │
    │    with coverage & Codecov) │
    ├─────────────────────────────┤
    │ 3. FRONTEND BUILD             │
    │    (XSS/eval check)          │
    ├─────────────────────────────┤
    │ 4. SECURITY SCAN (parallel)  │
    │    (npm audit)               │
    └─────────────────────────────┘
         ↓ (all must pass)
    [5. INTEGRATION TEST]
         ↓
    If branch=main AND event=push:
    └─→ [6. DEPLOY via Render webhook]
         ↓
    [7. NOTIFY - Generate Summary] → GitHub Actions
```

---

## 💻 API Endpoints

### GET /todos
**Retrieve all todos**
```bash
curl http://localhost:3000/todos
```
Response: `200 OK`
```json
[
  {"id": 1234567890, "title": "Learn CI/CD"},
  {"id": 1234567891, "title": "Build pipeline"}
]
```

### POST /todos
**Create new todo**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "New task"}'
```
**Validation:**
- ✅ Title required (not empty)
- ✅ No whitespace-only strings
- ✅ Auto-trimmed
- 🛡️ XSS-safe

Response: `201 Created`
```json
{"id": 1234567892, "title": "New task"}
```

Error: `400 Bad Request`
```json
{"message": "Title required"}
```

### DELETE /todos/:id
**Delete todo**
```bash
curl -X DELETE http://localhost:3000/todos/1234567890
```

Response: `200 OK`
```json
{"message": "Deleted"}
```

Error: `404 Not Found`
```json
{"message": "Task not found"}
```

---

## 🔐 Security Features

### Backend Security
✅ Input validation (required, not empty)  
✅ Whitespace trimming  
✅ XSS character handling  
✅ Proper HTTP status codes  

### Frontend Security
✅ No eval() usage  
✅ No innerHTML with user input  
✅ Safe DOM manipulation  
✅ CORS enabled  

### CI/CD Security
✅ npm audit scanning (vulnerability detection)  
✅ Frontend XSS checks  
✅ Multi-version compatibility testing  
✅ Coverage reports  

---

## 📈 Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Unit Test Response Time | < 5ms | 1-4ms | ✅ Pass |
| Total Test Suite Time | < 2s | 0.964s | ✅ Pass |
| Build Time | < 1min | 30-60s | ✅ Pass |
| Deploy Time | < 5min | 1-2min | ✅ Pass |
| CI/CD Total Pipeline | < 5min | 4-5min | ✅ Pass |

---

## 🚀 Deployment to Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub

### Step 2: Create Web Service
- Click "New +"
- Select "Web Service"
- Connect GitHub repository
- Configure:
  - **Build Command:** `cd backend && npm install`
  - **Start Command:** `cd backend && npm start`
  - **Environment:** Node

### Step 3: Setup Deploy Hook
- Go to Settings → Deploy Hook
- Copy the hook URL
- Add to GitHub Secrets:
  ```
  Name: RENDER_DEPLOY_HOOK
  Value: https://api.render.com/deploy/srv-xxxxxxxxxxxx
  ```

### Step 4: Push to Main
```bash
git push origin main
```
- CI/CD Pipeline runs automatically
- All tests must pass
- Deploy triggered automatically 🚀
- Check Render dashboard for deployment status

---

## 👨‍💻 Development Workflow

### Local Development Setup

```bash
# Terminal 1: Backend Server
cd backend
npm install
npm start
# Server running on http://localhost:3000

# Terminal 2: Frontend (optional - if not using file:// protocol)
cd frontend
python -m http.server 8000
# Open http://localhost:8000/index.html
```

### Before Committing

```bash
cd backend

# Run all tests
npm test

# Check coverage
npm test -- --coverage

# Run linting (if available)
npm run lint --if-present
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-update-endpoint

# Make changes and test locally
npm test
npm start

# Commit changes
git add .
git commit -m "feat: Add update todo endpoint"

# Push to GitHub (develop or feature branch)
git push origin feature/add-update-endpoint

# Create Pull Request on GitHub
# CI/CD runs all checks automatically

# After approval, merge to main
# CI/CD Pipeline triggers → Tests → Deploy 🚀
```

---

## 🧪 Test Commands Reference

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Watch mode (auto-rerun on file changes)
npm test -- --watch

# Run only unit tests
npm test -- --testMatch="**/*.unit.test.js"

# Run only integration tests
npm test -- --testMatch="**/*.integration.test.js"

# Run specific test by name
npm test -- --testNamePattern="should validate"

# Verbose output
npm test -- --verbose

# Run single file
npm test -- tests/todo.unit.test.js
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 3000 already in use** | `netstat -ano \| findstr :3000` then kill process |
| **npm install fails** | Delete `node_modules` and `package-lock.json`, try again |
| **Tests fail locally** | Ensure Node.js version matches (16.x or higher) |
| **CI/CD not triggering** | Check branch is `main` or `develop` |
| **Deploy not working** | Verify RENDER_DEPLOY_HOOK secret is set in GitHub |
| **Integration tests timeout** | Increase timeout-minutes in `.github/workflows/ci-cd.yml` |
| **Coverage not uploaded** | Check Codecov integration in CI/CD |

---

## 📚 Resources & Documentation

- [Express.js Documentation](https://expressjs.com/)
- [Jest Testing Framework](https://jestjs.io/)
- [GitHub Actions Guide](https://docs.github.com/en/actions)
- [Render Deployment Docs](https://render.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [REST API Design](https://restfulapi.net/)

---

## ✅ Pre-Deployment Checklist

- [ ] All 14 tests passing locally
- [ ] No ESLint errors
- [ ] No npm audit vulnerabilities
- [ ] Frontend security checks pass (no eval/innerHTML)
- [ ] Code coverage acceptable (> 80%)
- [ ] README.md updated
- [ ] package.json fully configured
- [ ] RENDER_DEPLOY_HOOK secret added to GitHub
- [ ] Branch protection rules configured
- [ ] Ready to push to main

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Test Files | 2 (unit + integration) |
| Total Tests | 14 |
| Unit Tests | 9 |
| Integration Tests | 5 |
| CI/CD Jobs | 7 |
| Git Branches | main, develop |
| Node.js Versions | 3 (16.x, 18.x, 20.x) |
| Pipeline Duration | 4-5 minutes |
| Lines of Code (Backend) | ~150 |
| Lines of Code (Frontend) | ~100 |

---

## 🎓 Learning Objectives Covered

✅ **CI/CD Concepts**
- Automation pipeline design
- Testing strategy & execution
- Deployment workflows
- Environment configuration

✅ **Software Quality Assurance**
- Unit testing with Jest
- Integration testing
- Code coverage analysis
- Security vulnerability scanning

✅ **DevOps & Infrastructure**
- GitHub Actions workflows
- Docker containerization concepts
- Webhook-based deployments
- Multi-environment testing

✅ **Software Engineering Best Practices**
- Project structure organization
- Test isolation & mocking
- Security hardening
- Documentation standards
- Error handling

---

## 📄 License

This project is for educational purposes - free to use and modify.

---

## 👨‍🎓 Author Notes

This project serves as a comprehensive demonstration of modern DevOps practices, suitable for learning CI/CD pipeline implementation in production environments.

---

**Last Updated:** April 13, 2026  
**Status:** ✅ Production Ready  
**Test Results:** 14/14 PASS  
**Build Status:** All Checks Passing

