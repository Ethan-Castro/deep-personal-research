import type { SessionState } from "./types"

// In-memory session store (V1 — replace with Vercel KV later)
const sessions = new Map<string, SessionState>()

export function createSession(session: SessionState): void {
  sessions.set(session.id, session)
}

export function getSession(id: string): SessionState | undefined {
  return sessions.get(id)
}

export function updateSession(
  id: string,
  updates: Partial<SessionState>
): SessionState | undefined {
  const session = sessions.get(id)
  if (!session) return undefined
  const updated = { ...session, ...updates }
  sessions.set(id, updated)
  return updated
}
