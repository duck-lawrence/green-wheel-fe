"use client"

import React from "react"

type FleetBackButtonProps = {
    onBack: () => void
    label: string
}

export function FleetBackButton({ onBack, label }: FleetBackButtonProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
                <span className="text-lg leading-none">&#8592;</span>
                <span>{label}</span>
            </button>
        </div>
    )
}
