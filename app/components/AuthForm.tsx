"use client"

import AuthFormInput from "./ui/AuthFormInput"
import AuthFormButton from "./ui/AuthFormButton"
import SmashQTitle from "./ui/SmashQTitle"
import Dropdown from "./ui/Dropdown"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
    const API_URL = "http://localhost:5000/api/auth"

    async function handleRegister(e: React.FormEvent) {
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
                alert(data.message || "Registration failed")
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        }
        setLoading(false)
    }

    async function handleLogin(e: React.FormEvent) {
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
                localStorage.setItem("accessToken", data.accessToken)
                localStorage.setItem("refreshToken", data.refreshToken)
                alert("Logged in successfully!")
                if (data.data.user.role === "Player") {
                    router.push("/player")
                }
                else if (data.data.user.role === "Queue Master") {
                    router.push("/queue_master/lobbies")
                }
            } else {
                alert(data.message || "Login failed")
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
                <AuthFormInput
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AuthFormInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </>
            ) : (
                <>
                <AuthFormInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex gap-2">
                    <AuthFormInput
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <AuthFormInput
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <AuthFormInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <AuthFormInput
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
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
                    onClick={() => alert("Google login not implemented yet")}
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
                    onClick={() => alert("Google register not implemented yet")}
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
