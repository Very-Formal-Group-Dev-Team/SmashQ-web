"use client"

import JoinTile from "@/app/components/ui/JoinTile";
import { BsQrCodeScan } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import AuthFormInput from "@/app/components/ui/Input";
import { useState } from "react";

export default function JoinLobbiesPage() {
    const [joinUrl, setJoinUrl] = useState("")

    return (
        <div className="text-accent flex flex-col lg:flex-row lg:justify-center items-center gap-16 lg:gap-32 mt-8 lg:mt-42">
            <JoinTile>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <p className="font-bold text-2xl flex items-center gap-2">Join via Link</p>
                        <FaLink className="text-3xl"/>
                    </div>
                    <AuthFormInput 
                        type="url"
                        placeholder="Link"
                        value={joinUrl}
                        onChange={(e) => setJoinUrl(e.target.value)}
                    />
                    <button className="bg-secondary px-5 py-2 font-semibold rounded-sm border-2 border-accent cursor-pointer transform duration-100 hover:rounded-xl">Confirm</button>
                </div>
            </JoinTile>
            <JoinTile>
                <div className="flex flex-col items-center gap-3 cursor-pointer">
                    <p className="font-bold text-2xl flex items-center gap-3">Join via QR</p>
                    <BsQrCodeScan className="text-9xl"/>
                </div>
            </JoinTile>
        </div>
        
    )
}