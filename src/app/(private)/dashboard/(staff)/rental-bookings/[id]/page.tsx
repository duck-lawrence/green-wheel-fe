"use client"
import { RentalContractDetail, SpinnerStyled } from "@/components"
import { useGetMe } from "@/hooks"
import { useParams } from "next/navigation"
import React from "react"

export default function RentalContractPage() {
    const { id } = useParams()
    const contractId = id?.toString()
    const { data: staff, isLoading } = useGetMe()

    if (!contractId || isLoading) return <SpinnerStyled />

    return <RentalContractDetail contractId={contractId} staff={staff} />
}
