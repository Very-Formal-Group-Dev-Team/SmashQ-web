"use client"

import Input from "./Input";
import Modal from "./Modal";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Button from "./Button";
import ModalTitle from "./ModalTitle";

interface modalProps {
    open: boolean
    onClose: () => void
}

export default function CreateLobbyModal({ open, onClose }: modalProps) {
    const [lobbyName, setLobbyName] = useState("")

    return (
        <div
            className={`
                fixed top-1/2 left-1/2 -translate-1/2 flex flex-col w-[350px] aspect-square transition-colors p-6 items-center justify-center
                ${open ? "visible bg-secondary border rounded-2xl shadow-lg" : "invisible"}
            `}
        >
            <button 
                onClick={onClose} 
                className="absolute top-5 left-5 text-3xl p-0.5 cursor-pointer hover:bg-white hover:rounded-xl"
            >
                <IoClose />
            </button>

            <div className="flex flex-col items-center">
                <ModalTitle>Create Lobby</ModalTitle>
                <div className="flex flex-col items-center gap-4">
                    <Input 
                        type="text"
                        placeholder="Lobby Name"
                        value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)}
                    />
                    <Button onClick={onClose}>Confirm</Button>
                </div>
            </div>
                
        </div>
    )
}