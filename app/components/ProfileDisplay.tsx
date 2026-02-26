"use client"

import { useEffect, useState } from "react"
import { getProfile, UserProfile } from "@/app/lib/api"
import { FiAward, FiTrendingUp, FiClock, FiUsers, FiTarget } from "react-icons/fi"

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="xl:w-60 bg-secondary rounded-xl p-6 border-2 border-accent hover:border-accent/80 transition duration-100 hover:shadow-lg hover:shadow-accent/20">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600 text-sm font-semibold tracking-wide">{label}</span>
        <div className={`${color} text-2xl`}>{Icon}</div>
      </div>
      <span className="text-accent font-bold text-3xl">{value}</span>
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

  const fetchProfile = () => {
    setLoading(true)
    setError(null)
    getProfile()
      .then((res) => setProfile(res.data.user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProfile()

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProfile()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center from-primary to-green-800 min-h-full">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <span className="text-white text-lg font-medium">Loading your profile…</span>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary min-h-full">
        <div className="text-center bg-secondary rounded-2xl p-10 max-w-md">
          <p className="text-accent text-lg font-semibold mb-4">⚠️ Unable to Load Profile</p>
          <p className="text-gray-600 mb-6">{error ?? "Failed to load profile."}</p>
          <button 
            onClick={fetchProfile}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const displayName = `${profile.first_name} ${profile.last_name}`
  const winRate = Number(profile.winrate ?? 0)
  const avgDuration = formatDuration(Number(profile.average_match_duration ?? 0) * 60)

  return (
    <div className="min-h-full flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-white py-12 px-4 mr-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="w-44 h-44 rounded-3xl bg-tertiary flex items-center justify-center shrink-0 shadow-2xl border-4 border-accent">
            <svg
              className="w-28 h-28 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            </svg>
          </div>

          {/* Header Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-display font-bold mb-2">{displayName}</h1>
            <p className="text-green-50 text-lg mb-4">ID: {profile.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Personal Info Section */}
        <div className="bg-secondary rounded-2xl p-8 border-2 border-accent hover:border-accent/80 transition duration-100 hover:shadow-lg hover:shadow-accent/20 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 flex items-center gap-2">
            <FiUsers className="text-primary" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Age</p>
              <p className="text-2xl font-bold text-accent">{profile.age ?? "—"}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Gender</p>
              <p className="text-2xl font-bold text-accent">{profile.gender ?? "—"}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Contact</p>
              <p className="text-lg font-semibold text-accent break-all">{profile.contact_number ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Matches Played" 
            value={profile.matches_played ?? 0}
            icon={<FiTarget />}
            color="text-primary"
          />
          <StatCard 
            label="Win Rate" 
            value={`${winRate.toFixed(1)}%`}
            icon={<FiTrendingUp />}
            color="text-green-600"
          />
          <StatCard 
            label="Avg Match Time" 
            value={avgDuration}
            icon={<FiClock />}
            color="text-blue-600"
          />
        </div>
      </div>
    </div>
  )

}
