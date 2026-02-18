"use client"

import { FaPlus } from "react-icons/fa"

interface lobbyProps {
    id?: number
    name?: string
    players?: number
    variant?: string
    onClick: () => void
}

export default function LobbyCard({ id, name, players, variant, onClick }: lobbyProps) {
    return (
        variant == "create" ? 
            <button onClick={onClick} className="text-accent bg-secondary border-2 border-accent rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-6xl"><FaPlus/></h2>
            </button> : 
            <button onClick={onClick} className="text-accent bg-secondary border-2 border-accent rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-3xl font-black">{name || `Lobby ${id}`}</h2>
                <p className="">{players} players</p>
            </button>   
    )
}