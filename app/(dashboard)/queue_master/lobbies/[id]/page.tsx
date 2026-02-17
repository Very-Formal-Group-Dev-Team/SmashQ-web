"use client"

import AddPlayerModal from "@/app/components/ui/AddPlayerModal";
import Button from "@/app/components/ui/Button";
import CourtDetailsModal from "@/app/components/ui/CourtDetailsModal";
import MatchCard from "@/app/components/ui/MatchCard";
import Modal from "@/app/components/ui/Modal";
import { useState } from "react";

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
    const [playerModalOpen, setPlayerModalOpen] = useState(false)
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [courtModalOpen, setCourtModalOpen] = useState(false)

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-secondary text-6xl text-center font-display">LOBBY NAME</h1>
            
            {/* Players Table */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">PLAYERS</h2>
                    <Button onClick={() => setPlayerModalOpen(true)}>Add Player</Button>
                </div>
                <div className="bg-secondary w-full h-80 rounded-md border-2 border-accent shadow-md">

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
                onClose={() => setPlayerModalOpen(false)}
            />
            <CourtDetailsModal 
                open={courtModalOpen} 
                onClose={() => setCourtModalOpen(false)} 
            />
        </div>
    )
}