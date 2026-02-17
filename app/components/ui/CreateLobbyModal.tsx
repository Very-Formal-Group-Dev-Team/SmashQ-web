import Modal from "./Modal";

interface modalProps {
    open: boolean
    onClose: () => void
}

export default function CreateLobbyModal({ open, onClose }: modalProps) {

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-center text-3xl font-bold mb-8">Create Lobby</h2>
        </Modal>
    )
}