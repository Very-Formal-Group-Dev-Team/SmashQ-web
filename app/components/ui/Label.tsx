
interface labelProps {
    children: React.ReactNode
}

export default function Label({ children }: labelProps) {
    return (
        <label className="text-sm">
            {children}
        </label>
    )
}