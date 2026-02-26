
interface joinTileProps {
    children: React.ReactNode
}

export default function JoinTile({ children }: joinTileProps) {

    return (
        <div className="bg-secondary w-80 sm:w-90 aspect-square flex justify-center items-center rounded-3xl border-3 border-accent hover:border-accent/80 transition duration-100 hover:shadow-lg hover:shadow-accent/20">
            {children}
        </div>
    )
}