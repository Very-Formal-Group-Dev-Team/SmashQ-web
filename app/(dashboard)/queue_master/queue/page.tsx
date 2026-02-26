"use client"

import MatchCard from "@/app/components/ui/MatchCard"
import ModalTitle from "@/app/components/ui/ModalTitle"
import { useEffect, useState, useCallback } from "react"
import { getUserMatches, type MatchData } from "@/app/lib/api"

export default function QueuePage() {
    const [matches, setMatches] = useState<MatchData[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMatches = useCallback(async () => {
        try {
            const data = await getUserMatches()
            setMatches(data.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMatches()
    }, [fetchMatches])

    useEffect(() => {
        const interval = setInterval(fetchMatches, 5000)
        return () => clearInterval(interval)
    }, [fetchMatches])

    const currentMatches = matches.filter(m => m.status === "ongoing" || (m.status === "pending" && m.timer_started_at))
    const nextMatches = matches.filter(m => m.status === "pending" && !m.timer_started_at)

    if (loading) {
        return <p className="text-secondary text-center mt-12">Loading matches...</p>
    }

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center mt-12 gap-4">
                <ModalTitle color="secondary">Queue</ModalTitle>
                <p className="text-secondary text-lg">No matches yet</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
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
}