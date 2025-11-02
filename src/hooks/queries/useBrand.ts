import { QUERY_KEYS } from "@/constants/queryKey"
import { BrandReq } from "@/models/brand/schema/request"
import { BackendError } from "@/models/common/response"
import { brandApi } from "@/services/brandApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useGetAllBrandes = () => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.BRANCHS],
        queryFn: brandApi.getAll
    })
    return query
}

export const useGetBrandById = (id: string, enabled = true) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.BRANCHS, id],
        queryFn: () => brandApi.getById(id),
        enabled
    })
    return query
}

export const useCreateBrand = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: brandApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.BRANCHS] })
            addToast({
                title: t("toast.success"),
                description: t("toast.create_success"),
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

export const useUpdateBrand = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: BrandReq }) =>
            await brandApi.update(id, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.BRANCHS] })
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
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
