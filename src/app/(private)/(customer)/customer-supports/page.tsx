"use client"

import {
    ButtonIconStyled,
    CreateTicketModal,
    EnumPicker,
    PaginationStyled,
    TicketCard
} from "@/components"
import { TicketStatus, TicketType } from "@/constants/enum"
import { TicketStatusLabels } from "@/constants/labels"
import { useGetMyTickets } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { Spinner, useDisclosure } from "@heroui/react"
import { Plus } from "lucide-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export default function CustomerSupportsPage() {
    const { t } = useTranslation()
    const [filters, setFilter] = useState<{ status?: TicketStatus }>({})
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const { data, isLoading, error, refetch } = useGetMyTickets({
        status: filters.status,
        pagination
    })

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    // check error
    useEffect(() => {
        if (error) {
            const backendErr = error as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [error, t])

    return (
        <div className="py-8 px-6 md:px-12 md:min-w-[75rem] max-w-[75rem] shadow-2xs rounded-2xl bg-white text-center">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("ticket.customer_support")}</p>
            </div>

            <div className="mb-3 flex gap-3 items-center">
                <EnumPicker
                    label={t("table.status")}
                    labels={TicketStatusLabels}
                    value={filters.status}
                    onChange={async (key) => {
                        setFilter({
                            status: key == null ? undefined : (key as TicketStatus)
                        })
                        await refetch()
                        setPagination((prev) => {
                            return {
                                ...prev,
                                pageNumber: 1
                            }
                        })
                    }}
                    className="max-w-48"
                />
                <ButtonIconStyled
                    isLoading={isLoading}
                    className="btn-gradient rounded-lg"
                    onPress={onOpen}
                >
                    <Plus />
                </ButtonIconStyled>
                <CreateTicketModal
                    status={filters.status}
                    pagination={pagination}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    type={TicketType.CustomerSupport}
                />
            </div>

            {isLoading ? (
                <Spinner className="md:min-w-[60rem]" />
            ) : (
                <div className="flex flex-wrap gap-6">
                    {(data?.items ?? []).map((item) => (
                        <TicketCard key={item.id} isStaff={false} ticket={item} />
                    ))}
                </div>
            )}
            <div className="mt-6 flex justify-center">
                <PaginationStyled
                    page={data?.pageNumber ?? 1}
                    total={data?.totalPages ?? 10}
                    onChange={(page: number) =>
                        setPagination((prev) => {
                            return {
                                ...prev,
                                pageNumber: page
                            }
                        })
                    }
                    showControls
                />
            </div>
        </div>
    )
}
