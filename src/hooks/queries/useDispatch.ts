import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { DispatchQueryParams } from "@/models/dispatch/schema/request"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import { dispatchApi } from "@/services/dispathApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export const useCreateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dispatchApi.create,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.DISPATCH_REQUESTS,
                exact: false
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("dispatch.create_success"),
                color: "success"
            })
            router.push("/dashboard/dispatchs")
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useUpdateDispatch = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    // const router = useRouter()

    return useMutation({
        mutationFn: dispatchApi.updateStatus,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.DISPATCH_REQUESTS,
                exact: false
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("dispatch.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useGetAllDispatch = ({
    params,
    enabled = true
}: {
    params: DispatchQueryParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS, params],
        queryFn: () => dispatchApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<DispatchViewRes[]>([
                ...QUERY_KEYS.DISPATCH_REQUESTS,
                params
            ])
        },
        enabled
    })
    return query
}

export const useGetDispatchById = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
    // const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.DISPATCH_REQUESTS, id],
        queryFn: () => dispatchApi.getById(id),

        enabled
    })
    return query
}
