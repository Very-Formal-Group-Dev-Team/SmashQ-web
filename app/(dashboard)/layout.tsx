"use client"

import { useState } from "react"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-primary">
        <p className="text-secondary text-xl">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
        <div className="min-h-screen flex flex-col bg-primary">
            <Header open={() => setIsOpen(true)} />
            <div className="flex flex-1">
                <Sidebar isOpen={isOpen} close={() => setIsOpen(false)} />
                <main className="flex-1 p-4 sm:p-8 lg:p-16">{children}</main>
            </div>
        </div>
  )
}
