
interface matchCardProps {
    variant?: "lobby" | "queue"
    id: number
    team1: string[]
    team2: string[]
    estimated_duration: string
    onClick?: () => void
}

type Match = {
    id: number
    team1: string[]
    team2: string[]
    estimated_duration: string
}

export default function MatchCard({ variant, id, team1, team2, estimated_duration, onClick }: matchCardProps) {

    return (
        variant === "lobby" ?
            <button 
                type="button"
                onClick={onClick}
                className="text-accent bg-secondary w-full h-56 p-8 rounded-md border-3 border-accent flex flex-col gap-10 cursor-pointer transform duration-150 hover:-translate-y-1.5 hover:shadow-xl"
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
            :
            <div className="text-accent bg-secondary w-full max-w-200 h-67 sm:h-72 py-8 sm:mx-8 rounded-md shadow-lg border-3 border-accent flex flex-col items-center gap-10">
                <h3 className="text-xl sm:text-2xl font-extrabold">Court {id}</h3>
                <div className="flex justify-between gap-8 sm:gap-20 text-sm md:text-lg">
                    <div className="text-left flex flex-col gap-6">
                        {team1.map((player) => (
                            <p key={`t1-${player}`} className="">{player}</p>
                        ))}
                    </div>
                    <div className=" text-right flex flex-col gap-6">
                        {team2.map((player) => (
                            <p key={`t1-${player}`} className="">{player}</p>
                        ))}
                    </div>
                </div>
                <p className="text-xl font-mono">{estimated_duration}</p>
            </div>
    )
}