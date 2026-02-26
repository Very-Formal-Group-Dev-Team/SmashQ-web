"use client"

import Modal from "@/app/components/ui/Modal"
import ModalTitle from "@/app/components/ui/ModalTitle"
import { type LobbyData, type LobbyUser, type AnalyticsMatchData } from "@/app/lib/api"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line,
} from "recharts"
import { useState } from "react"
import { FaTrophy, FaClock, FaUsers, FaTableTennis } from "react-icons/fa"

interface LobbyAnalytics {
    lobby: LobbyData
    users: LobbyUser[]
    matches: AnalyticsMatchData[]
}

interface Props {
    open: boolean
    onClose: () => void
    data: LobbyAnalytics | null
    loading: boolean
}

const CHART_COLORS = ["#368F66", "#2C2C2C", "#60a5fa", "#f97316", "#a78bfa", "#f43f5e", "#14b8a6", "#eab308"]

function computePlayerStats(matches: AnalyticsMatchData[]) {
    const finished = matches.filter(m => m.status === "finished" && m.winner_team)
    const statsMap: Record<number, { name: string; wins: number; losses: number; matchesPlayed: number; totalDuration: number; matchCount: number }> = {}

    for (const match of finished) {
        const duration = match.started_at && match.ended_at
            ? (new Date(match.ended_at).getTime() - new Date(match.started_at).getTime()) / 1000 / 60
            : 0

        for (const player of match.players) {
            if (!statsMap[player.user_id]) {
                statsMap[player.user_id] = { name: player.name, wins: 0, losses: 0, matchesPlayed: 0, totalDuration: 0, matchCount: 0 }
            }
            const s = statsMap[player.user_id]
            s.matchesPlayed++
            if (player.team === match.winner_team) {
                s.wins++
            } else {
                s.losses++
            }
            if (duration > 0) {
                s.totalDuration += duration
                s.matchCount++
            }
        }
    }

    return Object.entries(statsMap).map(([id, s]) => ({
        userId: Number(id),
        name: s.name,
        wins: s.wins,
        losses: s.losses,
        matchesPlayed: s.matchesPlayed,
        winrate: s.matchesPlayed > 0 ? Math.round((s.wins / s.matchesPlayed) * 100) : 0,
        avgDuration: s.matchCount > 0 ? Math.round((s.totalDuration / s.matchCount) * 100) / 100 : 0,
    })).sort((a, b) => b.wins - a.wins)
}

function computeMatchTimeline(matches: AnalyticsMatchData[]) {
    const finished = matches
        .filter(m => m.status === "finished" && m.created_at)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    return finished.map((m, i) => {
        const duration = m.started_at && m.ended_at
            ? Math.round((new Date(m.ended_at).getTime() - new Date(m.started_at).getTime()) / 1000 / 60 * 100) / 100
            : 0
        return {
            match: `#${i + 1}`,
            duration,
            court: m.court_name || `Court ${m.court_id}`,
        }
    })
}

function computeCourtUsage(matches: AnalyticsMatchData[]) {
    const finished = matches.filter(m => m.status === "finished")
    const courtMap: Record<string, number> = {}
    for (const m of finished) {
        const name = m.court_name || `Court ${m.court_id}`
        courtMap[name] = (courtMap[name] || 0) + 1
    }
    return Object.entries(courtMap).map(([name, value]) => ({ name, value }))
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="bg-white rounded-xl border-2 border-accent/10 p-4 flex items-center gap-3">
            <div className="text-primary text-xl">{icon}</div>
            <div>
                <p className="text-accent/60 text-xs font-medium">{label}</p>
                <p className="text-accent text-lg font-black">{value}</p>
            </div>
        </div>
    )
}

type Tab = "overview" | "players" | "matches"

