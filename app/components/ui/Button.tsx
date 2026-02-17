
interface ButtonProps {
    children: React.ReactNode
    onClick: () => void
}

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <button onClick={onClick} className="bg-secondary font-semibold w-32 py-2 rounded-sm border shadow-sm cursor-pointer hover:rounded-full hover:bg-tertiary">
            {children}
        </button>
    )
}