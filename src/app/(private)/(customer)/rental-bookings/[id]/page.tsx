"use client"
import { RentalContractDetail, SpinnerStyled } from "@/components"
import { useParams } from "next/navigation"
import React from "react"

export default function RentalContractDetailPage() {
    const { id } = useParams()
    const contractId = id?.toString()

    if (!contractId) return <SpinnerStyled />

    return (
        // <div className="max-w-screen w-fit md:max-w-7xl bg-white px-14 py-6 rounded-2xl">
        <div className="w-full max-w-5xl bg-white px-4 md:px-14 py-6 rounded-2xl">
            <RentalContractDetail isCustomer={true} contractId={contractId} />
        </div>
    )
}
