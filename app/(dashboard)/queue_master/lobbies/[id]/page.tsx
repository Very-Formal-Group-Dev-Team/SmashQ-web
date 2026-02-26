"use client"

import Button from "@/app/components/ui/Button";
import CourtDetailsModal from "@/app/components/ui/CourtDetailsModal";
import MatchCard from "@/app/components/ui/MatchCard";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    getLobbyUsers, getLobby, getJoinLink, getCourtsWithMatches,
    createCourt as apiCreateCourt,
    addGuestPlayer,
    finishMatch,
    startTimer,
    startMatch,
    type LobbyUser, type LobbyData, type CourtData
} from "@/app/lib/api";
import Input from "@/app/components/ui/Input";
import { QRCodeSVG } from "qrcode.react";
import WinnerModal from "@/app/components/ui/WinnerModal";

export default function LobbyInfoPage() {
    const params = useParams()
    const lobbyId = params.id as string

    const [lobby, setLobby] = useState<LobbyData>()
    const [selectedCourt, setSelectedCourt] = useState<CourtData | null>(null)
    const [courtModalOpen, setCourtModalOpen] = useState(false)

    const [players, setPlayers] = useState<LobbyUser[]>([])
    const [playersLoading, setPlayersLoading] = useState(true)
    const [playersError, setPlayersError] = useState("")

    const [courts, setCourts] = useState<CourtData[]>([])
    const [courtsLoading, setCourtsLoading] = useState(true)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [playerName, setPlayerName] = useState("")
    const [joinLink, setJoinLink] = useState("")
    const [linkLoading, setLinkLoading] = useState(false)

    const [winnerModalOpen, setWinnerModalOpen] = useState(false)
    const [winnerCourt, setWinnerCourt] = useState<CourtData | null>(null)
    const [winnerSaving, setWinnerSaving] = useState(false)

    useEffect(() => {
        if (lobbyId) {
            setLinkLoading(true)
            getJoinLink(lobbyId)
                .then(data => {
                    const base = window.location.origin
                    setJoinLink(`${base}${data.join_link}`)
                })
                .catch(() => setJoinLink("Failed to load link"))
                .finally(() => setLinkLoading(false))
        }
    }, [lobbyId])

    function handleCopyLink() {
        if (joinLink) {
            navigator.clipboard.writeText(joinLink)
        }
    }

    async function fetchLobby() {
        setLoading(true)
        try {
            const data = await getLobby(lobbyId)
            setLobby(data.data)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load lobby"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLobby()
    }, [])

    const fetchPlayers = useCallback(async () => {
        setPlayersLoading(true)
        setPlayersError("")
        try {
            const data = await getLobbyUsers(lobbyId)
            setPlayers(data.users)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load players"
            setPlayersError(message)
        } finally {
            setPlayersLoading(false)
        }
    }, [lobbyId])

    useEffect(() => {
        if (lobbyId) fetchPlayers()
    }, [lobbyId, fetchPlayers])

    const fetchCourts = useCallback(async (isInitial = false) => {
        if (isInitial) setCourtsLoading(true)
        try {
            const data = await getCourtsWithMatches(lobbyId)
            setCourts(data.data)
        } catch {
        } finally {
            if (isInitial) setCourtsLoading(false)
        }
    }, [lobbyId])

    useEffect(() => {
        if (lobbyId) fetchCourts(true)
    }, [lobbyId, fetchCourts])

    useEffect(() => {
        if (!lobbyId) return
        const interval = setInterval(fetchCourts, 5000)
        return () => clearInterval(interval)
    }, [lobbyId, fetchCourts])

    async function handleAddCourt() {
        const nextNum = courts.length + 1
        try {
            await apiCreateCourt(lobbyId, `Court ${nextNum}`)
            fetchCourts()
        } catch {
        }
    }

    function handleCourtClick(court: CourtData) {
        setSelectedCourt(court)
        setCourtModalOpen(true)
    }

    function handleCourtModalClose() {
        setCourtModalOpen(false)
        setSelectedCourt(null)
        fetchCourts()
    }

    function handleDone(court: CourtData) {
        setWinnerCourt(court)
        setWinnerModalOpen(true)
    }

    async function handleStart(court: CourtData) {
        if (!court.active_match) return
        try {
            await startTimer(lobbyId, court.id, court.active_match.id)
            fetchCourts()
        } catch {}
    }

    async function handleStartNow(court: CourtData) {
        if (!court.active_match) return
        try {
            await startMatch(lobbyId, court.id, court.active_match.id)
            fetchCourts()
        } catch {}
    }

    async function handleSelectWinner(winnerTeam: number) {
        if (!winnerCourt?.active_match) return
        setWinnerSaving(true)
        try {
            await finishMatch(lobbyId, winnerCourt.id, winnerCourt.active_match.id, winnerTeam)
            setWinnerModalOpen(false)
            setWinnerCourt(null)
            fetchCourts()
        } catch {
        } finally {
            setWinnerSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-secondary text-6xl text-center font-display">{lobby ? lobby.lobby_name : `Lobby ${lobbyId}`}</h1>
            
            <div className="flex flex-col xl:flex-row gap-10 lg:gap-16">
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

                <div className="flex flex-col gap-3 w-full h-full">
                    <h2 className="text-secondary text-3xl self-center font-display">ADD PLAYERS</h2>
                    <div className="bg-secondary mt-2 rounded-md border-3 border-accent shadow-md px-4 py-12 flex flex-col gap-8 justify-between items-center w-full">
                        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
                            <div className="flex flex-col items-center gap-2">
                                {joinLink && !linkLoading ? (
                                    <QRCodeSVG value={joinLink} size={250} level="M" />
                                ) : (
                                    <div className="bg-white border w-[250px] aspect-square flex items-center justify-center text-gray-400">
                                        {linkLoading ? "Loading..." : "No link"}
                                    </div>
                                )}
                                <p
                                    className="text-md sm:text-md cursor-pointer hover:underline break-all max-w-[250px] text-center"
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
                                <Button onClick={async () => {
                                    if (!playerName.trim()) return
                                    try {
                                        await addGuestPlayer(lobbyId, playerName.trim())
                                        setPlayerName("")
                                        fetchPlayers()
                                    } catch {}
                                }}>Confirm</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <h2 className="text-secondary text-3xl font-display">COURTS</h2>
                    <Button inverse={true} onClick={handleAddCourt}>Add Court</Button>
                </div>
                {courtsLoading && <p className="text-secondary text-center">Loading courts...</p>}
                {!courtsLoading && courts.length === 0 && (
                    <div className="bg-secondary rounded-md border-3 border-accent shadow-md p-12 text-center">
                        <p className="text-gray-400 text-lg">You don&apos;t have courts yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click &quot;Add Court&quot; to create one</p>
                    </div>
                )}
                {!courtsLoading && courts.length > 0 && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {courts.map((court) => {
                            const match = court.active_match
                            const team1 = match?.players?.filter((p) => p.team === 1).map((p) => p.name) || []
                            const team2 = match?.players?.filter((p) => p.team === 2).map((p) => p.name) || []
                            return (
                                <li key={court.id} className="flex justify-center">
                                    <MatchCard
                                        variant="lobby"
                                        id={court.id}
                                        courtName={court.court_name || `Court ${court.id}`}
                                        team1={team1}
                                        team2={team2}
                                        status={match?.status}
                                        timerDuration={match?.timer_duration}
                                        timerStartedAt={match?.timer_started_at}
                                        startedAt={match?.started_at}
                                        hasMatch={!!match}
                                        onClick={() => handleCourtClick(court)}
                                        onDone={() => handleDone(court)}
                                        onStart={() => handleStart(court)}
                                        onStartNow={() => handleStartNow(court)}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {selectedCourt && (
                <CourtDetailsModal
                    open={courtModalOpen}
                    onClose={handleCourtModalClose}
                    courtId={selectedCourt.id}
                    courtName={selectedCourt.court_name || `Court ${selectedCourt.id}`}
                    lobbyId={Number(lobbyId)}
                    lobbyPlayers={players}
                />
            )}

            {winnerCourt && winnerCourt.active_match && (
                <WinnerModal
                    open={winnerModalOpen}
                    onClose={() => { setWinnerModalOpen(false); setWinnerCourt(null); }}
                    courtName={winnerCourt.court_name || `Court ${winnerCourt.id}`}
                    team1={winnerCourt.active_match.players?.filter(p => p.team === 1).map(p => p.name) || []}
                    team2={winnerCourt.active_match.players?.filter(p => p.team === 2).map(p => p.name) || []}
                    onSelectWinner={handleSelectWinner}
                    saving={winnerSaving}
                />
            )}
        </div>
    )
}