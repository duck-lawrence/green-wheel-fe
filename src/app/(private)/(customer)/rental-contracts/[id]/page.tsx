"use client"
import { RentalContractDetail, SpinnerStyled } from "@/components"
import { useParams } from "next/navigation"
import React from "react"

export default function RentalContractDetailPage() {
    const { id } = useParams()
    const contractId = id?.toString()

    if (!contractId) return <SpinnerStyled />

    return <RentalContractDetail contractId={contractId} />
}
