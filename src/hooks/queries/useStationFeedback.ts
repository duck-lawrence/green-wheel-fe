import { BackendError } from "@/models/common/response"
import { stationFeedbackApi } from "@/services/stationFeedBackApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useCreateFeedback = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: stationFeedbackApi.create,
        onSuccess: () => {
            toast.success(t("reaview.create"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
