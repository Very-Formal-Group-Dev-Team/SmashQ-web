import MatchCard from "@/app/components/ui/MatchCard";

const matches = [
    {
        id: 1,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 2,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 3,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 4,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 5,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 6,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 7,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
    {
        id: 8,
        team1: [
            "Joshua Frell Te",
            "Kyrr Josh Magbussin",
        ],
        team2: [
            "Joshua Benedict Lazaro",
            "Rico Euma Aban",
        ],
    },
]


export default function LobbyInfoPage() {

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-secondary text-6xl text-center font-display">LOBBY NAME</h1>
            
            {/* Players Table */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">PLAYERS</h2>
                    <button className="bg-secondary px-5 py-2 rounded-sm border cursor-pointer">Add Player</button>
                </div>
                <div className="bg-secondary w-full h-64 rounded-md border">

                </div>
            </div>

            {/* Match List */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">MATCHES</h2>
                    <button className="bg-secondary px-5 py-2 rounded-sm border cursor-pointer">Add Court</button>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(325px,1fr))] gap-6 sm:gap-12">
                    {matches.map((match) => (
                        <li key={match.id} className="flex justify-center">
                            <MatchCard 
                                id={match.id}
                                team1={match.team1}
                                team2={match.team2}
                            />
                        </li>
                    ))}
                </ul>
                    
            </div>
        </div>
    )
}