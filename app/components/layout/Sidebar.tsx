"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FiUser, FiPlusCircle, FiServer, FiLogOut } from "react-icons/fi"
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/context/AuthContext"

interface SidebarProps {
    isOpen: boolean
    close: () => void
}

interface MenuItem {
    label: string
    href: string
    icon: React.ReactNode
}

type Role = "Player" | "Queue Master" | "Admin"

const menuItems: Record<Role, MenuItem[]> = {
    "Player": [
        { label: "Profile", href: "/player/profile", icon: <FiUser /> },
        { label: "Join Lobby", href: "/player/join_lobby", icon: <FiPlusCircle />}
    ],
    "Queue Master": [
        { label: "Profile", href: "/queue_master/profile", icon: <FiUser /> },
        { label: "Lobbies", href: "/queue_master/lobbies", icon: <FiServer /> },
        { label: "Join Lobby", href: "/queue_master/join_lobby", icon: <FiPlusCircle />}
    ],
    "Admin": [
        { label: "Profile", href: "/queue_master/profile", icon: <FiUser /> },
        { label: "Lobbies", href: "/queue_master/lobbies", icon: <FiServer /> },
        { label: "Join Lobby", href: "/queue_master/join_lobby", icon: <FiPlusCircle />}
    ],
}

export default function Sidebar({ isOpen, close }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useAuth()
    // const { user } = useAuth()
    
    // if (!user) return null

    const navItems = menuItems["Admin"]

    function handleLogout() {
        logout()
        router.push("/login")
    }

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
                    fixed top-0 left-0 min-h-lvh w-64 bg-tertiary border-r-2 border-accent shadow-lg
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:shadow-lg
                `}
            >
                <button type="button" onClick={close} className="text-3xl p-6 cursor-pointer lg:hidden" aria-label="Close Menu">
                    <IoClose />
                </button>

                <nav className="flex flex-col p-8 gap-36 text-lg justify-between">
                    <div className="flex flex-col gap-3">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href} 
                                    onClick={close} 
                                    className={`flex items-center gap-3 px-4 py-2 transform duration-150 hover:bg-white hover:rounded-lg ${isActive ? "bg-white rounded-lg" : ""}`}
                                >
                                    {item.icon} {item.label}
                                </Link>
                            )
                    })}
                    </div>
                    <div className="mt-auto">
                        <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 transform duration-150 hover:bg-white hover:rounded-lg">
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    )
}