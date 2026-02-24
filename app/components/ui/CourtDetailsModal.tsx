"use client"

import Modal from "./Modal"
import PlayerSlot from "./PlayerSlot"
import DraggablePlayerCard from "./DraggablePlayerCard"
import Button from "./Button"
import ModalTitle from "./ModalTitle"
import { type DragEvent, useState } from "react"

interface modalProps {
    open: boolean
    onClose: () => void
}

type DragSource = {
    source: "pool" | "slot"
    index: number
}

export default function CourtDetailsModal({ open, onClose }: modalProps) {
    const [availablePlayers, setAvailablePlayers] = useState([
        "Juan A. Dela Cruz",
        "Maria L. Santos",
        "Paolo B. Reyes",
        "Ana C. Villanueva",
    ])

    const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null])
    const [activeSlotDropIndex, setActiveSlotDropIndex] = useState<number | null>(null)
    const [isPoolDropActive, setIsPoolDropActive] = useState(false)

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

    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>Court #</ModalTitle>
            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-4/5 lg:gap-12 items-center">
                <div className="w-9/10 px-3 flex flex-col gap-1">
                    {slots.slice(0, 2).map((slotPlayer, index) => (
                        <PlayerSlot
                            key={`team-a-${index}`}
                            label={`Player ${index + 1}`}
                            playerName={slotPlayer ?? undefined}
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
                                playerName={slotPlayer ?? undefined}
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
                    className={`bg-white w-9/10 h-64 border-2 rounded-lg flex flex-col gap-2 p-3 overflow-y-auto ${isPoolDropActive ? "border-primary" : "border-accent"}`}
                    onDragOver={(event) => {
                        event.preventDefault()
                        setIsPoolDropActive(true)
                    }}
                    onDrop={handleDropOnPool}
                    onDragLeave={() => setIsPoolDropActive(false)}
                >
                    {availablePlayers.map((playerName, index) => (
                        <DraggablePlayerCard
                            key={`${playerName}-${index}`}
                            playerName={playerName}
                            onDragStart={(event) => setDragSource(event, { source: "pool", index })}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <Button onClick={() => alert("UNDER CONSTRUCTION PA NI")}>Auto</Button>
                <Button onClick={onClose}>Confirm</Button>
            </div>
            
        </Modal>
    )
}