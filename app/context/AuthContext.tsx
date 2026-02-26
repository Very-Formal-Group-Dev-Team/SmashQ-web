"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Role = "Player" | "Queue Master"

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
  gender?: string | null
  age?: number | null
  contact_number?: string | null
  nickname?: string | null
  dominant_hand?: string | null
  is_verified?: boolean
  matches_played?: number
  winrate?: number
  average_match_duration?: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function ensureAbsoluteUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`
  return url
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = ensureAbsoluteUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
  )

  const loadUser = useCallback(async () => {
    setLoading(true)
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Unauthorized")
      }

      const data = await res.json()
      console.debug("AuthProvider: /auth/me response:", data)

      const resolvedUser = data.data?.user

      if (!resolvedUser) {
        throw new Error("No user data in response")
      }

      setUser(resolvedUser)
    } catch (error) {
      console.error("Auth error:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  useEffect(() => {
    // initial load
    loadUser()

    // listen to storage events so login in one tab updates others
    function onStorage(e: StorageEvent) {
      if (!e.key) return
      if (e.key === "accessToken" || e.key === "authChange" || e.key === "logout") {
        console.debug("AuthProvider: storage event detected, reloading user for key:", e.key)
        loadUser()
      }
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [loadUser])

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: loadUser }}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    } 
    return context
}