export default function LobbyStatsModal({ open, onClose, data, loading }: Props) {
    const [tab, setTab] = useState<Tab>("overview")

    if (!open) return null

    const lobby = data?.lobby
    const users = data?.users ?? []
    const matches = data?.matches ?? []
    const finishedMatches = matches.filter(m => m.status === "finished")
    const playerStats = computePlayerStats(matches)
    const mvp = playerStats.length > 0 ? playerStats[0] : null
    const timeline = computeMatchTimeline(matches)
    const courtUsage = computeCourtUsage(matches)

    const totalDuration = finishedMatches.reduce((acc, m) => {
        if (m.started_at && m.ended_at) {
            return acc + (new Date(m.ended_at).getTime() - new Date(m.started_at).getTime()) / 1000 / 60
        }
        return acc
    }, 0)
    const avgMatchDuration = finishedMatches.length > 0 ? Math.round((totalDuration / finishedMatches.length) * 10) / 10 : 0

    const tabs: { key: Tab; label: string }[] = [
        { key: "overview", label: "Overview" },
        { key: "players", label: "Players" },
        { key: "matches", label: "Match Log" },
    ]

    return (
        <Modal open={open} onClose={onClose}>
            {loading ? (
                <p className="text-accent text-lg py-12">Loading statistics...</p>
            ) : (
                <div className="w-full">
                    <ModalTitle>{lobby?.lobby_name || `Lobby ${lobby?.lobby_id}`}</ModalTitle>

                    <div className="flex justify-center gap-2 mb-8">
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer
                                    ${tab === t.key
                                        ? "bg-primary text-white"
                                        : "bg-accent/10 text-accent hover:bg-accent/20"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === "overview" && (
                        <div className="w-full space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <StatCard icon={<FaUsers />} label="Players" value={users.length} />
                                <StatCard icon={<FaTableTennis />} label="Matches Played" value={finishedMatches.length} />
                                <StatCard icon={<FaClock />} label="Avg Duration" value={`${avgMatchDuration} min`} />
                                <StatCard
                                    icon={<FaTrophy />}
                                    label="MVP"
                                    value={mvp ? `${mvp.name} (${mvp.wins}W)` : "N/A"}
                                />
                            </div>

                            {mvp && (
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaTrophy className="text-yellow-500 text-2xl" />
                                        <h3 className="font-black text-accent text-lg">Most Wins</h3>
                                    </div>
                                    <p className="text-accent text-2xl font-black">{mvp.name}</p>
                                    <div className="flex gap-6 mt-2 text-sm text-accent/70">
                                        <span>{mvp.wins} wins</span>
                                        <span>{mvp.losses} losses</span>
                                        <span>{mvp.winrate}% winrate</span>
                                        <span>{mvp.matchesPlayed} games</span>
                                    </div>
                                </div>
                            )}

                            {playerStats.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-accent text-sm mb-3">Wins per Player</h3>
                                    <div className="w-full h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={playerStats.slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                                    formatter={(value?: number, name?: string) => [value ?? 0, name === "wins" ? "Wins" : "Losses"]}
                                                />
                                                <Bar dataKey="wins" fill="#368F66" radius={[4, 4, 0, 0]} name="wins" />
                                                <Bar dataKey="losses" fill="#2C2C2C" radius={[4, 4, 0, 0]} name="losses" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {courtUsage.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-accent text-sm mb-3">Court Usage</h3>
                                    <div className="w-full h-52">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={courtUsage}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                                >
                                                    {courtUsage.map((_, i) => (
                                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {timeline.length > 1 && (
                                <div>
                                    <h3 className="font-bold text-accent text-sm mb-3">Match Duration Over Time (minutes)</h3>
                                    <div className="w-full h-52">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={timeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="match" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                                    formatter={(value?: number) => [`${value ?? 0} min`, "Duration"]}
                                                    labelFormatter={(label) => `Match ${label}`}
                                                />
                                                <Line type="monotone" dataKey="duration" stroke="#368F66" strokeWidth={2} dot={{ r: 4, fill: "#368F66" }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "players" && (
                        <div className="w-full space-y-4">
                            {playerStats.length === 0 && (
                                <p className="text-accent/60 text-center py-8">No match data available.</p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-accent/10 text-left text-accent/60">
                                            <th className="pb-2 pr-4">#</th>
                                            <th className="pb-2 pr-4">Player</th>
                                            <th className="pb-2 pr-4 text-center">W</th>
                                            <th className="pb-2 pr-4 text-center">L</th>
                                            <th className="pb-2 pr-4 text-center">Win%</th>
                                            <th className="pb-2 pr-4 text-center">Games</th>
                                            <th className="pb-2 text-center">Avg Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playerStats.map((p, i) => (
                                            <tr key={p.userId} className="border-b border-accent/5 hover:bg-accent/5 transition">
                                                <td className="py-2 pr-4 font-bold text-accent/40">{i + 1}</td>
                                                <td className="py-2 pr-4 font-semibold text-accent flex items-center gap-2">
                                                    {i === 0 && <FaTrophy className="text-yellow-500 text-sm" />}
                                                    {p.name}
                                                </td>
                                                <td className="py-2 pr-4 text-center text-green-600 font-bold">{p.wins}</td>
                                                <td className="py-2 pr-4 text-center text-red-500 font-bold">{p.losses}</td>
                                                <td className="py-2 pr-4 text-center">{p.winrate}%</td>
                                                <td className="py-2 pr-4 text-center">{p.matchesPlayed}</td>
                                                <td className="py-2 text-center">{p.avgDuration > 0 ? `${p.avgDuration} min` : "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {users.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold text-accent text-sm mb-3">All Players Who Joined</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {users.map(u => (
                                            <span
                                                key={u.id}
                                                className="bg-accent/10 text-accent text-xs font-medium px-3 py-1.5 rounded-full"
                                            >
                                                {u.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {playerStats.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-bold text-accent text-sm mb-3">Winrate Distribution</h3>
                                    <div className="w-full h-56">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={playerStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                                    formatter={(value?: number) => [`${value ?? 0}%`, "Winrate"]}
                                                />
                                                <Bar dataKey="winrate" fill="#368F66" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "matches" && (
                        <div className="w-full space-y-3">
                            {finishedMatches.length === 0 && (
                                <p className="text-accent/60 text-center py-8">No finished matches.</p>
                            )}
                            {finishedMatches.map((match, i) => {
                                const team1 = match.players.filter(p => p.team === 1)
                                const team2 = match.players.filter(p => p.team === 2)
                                const duration = match.started_at && match.ended_at
                                    ? Math.round((new Date(match.ended_at).getTime() - new Date(match.started_at).getTime()) / 1000 / 60 * 10) / 10
                                    : null

                                return (
                                    <div key={match.id} className="bg-white rounded-xl border border-accent/10 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-accent text-sm">Match #{finishedMatches.length - i}</span>
                                                <span className="text-accent/40 text-xs">
                                                    {match.court_name || `Court ${match.court_id}`}
                                                </span>
                                            </div>
                                            {duration !== null && (
                                                <span className="text-xs text-accent/50 flex items-center gap-1">
                                                    <FaClock className="text-[10px]" /> {duration} min
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-1 rounded-lg p-3 text-center ${match.winner_team === 1 ? "bg-green-50 border-2 border-green-300" : "bg-accent/5 border border-accent/10"}`}>
                                                <p className="text-xs font-semibold text-accent/50 mb-1">
                                                    Team 1 {match.winner_team === 1 && <FaTrophy className="inline text-yellow-500 ml-1" />}
                                                </p>
                                                {team1.map(p => (
                                                    <p key={p.user_id} className="text-sm text-accent font-medium">{p.name}</p>
                                                ))}
                                            </div>
                                            <span className="text-accent/30 font-bold text-lg">vs</span>
                                            <div className={`flex-1 rounded-lg p-3 text-center ${match.winner_team === 2 ? "bg-green-50 border-2 border-green-300" : "bg-accent/5 border border-accent/10"}`}>
                                                <p className="text-xs font-semibold text-accent/50 mb-1">
                                                    Team 2 {match.winner_team === 2 && <FaTrophy className="inline text-yellow-500 ml-1" />}
                                                </p>
                                                {team2.map(p => (
                                                    <p key={p.user_id} className="text-sm text-accent font-medium">{p.name}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}
