"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { TableContractStaff } from "@/components"
import FilterContractStaff from "@/components/shared/FilterContractStaff"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useSearchRentalContracts } from "@/hooks"
// import { mockContracts } from "@/data/mockContracts"

export default function StaffContractsPage() {
    const { t } = useTranslation()
    // const [contracts] = useState(mockContracts)
    const [contracts, setContracts] = useState<RentalContractViewRes[]>([])
    const [filters, setFilter] = useState({})

    const search = useSearchRentalContracts({
        onSuccess: (data) => setContracts(data)
    })

    const handleFilterChange = useCallback(
        async (filters: any) => {
            await search.mutateAsync(filters)
        },
        [search]
    )

    useEffect(() => {
        if (contracts.length === 0) {
            handleFilterChange({})
        }
    }, [])

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("staff.sidebar_contracts")}</p>
            </div>

            <div className="mb-4">
                <FilterContractStaff onFilterChange={() => setFilter(filters)} />
            </div>

            <TableContractStaff contracts={contracts} />
        </div>
    )
}

// useEffect(() => {
//     if (filters) {
//         console.log("[staff/contracts] filters sent to BE:", filters)
//     }
// }, [filters])
//loading={searchContractsMutation.isPending}
