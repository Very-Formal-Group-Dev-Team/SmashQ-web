
interface joinTileProps {
    children: React.ReactNode
}

export default function JoinTile({ children }: joinTileProps) {

    return (
        <div className="bg-secondary w-80 sm:w-90 aspect-square flex justify-center items-center rounded-xl border-3 border-accent shadow-lg">
            {children}
        </div>
    )
}