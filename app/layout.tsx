import type { Metadata } from "next";
import { Jaro, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
})

const jaro = Jaro({
  subsets: ['latin'],
  variable: '--font-jaro', 
})

export const metadata: Metadata = {
  title: "SmashQ",
  description: "Badminton queueing system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jaro.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider> 
      </body>
    </html>
  );
}
