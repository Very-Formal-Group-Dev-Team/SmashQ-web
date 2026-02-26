"use client"

import MatchCard from "@/app/components/ui/MatchCard"
import ModalTitle from "@/app/components/ui/ModalTitle"
import { useEffect, useState, useCallback } from "react"
import { getUserMatches, getUserLobbyGames, leaveLobby, type MatchData, type LobbyGamesData } from "@/app/lib/api"

export default function QueuePage() {
    const [matches, setMatches] = useState<MatchData[]>([])
    const [loading, setLoading] = useState(true)
    const [lobbyGames, setLobbyGames] = useState<LobbyGamesData[]>([])

    const fetchMatches = useCallback(async () => {
        try {
            const data = await getUserMatches()
            setMatches(data.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchLobbyGames = useCallback(async () => {
        try {
            const data = await getUserLobbyGames()
            setLobbyGames(data.data)
        } catch {}
    }, [])

    useEffect(() => {
        fetchMatches()
        fetchLobbyGames()

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchMatches()
                fetchLobbyGames()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [fetchMatches, fetchLobbyGames])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMatches()
            fetchLobbyGames()
        }, 5000)
        return () => clearInterval(interval)
    }, [fetchMatches, fetchLobbyGames])

    async function handleLeaveLobby(lobbyId: number) {
        if (!confirm("Are you sure you want to leave this lobby?")) return
        try {
            await leaveLobby(lobbyId)
            fetchLobbyGames()
            fetchMatches()
        } catch {}
    }

    const currentMatches = matches.filter(m => m.status === "ongoing" || (m.status === "pending" && m.timer_started_at))
    const nextMatches = matches.filter(m => m.status === "pending" && !m.timer_started_at)

    if (loading) {
        return <p className="text-secondary text-center mt-12">Loading matches...</p>
    }

    if (matches.length === 0 && lobbyGames.length === 0) {
        return (
            <div className="flex flex-col items-center mt-12 gap-4">
                <ModalTitle color="secondary">Queue</ModalTitle>
                <p className="text-secondary text-lg">No matches yet</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {lobbyGames.length > 0 && (
                <div className="mb-8">
                    <ModalTitle color="secondary">My Games</ModalTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {lobbyGames.map(lg => {
                            const atLimit = lg.max_games_per_player != null && lg.games_played >= lg.max_games_per_player
                            const progressPct = lg.max_games_per_player ? Math.min((lg.games_played / lg.max_games_per_player) * 100, 100) : 0
                            return (
                                <div key={lg.lobby_id} className="bg-secondary rounded-lg border-3 border-accent shadow-md p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <p className="font-display text-lg truncate">{lg.lobby_name}</p>
                                        <button
                                            type="button"
                                            onClick={() => handleLeaveLobby(lg.lobby_id)}
                                            className="text-red-400 hover:text-red-600 text-xs font-semibold cursor-pointer shrink-0 ml-2"
                                        >
                                            Leave
                                        </button>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-3xl font-bold ${atLimit ? "text-red-500" : "text-primary"}`}>
                                            {lg.games_played}
                                        </span>
                                        {lg.max_games_per_player != null && (
                                            <span className="text-gray-400 text-sm">/ {lg.max_games_per_player} games</span>
                                        )}
                                        {lg.max_games_per_player == null && (
                                            <span className="text-gray-400 text-sm">games played</span>
                                        )}
                                    </div>
                                    {lg.max_games_per_player != null && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${atLimit ? "bg-red-500" : "bg-primary"}`}
                                                style={{ width: `${progressPct}%` }}
                                            />
                                        </div>
                                    )}
                                    {atLimit && (
                                        <p className="text-xs text-red-500 font-semibold">Limit reached</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {currentMatches.length > 0 && (
                <ol className="flex flex-col gap-8 mb-8 sm:mb-12">
                    <li className="flex flex-col items-center justify-center">
                        <ModalTitle color="secondary">Current Match</ModalTitle>
                        {currentMatches.map(match => {
                            const team1 = match.players.filter(p => p.team === 1).map(p => p.name)
                            const team2 = match.players.filter(p => p.team === 2).map(p => p.name)
                            return (
                                <MatchCard
                                    key={match.id}
                                    variant="queue"
                                    id={match.id}
                                    courtName={match.court_name}
                                    lobbyName={match.lobby_name}
                                    team1={team1}
                                    team2={team2}
                                    status={match.status}
                                    timerDuration={match.timer_duration}
                                    timerStartedAt={match.timer_started_at}
                                    startedAt={match.started_at}
                                />
                            )
                        })}
                    </li>
                </ol>
            )}

            {nextMatches.length > 0 && (
                <>
                    <ModalTitle color="secondary">Next Matches</ModalTitle>
                    <ol className="flex flex-col gap-8">
                        {nextMatches.map(match => {
                            const team1 = match.players.filter(p => p.team === 1).map(p => p.name)
                            const team2 = match.players.filter(p => p.team === 2).map(p => p.name)
                            return (
                                <li key={match.id} className="flex justify-center">
                                    <MatchCard
                                        variant="queue"
                                        id={match.id}
                                        courtName={match.court_name}
                                        lobbyName={match.lobby_name}
                                        team1={team1}
                                        team2={team2}
                                        status={match.status}
                                        timerDuration={match.timer_duration}
                                        timerStartedAt={match.timer_started_at}
                                        startedAt={match.started_at}
                                    />
                                </li>
                            )
                        })}
                    </ol>
                </>
            )}
        </div>
    )
}