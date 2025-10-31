import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { stationFeedbackApi } from "@/services/stationFeedBackApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useCreateFeedback = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: stationFeedbackApi.create,
        onSuccess: () => {
            onSuccess?.()
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.STATION_FEEDBACKS
            })
            addToast({
                title: t("toast.success"),
                description: t("review.create_successfull"),
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

export const useGetAllFeedback = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: QUERY_KEYS.STATION_FEEDBACKS,
        queryFn: stationFeedbackApi.getAll,
        enabled,
        refetchOnWindowFocus: true
    })
    return query
}

export const useDeleteFeedback = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: stationFeedbackApi.delete,
        onSuccess: () => {
            addToast({
                title: t("toast.success"),
                description: t("review.delete_successfull"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.STATION_FEEDBACKS
            })
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
