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
        estimated_duration: 1311342
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
        estimated_duration: 1536454
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
        estimated_duration: 1443257
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
        estimated_duration: 1999533
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
        estimated_duration: 1714373
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
                        estimated_duration={`${Math.floor(currentMatch.estimated_duration / 1000 / 60)}m ${Math.floor((currentMatch.estimated_duration % 60000) / 1000)}s`}
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
                            estimated_duration={`${Math.floor(match.estimated_duration / 1000 / 60)}m ${Math.floor((match.estimated_duration % 60000) / 1000)}s`}
                        />
                    </li>
                ))}
            </ol>
        </div>
    )
}