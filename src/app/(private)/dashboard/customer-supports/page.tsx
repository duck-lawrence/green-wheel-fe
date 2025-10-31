"use client"

import TicketManagement from "@/components/pages/TicketManagement"
import { RoleName, TicketType } from "@/constants/enum"
import { useGetAllTickets, useGetMe } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function CustomerSupportsPage() {
    const { t } = useTranslation()
    const { data: user } = useGetMe()
    const isAdmin = user?.role?.name === RoleName.Admin

    const [filter, setFilter] = useState<TicketFilterParams>({ type: TicketType.CustomerSupport })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const queryResult = useGetAllTickets({
        query: filter,
        pagination
    })

    // check error
    useEffect(() => {
        if (queryResult.error) {
            const backendErr = queryResult.error as BackendError
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, backendErr.detail),
                color: "danger"
            })
        }
    }, [queryResult.error, t])

    return (
        <TicketManagement
            isEditable={true}
            isAdmin={isAdmin}
            filterState={[filter, setFilter]}
            paginations={[pagination, setPagination]}
            queryResult={queryResult}
            createType={undefined}
        />
    )
}
