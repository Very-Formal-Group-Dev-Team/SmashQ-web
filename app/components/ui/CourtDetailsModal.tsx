import Modal from "./Modal"
import PlayerSlot from "./PlayerSlot"
import DraggablePlayerCard from "./DraggablePlayerCard"

interface modalProps {
    open: boolean
    onClose: () => void
}

export default function CourtDetailsModal({ open, onClose }: modalProps) {

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-center text-3xl font-bold mb-8">Court #</h2>
            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-4/5 lg:gap-12 items-center">
                <div className="w-9/10 px-3 flex flex-col gap-1">
                    <PlayerSlot></PlayerSlot>
                    <PlayerSlot></PlayerSlot>
                    <p className="self-center font-semibold">VS</p>
                    <PlayerSlot></PlayerSlot>
                    <PlayerSlot></PlayerSlot>
                </div>
                <div className="bg-white w-9/10 h-64 border-2 rounded-lg flex flex-col gap-2 p-3">
                    <DraggablePlayerCard></DraggablePlayerCard>
                    <DraggablePlayerCard></DraggablePlayerCard>
                    <DraggablePlayerCard></DraggablePlayerCard>
                    <DraggablePlayerCard></DraggablePlayerCard>
                </div>
                
            </div>
            <div className="flex gap-4 mt-8">
                <button className="bg-secondary font-semibold w-32 py-1.5 rounded-sm border cursor-pointer hover:rounded-xl">
                    Auto
                </button>
                <button
                    onClick={onClose}
                    className="bg-secondary font-semibold w-32 py-1.5 rounded-sm border cursor-pointer hover:rounded-xl"
                >
                    Confirm
                </button>
            </div>
            
        </Modal>
    )
}