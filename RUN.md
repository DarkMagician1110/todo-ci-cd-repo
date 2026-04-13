# 🚀 How to Run Todo App

## 📋 Prerequisites
- Node.js 16.x or higher
- npm 6.x or higher
- Git (optional)

---

## 🎯 Option 1: Full Setup (Backend + Frontend) - RECOMMENDED

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Run Backend Server (Terminal 1)
```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Server running on http://localhost:3000
📍 Health check: http://localhost:3000/health
📋 API endpoint: http://localhost:3000/todos
```

### Step 3: Run Frontend Server (Terminal 2)

#### Option A: Using Python (Built-in on Windows)
```bash
cd frontend
python -m http.server 8000
```

#### Option B: Using Node (if installed globally)
```bash
cd frontend
npx serve .
```

#### Option C: Direct File Open
```bash
cd frontend
# Double-click index.html OR right-click → Open with Browser
```

### Step 4: Access the App
- **Frontend:** http://localhost:8000 (or http://localhost:8000/index.html)
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## ✅ Verify Everything Works

### Test 1: Add a Todo
1. In UI, type "Learn CI/CD"
2. Click "➕ Add Todo"
3. Should appear in the list

### Test 2: Delete Todo
1. Click "❌" button on any todo
2. Confirm deletion
3. Todo should disappear from list

### Test 3: Check API Status
- Green dot + "✅ Connected" = Backend is working
- Red dot + "❌ Disconnected" = Backend connection failed

---

## 🧪 Run Tests

### Terminal 3: Run All Tests
```bash
cd backend
npm test
```

**Expected Output:**
```
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Time:        1.189 s
```

### Run Specific Tests
```bash
# Only unit tests
npm test -- --testMatch="**/*.unit.test.js"

# Only integration tests
npm test -- --testMatch="**/*.integration.test.js"

# Watch mode (auto-rerun on file change)
npm test -- --watch

# With coverage
npm test -- --coverage
```

---

## 📁 Project Layout

```
terminal-1:
$ cd d:\todo-pro\backend && npm start
✅ Backend running on port 3000

terminal-2:
$ cd d:\todo-pro\frontend && python -m http.server 8000
✅ Frontend running on port 8000

terminal-3:
$ cd d:\todo-pro\backend && npm test
✅ Tests passing
```

---

## 🐛 Troubleshooting

### ❌ Port 3000 Already in Use
```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# OR change port in src/app.js
```

### ❌ Frontend Can't Connect to Backend
1. ✅ Backend server is running on port 3000?
2. ✅ CORS is enabled in app.js? (Yes ✅)
3. ✅ Try hard refresh (Ctrl+Shift+R)
4. ✅ Check browser console for errors

### ❌ Python HTTP Server Not Found
```bash
# Use Node instead
cd frontend
npx serve .
```

### ❌ npm install Fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### ❌ Tests Fail
```bash
# Ensure Node version 16.x+
node --version

# Clear jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

---

## 🎯 Common Commands Reference

### Backend
```bash
npm start              # Run server
npm test               # Run all tests
npm test -- --watch   # Watch mode
npm run lint           # Check linting
npm run dev            # Development mode
```

### Frontend
```bash
python -m http.server 8000  # Start Python server
npx serve .                 # Start Node server
```

### Git (if using version control)
```bash
git status
git add .
git commit -m "message"
git push origin main
```

---

## 📊 Expected Results

### ✅ Backend Status
- Server running: `http://localhost:3000/health` returns `{status: "OK"}`
- Todos endpoint: `http://localhost:3000/todos` returns `[]`

### ✅ Frontend Status
- Page loads without errors
- API indicator shows green + "Connected"
- Can add/delete todos

### ✅ Tests Status
- 14 tests passing
- Test time < 2 seconds
- No failures

---

## 📸 Screenshots / Demo Flow

1. **Open Frontend** → http://localhost:8000
2. **Type Todo** → "Setup CI/CD"
3. **Click Add** → Added to list
4. **See in Backend** → GET /todos returns the new todo
5. **Click Delete** → Todo removed
6. **Tests Pass** → npm test shows 14/14 ✅

---

## 🔗 API Endpoints (for Testing)

```bash
# Get all todos
curl http://localhost:3000/todos

# Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task"}'

# Delete todo
curl -X DELETE http://localhost:3000/todos/1234567890

# Health check
curl http://localhost:3000/health
```

---

## 💡 Pro Tips

1. **Keep 3 terminals open:**
   - Terminal 1: Backend (npm start)
   - Terminal 2: Frontend (python -m http.server 8000)
   - Terminal 3: Tests/Development

2. **Auto-reload Frontend:**
   - Use Python/Node server (auto-refreshes on code change)
   - Don't use file:// protocol for consistent experience

3. **Debug API Calls:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Make requests to see what's happening

4. **Development Workflow:**
   ```
   Make changes → Save file → Auto-reload → Test
   ```

---

## 🚀 Next Steps

1. ✅ Run tests locally: `npm test`
2. ✅ Test UI manually
3. ✅ Commit to Git
4. ✅ Push to GitHub
5. ✅ GitHub Actions runs CI/CD
6. ✅ Deploy to Render (if configured)

---

**Last Updated:** April 13, 2026  
**Status:** Ready to Run ✅
