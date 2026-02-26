"use client"

import Modal from "./Modal"
import PlayerSlot from "./PlayerSlot"
import DraggablePlayerCard from "./DraggablePlayerCard"
import Button from "./Button"
import ModalTitle from "./ModalTitle"
import { type DragEvent, useState, useEffect } from "react"
import { createMatch, type LobbyUser } from "@/app/lib/api"

interface modalProps {
    open: boolean
    onClose: () => void
    courtId: number
    courtName: string
    lobbyId: number
    lobbyPlayers: LobbyUser[]
}

type DragSource = {
    source: "pool" | "slot"
    index: number
}

type PoolPlayer = {
    id: number
    name: string
}

export default function CourtDetailsModal({ open, onClose, courtId, courtName, lobbyId, lobbyPlayers }: modalProps) {
    const [availablePlayers, setAvailablePlayers] = useState<PoolPlayer[]>([])
    const [slots, setSlots] = useState<(PoolPlayer | null)[]>([null, null, null, null])
    const [activeSlotDropIndex, setActiveSlotDropIndex] = useState<number | null>(null)
    const [isPoolDropActive, setIsPoolDropActive] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (open) {
            setAvailablePlayers(lobbyPlayers.map(p => ({ id: p.id, name: p.name })))
            setSlots([null, null, null, null])
        }
    }, [open, lobbyPlayers])

    function setDragSource(event: DragEvent<HTMLDivElement>, source: DragSource) {
        event.dataTransfer.setData("application/json", JSON.stringify(source))
        event.dataTransfer.effectAllowed = "move"
    }

    function getDragSource(event: DragEvent<HTMLDivElement>): DragSource | null {
        const rawData = event.dataTransfer.getData("application/json")
        if (!rawData) return null
        try {
            return JSON.parse(rawData) as DragSource
        } catch {
            return null
        }
    }

    function handleDropOnSlot(slotIndex: number, event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setActiveSlotDropIndex(null)
        const dragSource = getDragSource(event)
        if (!dragSource) return

        if (dragSource.source === "pool") {
            const draggedPlayer = availablePlayers[dragSource.index]
            if (!draggedPlayer) return

            const nextPool = [...availablePlayers]
            nextPool.splice(dragSource.index, 1)

            const nextSlots = [...slots]
            const replacedPlayer = nextSlots[slotIndex]
            nextSlots[slotIndex] = draggedPlayer

            if (replacedPlayer) {
                nextPool.push(replacedPlayer)
            }

            setAvailablePlayers(nextPool)
            setSlots(nextSlots)
            return
        }

        if (dragSource.source === "slot") {
            if (dragSource.index === slotIndex) return

            const nextSlots = [...slots]
            const fromPlayer = nextSlots[dragSource.index]
            const toPlayer = nextSlots[slotIndex]

            nextSlots[slotIndex] = fromPlayer
            nextSlots[dragSource.index] = toPlayer
            setSlots(nextSlots)
        }
    }

    function handleDropOnPool(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setIsPoolDropActive(false)

        const dragSource = getDragSource(event)
        if (!dragSource || dragSource.source !== "slot") return

        const playerToReturn = slots[dragSource.index]
        if (!playerToReturn) return

        const nextSlots = [...slots]
        nextSlots[dragSource.index] = null

        setSlots(nextSlots)
        setAvailablePlayers(prev => [...prev, playerToReturn])
    }

    async function handleConfirm() {
        const team1Ids = slots.slice(0, 2).filter(Boolean).map(p => p!.id)
        const team2Ids = slots.slice(2, 4).filter(Boolean).map(p => p!.id)

        if (team1Ids.length === 0 && team2Ids.length === 0) {
            onClose()
            return
        }

        setSaving(true)
        try {
            await createMatch(lobbyId, courtId, team1Ids, team2Ids)
            onClose()
        } catch {
            setSaving(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>{courtName}</ModalTitle>
            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-4/5 lg:gap-12 items-center">
                <div className="w-9/10 px-3 flex flex-col gap-2">
                    {slots.slice(0, 2).map((slotPlayer, index) => (
                        <PlayerSlot
                            key={`team-a-${index}`}
                            label={`Player ${index + 1}`}
                            playerName={slotPlayer?.name}
                            isActiveDropTarget={activeSlotDropIndex === index}
                            onDragOver={(event) => {
                                event.preventDefault()
                                setActiveSlotDropIndex(index)
                            }}
                            onDrop={(event) => handleDropOnSlot(index, event)}
                            onDragLeave={() => setActiveSlotDropIndex(null)}
                            onCardDragStart={(event) => setDragSource(event, { source: "slot", index })}
                        />
                    ))}
                    <p className="self-center font-semibold">VS</p>
                    {slots.slice(2, 4).map((slotPlayer, sliceIndex) => {
                        const slotIndex = sliceIndex + 2
                        return (
                            <PlayerSlot
                                key={`team-b-${sliceIndex}`}
                                label={`Player ${slotIndex + 1}`}
                                playerName={slotPlayer?.name}
                                isActiveDropTarget={activeSlotDropIndex === slotIndex}
                                onDragOver={(event) => {
                                    event.preventDefault()
                                    setActiveSlotDropIndex(slotIndex)
                                }}
                                onDrop={(event) => handleDropOnSlot(slotIndex, event)}
                                onDragLeave={() => setActiveSlotDropIndex(null)}
                                onCardDragStart={(event) => setDragSource(event, { source: "slot", index: slotIndex })}
                            />
                        )
                    })}
                </div>
                <div
                    className={`bg-white w-9/10 h-70 border-2 rounded-lg flex flex-col gap-2 p-3 overflow-y-auto ${isPoolDropActive ? "border-primary" : "border-accent"}`}
                    onDragOver={(event) => {
                        event.preventDefault()
                        setIsPoolDropActive(true)
                    }}
                    onDrop={handleDropOnPool}
                    onDragLeave={() => setIsPoolDropActive(false)}
                >
                    {availablePlayers.length === 0 && (
                        <p className="text-gray-400 text-center mt-4 text-sm">No players available</p>
                    )}
                    {availablePlayers.map((player, index) => (
                        <DraggablePlayerCard
                            key={`${player.id}-${index}`}
                            playerName={player.name}
                            onDragStart={(event) => setDragSource(event, { source: "pool", index })}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-4 mt-8 mb-8">
                <Button onClick={handleConfirm}>
                    {saving ? "Saving..." : "Confirm"}
                </Button>
            </div>
            
        </Modal>
    )
}