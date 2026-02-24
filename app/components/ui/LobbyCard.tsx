"use client"

import { FaPlus } from "react-icons/fa"
import ModalTitle from "./ModalTitle"
import Input from "./Input"
import { useState } from "react"
import { createLobby, getLobby } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext"
import Button from "./Button"

interface lobbyProps {
    id?: number
    name?: string
    players?: number
    variant?: string
    onClick?: () => void
    onCreated?: () => void
}

export default function LobbyCard({ id, name, players, variant, onClick, onCreated }: lobbyProps) {
    const [lobbyName, setLobbyName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { user, loading: authLoading } = useAuth()
    
    async function handleCreate() {
        if (!lobbyName.trim()) {
            setError("Please enter a lobby name")
            return
        }

        // Determine owner: use user.id from context, or decode from stored token
        let ownerId: number | null = user ? Number(user.id) : null
        if (!ownerId) {
            const raw = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
            if (raw) {
                try {
                    const payload = JSON.parse(atob(raw.split(".")[1]))
                    ownerId = payload.userId ?? payload.id ?? null
                } catch {
                    // ignore parse errors
                }
            }
        }

        if (!ownerId) {
            setError("You must be logged in")
            return
        }

        setLoading(true)
        setError("")
        try {
            await createLobby(lobbyName.trim(), ownerId)
            setLobbyName("")
            if (onCreated) onCreated()
        } catch (err: any) {
            setError(err.message || "Failed to create lobby")
        } finally {
            setLoading(false)
        }
    }

    const fetchPlayers = async () => {

    }

    return (
        variant == "create" ? 
            <div onClick={onClick} className="text-accent bg-secondary border-3 border-accent rounded-lg shadow-md h-75 aspect-square flex flex-col justify-center items-center">
                <ModalTitle>Create Lobby</ModalTitle>
                <div className="flex flex-col items-center gap-3 px-8">
                    <Input 
                        type="text"
                        placeholder="Lobby Name"
                        value={lobbyName}
                        onChange={(e) => { setLobbyName(e.target.value); setError(""); }}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button onClick={handleCreate}>
                        {authLoading ? "Loading..." : loading ? "Creating..." : "Confirm"}
                    </Button>
                </div>
            </div> : 
            <button onClick={onClick} className="text-accent bg-secondary border-3 border-accent rounded-xl shadow-md h-75 aspect-square flex flex-col justify-center items-center gap-1 cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-4xl font-black">{name || `Lobby ${id}`}</h2>
                <p className="">{players} players</p>
            </button>   
    )
}