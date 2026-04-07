🚀 Todo App with CI/CD
📌 Description

Fullstack Todo App with CI/CD pipeline (auto test & deploy) using GitHub Actions and Render.

⚙️ Features
➕ Add todo
📄 Get all todos
❌ Delete todo
🛠️ Tech Stack
Backend: Node.js (Express)
Frontend: HTML, CSS, JavaScript
CI/CD: GitHub Actions
Deployment: Render
🔄 CI/CD Pipeline

This project demonstrates a simple CI/CD workflow:

Push code to GitHub
GitHub Actions runs:
Install dependencies
Run tests
If tests pass → trigger deployment on Render
📂 Project Structure
backend/
  src/
    controllers/
    routes/
    app.js
  tests/

frontend/
  index.html
  script.js
▶️ Run Locally
Backend
cd backend
npm install
npm start
Frontend
Open frontend/index.html
Or use Live Server (recommended)
🌐 Deployment

The application is automatically deployed on Render after a successful CI pipeline.

🎯 Purpose

This project is built for learning and demonstrating:

Continuous Integration (CI)
Continuous Deployment (CD)
Automated testing and deployment workflow
🧠 Summary

This project showcases how to automate testing and deployment of a web application using GitHub Actions and Render.
