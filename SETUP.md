# SETUP — Steps Required From You

These are the only manual steps needed to get Mission Control running.
Everything else (code, configs, schema, seed) is already built.

---

## Option A: Docker (Recommended — one command)

### Prerequisites
- [ ] Docker Desktop installed and running

### Steps
```bash
cd /project
docker-compose up
```

That's it. Docker will:
1. Start PostgreSQL on `:5432`
2. Build and start the backend on `:3001` (runs migrations + seed automatically)
3. Build and start the frontend on `:5173`

Open → **http://localhost:5173**

---

## Option B: Local Dev (No Docker)

### Prerequisites
- [ ] Node.js 20 LTS installed (`node --version` should show v20.x)
- [ ] PostgreSQL 15 running locally on port 5432
- [ ] A database named `mission_control` created

### Step 1 — Create the database
```sql
-- In psql or any Postgres client:
CREATE DATABASE mission_control;
```

### Step 2 — Backend setup
```bash
cd /project/backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend will be live at **http://localhost:3001**

### Step 3 — Frontend setup (new terminal)
```bash
cd /project/frontend
npm install
npm run dev
```

Frontend will be live at **http://localhost:5173**

---

## Verify It's Working

1. Open http://localhost:5173 → should see the dashboard with 3 agent cards
2. All 3 agents (Nexus, Cipher, Relay) will show as **Offline** initially — that's correct, their health endpoints don't exist yet
3. Navigate to **Boards** → create a task
4. Navigate to **Approvals** → should show "All clear"

---

## Test the Agent-Facing API

```bash
# First get the board ID
curl http://localhost:3001/boards

# Create a task (replace BOARD_ID)
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"boardId":"BOARD_ID","title":"Test task","status":"IN_PROGRESS"}'

# Trigger approval (replace TASK_ID)
curl -X POST http://localhost:3001/require_approval \
  -H "Content-Type: application/json" \
  -d '{"taskId":"TASK_ID","reason":"Need API key"}'
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `relation "agents" does not exist` | Run `npx prisma migrate dev` in `/backend` |
| Port 5432 already in use | Stop your local Postgres or change the port in docker-compose.yml |
| Port 5173 / 3001 in use | Kill the process using that port or change in the config files |
| `Cannot find module '@prisma/client'` | Run `npx prisma generate` in `/backend` |
