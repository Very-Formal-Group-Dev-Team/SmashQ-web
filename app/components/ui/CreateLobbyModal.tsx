"use client"

import Input from "./Input";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Button from "./Button";
import ModalTitle from "./ModalTitle";
import { createLobby } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface modalProps {
    open: boolean
    onClose: () => void
    onCreated?: () => void
}

export default function CreateLobbyModal({ open, onClose, onCreated }: modalProps) {
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
            onCreated ? onCreated() : onClose()
        } catch (err: any) {
            setError(err.message || "Failed to create lobby")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={`
                fixed top-1/2 left-1/2 -translate-1/2 flex flex-col w-[350px] aspect-square transition-colors p-6 items-center justify-center z-50
                ${open ? "visible bg-secondary border rounded-2xl shadow-lg" : "invisible"}
            `}
        >
            <button 
                type="button"
                onClick={onClose} 
                className="absolute top-5 left-5 text-3xl p-0.5 cursor-pointer hover:bg-white hover:rounded-xl"
            >
                <IoClose />
            </button>

            <div className="flex flex-col items-center">
                <ModalTitle>Create Lobby</ModalTitle>
                <div className="flex flex-col items-center gap-4">
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
            </div>
                
        </div>
    )
}