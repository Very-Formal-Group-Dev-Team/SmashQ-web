const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newToken = data.data?.accessToken;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { ...options, headers: { ...authHeaders(), ...options.headers } });
  if (res.status !== 401) return res;
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
  }
  const newToken = await refreshPromise;
  if (!newToken) return res;
  const retryHeaders: HeadersInit = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${newToken}`,
  };
  return fetch(url, { ...options, headers: retryHeaders });
}

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

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  gender: string | null;
  age: number | null;
  contact_number: string | null;
  nickname: string | null;
  dominant_hand: string | null;
  is_verified: boolean;
  matches_played: number;
  winrate: number;
  average_match_duration: number;
}

export async function getProfile(): Promise<{ success: boolean; data: { user: UserProfile } }> {
  const res = await fetchWithAuth(`${API_BASE}/profile`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to get profile");
  return data;
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
  const res = await fetchWithAuth(`${API_BASE}/join/${lobbyId}`, {
    method: "POST",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to join lobby");
  }
  return data as { success: boolean; message: string };
}

export async function leaveLobby(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/join/${lobbyId}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to leave lobby");
  }
  return data as { success: boolean; message: string };
}

// ── Lobby Endpoints ─────────────────────────────────────────

export interface LobbyData {
  lobby_id: number;
  lobby_name: string;
  owner: number;
  created_at: string;
  number_of_players?: number;
  max_games_per_player?: number | null;
  status?: string;
}

/** POST /api/lobby – auth required, creates a new lobby */
export async function createLobby(lobbyName: string, owner: number) {
  const res = await fetchWithAuth(`${API_BASE}/lobby`, {
    method: "POST",
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
  const res = await fetchWithAuth(`${API_BASE}/lobby`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobbies");
  }
  return data as { success: boolean; message: string; data: LobbyData[] };
}

/** GET /api/lobby/:lobby_id - auth required, returns lobby data */
export async function getLobby(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobbies");
  }
  return data as { success: boolean; message: string; data: LobbyData };
}

export async function finishLobby(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/finish`, {
    method: "PATCH",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to finish lobby");
  }
  return data as { success: boolean; data: { status: string } };
}

export async function removePlayerFromLobby(lobbyId: number | string, userId: number) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/users/${userId}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to remove player");
  }
  return data as { success: boolean; message: string };
}

// ── Lobby Users Endpoint ────────────────────────────────────

export interface LobbyUser {
  id: number;
  name: string;
  joined_at: string;
  games_played: number;
}

/** GET /api/lobby/:lobby_id/users – auth required, returns users in lobby */
export async function getLobbyUsers(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/users`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch lobby users");
  }
  return data as { users: LobbyUser[] };
}

export interface CourtData {
  id: number;
  lobby_id: number;
  court_name: string | null;
  location: string;
  active_match: MatchData | null;
}

export interface MatchPlayer {
  user_id: number;
  name: string;
  team: number;
}

export interface MatchData {
  id: number;
  court_id: number;
  lobby_id: number;
  status: string;
  timer_duration: number;
  timer_started_at: string | null;
  started_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  players: MatchPlayer[];
  court_name?: string;
  lobby_name?: string;
}

export async function getLobbyCourts(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch courts");
  return data as { success: boolean; data: CourtData[] };
}

export async function createCourt(lobbyId: number | string, courtName: string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts`, {
    method: "POST",
    body: JSON.stringify({ court_name: courtName }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create court");
  return data as { success: boolean; data: CourtData };
}

export async function deleteCourt(lobbyId: number | string, courtId: number) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to delete court");
  return data;
}

export async function updateCourtName(lobbyId: number | string, courtId: number, courtName: string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}`, {
    method: "PATCH",
    body: JSON.stringify({ court_name: courtName }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update court");
  return data as { success: boolean; data: CourtData };
}

export async function createMatch(
  lobbyId: number | string,
  courtId: number,
  team1: number[],
  team2: number[],
  scheduledAt?: string
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/match`, {
    method: "POST",
    body: JSON.stringify({ team1, team2, scheduled_at: scheduledAt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create match");
  return data as { success: boolean; data: MatchData };
}

export async function getCourtMatch(lobbyId: number | string, courtId: number) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/match`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch match");
  return data as { success: boolean; data: MatchData | null };
}

export async function getCourtsWithMatches(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts-with-matches`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch courts");
  return data as { success: boolean; data: CourtData[] };
}

export async function addGuestPlayer(lobbyId: number | string, name: string) {
  const res = await fetchWithAuth(`${API_BASE}/join/${lobbyId}/guest`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to add guest player");
  return data as { success: boolean; data: { id: number; name: string; is_guest: boolean } };
}

export async function finishMatch(
  lobbyId: number | string,
  courtId: number,
  matchId: number,
  winnerTeam: number
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/match/${matchId}/finish`, {
    method: "PATCH",
    body: JSON.stringify({ winner_team: winnerTeam }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to finish match");
  return data as { success: boolean; data: MatchData };
}

export async function startTimer(
  lobbyId: number | string,
  courtId: number,
  matchId: number,
  timerDuration?: number
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/match/${matchId}/start-timer`, {
    method: "PATCH",
    body: JSON.stringify({ timer_duration: timerDuration }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to start timer");
  return data as { success: boolean; data: MatchData };
}

export async function startMatch(
  lobbyId: number | string,
  courtId: number,
  matchId: number
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/match/${matchId}/start`, {
    method: "PATCH",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to start match");
  return data as { success: boolean; data: MatchData };
}

export async function getUserMatches() {
  const res = await fetchWithAuth(`${API_BASE}/lobby/user-matches`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch user matches");
  return data as { success: boolean; data: MatchData[] };
}

export async function autoAssignMatch(
  lobbyId: number | string,
  courtId: number,
  mode: "1v1" | "2v2" = "2v2"
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/courts/${courtId}/auto-assign`, {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to auto-assign match");
  return data as {
    success: boolean;
    message: string;
    data: {
      team1: { id: number; name: string }[];
      team2: { id: number; name: string }[];
    };
  };
}

export async function updateLobbySettings(
  lobbyId: number | string,
  settings: { max_games_per_player: number | null }
) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/settings`, {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update lobby settings");
  return data as { success: boolean; data: { max_games_per_player: number | null } };
}

export interface LobbyGamesData {
  lobby_id: number;
  lobby_name: string;
  games_played: number;
  max_games_per_player: number | null;
}

export async function getUserLobbyGames() {
  const res = await fetchWithAuth(`${API_BASE}/lobby/user-lobby-games`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch lobby games");
  return data as { success: boolean; data: LobbyGamesData[] };
}

export interface AnalyticsMatchData {
  id: number;
  court_id: number;
  lobby_id: number;
  status: string;
  winner_team: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  court_name?: string;
  players: MatchPlayer[];
}

export async function getLobbyMatches(lobbyId: number | string) {
  const res = await fetchWithAuth(`${API_BASE}/lobby/${lobbyId}/matches`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch lobby matches");
  return data as { success: boolean; data: AnalyticsMatchData[] };
}
