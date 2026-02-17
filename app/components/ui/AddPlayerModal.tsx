import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import { useState } from "react";
import ModalTitle from "./ModalTitle";

interface modalProps {
    open: boolean
    onClose: () => void
}

export default function AddPlayerModal({ open, onClose}: modalProps) {
    const [ playerName, setPlayerName ] = useState("")

    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>Add Players</ModalTitle>
            <div className="flex flex-col gap-8 items-center">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
                    <div className="flex flex-col gap-2">
                        <div className="bg-white border-1 w-full aspect-square" />
                        <p className="text-sm sm:text-md">http://www.projbqo.com/join/bhjhkb</p>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <h3>Manual Join</h3>
                        <Input 
                            type="text"
                            placeholder="Name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={onClose}>Done</Button>
            </div>
            
        </Modal>
    )
}