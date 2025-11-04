import { PolicyPageEN, PolicyPageVN } from "@/components"
import { cookies } from "next/headers"
import React from "react"

export default async function PolicyPage() {
    const cookieStore = await cookies()
    const locale = cookieStore.get("i18next")?.value || "en"

    return (
        <div className="w-full max-w-5xl px-3 py-6 md:py-8 md:px-12 bg-white rounded-2xl shadow-lg">
            {locale === "vi" ? <PolicyPageVN /> : <PolicyPageEN />}
        </div>
    )
}
