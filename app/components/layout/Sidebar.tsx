"use client"

import Link from "next/link"
import { FiUser, FiPlusCircle, FiServer, FiLogOut } from "react-icons/fi"

interface SidebarProps {
  isOpen: boolean
  close: () => void
}

export default function Sidebar({ isOpen, close }: SidebarProps) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 lg:hidden"
                    onClick={close}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-screen w-64 bg-tertiary border-r shadow-md
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:shadow-lg
                `}
            >
                <button onClick={close} className="p-4 lg:hidden" aria-label="Close Menu">
                ✕
                </button>

                <nav className="flex flex-col p-8 gap-16 text-lg justify-between">
                    <div className="flex flex-col gap-4">
                        <Link href="/" onClick={close} className="flex items-center gap-3">
                            <FiUser /> Profile
                        </Link>
                        <Link href="/" onClick={close} className="flex items-center gap-3">
                            <FiPlusCircle /> Lobbies
                        </Link>
                        <Link href="/" onClick={close} className="flex items-center gap-3">
                            <FiServer /> Join Lobbies
                        </Link>
                    </div>
                    <div className="mt-auto">
                        <Link href="/login" onClick={close} className="flex items-center gap-3">
                            <FiLogOut /> Logout
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    )
}