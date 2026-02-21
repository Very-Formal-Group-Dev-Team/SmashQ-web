"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import SmashQTitle from "@/app/components/ui/SmashQTitle"

export default function OnboardingPage() {
    const router = useRouter()
    const { refreshUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

    async function selectRole(role: "Player" | "Queue Master") {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("accessToken")

        try {
            const res = await fetch(`${API_BASE}/auth/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to set role")
            }

            await refreshUser()

            if (role === "Queue Master") {
                router.push("/queue_master/lobbies")
            } else {
                router.push("/player/join_lobby")
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
            <div className="bg-secondary rounded-2xl p-10 w-full max-w-lg text-center shadow-lg">
                <SmashQTitle />
                <h1 className="text-2xl font-bold mt-6 mb-2">Welcome to SmashQ!</h1>
                <p className="text-gray-600 mb-8">How will you be using SmashQ?</p>

                {error && (
                    <p className="text-red-500 mb-4 text-sm">{error}</p>
                )}

                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => selectRole("Player")}
                        className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
                    >
                        Player
                        <p className="text-sm font-normal mt-1 opacity-80">Join lobbies and play matches</p>
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => selectRole("Queue Master")}
                        className="w-full py-4 rounded-xl border-2 border-accent text-accent font-semibold text-lg hover:bg-accent hover:text-white transition disabled:opacity-50 cursor-pointer"
                    >
                        Queue Master
                        <p className="text-sm font-normal mt-1 opacity-80">Create and manage lobbies</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
