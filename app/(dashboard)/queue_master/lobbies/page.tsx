"use client"

import LobbyCard from "@/app/components/ui/LobbyCard"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyLobbies, type LobbyData } from "@/app/lib/api"

export default function QueueMasterDashboardPage() {
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

    useEffect(() => {
        if (lobbies) console.log(lobbies)
    }, [lobbies])

    function handleLobbyCreated() {
        fetchLobbies()
    }
    return (
        <div className="">
            {loading && <p className="text-secondary text-center">Loading lobbies...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <ol className="flex flex-wrap gap-16 justify-center"> 
                <li className="flex justify-center">
                    <LobbyCard 
                        variant="create" 
                        onCreated={handleLobbyCreated}
                    />
                </li>
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
            </ol>
        </div>
    )
}