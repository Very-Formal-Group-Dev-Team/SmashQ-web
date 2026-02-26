"use client"

import { useEffect, useState } from "react"
import { getMyLobbies, getLobbyUsers, getLobbyMatches, type LobbyData, type LobbyUser, type AnalyticsMatchData } from "@/app/lib/api"
import LobbyStatsModal from "./LobbyStatsModal"

interface LobbyAnalytics {
    lobby: LobbyData
    users: LobbyUser[]
    matches: AnalyticsMatchData[]
}

export default function AnalyticsPage() {
    const [lobbies, setLobbies] = useState<LobbyData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedLobby, setSelectedLobby] = useState<LobbyAnalytics | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    useEffect(() => {
        async function fetchLobbies() {
            setLoading(true)
            setError("")
            try {
                const data = await getMyLobbies()
                const finished = data.data.filter(l => l.status === "finished")
                setLobbies(finished)
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to load lobbies"
                setError(message)
            } finally {
                setLoading(false)
            }
        }

        fetchLobbies()

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchLobbies()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [])

    async function handleLobbyClick(lobby: LobbyData) {
        setModalLoading(true)
        setModalOpen(true)
        try {
            const [usersRes, matchesRes] = await Promise.all([
                getLobbyUsers(lobby.lobby_id),
                getLobbyMatches(lobby.lobby_id),
            ])
            setSelectedLobby({
                lobby,
                users: usersRes.users,
                matches: matchesRes.data,
            })
        } catch {
            setSelectedLobby({ lobby, users: [], matches: [] })
        } finally {
            setModalLoading(false)
        }
    }

    function handleCloseModal() {
        setModalOpen(false)
        setSelectedLobby(null)
    }

    return (
        <div className="w-full">
            <h1 className="font-display text-secondary text-4xl md:text-5xl mb-10">Analytics</h1>

            {loading && <p className="text-secondary text-center text-lg">Loading lobbies...</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            {!loading && lobbies.length === 0 && !error && (
                <p className="text-secondary/70 text-center text-lg mt-20">No finished lobbies yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lobbies.map(lobby => (
                    <button
                        key={lobby.lobby_id}
                        onClick={() => handleLobbyClick(lobby)}
                        className="group bg-secondary border-3 border-accent rounded-xl p-6 text-left cursor-pointer
                                   transform transition duration-150 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <h2 className="font-black text-accent text-2xl truncate">
                            {lobby.lobby_name || `Lobby ${lobby.lobby_id}`}
                        </h2>
                        <div className="mt-3 flex flex-col gap-1 text-accent/70 text-sm">
                            <span>{lobby.number_of_players ?? 0} players</span>
                            <span>{new Date(lobby.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}</span>
                        </div>
                        <div className="mt-4">
                            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
                                Finished
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <LobbyStatsModal
                open={modalOpen}
                onClose={handleCloseModal}
                data={selectedLobby}
                loading={modalLoading}
            />
        </div>
    )
}