import AuthFormInput from "./AuthFormInput";
import Modal from "./Modal";
import { useState } from "react";

interface modalProps {
    open: boolean
    onClose: () => void
}

export default function AddPlayerModal({ open, onClose}: modalProps) {
    const [ playerName, setPlayerName ] = useState("")

    return (
        <Modal open={open} onClose={onClose}>
           
            <h2 className="text-center text-3xl font-bold mb-8">Add Players</h2>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="bg-white border-1 w-full aspect-square" />
                        <p>http://www.projbqo.com/join/bhjhkb</p>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <h3>Manual Join</h3>
                        <AuthFormInput 
                            type="text"
                            placeholder="Name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={onClose} className="bg-white px-5 py-2 rounded-sm border cursor-pointer transform duration-100 hover:rounded-xl">Done</button>
            </div>
            
        </Modal>
    )
}