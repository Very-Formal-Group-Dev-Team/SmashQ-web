"use client"

import { FaPlus } from "react-icons/fa"
import { useRouter } from "next/navigation"

interface lobbyProps {
    id?: number
    players?: number
    variant?: string
}

export default function LobbyCard({ id, players, variant }: lobbyProps) {
    const router = useRouter() 
    return (
        variant == "create" ? 
            <button onClick={() => router.push("/queue_master/lobbies/create")} className="bg-secondary border rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-6xl"><FaPlus/></h2>
            </button> : 
            <button onClick={() => router.push("/queue_master/lobbies/lobby")} className="bg-secondary border rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-3xl font-black">Lobby {id}</h2>
                <p className="">{players} players</p>
            </button>   
    )
}