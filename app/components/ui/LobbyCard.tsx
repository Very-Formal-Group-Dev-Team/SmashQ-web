import Link from "next/link"

interface lobbyProps {
    id: number
    players: number
}

export default function LobbyCard({ id, players }: lobbyProps) {
    
    return (
        <Link href="" className="bg-secondary border rounded-lg shadow-md h-60 aspect-square flex flex-col justify-center items-center cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl">
            <h2 className="text-3xl font-black">Lobby {id}</h2>
            <p className="">{players} players</p>
        </Link>
    )
}