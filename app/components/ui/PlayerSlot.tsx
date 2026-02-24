import type { DragEventHandler } from "react"
import DraggablePlayerCard from "./DraggablePlayerCard"

interface PlayerSlotProps {
    label: string
    playerName?: string
    isActiveDropTarget?: boolean
    onDragOver: DragEventHandler<HTMLDivElement>
    onDrop: DragEventHandler<HTMLDivElement>
    onDragLeave: DragEventHandler<HTMLDivElement>
    onCardDragStart?: DragEventHandler<HTMLDivElement>
}

export default function PlayerSlot({
    label,
    playerName,
    isActiveDropTarget,
    onDragOver,
    onDrop,
    onDragLeave,
    onCardDragStart,
}: PlayerSlotProps) {
    return (
        <div
            className={`bg-white  flex justify-center items-center border-2 border-dashed rounded-lg min-h-[56px] ${isActiveDropTarget ? "border-primary" : "border-accent"}`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
        >
            {playerName && onCardDragStart ? (
                <DraggablePlayerCard playerName={playerName} onDragStart={onCardDragStart} />
            ) : (
                label
            )}
        </div>
    )
}