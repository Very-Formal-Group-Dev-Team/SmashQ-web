"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { joinLobby } from "@/app/lib/api"

export default function JoinPage() {
    const params = useParams()
    const lobbyId = params.id as string
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [status, setStatus] = useState<"loading" | "joining" | "error" | "success">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (authLoading) return

        if (!user) {
            localStorage.setItem("pendingJoinLobby", lobbyId)
            router.replace(`/login?redirect=/join/${lobbyId}`)
            return
        }

        setStatus("joining")
        joinLobby(lobbyId)
            .then((data) => {
                localStorage.removeItem("pendingJoinLobby")
                setStatus("success")
                setMessage(data.message || "Joined lobby successfully!")
                setTimeout(() => {
                    const role = user.role
                    if (role === "Queue Master") {
                        router.replace(`/queue_master/lobbies/${lobbyId}`)
                    } else {
                        router.replace("/player/queue")
                    }
                }, 1000)
            })
            .catch((err) => {
                localStorage.removeItem("pendingJoinLobby")
                if (err.message?.includes("already in lobby")) {
                    setStatus("success")
                    setMessage("You're already in this lobby!")
                    setTimeout(() => {
                        const role = user.role
                        if (role === "Queue Master") {
                            router.replace(`/queue_master/lobbies/${lobbyId}`)
                        } else {
                            router.replace("/player/queue")
                        }
                    }, 1000)
                } else {
                    setStatus("error")
                    setMessage(err.message || "Failed to join lobby")
                }
            })
    }, [authLoading, user, lobbyId, router])

    return (
        <div className="bg-primary h-lvh flex items-center justify-center">
            <div className="bg-secondary p-8 rounded-xl text-center max-w-sm">
                {status === "loading" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Joining Lobby...</h2>
                        <p className="text-gray-700">Checking your login status.</p>
                    </>
                )}
                {status === "joining" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Joining Lobby...</h2>
                        <p className="text-gray-700">Adding you to lobby #{lobbyId}.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Success!</h2>
                        <p className="text-gray-700">{message}</p>
                        <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Failed to Join</h2>
                        <p className="text-gray-700 mb-4">{message}</p>
                        <button
                            onClick={() => router.push("/player/join_lobby")}
                            className="px-6 py-2 bg-accent text-white rounded-lg hover:brightness-110 transition cursor-pointer"
                        >
                            Go to Join Page
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
