
interface ButtonProps {
    inverse?: boolean
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    type?: "button" | "submit" | "reset"
}

export default function Button({ inverse, children, onClick, disabled = false, type = "button" }: ButtonProps) {
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled} 
            className={"font-semibold w-32 py-2 rounded-2xl border-2 shadow-md cursor-pointer transition duration-75 hover:shadow-none" 
                        + (disabled ? " opacity-50 pointer-events-none" : "") 
                        + (inverse ? " text-gray-100 hover:bg-green-700 hover:text-white" : " hover:bg-tertiary")}
        >
            {children}
        </button>
    )
}