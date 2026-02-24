import { IoClose } from "react-icons/io5"

interface modalProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({ open, onClose, children}: modalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-accent/30 backdrop-blur-sm"
                aria-label="Close modal"
            />
            <div className="relative flex max-h-[92vh] w-full max-w-4xl scale-95 flex-col items-center justify-center overflow-y-auto rounded-2xl border bg-secondary px-4 pb-4 pt-14 shadow-lg transition-transform sm:scale-100 sm:px-6 sm:pb-6 sm:pt-16 md:px-8 md:pb-8 md:pt-18">
            <button 
                type="button"
                onClick={onClose} 
                className="absolute top-3 right-3 cursor-pointer rounded-xl p-0.5 text-3xl hover:bg-white sm:top-5 sm:right-5"
            >
                <IoClose />
            </button>
            {children}
            </div>
        </div>
    )
}