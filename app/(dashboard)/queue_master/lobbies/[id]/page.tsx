"use client"

import AddPlayerModal from "@/app/components/ui/AddPlayerModal";
import Button from "@/app/components/ui/Button";
import CourtDetailsModal from "@/app/components/ui/CourtDetailsModal";
import MatchCard from "@/app/components/ui/MatchCard";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLobbyUsers, type LobbyUser } from "@/app/lib/api";

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
    const params = useParams()
    const lobbyId = params.id as string

    const [playerModalOpen, setPlayerModalOpen] = useState(false)
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [courtModalOpen, setCourtModalOpen] = useState(false)

    const [players, setPlayers] = useState<LobbyUser[]>([])
    const [playersLoading, setPlayersLoading] = useState(true)
    const [playersError, setPlayersError] = useState("")

    async function fetchPlayers() {
        setPlayersLoading(true)
        setPlayersError("")
        try {
            const data = await getLobbyUsers(lobbyId)
            setPlayers(data.users)
        } catch (err: any) {
            setPlayersError(err.message || "Failed to load players")
        } finally {
            setPlayersLoading(false)
        }
    }

    useEffect(() => {
        if (lobbyId) fetchPlayers()
    }, [lobbyId])

    function handlePlayerModalClose() {
        setPlayerModalOpen(false)
        // Refresh the player list after modal closes
        fetchPlayers()
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-secondary text-6xl text-center font-display">LOBBY {lobbyId}</h1>
            
            {/* Players Table */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">PLAYERS ({players.length})</h2>
                    <Button onClick={() => setPlayerModalOpen(true)}>Add Player</Button>
                </div>
                <div className="bg-secondary w-full min-h-80 rounded-md border-2 border-accent shadow-md p-4">
                    {playersLoading && <p className="text-center text-gray-500">Loading players...</p>}
                    {playersError && <p className="text-center text-red-500">{playersError}</p>}
                    {!playersLoading && !playersError && players.length === 0 && (
                        <p className="text-center text-gray-400">No players yet. Share the join link to invite players!</p>
                    )}
                    {!playersLoading && players.length > 0 && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-accent">
                                    <th className="py-2 px-3">#</th>
                                    <th className="py-2 px-3">Name</th>
                                    <th className="py-2 px-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, idx) => (
                                    <tr key={player.id} className="border-b border-gray-200">
                                        <td className="py-2 px-3">{idx + 1}</td>
                                        <td className="py-2 px-3">{player.name}</td>
                                        <td className="py-2 px-3 text-sm text-gray-500">
                                            {new Date(player.joined_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Match List */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">MATCHES</h2>
                    <Button onClick={() => alert("TO BE IMPLEMENTED")}>Add Court</Button>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 sm:gap-12">
                    {matches.map((match) => (
                        <li key={match.id} className="flex justify-center">
                            <MatchCard 
                                id={match.id}
                                team1={match.team1}
                                team2={match.team2}
                                onClick={() => setCourtModalOpen(true)}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <AddPlayerModal 
                open={playerModalOpen} 
                onClose={handlePlayerModalClose}
                lobbyId={lobbyId}
            />
            <CourtDetailsModal 
                open={courtModalOpen} 
                onClose={() => setCourtModalOpen(false)} 
            />
        </div>
    )
}