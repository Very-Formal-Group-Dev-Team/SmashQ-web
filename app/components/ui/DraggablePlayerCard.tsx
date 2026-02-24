
import type { DragEventHandler } from "react"

interface DraggablePlayerCardProps {
    playerName: string
    onDragStart: DragEventHandler<HTMLDivElement>
}

export default function DraggablePlayerCard({ playerName, onDragStart }: DraggablePlayerCardProps) {
    return (
        <div
            className="bg-secondary w-full px-4 py-3 rounded-md border flex justify-between items-center cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={onDragStart}
        >
            <p>{playerName}</p>
            <p className="cursor-pointer">||</p>
        </div>
    )
}