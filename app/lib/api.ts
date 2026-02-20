const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Decode the JWT payload from the stored access token without verifying the signature.
 * Used only to extract `userId` on the client when AuthContext hasn't loaded yet.
 */
export function getUserIdFromToken(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? payload.id ?? null;
  } catch {
    return null;
  }
}

// ── Join Endpoints ──────────────────────────────────────────

/** GET /api/join/:lobby_id – public, returns { join_link } */
export async function getJoinLink(lobbyId: number | string) {
  const res = await fetch(`${API_BASE}/join/${lobbyId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to get join link");
  }
  return res.json() as Promise<{ join_link: string }>;
}

/** POST /api/join/:lobby_id – auth required, joins authenticated user */
export async function joinLobby(lobbyId: number | string) {
  const res = await fetch(`${API_BASE}/join/${lobbyId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to join lobby");
  }
  return data as { success: boolean; message: string };
}

// ── Lobby Endpoints ─────────────────────────────────────────

export interface LobbyData {
  lobby_id: number;
  lobby_name: string;
  owner: number;
  created_at: string;
}

/** POST /api/lobby – auth required, creates a new lobby */
export async function createLobby(lobbyName: string, owner: number) {
  const res = await fetch(`${API_BASE}/lobby`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ lobby_name: lobbyName, owner }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to create lobby");
  }
  return data as { success: boolean; message: string; data: LobbyData };
}

/** GET /api/lobby – auth required, returns lobbies owned by user */
export async function getMyLobbies() {
  const res = await fetch(`${API_BASE}/lobby`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobbies");
  }
  return data as { success: boolean; message: string; data: LobbyData[] };
}

/** GET /api/lobby/:lobby_id - auth required, returns lobby data */
export async function getLobby(lobbyId: number | string) {
  const res = await fetch(`${API_BASE}/lobby/${lobbyId}`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobbies");
  }
  return data as { success: boolean; message: string; data: LobbyData[] };
}

// ── Lobby Users Endpoint ────────────────────────────────────

export interface LobbyUser {
  id: number;
  name: string;
  joined_at: string;
}

/** GET /api/lobby/:lobby_id/users – auth required, returns users in lobby */
export async function getLobbyUsers(lobbyId: number | string) {
  const res = await fetch(`${API_BASE}/lobby/${lobbyId}/users`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobby users");
  }
  return data as { users: LobbyUser[] };
}
