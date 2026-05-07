# SETUP — Getting Mission Control Running

No seed data. No hardcoded agents. Start the stack, then add agents via `POST /agents` from the dashboard.

---

## Option A: Docker (Recommended)

### Prerequisites
- [ ] Docker Desktop installed and running
- [ ] Your remote MongoDB URL ready (hosted on Coolify/VBS)

### Steps

1. Create a root `.env` file with your MongoDB URL:
   ```env
   MONGODB_URL=mongodb://user:password@your-vbs-host:27017/mission_control
   ```

2. Start the stack:
   ```bash
   docker-compose up
   ```

Docker will:
1. Build and start the FastAPI backend on `:3001`
2. Build and start the Vite frontend on `:5173`
3. Connect to your remote MongoDB on startup

Open → **http://localhost:5173**

---

## Option B: Local Dev (No Docker)

### Prerequisites
- [ ] Python 3.12+ installed
- [ ] Node.js 20 LTS installed
- [ ] Remote MongoDB URL ready

### Step 1 — Backend

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set MONGODB_URL to your remote instance
```

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 3001 --reload
```

Backend live at **http://localhost:3001**

### Step 2 — Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend live at **http://localhost:5173**

---

## Adding Agents

The database starts empty. Add agents from the dashboard or via curl:

```bash
curl -s -X POST http://localhost:3001/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nexus",
    "health_endpoint": "/health",
    "description": "Optional description",
    "bot_webhook_url": "https://your-telegram-or-discord-webhook"
  }'
```

The response returns the agent's **plaintext API key once** — copy it immediately:

```json
{
  "success": true,
  "data": {
    "id": "664abc...",
    "name": "Nexus",
    "api_key": "the-key-shown-only-once"
  }
}
```

Give the agent its key. The key is never stored in plaintext or returned again. To rotate it: `POST /agents/{id}/regenerate-key`.

---

## Agent API Authentication

All agent-facing endpoints require:

```
Authorization: Bearer <API_KEY>
```

Agent-facing endpoints: `POST /require_approval`, `GET /skills/*`, `POST /skills/*`, `DELETE /skills/*`.

Operator dashboard endpoints (`/agents`, `/boards`, `/tasks`, `/approvals`) require no auth (trusted local network).

---

## How Agent Task Polling Works

Agents poll `GET /skills/get-tasks` using their API key. The endpoint returns **only tasks assigned to the calling agent** — other agents' tasks are never included. If a task exists for that agent, the agent acts on it; otherwise it stays idle. No WebSockets, no push — polling only.

---

## Manual Health Check Trigger (dev only)

```bash
curl -X POST http://localhost:3001/agents/health-check
```

Returns `{ "checked": n, "online": n, "offline": n }`. The scheduler also runs automatically every 5 minutes on startup.

---

## Test the Agent-Facing API

Replace `YOUR_API_KEY` with the key returned when you created the agent, and `BOARD_ID` / `TASK_ID` with real IDs.

```bash
# Get boards (create one first if empty)
curl http://localhost:3001/boards

# Agent creates a task on its own board
curl -X POST http://localhost:3001/skills/create-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"board_id":"BOARD_ID","name":"Analyse logs","description":"Check for anomalies"}'

# Agent fetches its own tasks
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3001/skills/get-tasks

# Agent escalates a task for approval
curl -X POST http://localhost:3001/require_approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"task_id":"TASK_ID","reason":"Need operator sign-off before proceeding"}'

# Operator resolves the approval
curl -X POST http://localhost:3001/approvals/TASK_ID/resolve \
  -H "Content-Type: application/json" \
  -d '{"action":"approve"}'
```

---

## Verify It's Working

1. Open **http://localhost:5173** → dashboard loads (empty agent grid until you add agents)
2. Add an agent via `POST /agents` → agent card appears
3. Health check runs automatically — agent shows Online/Offline based on `health_endpoint` response
4. Navigate to **Boards** → create a board, then add tasks
5. Navigate to **Approvals** → tasks escalated via `POST /require_approval` appear here

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MONGODB_URL` not set | Create root `.env` (Docker) or `backend/.env` (local) with the variable |
| MongoDB connection refused | Verify the remote host/port is reachable; check firewall rules on your VBS |
| Port 3001 / 5173 in use | Kill the process using that port or change in `docker-compose.yml` |
| Agent calls return 401 | `Authorization: Bearer <KEY>` header missing or malformed |
| Agent calls return 401 (key present) | Key is wrong or was regenerated — re-issue via `POST /agents/{id}/regenerate-key` |
| Agent always offline | Verify `health_endpoint` stored on the agent doc is reachable; trigger `POST /agents/health-check` to force a cycle |
| `pydantic_settings` import error | Run `pip install -r requirements.txt` — ensure `pydantic-settings` is installed |
