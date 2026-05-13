# Lumina AI - SaaS Platform

A MERN stack-based AI SaaS application with subscription billing, prompt history, and JWT authentication.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs
- **Database:** MongoDB
- **Infrastructure:** Docker & Docker Compose

## Prerequisites
- Docker and Docker Compose installed.

## Getting Started

### 1. Environment Variables
Copy the `.env.example` file in the `server` directory and create a `.env` file.
```bash
cp server/.env.example server/.env
```

### 2. Start the Application
Run Docker Compose to start MongoDB, Redis, and the Node.js Express server.
```bash
docker-compose up -d
```
The server will be running on `http://localhost:5000`.

### 3. Start the Frontend
In a new terminal window, navigate to the `client` directory and start the Vite dev server:
```bash
cd client
npm run dev
```
The client will be running on `http://localhost:5173`.
