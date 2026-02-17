"use client"

import LobbyCard from "@/app/components/ui/LobbyCard"
import DashboardLayout from "../../layout"
import CreateLobbyModal from "@/app/components/ui/CreateLobbyModal"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface lobbyProps {
    id: number
    players: number
}

const lobbies: lobbyProps[] = [
    {
        id: 1,
        players: 6,
    },
    {
        id: 2,
        players: 8,
    },
    {
        id: 3,
        players: 4,
    },
    {
        id: 4,
        players: 5,
    },
    {
        id: 5,
        players: 10,
    },
    {
        id: 6,
        players: 7,
    },
    {
        id: 7,
        players: 8,
    },
]

export default function QueueMasterDashboardPage() {
    const [createLobbyModalOpen, setCreateLobbyModalOpen] = useState(false)
    const router = useRouter()

    return (
        <div className="">
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12">
                {lobbies.map(lobby => (
                    <li key={lobby.id} className="flex justify-center">
                        <LobbyCard id={lobby.id} players={lobby.players} onClick={() => router.push(`/queue_master/lobbies/${lobby.id}`)}/>
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
            />
        </div>
    )
}