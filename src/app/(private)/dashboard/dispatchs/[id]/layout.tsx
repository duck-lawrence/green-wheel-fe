"use client"

import { DispatchInfo, SpinnerStyled } from "@/components"
import { useGetDispatchById } from "@/hooks"
import { useParams } from "next/navigation"
import React from "react"

export default function DispatchDetailLayout({ children }: { children: React.ReactNode }) {
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: dispatch } = useGetDispatchById({ id: dispatchId!, enabled: true })

    if (!dispatch) return <SpinnerStyled />

    return (
        <div className="w-full">
            <DispatchInfo dispatch={dispatch} />
            {children}
        </div>
    )
}
