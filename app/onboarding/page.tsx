"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import SmashQTitle from "@/app/components/ui/SmashQTitle"
import Input from "@/app/components/ui/Input"
import Dropdown from "@/app/components/ui/Dropdown"
import Label from "@/app/components/ui/Label"

export default function OnboardingPage() {
    const router = useRouter()
    const { refreshUser } = useAuth()
    const [role, setRole] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("accessToken")
        if (!role) {
            setError("Please select a role")
            setLoading(false)
            return
        }
        if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
            setError("Please enter a valid age")
            setLoading(false)
            return
        }
        if (!gender) {
            setError("Please select your sex")
            setLoading(false)
            return
        }
        if (!contactNumber) {
            setError("Please enter your contact number")
            setLoading(false)
            return
        }
        try {
            // Update role
            const resRole = await fetch(`${API_BASE}/auth/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role }),
            })
            const dataRole = await resRole.json()
            if (!resRole.ok || !dataRole.success) {
                throw new Error(dataRole.message || "Failed to set role")
            }

            // Update profile fields
            const resProfile = await fetch(`${API_BASE}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ age: Number(age), gender, contact_number: contactNumber }),
            })
            const dataProfile = await resProfile.json()
            if (!resProfile.ok || !dataProfile.success) {
                throw new Error(dataProfile.message || "Failed to update profile")
            }

            await refreshUser()
            if (role === "Queue Master") {
                router.push("/queue_master/lobbies")
            } else {
                router.push("/player/join_lobby")
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center bg-secondary rounded-2xl py-8 px-6 w-[340px] sm:w-[400px] sm:py-10 max-w-lg text-center shadow-lg">
                <SmashQTitle />
                <h1 className="text-2xl font-bold mt-6 mb-1">Complete Your Profile</h1>
                <p className="text-md font-light text-gray-600 mb-5">Please provide the following information to finish onboarding</p>

                <form className="w-69 sm:w-78 flex flex-col gap-2.5 text-left" onSubmit={handleSubmit}>
                    <div>
                        <Label>Role</Label>
                        <Dropdown
                            placeholder="Select Role"
                            options={[
                                { value: "Player", label: "Player" },
                                { value: "Queue Master", label: "Queue Master" },
                            ]}
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label>Age</Label>
                            <Input
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <Label>Sex</Label>
                            <Dropdown
                                placeholder="Select Sex"
                                options={[
                                    { value: "Male", label: "Male" },
                                    { value: "Female", label: "Female" },
                                ]}
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Contact Number</Label>
                        <Input
                            type="text"
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChange={e => setContactNumber(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-center text-red-500 mb-4 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:brightness-175 transition disabled:opacity-50 cursor-pointer mt-4"
                    >
                        Finish Onboarding
                    </button>
                </form>
            </div>
        </div>
    )
}
