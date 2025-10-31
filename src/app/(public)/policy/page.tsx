import { PolicyPageEN, PolicyPageVN } from "@/components"
import { cookies } from "next/headers"
import React from "react"

export default async function PolicyPage() {
    const cookieStore = await cookies()
    const locale = cookieStore.get("i18next")?.value || "en"
    return locale === "vi" ? <PolicyPageVN /> : <PolicyPageEN />
}
