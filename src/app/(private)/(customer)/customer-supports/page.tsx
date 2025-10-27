"use client"

import TicketManagement from "@/components/pages/TicketManagement"
import { TicketType } from "@/constants/enum"
import { useGetMyTickets } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export default function CustomerSupportsPage() {
    const { t } = useTranslation()
    const [filter, setFilter] = useState<TicketFilterParams>({ type: TicketType.CustomerSupport })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const queryResult = useGetMyTickets({
        status: filter.status,
        pagination
    })

    // check error
    useEffect(() => {
        if (queryResult.error) {
            const backendErr = queryResult.error as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [queryResult.error, t])

    return (
        <div className="md:min-w-3xl lg:min-w-5xl max-w-screen">
            <TicketManagement
                isEditable={false}
                filterState={[filter, setFilter]}
                paginations={[pagination, setPagination]}
                queryResult={queryResult}
                createType={TicketType.CustomerSupport}
            />
        </div>
    )
}
