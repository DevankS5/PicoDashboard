# SETUP — Getting Mission Control Running

Everything (code, configs, schema, seed) is already built. These are the only manual steps needed.

---

## Option A: Docker (Recommended — one command)

### Prerequisites
- [ ] Docker Desktop installed and running

### Steps
```bash
cd /project
docker-compose up
```

Docker will:
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

### Step 2 — Configure environment
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set the three agent API keys to unique values (see below).

### Step 3 — Backend setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend will be live at **http://localhost:3001**

### Step 4 — Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at **http://localhost:5173**

---

## Agent API Keys

Agent-facing endpoints (`POST /tasks`, `PUT /tasks/:id`, `POST /require_approval`) now require authentication. Each agent must include its API key in every request:

```
Authorization: Bearer <API_KEY>
```

### Generate keys

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this 3 times and set the output in `backend/.env`:

```env
AGENT_NEXUS_API_KEY=<64-char hex key>
AGENT_CIPHER_API_KEY=<64-char hex key>
AGENT_RELAY_API_KEY=<64-char hex key>
```

The `.env` already contains pre-generated development keys — they work out of the box for local testing. Rotate them before exposing the backend to any external network.

### Distribute to agents

Each PicoClock agent needs its own key. Give each agent only its own key — not the others:

| Agent | Env var to share |
|-------|-----------------|
| Nexus | `AGENT_NEXUS_API_KEY` |
| Cipher | `AGENT_CIPHER_API_KEY` |
| Relay | `AGENT_RELAY_API_KEY` |

---

## Verify It's Working

1. Open **http://localhost:5173** → should see the dashboard with 3 agent cards
2. All 3 agents (Nexus, Cipher, Relay) will show as **Offline** initially — correct, their health endpoints don't exist yet
3. Navigate to **Boards** → create a task
4. Navigate to **Approvals** → should show "All clear"

---

## Test the Agent-Facing API

These commands simulate what a PicoClock agent would send. Replace `YOUR_API_KEY` with the relevant key from `backend/.env`.

```bash
# Get the board ID
curl http://localhost:3001/boards

# Create a task (replace BOARD_ID and API_KEY)
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"boardId":"BOARD_ID","title":"Test task","status":"IN_PROGRESS"}'

# Trigger an approval request (replace TASK_ID and API_KEY)
curl -X POST http://localhost:3001/require_approval \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"taskId":"TASK_ID","reason":"Need API key for payment gateway"}'
```

Without the `Authorization` header, these calls return:
```json
{ "success": false, "error": "Missing or malformed Authorization header. Expected: Bearer <API_KEY>", "code": "UNAUTHORIZED" }
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `relation "agents" does not exist` | Run `npx prisma migrate dev` in `backend/` |
| Port 5432 already in use | Stop your local Postgres or change the port in `docker-compose.yml` |
| Port 5173 / 3001 in use | Kill the process using that port or change in the config files |
| `Cannot find module '@prisma/client'` | Run `npx prisma generate` in `backend/` |
| Agent calls return 401 | Check `Authorization: Bearer <KEY>` header is included |
| Agent calls return 403 | Key is present but wrong — verify it matches the env var for that agent |
| Keys not loading | Ensure `backend/.env` exists and has all three `AGENT_*_API_KEY` vars set |
