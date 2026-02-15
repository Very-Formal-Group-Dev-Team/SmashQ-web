"use client"

import { useState } from "react"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
        <div className="min-h-screen flex flex-col bg-primary">
            <Header open={() => setIsOpen(true)} />
            <div className="flex flex-1">
                <Sidebar isOpen={isOpen} close={() => setIsOpen(false)} />
                <main className="flex-1 p-20">{children}</main>
            </div>
        </div>
  )
}
