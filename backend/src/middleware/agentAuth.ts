import { Request, Response, NextFunction } from 'express';

// Map of API key → agent name, loaded once at startup.
// Keys come from environment variables so they are never committed to source.
const KEY_TO_AGENT: Record<string, string> = {};

function loadKeys() {
  const entries: [string, string][] = [
    [process.env.AGENT_NEXUS_API_KEY ?? '', 'Nexus'],
    [process.env.AGENT_CIPHER_API_KEY ?? '', 'Cipher'],
    [process.env.AGENT_RELAY_API_KEY ?? '', 'Relay'],
  ];

  for (const [key, name] of entries) {
    if (key) KEY_TO_AGENT[key] = name;
  }
}

loadKeys();

// Extend Express Request so downstream handlers can read req.agentName.
declare global {
  namespace Express {
    interface Request {
      agentName?: string;
    }
  }
}

export function agentAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Missing or malformed Authorization header. Expected: Bearer <API_KEY>',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "
  const agentName = KEY_TO_AGENT[token];

  if (!agentName) {
    res.status(403).json({
      success: false,
      error: 'Invalid API key',
      code: 'FORBIDDEN',
    });
    return;
  }

  req.agentName = agentName;
  console.log(`[AgentAuth] Request from agent: ${agentName} → ${req.method} ${req.path}`);
  next();
}
