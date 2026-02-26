"use client"

import Input from "./ui/Input"
import AuthFormButton from "./ui/AuthFormButton"
import SmashQTitle from "./ui/SmashQTitle"
import Dropdown from "./ui/Dropdown"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import Label from "./ui/Label"

type Mode = "register" | "login"

export default function AuthForm({ mode }: { mode: Mode }) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [role, setRole] = useState("player")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { refreshUser } = useAuth()
    function ensureAbsoluteUrl(url: string): string {
        if (!/^https?:\/\//i.test(url)) return `https://${url}`
        return url
    }

    const API_BASE = ensureAbsoluteUrl(
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
    )
    const API_URL = `${API_BASE}/auth`

    function handleGoogleAuth() {
        window.location.href = `${API_BASE}/auth/google`
    }

    async function handleRegister(e: React.MouseEvent) {
        e.preventDefault()
        
        if (!firstName || !lastName || !email || !password || !passwordConfirm) {
            alert("Please fill in all fields")
            return
        }

        if (password !== passwordConfirm) {
            alert("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            let age: number | undefined
            if (dob) {
                const birth = new Date(dob)
                const today = new Date()
                age = today.getFullYear() - birth.getFullYear()
                const monthDiff = today.getMonth() - birth.getMonth()
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--
                }
            }

            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    password,
                    role,
                    age: age ?? null,
                    gender: gender || null,
                    contact_number: contactNumber || null,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                alert("Registration successful! Check your email for verification link.")
                router.push("/login")
            } else {
                // Ensure loading is reset before showing error to avoid accidental resubmits
                setLoading(false)
                alert(data.message || "Registration failed")
                return
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        }
        setLoading(false)
    }

    async function handleLogin(e: React.MouseEvent) {
        e.preventDefault()

        if (!email || !password) {
            alert("Please fill in email and password")
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (response.ok) {
                // Tokens are nested in data.data
                localStorage.setItem("accessToken", data.data.accessToken)
                localStorage.setItem("refreshToken", data.data.refreshToken)

                // Refresh AuthContext so DashboardLayout sees the user before we navigate
                await refreshUser()

                const role = data.data.user.role
                let target = "/player/join_lobby"
                if (role === "Queue Master" || role === "queue master" || role === "Queue master") {
                    target = "/queue_master/lobbies"
                }

                router.push(target)
                return
            } else {
                setLoading(false)
                alert(data.message || "Login failed")
                return
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        }
        setLoading(false)
    }

    return (
        <div className="bg-primary h-lvh">
            <form className={`pl-8 pr-8 pt-10 pb-10 bg-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-6 rounded-xl ${mode === "login" ? "w-[370px]" : "w-[370px] md:w-[750px] md:pl-12 md:pr-12"}`}>
                <div className="flex flex-col text-center gap-1">
                    <SmashQTitle />
                    <p className="text-gray-700">
                        {mode === "login" ? "Log in to your Account" : "Create an Account"}
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                {mode === "login" ? (
                    <div className="flex flex-col gap-2">
                        {/* Email */}
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* Password */}
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            showToggle={true}
                            ariaLabel="Password"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                        <div className="w-full flex flex-col gap-2">
                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <Label>Name</Label>
                                <div className="flex gap-2">
                                    {/* First Name */}
                                    <Input
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    {/* Last Name */}
                                    <Input
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    showToggle={true}
                                    ariaLabel="Password"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Label>Confirm Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    showToggle={true}
                                    ariaLabel="Confirm Password"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            {/* Date of Birth */}
                            <div>
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>
                            {/* Sex */}
                            <div>
                                <Label>Sex</Label>
                                <Dropdown
                                    placeholder="Select Sex"
                                    options={[
                                        { value: "Male", label: "Male" },
                                        { value: "Female", label: "Female" },
                                    ]}
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                            </div>
                            {/* Contact Number */}
                            <div>
                                <Label>Contact Number</Label>
                                <Input
                                    type="text"
                                    placeholder="Contact Number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                            {/* Role */}
                            <div>
                                <Label>Role</Label>
                                <Dropdown
                                    placeholder="Select Role"
                                    options={[
                                        { value: "Player", label: "Player" },
                                        { value: "Queue Master", label: "Queue Master" },
                                    ]}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {mode === "login" ? (
                        <>
                            <AuthFormButton variant="login" onClick={handleLogin} disabled={loading} />
                            <AuthFormButton
                                variant="guest"
                                onClick={() => alert("Guest login not implemented yet")}
                            />
                            <AuthFormButton
                                variant="googleLogin"
                                onClick={handleGoogleAuth}
                            />
                        </>
                    ) : (
                        <>
                            <AuthFormButton
                                variant="register"
                                onClick={handleRegister}
                                disabled={loading}
                            />
                            <AuthFormButton
                                variant="googleRegister"
                                onClick={handleGoogleAuth}
                            />
                        </>
                    )}
                </div>

                <p>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <a
                        href={mode === "login" ? "/register" : "/login"}
                        className="text-[#368F66] font-semibold hover:cursor-pointer"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </a>
                </p>
            </form>
        </div>
    )
}
