
interface matchCardProps {
    id: number
    team1: string[]
    team2: string[]
    onClick: () => void
}

type Match = {
    id: number
    team1: string[]
    team2: string[]
}

export default function MatchCard({ id, team1, team2, onClick }: matchCardProps) {
    
    return (
        <button 
            onClick={onClick}
            className="bg-secondary h-56 p-8 rounded-md border flex flex-col gap-10 cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl"
        >
            <h3 className="text-xl font-extrabold">Court {id}</h3>
            <div className="flex justify-between text-sm md:text-md">
                <div className="text-left flex flex-wrap gap-3">
                    {team1.map((player) => (
                        <p key={`t1-${player}`} className="">{player}</p>
                    ))}
                </div>
                <div className=" text-right flex flex-wrap gap-3">
                    {team2.map((player) => (
                        <p key={`t1-${player}`} className="">{player}</p>
                    ))}
                </div>
            </div>
        </button>
    )
}