"use client"

import { useRouter } from "next/navigation";
import SmashQTitle from "../components/ui/SmashQTitle";

export default function LandingPage() {
    const router = useRouter()

    const features = [
        {
            title: "Smart Matchmaking",
            description: "Intelligent algorithms pair players of similar skill levels for competitive, balanced matches"
        },
        {
            title: "Automated Queueing",
            description: "Say goodbye to manual management. Our system handles queues automatically and efficiently"
        },
        {
            title: "Real-Time Analytics",
            description: "Track player performance, win rates, and court utilization with comprehensive dashboards"
        },
        {
            title: "Easy Court Management",
            description: "Manage multiple courts from one intuitive platform with detailed lobby controls"
        },
        {
            title: "Player Profiles",
            description: "Build player reputation through profiles, statistics, and match history"
        },
        {
            title: "Instant Notifications",
            description: "Players stay informed with real-time updates on match status and queue positions"
        }
    ]

    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <header className="bg-secondary text-4xl flex justify-between items-center px-8 md:px-16 py-5 border-b-2 border-accent shadow-md sticky top-0 z-50">
                <SmashQTitle />
                <button
                    onClick={() => router.push("/login")}
                    className="hidden md:block font-bold text-sm text-secondary bg-accent py-2 px-6 rounded-md cursor-pointer transition duration-200 hover:bg-green-400 hover:shadow-lg"
                >
                    Sign In
                </button>
            </header>

            <main className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="px-8 md:px-16 py-16 md:py-24 flex flex-col gap-8 md:items-center text-center">
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        <h1 className="font-sans font-bold text-6xl md:text-7xl text-[#FFFFF2] leading-tight">
                            Your Intelligent Sports Matchmaking Platform
                        </h1>
                        <p className="text-xl text-[#E8E8D0] max-w-2xl mx-auto">
                            Manage courts, match players, and run tournaments with our next-generation queueing and matchmaking system
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:justify-center">
                        <button
                            onClick={() => router.push("/register")}
                            className="font-bold text-lg text-[#FFFFF2] bg-accent py-3 px-8 rounded-md cursor-pointer transition duration-200 hover:bg-green-400 hover:shadow-lg hover:scale-105"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="font-bold text-lg text-accent bg-transparent border-2 border-accent py-3 px-8 rounded-md cursor-pointer transition duration-200 hover:bg-accent hover:text-secondary md:hidden"
                        >
                            Sign In
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-8 md:px-16 py-16 bg-secondary/30">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFF2] text-center mb-12">
                            Why Choose SmashQ?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-primary/50 p-6 rounded-lg border border-accent/30 hover:border-accent transition duration-300 hover:shadow-lg hover:shadow-accent/20"
                                >
                                    <h3 className="text-xl font-bold text-accent mb-3">{feature.title}</h3>
                                    <p className="text-[#E8E8D0]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="px-8 md:px-16 py-16">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl font-bold text-[#FFFFF2]">For Court Operators</h2>
                            <ul className="flex flex-col gap-4">
                                {[
                                    "Reduce operational overhead with automated management",
                                    "Maximize court utilization with smart scheduling",
                                    "Access detailed analytics and reporting",
                                    "Increase player satisfaction with fair matchmaking"
                                ].map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[#E8E8D0]">
                                        <span className="text-accent font-bold mt-1">✓</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl font-bold text-[#FFFFF2]">For Players</h2>
                            <ul className="flex flex-col gap-4">
                                {[
                                    "Join queues instantly without manual coordination",
                                    "Get matched with equally skilled opponents",
                                    "Track your performance and progress",
                                    "Build your competitive profile"
                                ].map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[#E8E8D0]">
                                        <span className="text-accent font-bold mt-1">✓</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-8 md:px-16 py-16 bg-accent/10 border-t border-accent/30">
                    <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFF2] mb-4">
                                Ready to Transform Your Sports Platform?
                            </h2>
                            <p className="text-xl text-[#E8E8D0]">
                                Join thousands of courts and players already using SmashQ
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/register")}
                            className="w-full md:w-auto font-bold text-lg text-[#FFFFF2] bg-accent py-3 px-12 rounded-md cursor-pointer transition duration-200 hover:bg-green-400 hover:shadow-lg hover:scale-105 mx-auto"
                        >
                            Start Your Free Trial
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-secondary text-[#E8E8D0] border-t border-accent/30 px-8 md:px-16 py-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="font-bold text-accent mb-2">SmashQ</p>
                        <p className="text-sm">The future of sports matchmaking</p>
                    </div>
                    <div className="flex gap-8 text-sm">
                        <button onClick={() => router.push("/login")} className="hover:text-accent transition">Sign In</button>
                        <button onClick={() => router.push("/register")} className="hover:text-accent transition">Sign Up</button>
                        <a href="#" className="hover:text-accent transition">Privacy</a>
                        <a href="#" className="hover:text-accent transition">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}