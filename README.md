# CollabSpace

A real-time collaborative workspace where teams can create sticky-note boards, drag ideas around, and talk via built-in voice chat — all synced live.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS, DaisyUI |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Real-time | Socket.io (WebRTC for voice) |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Railway (backend) |

## Features

- **Real-time boards** — drag, drop, and edit sticky notes; changes sync to all users instantly
- **Voice chat** — WebRTC peer-to-peer audio built into every board
- **Share codes** — invite anyone with a unique 8-character code
- **Guest access** — jump in without creating an account
- **Board export** — download your board as a PNG
- **Delete boards** — owners can remove boards they created

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works) or local MongoDB

### Backend

```bash
cd backend
npm install
# Copy .env.example to .env and fill in values
cp .env.example .env
node index.js
# Server runs on http://localhost:8080
```

**Required env vars (`backend/.env`):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET_KEY=your-secret
PORT=8080
CORS_ORIGINS=http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
# App runs on http://localhost:3000
```

**Required env vars (`frontend/.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

### Docker (runs everything together)

```bash
# Update JWT_SECRET_KEY in docker-compose.yml first
docker-compose up --build
```

## Deployment

### Backend → Railway
1. Push code to GitHub
2. Create a new Railway project, connect your repo, set root to `backend/`
3. Add environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET_KEY` — a strong random string
   - `CORS_ORIGINS` — your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
4. Railway auto-detects Node.js and deploys

### Frontend → Vercel
1. Import repo on vercel.com, set root to `frontend/`
2. Add environment variables:
   - `NEXT_PUBLIC_API_URL` — your Railway backend URL
   - `NEXT_PUBLIC_WS_URL` — your Railway backend URL
3. Deploy

## Project Structure

```
CollabSpace/
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── app/           # Pages (landing, dashboard, board, auth)
│   │   ├── components/    # UI components
│   │   ├── hooks/         # useSocket, useVoiceChat
│   │   ├── api/           # REST API clients
│   │   └── ws/            # Socket.io event helpers
│   └── vercel.json
│
└── backend/               # Express API + Socket.io
    ├── src/
    │   ├── models/        # Mongoose schemas (User, Board, Post)
    │   ├── routes/        # REST routes (auth, user, board, post)
    │   ├── socket/        # Socket.io handlers (12 events)
    │   ├── middleware/     # JWT auth middleware
    │   └── utils/         # jwt, password, board helpers
    ├── index.js           # Entry point
    └── railway.json
```
