
interface ButtonProps {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    type?: "button" | "submit" | "reset"
}

export default function Button({ children, onClick, disabled = false, type = "button" }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={"bg-secondary font-semibold w-32 py-2 rounded-sm border shadow-sm cursor-pointer hover:rounded-full hover:bg-tertiary" + (disabled ? " opacity-50 pointer-events-none" : "")}>
            {children}
        </button>
    )
}