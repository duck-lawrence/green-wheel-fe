import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/providers"
import { cookies } from "next/headers"
import { ClientHydration, Footer, Modals, Navbar, ScrollToTopButton } from "@/components/"
import Script from "next/script"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Green Wheel",
    description: "EV station-based rental system",
    icons: {
        icon: "/favicon.ico"
    }
}

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const cookieStore = await cookies()
    const locale = cookieStore.get("i18next")?.value || "en"

    return (
        <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} min-w-xs`}>
            <body
                className="antialiased bg-secondary diamond-background 
                min-w-xs max-w-screen overflow-x-hidden nextstepjs--active"
            >
                <AppProviders locale={locale}>
                    <ClientHydration>
                        <div className="min-h-screen flex flex-col items-center pt-25 mb-6 ">
                            <Navbar />
                            {children}
                            <ScrollToTopButton />
                        </div>
                        <Footer />
                        <Modals />
                    </ClientHydration>
                </AppProviders>
                <Script src="https://accounts.google.com/gsi/client" async defer />
            </body>
        </html>
    )
}
