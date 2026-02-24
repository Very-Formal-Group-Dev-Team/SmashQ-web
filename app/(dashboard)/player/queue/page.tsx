import MatchCard from "@/app/components/ui/MatchCard"
import ModalTitle from "@/app/components/ui/ModalTitle"

const matchQueue = [
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

export default function QueuePage() {
    const [currentMatch, ...nextMatches] = matchQueue

    return (
        <div className="flex flex-col">
            <ol className="flex flex-col gap-8 mb-8 sm:mb-12"> 
                <li className="flex flex-col items-center justify-center">
                    <ModalTitle color="secondary">Current Match</ModalTitle>
                    <MatchCard 
                        variant="queue"
                        id={currentMatch.id}
                        team1={currentMatch.team1}
                        team2={currentMatch.team2}
                    />
                </li>
            </ol>
            
            <ModalTitle color="secondary">Next Matches</ModalTitle>
            <ol className="flex flex-col gap-8"> 
                {nextMatches.map((match) => (
                    <li key={match.id} className="flex justify-center">
                        <MatchCard 
                            variant="queue"
                            id={match.id}
                            team1={match.team1}
                            team2={match.team2}
                        />
                    </li>
                ))}
            </ol>
        </div>
    )
}