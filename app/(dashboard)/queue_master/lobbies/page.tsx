import LobbyCard from "@/app/components/ui/LobbyCard"
import DashboardLayout from "../../layout"

interface lobbyProps {
    id: number
    players: number
}

const lobbies: lobbyProps[] = [
    {
        id: 1,
        players: 6,
    },
    {
        id: 2,
        players: 8,
    },
    {
        id: 3,
        players: 4,
    },
    {
        id: 4,
        players: 5,
    },
    {
        id: 5,
        players: 10,
    },
    {
        id: 6,
        players: 7,
    },
    {
        id: 7,
        players: 8,
    },
]

export default function QueueMasterDashboardPage() {
    return (
        <div>
            <ol className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12">
                {lobbies.map(lobby => (
                    <li key={lobby.id} className="flex justify-center">
                        <LobbyCard id={lobby.id} players={lobby.players}/>
                    </li>
                ))}
                <li className="flex justify-center"><LobbyCard variant="create"/></li>
            </ol>
        </div>
    )
}