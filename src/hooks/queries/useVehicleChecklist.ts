import { QUERY_KEYS } from "@/constants/queryKey"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { BackendError } from "@/models/common/response"
import { vehicleChecklistsApi } from "@/services/vehicleChecklistsApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetByIdVehicleChecklist = ({
    id,
    enabled = true
}: {
    id: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, id],
        queryFn: () => vehicleChecklistsApi.getById(id),
        initialData: () => {
            return queryClient.getQueryData<VehicleChecklistViewRes>([
                ...QUERY_KEYS.VEHICLE_CHECKLISTS,
                id
            ])
        },
        enabled
    })
    return query
}

export const useCreateVehicleChecklist = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()
    return useMutation({
        mutationFn: vehicleChecklistsApi.create,
        onSuccess: ({ id }) => {
            toast.success(t("contral_form.wait_for_confirm"), {
                duration: 5000
            })
            router.push(`/dashboard/vehicle-checklists/${id}`)
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
