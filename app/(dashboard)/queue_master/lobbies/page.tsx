"use client"

import LobbyCard from "@/app/components/ui/LobbyCard"
import CreateLobbyModal from "@/app/components/ui/CreateLobbyModal"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyLobbies, type LobbyData } from "@/app/lib/api"

export default function QueueMasterDashboardPage() {
    const [createLobbyModalOpen, setCreateLobbyModalOpen] = useState(false)
    const [lobbies, setLobbies] = useState<LobbyData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    async function fetchLobbies() {
        setLoading(true)
        setError("")
        try {
            const data = await getMyLobbies()
            setLobbies(data.data)
        } catch (err: any) {
            setError(err.message || "Failed to load lobbies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLobbies()
    }, [])

    function handleLobbyCreated() {
        setCreateLobbyModalOpen(false)
        fetchLobbies()
    }

    return (
        <div className="">
            {loading && <p className="text-secondary text-center">Loading lobbies...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12">
                {lobbies.map(lobby => (
                    <li key={lobby.lobby_id} className="flex justify-center">
                        <LobbyCard 
                            id={lobby.lobby_id} 
                            name={lobby.lobby_name}
                            players={lobby.number_of_players} 
                            onClick={() => router.push(`/queue_master/lobbies/${lobby.lobby_id}`)}
                        />
                    </li>
                ))}
                <li className="flex justify-center">
                    <LobbyCard 
                        variant="create" 
                        onClick={() => setCreateLobbyModalOpen(true)}
                    />
                </li>
            </ol>
            <CreateLobbyModal
                open={createLobbyModalOpen} 
                onClose={() => setCreateLobbyModalOpen(false)}
                onCreated={handleLobbyCreated}
            />
        </div>
    )
}