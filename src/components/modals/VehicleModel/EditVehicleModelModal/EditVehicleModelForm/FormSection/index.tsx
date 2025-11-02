"use client"

import React, { ReactNode } from "react"

type FormSectionProps = {
    title: string
    children: ReactNode
    description?: string
}

export function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <section className="space-y-4">
            <header>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {title}
                </h3>
                {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
            </header>

            {children}
        </section>
    )
}
