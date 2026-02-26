"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

function CallbackHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { refreshUser } = useAuth()

    useEffect(() => {
        const accessToken = searchParams.get("accessToken")
        const refreshToken = searchParams.get("refreshToken")
        const error = searchParams.get("error")

        if (error) {
            alert(`Authentication failed: ${error}`)
            router.push("/login")
            return
        }

        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            const isNewUser = searchParams.get("isNewUser") === "true"

            if (isNewUser) {
                refreshUser().then(() => router.push("/onboarding"))
                return
            }

            refreshUser().then(() => {
                const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

                fetch(`${API_BASE}/auth/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data.user) {
                        const role = data.data.user.role
                        let target = "/player/join_lobby"

                        if (role === "Player" || role === "player") {
                            target = "/player/join_lobby"
                        } else if (role === "Queue Master" || role === "queue master" || role === "Queue master") {
                            target = "/queue_master/lobbies"
                        }

                        router.push(target)
                    } else {
                        router.push("/player/join_lobby")
                    }
                })
                .catch(() => {
                    router.push("/player/join_lobby")
                })
            })
        } else {
            alert("Authentication failed. Please try again.")
            router.push("/login")
        }
    }, [searchParams, router, refreshUser])

    return null
}

export default function AuthCallbackPage() {
    return (
        <div className="bg-primary h-lvh flex items-center justify-center">
            <div className="bg-secondary p-8 rounded-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Processing Authentication...</h2>
                <p className="text-gray-700">Please wait while we log you in.</p>
            </div>
            <Suspense>
                <CallbackHandler />
            </Suspense>
        </div>
    )
}
