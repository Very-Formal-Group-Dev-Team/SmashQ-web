"use client"

import SmashQTitle from "../ui/SmashQTitle"
import { FiMenu } from "react-icons/fi"

export default function Header({ open }: { open: () => void }) {
    return (
        <header className="bg-secondary text-4xl flex justify-between items-center px-8 md:px-16 py-5 border-b-2 border-accent shadow-md">
            <SmashQTitle />
            <button
                onClick={open}
                className="cursor-pointer lg:hidden"
                aria-label="Open Menu"
            >
                <FiMenu />
            </button>
        </header>
    )
}