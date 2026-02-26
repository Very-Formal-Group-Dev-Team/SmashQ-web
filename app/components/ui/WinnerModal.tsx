"use client"

import Modal from "./Modal"
import ModalTitle from "./ModalTitle"
import Button from "./Button"
import { useState } from "react"

interface WinnerModalProps {
    open: boolean
    onClose: () => void
    courtName: string
    team1: string[]
    team2: string[]
    onSelectWinner: (winnerTeam: number) => void
    saving?: boolean
}

export default function WinnerModal({ open, onClose, courtName, team1, team2, onSelectWinner, saving }: WinnerModalProps) {
    const [selected, setSelected] = useState<number | null>(null)

    function handleConfirm() {
        if (selected) onSelectWinner(selected)
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>{courtName}</ModalTitle>
            <p className="text-accent text-lg font-semibold mb-6">Select the winning team</p>
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center items-center">
                <button
                    type="button"
                    onClick={() => setSelected(1)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-xl border-3 w-full cursor-pointer transition ${selected === 1 ? "border-green-500 bg-green-50" : "border-accent bg-white hover:border-green-300"}`}
                >
                    <span className="font-bold text-sm">Team 1</span>
                    {team1.map((p, i) => <span key={i} className="text-sm">{p}</span>)}
                </button>
                <button
                    type="button"
                    onClick={() => setSelected(2)}
                    className={`flex flex-col items-center gap-2 p-6 rounded-xl border-3 w-full cursor-pointer transition ${selected === 2 ? "border-green-500 bg-green-50" : "border-accent bg-white hover:border-green-300"}`}
                >
                    <span className="font-bold text-sm">Team 2</span>
                    {team2.map((p, i) => <span key={i} className="text-sm">{p}</span>)}
                </button>
            </div>
            <div className="mt-8 mb-6">
                <Button onClick={handleConfirm} disabled={!selected || saving}>
                    {saving ? "Saving..." : "Confirm"}
                </Button>
            </div>
        </Modal>
    )
}
