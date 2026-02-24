"use client"

import Input from "./ui/Input"
import AuthFormButton from "./ui/AuthFormButton"
import SmashQTitle from "./ui/SmashQTitle"
import Dropdown from "./ui/Dropdown"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

type Mode = "register" | "login"

export default function AuthForm({ mode }: { mode: Mode }) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [role, setRole] = useState("player")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { refreshUser } = useAuth()
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"
    const API_URL = `${API_BASE}/auth`

    function handleGoogleAuth() {
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"
        window.location.href = `${backendUrl}/auth/google`
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
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, firstName, lastName, password, role }),
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
        <form className="pl-8 pr-8 pt-10 pb-10 bg-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-6 rounded-xl w-[370px]">
            <div className="flex flex-col text-center gap-1">
            <SmashQTitle />
            <p className="text-gray-700">
                {mode === "login" ? "Log in to your Account" : "Create an Account"}
            </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
            {mode === "login" ? (
                <>
                <Input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showToggle={true}
                    ariaLabel="Password"
                />
                </>
            ) : (
                <>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showToggle={true}
                    ariaLabel="Password"
                />
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    showToggle={true}
                    ariaLabel="Confirm Password"
                />
                <Dropdown
                    placeholder="Select Role"
                    options={[
                        { value: "Player", label: "Player" },
                        { value: "Queue Master", label: "Queue Master" },
                    ]}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                </>
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
