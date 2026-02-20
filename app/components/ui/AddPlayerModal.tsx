import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import { useState, useEffect } from "react";
import ModalTitle from "./ModalTitle";
import { getJoinLink } from "@/app/lib/api";

interface modalProps {
    open: boolean
    onClose: () => void
    lobbyId?: number | string
}

export default function AddPlayerModal({ open, onClose, lobbyId }: modalProps) {
    const [ playerName, setPlayerName ] = useState("")
    const [ joinLink, setJoinLink ] = useState("")
    const [ linkLoading, setLinkLoading ] = useState(false)

    useEffect(() => {
        if (open && lobbyId) {
            setLinkLoading(true)
            getJoinLink(lobbyId)
                .then(data => {
                    // Build full URL from the relative join_link
                    const base = window.location.origin
                    setJoinLink(`${base}${data.join_link}`)
                })
                .catch(() => setJoinLink("Failed to load link"))
                .finally(() => setLinkLoading(false))
        }
    }, [open, lobbyId])

    function handleCopyLink() {
        if (joinLink) {
            navigator.clipboard.writeText(joinLink)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>Add Players</ModalTitle>
            <div className="flex flex-col gap-8 items-center">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
                    <div className="flex flex-col gap-2">
                        <div className="bg-white border w-full aspect-square" />
                        <p 
                            className="text-sm sm:text-md cursor-pointer hover:underline break-all"
                            onClick={handleCopyLink}
                            title="Click to copy"
                        >
                            {linkLoading ? "Loading..." : joinLink || "No link available"}
                        </p>
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