import { QUERY_KEYS } from "@/constants/queryKey"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { StationFeedbackParams } from "@/models/station-feedback/schema/request"
import { stationFeedbackApi } from "@/services/stationFeedBackApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useCreateFeedback = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: stationFeedbackApi.create,
        onSuccess: () => {
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("review.create_successfull"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useGetAllFeedbacks = ({
    filter,
    pagination = {},
    enabled = true
}: {
    filter: StationFeedbackParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.STATION_FEEDBACKS, filter, pagination],
        queryFn: async () => await stationFeedbackApi.getAll({ query: filter, pagination }),
        enabled
    })
    return query
}

export const useDeleteFeedback = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: stationFeedbackApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.STATION_FEEDBACKS,
                exact: false
            })
            addToast({
                title: t("toast.success"),
                description: t("review.delete_successfull"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
