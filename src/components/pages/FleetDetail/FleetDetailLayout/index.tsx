"use client"

import React from "react"

type FleetDetailLayoutProps = {
    children: React.ReactNode
}

export function FleetDetailLayout({ children }: FleetDetailLayoutProps) {
    return <div className="mx-auto mb-6 max-w-5xl space-y-10">{children}</div>
}

export * from "./FleetBackButton"
export * from "./FleetInfoHeader"
export * from "./FleetSpecSection"
