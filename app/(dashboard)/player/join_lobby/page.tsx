"use client"

import JoinTile from "@/app/components/ui/JoinTile";
import { BsQrCodeScan } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import Input from "@/app/components/ui/Input";
import { useState } from "react";
import Button from "@/app/components/ui/Button";
import { joinLobby } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function JoinLobbiesPage() {
    const [joinUrl, setJoinUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()

    function extractLobbyId(input: string): string | null {
        const trimmed = input.trim()
        const match = trimmed.match(/\/join\/(\d+)/)
        if (match) return match[1]
        if (/^\d+$/.test(trimmed)) return trimmed
        return null
    }

    async function handleJoin() {
        setError("")
        setSuccess("")

        const lobbyId = extractLobbyId(joinUrl)
        if (!lobbyId) {
            setError("Please enter a valid join link or lobby ID")
            return
        }

        setLoading(true)
        try {
            const data = await joinLobby(lobbyId)
            setSuccess(data.message || "Joined lobby successfully!")
            setJoinUrl("")
            setTimeout(() => router.push("/player/queue"), 1500)
        } catch (err: any) {
            setError(err.message || "Failed to join lobby")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="text-accent flex flex-col lg:flex-row lg:justify-center items-center gap-16 lg:gap-32 mt-8 lg:mt-42">
            <JoinTile>
                <div className="flex flex-col items-center gap-5 w-[260px]">
                    <div className="flex items-center gap-2">
                        <p className="font-display text-4xl flex items-center gap-2">Join via Link</p>
                        <FaLink className="text-3xl"/>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Input 
                            type="url"
                            placeholder="Paste join link or lobby ID"
                            value={joinUrl}
                            onChange={(e) => { setJoinUrl(e.target.value); setError(""); setSuccess(""); }}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-600 text-sm">{success}</p>}
                        <Button onClick={handleJoin}>
                            {loading ? "Joining..." : "Confirm"}
                        </Button>
                    </div>
                </div>
            </JoinTile>
            <JoinTile>
                <div className="flex flex-col items-center gap-4 cursor-pointer">
                    <p className="font-display text-4xl flex items-center gap-3">Join via QR</p>
                    <BsQrCodeScan className="text-9xl"/>
                </div>
            </JoinTile>
        </div>
        
    )
}