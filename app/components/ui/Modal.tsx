import { IoClose } from "react-icons/io5"

interface modalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({ open, onClose, children}: modalProps) {
    return (
        <div
            className={`
                fixed flex flex-col w-4/5 sm:w-1/2 h-4/5 transition-colors p-6 items-center justify-center self-center
                ${open ? "visible bg-secondary border rounded-2xl" : "invisible"}
            `}
        >
            <button 
                onClick={onClose} 
                className="absolute top-5 left-5 text-3xl p-0.5 cursor-pointer hover:bg-white hover:rounded-xl"
            >
                <IoClose />
            </button>
            {children}
        </div>
    )
}