"use client"

import Button from "@/app/components/ui/Button";
import CourtDetailsModal from "@/app/components/ui/CourtDetailsModal";
import MatchCard from "@/app/components/ui/MatchCard";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLobbyUsers, getLobby, type LobbyUser, type LobbyData, getJoinLink } from "@/app/lib/api";
import Input from "@/app/components/ui/Input";

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
]

export default function LobbyInfoPage() {
    const params = useParams()
    const lobbyId = params.id as string

    const [lobby, setLobby] = useState<LobbyData>()

    const [playerModalOpen, setPlayerModalOpen] = useState(false)
    const [selectedCourt, setSelectedCourt] = useState(null)
    const [courtModalOpen, setCourtModalOpen] = useState(false)

    const [players, setPlayers] = useState<LobbyUser[]>([])
    const [playersLoading, setPlayersLoading] = useState(true)
    const [playersError, setPlayersError] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [ playerName, setPlayerName ] = useState("")
    const [ joinLink, setJoinLink ] = useState("")
    const [ linkLoading, setLinkLoading ] = useState(false)

    useEffect(() => {
        if (lobbyId) {
            setLinkLoading(true)
            getJoinLink(lobbyId)
                .then(data => {
                    // Build full URL from the relative join_link
                    const base = window.location.origin
                    setJoinLink(`${base}${data.join_link}`)
                })
                .catch(() => setJoinLink("Failed to load link"))
                .finally(() => setLinkLoading(false))
        }
    }, [open, lobbyId])

    function handleCopyLink() {
        if (joinLink) {
            navigator.clipboard.writeText(joinLink)
        }
    }

    async function fetchLobby() {
        setLoading(true)
        // setError("")
        try {
            const data = await getLobby(lobbyId)
            setLobby(data.data)
        } catch (err: any) {
            setError(err.message || "Failed to load lobbies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLobby()
    }, [])

    useEffect(() => {
        if (lobby) console.log(lobby.lobby_name)
    }, [lobby])

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
            <h1 className="text-secondary text-6xl text-center font-display">{lobby ? lobby.lobby_name : `Lobby {lobbyId}`}</h1>
            
            <div className="flex flex-col xl:flex-row gap-10 lg:gap-16">
                {/* Players Table */}
                <div className="flex flex-col gap-3 w-full">
                    
                    <h2 className="text-secondary text-3xl font-display self-center">PLAYERS ({players.length})</h2>
                   
                    <div className="bg-secondary w-full h-full mt-2 rounded-md border-3 border-accent shadow-md p-4">
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
                                        <tr key={player.id} className="border-b border-accent">
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

                {/* Add Players Section*/}
                <div className="flex flex-col gap-3 w-full h-full">
                    <h2 className="text-secondary text-3xl self-center font-display">ADD PLAYERS</h2>
                    <div className="bg-secondary mt-2 rounded-md border-3 border-accent shadow-md px-4 py-12 flex flex-col gap-8 justify-between items-center w-full">
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-white border w-[250px] aspect-square" />
                                <p 
                                    className="text-md sm:text-md cursor-pointer hover:underline break-all"
                                    onClick={handleCopyLink}
                                    title="Click to copy"
                                >
                                    {linkLoading ? "Loading..." : joinLink || "No link available"}
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-5 w-full">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-semibold self-start">Manual Join</h3>
                                    <Input 
                                        type="text"
                                        placeholder="Name"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => alert("hello")}>Confirm</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Match List */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">MATCHES</h2>
                    <Button inverse={true} onClick={() => alert("TO BE IMPLEMENTED")}>Add Court</Button>
                </div>
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6 sm:gap-12">
                    {matches.map((match) => (
                        <li key={match.id} className="flex justify-center">
                            <MatchCard 
                                variant="lobby"
                                id={match.id}
                                team1={match.team1}
                                team2={match.team2}
                                onClick={() => setCourtModalOpen(true)}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <CourtDetailsModal 
                open={courtModalOpen} 
                onClose={() => setCourtModalOpen(false)} 
            />
        </div>
    )
}