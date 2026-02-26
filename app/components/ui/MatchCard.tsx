"use client"

import { useEffect, useState, useRef } from "react"

interface matchCardProps {
    variant?: "lobby" | "queue"
    id: number
    courtName?: string
    lobbyName?: string
    team1: string[]
    team2: string[]
    status?: string
    timerDuration?: number
    timerStartedAt?: string | null
    startedAt?: string | null
    hasMatch?: boolean
    onClick?: () => void
    onDone?: () => void
    onStart?: () => void
    onStartNow?: () => void
}

function formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function PlayerGrid({ team1, team2 }: { team1: string[]; team2: string[] }) {
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs md:text-sm w-full">
            {Array.from({ length: Math.max(team1.length, team2.length) }).map((_, i) => (
                <div key={i} className="contents">
                    <p className="text-left truncate">{team1[i] || ""}</p>
                    <p className="text-right truncate">{team2[i] || ""}</p>
                </div>
            ))}
        </div>
    )
}

export default function MatchCard({
    variant,
    id,
    courtName,
    lobbyName,
    team1,
    team2,
    status,
    timerDuration = 300,
    timerStartedAt,
    startedAt,
    hasMatch,
    onClick,
    onDone,
    onStart,
    onStartNow,
}: matchCardProps) {
    const displayName = courtName || `Court ${id}`
    const [countdown, setCountdown] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState<number>(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        if (timerStartedAt && status === "pending") {
            const update = () => {
                const started = new Date(timerStartedAt).getTime()
                const now = Date.now()
                const elapsed = Math.floor((now - started) / 1000)
                const remaining = Math.max(0, timerDuration - elapsed)
                setCountdown(remaining)
                if (remaining <= 0 && intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                    if (onStartNow) onStartNow()
                }
            }
            update()
            intervalRef.current = setInterval(update, 1000)
        } else {
            setCountdown(null)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [timerStartedAt, timerDuration, status])

    useEffect(() => {
        if (intervalRef.current && status !== "pending") {
        }

        if (status === "ongoing" && startedAt) {
            const update = () => {
                const started = new Date(startedAt).getTime()
                const now = Date.now()
                setElapsed(Math.floor((now - started) / 1000))
            }
            update()
            const id = setInterval(update, 1000)
            return () => clearInterval(id)
        } else {
            setElapsed(0)
        }
    }, [status, startedAt])

    const isTimerRunning = timerStartedAt && status === "pending" && countdown !== null && countdown > 0
    const isTimerExpired = timerStartedAt && status === "pending" && countdown === 0
    const isOngoing = status === "ongoing"
    const isPending = status === "pending" && !timerStartedAt

    if (variant === "lobby") {
        return (
            <div className="text-accent bg-secondary w-full h-48 p-5 rounded-md border-3 border-accent hover:border-accent/80 transition duration-200 hover:shadow-lg hover:shadow-accent/20 flex flex-col justify-between transform hover:-translate-y-1.5">
                <button
                    type="button"
                    onClick={onClick}
                    disabled={isOngoing}
                    className="flex flex-col gap-2 cursor-pointer text-left flex-1 min-h-0"
                >
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-extrabold">{displayName}</h3>
                        {isTimerRunning && (
                            <span className="text-sm font-mono font-bold text-primary">
                                {formatCountdown(countdown!)}
                            </span>
                        )}
                        {isOngoing && (
                            <span className="text-sm font-mono font-bold text-primary">
                                {formatElapsed(elapsed)}
                            </span>
                        )}
                    </div>
                    {team1.length === 0 && team2.length === 0 ? (
                        <p className="text-gray-400 text-sm self-center">No players assigned</p>
                    ) : (
                        <PlayerGrid team1={team1} team2={team2} />
                    )}
                </button>
                {hasMatch && (
                    <div className="flex justify-end gap-2 mt-1">
                        {isPending && onStart && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onStart(); }}
                                className="text-xs font-semibold px-4 py-1.5 rounded-xl border-2 border-primary text-primary cursor-pointer hover:bg-primary hover:text-white transition"
                            >
                                Start
                            </button>
                        )}
                        {isTimerRunning && onStartNow && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onStartNow(); }}
                                className="text-xs font-semibold px-4 py-1.5 rounded-xl border-2 border-primary text-primary cursor-pointer hover:bg-primary hover:text-white transition"
                            >
                                Start Now
                            </button>
                        )}
                        {(isOngoing || isTimerExpired) && onDone && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onDone(); }}
                                className="text-xs font-semibold px-4 py-1.5 rounded-xl border-2 border-accent cursor-pointer hover:bg-tertiary transition"
                            >
                                Done
                            </button>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="text-accent bg-secondary w-full max-w-200 py-6 sm:py-8 px-6 sm:mx-8 rounded-md border-3 border-accent hover:border-accent/80 transition duration-200 hover:shadow-lg hover:shadow-accent/20 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-xl sm:text-2xl font-extrabold">{displayName}</h3>
                {lobbyName && <p className="text-xs text-gray-500">{lobbyName}</p>}
            </div>
            {isTimerRunning && (
                <p className="text-2xl font-mono font-bold text-primary">
                    Starting in {formatCountdown(countdown!)}
                </p>
            )}
            {isOngoing && (
                <p className="text-2xl font-mono font-bold text-primary">
                    {formatElapsed(elapsed)}
                </p>
            )}
            {isPending && (
                <p className="text-sm text-gray-400">Waiting to start</p>
            )}
            <div className="grid grid-cols-2 gap-x-12 sm:gap-x-20 gap-y-4 text-sm md:text-lg">
                {Array.from({ length: Math.max(team1.length, team2.length) }).map((_, i) => (
                    <div key={i} className="contents">
                        <p className="text-left">{team1[i] || ""}</p>
                        <p className="text-right">{team2[i] || ""}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}