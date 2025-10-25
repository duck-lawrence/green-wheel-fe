import { TicketStatus } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { PaginationParams } from "@/models/common/request"
import { BackendError, PageResult } from "@/models/common/response"
import { TicketViewRes } from "@/models/ticket/schema/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { ticketApi } from "@/services/ticketApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useCreateTicket = ({
    status,
    pagination = {},
    onSuccess
}: {
    status?: TicketStatus
    pagination?: PaginationParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, ...QUERY_KEYS.ME, status, pagination]

    return useMutation({
        mutationFn: ticketApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: key })
            toast.success(t("success.create"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllTickets = ({
    query = {},
    pagination = {},
    enabled = true
}: {
    query: TicketFilterParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, query, pagination]

    return useQuery({
        queryKey: key,
        queryFn: async () => await ticketApi.getAll({ query, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<TicketViewRes>>(key)
        },
        enabled
    })
}

export const useGetMyTickets = ({
    status,
    pagination = {},
    enabled = true
}: {
    status?: TicketStatus
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, ...QUERY_KEYS.ME, status, pagination]

    return useQuery({
        queryKey: key,
        queryFn: async () => await ticketApi.getMyTickets({ status, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<TicketViewRes>>(key)
        },
        enabled
    })
}

export const useUpdateTicket = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: ticketApi.update,
        onSuccess: () => {
            toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useEscalateTicketToAdmin = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: ticketApi.escalateToAdmin,
        onSuccess: () => {
            toast.success(t("success.update"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
