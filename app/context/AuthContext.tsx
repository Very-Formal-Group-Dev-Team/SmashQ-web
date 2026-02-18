"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Role = "Player" | "Queue Master"

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Unauthorized")
        }

        const data = await res.json()
        console.log(data)

        // Backend returns { success: true, data: { user: {...} } }
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
    }

    loadUser()
  }, [])

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
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
