"use client"

import { useEffect, useState } from "react"
import { getProfile, UserProfile } from "@/app/lib/api"

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-white/80 text-sm font-medium tracking-wide">{label}</span>
      <span className="text-white font-bold text-2xl">{value}</span>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}m ${s.toString().padStart(2, "0")}s`
}

export default function ProfileDisplay() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data.user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center -m-8 sm:-m-16 bg-primary min-h-full">
        <span className="text-white text-lg font-medium">Loading…</span>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center -m-8 sm:-m-16 bg-primary min-h-full">
        <span className="text-white text-lg font-medium">{error ?? "Failed to load profile."}</span>
      </div>
    )
  }

  const displayName = `${profile.first_name} ${profile.last_name}`
  const winRate = `${Number(profile.winrate ?? 0).toFixed(1)}%`
  const avgDuration = formatDuration(Number(profile.average_match_duration ?? 0) * 60)

  return (
    <div className="flex flex-col items-center justify-center -m-8 sm:-m-16 bg-primary min-h-full py-14 px-8">
      <div className="w-44 h-44 rounded-3xl bg-secondary flex items-center justify-center mb-8 shrink-0">
        <svg
          className="w-28 h-28 text-accent"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
      </div>

      <h1 className="text-white font-bold text-4xl font-display mb-1">{displayName}</h1>
      <p className="text-white/80 text-base mb-10">ID: {profile.id}</p>

      <div className="flex flex-wrap justify-center gap-12 mb-10">
        <StatBlock label="Age" value={profile.age ?? "—"} />
        <StatBlock label="Sex" value={profile.gender ?? "—"} />
      </div>

      <div className="flex flex-wrap justify-center gap-12">
        <StatBlock label="Contact No." value={profile.contact_number ?? "—"} />
        <StatBlock label="Matches Played" value={profile.matches_played ?? 0} />
        <StatBlock label="Win Rate" value={winRate} />
        <StatBlock label="Average Match Duration" value={avgDuration} />
      </div>
    </div>
  )
}
