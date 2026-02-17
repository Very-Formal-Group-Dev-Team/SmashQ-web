"use client"

import { useState } from "react"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import { useAuth } from "@/app/context/AuthContext"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
//   const { user, loading } = useAuth()

//   if (loading) return <p>Loading...</p>
//   if (!user) return <p>Unauthorized</p>

  return (
        <div className="min-h-screen flex flex-col bg-primary">
            <Header open={() => setIsOpen(true)} />
            <div className="flex flex-1">
                <Sidebar isOpen={isOpen} close={() => setIsOpen(false)} />
                <main className="flex-1 p-8 sm:p-16">{children}</main>
            </div>
        </div>
  )
}
