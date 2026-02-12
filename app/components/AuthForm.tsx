"use client"

import AuthFormInput from "./ui/AuthFormInput"
import AuthFormButton from "./ui/AuthFormButton"
import SmashQTitle from "./ui/SmashQTitle"
import Dropdown from "./ui/Dropdown"
import { useState } from "react"

type Mode = "register" | "login"

export default function AuthForm({ mode }: {mode: Mode}) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)
    
    return (
        <div className="bg-[#368F66] h-lvh">
            <form className="pl-10 pr-10 pt-10 pb-10 bg-[#E2E1E0] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-6 rounded-lg w-[370px]">
                <div className="flex flex-col text-center gap-1"> 
                    <SmashQTitle />
                    <p className="text-gray-700">
                        {mode === "login" ? "Log in to your Account" : "Create an Account"}
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    {mode === "login" ?
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
                    </> :
                    <>
                        <AuthFormInput 
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
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
                        <AuthFormInput
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        <Dropdown
                            placeholder="Select Role"
                            options={[
                                { value: 'player', label: 'Player'},
                                { value: 'queueMaster', label: 'Queue Master'},
                            ]}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </>
                    }
                   
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                    {mode === "login" ? 
                    <>
                        <AuthFormButton variant="login" />
                        <AuthFormButton variant="guest" />
                        <AuthFormButton variant="googleLogin" />
                    </> : 
                    <>
                        <AuthFormButton variant="register" />
                        <AuthFormButton variant="googleRegister" />
                    </>
                }
                </div>

                <p>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <a href={mode === "login" ? "/register" : "/login"} className="text-[#368F66] font-semibold hover:cursor-pointer">
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </a>
                </p>
                
            </form>
        </div>
    )
}