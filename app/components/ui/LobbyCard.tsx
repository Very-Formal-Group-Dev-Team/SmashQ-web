"use client"

import { FaPlus } from "react-icons/fa"
import ModalTitle from "./ModalTitle"
import Input from "./Input"
import { useState } from "react"
import { createLobby } from "@/app/lib/api";
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
                    // I say we ball!!!! fuck them errors bro
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

    return (
        variant == "create" ?
            <button type="button" onClick={onClick} className="text-accent bg-secondary border-2 border-accent rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-6xl"><FaPlus/></h2>
            </button>
        :
            <button type="button" onClick={onClick} className="text-accent bg-secondary border-2 border-accent rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
                <h2 className="text-3xl font-black">{name || `Lobby ${id}`}</h2>
                <p className="">{players} players</p>
            </button>
    )
}