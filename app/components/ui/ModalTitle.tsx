
interface headingProps {
    color?: "primary" | "secondary"
    children: React.ReactNode
}

export default function Heading({ color, children }: headingProps) {
    
    return (
        <h2 className={`font-display text-center text-4xl mb-6 ${color === "secondary" ? "text-secondary" : "text-accent"}`}>
            {children}
        </h2>
    )
}