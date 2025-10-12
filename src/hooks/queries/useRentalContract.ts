import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { CitizenIdentityRes } from "@/models/citizen-identity/schema/response"
import { BackendError } from "@/models/common/response"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { rentalContractApi } from "@/services/rentalContractApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetAllRentalContract = ({
    params,
    enabled = true
}: {
    params: { phone?: string; status?: RentalContractStatus }
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS, params],
        queryFn: () => rentalContractApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<RentalContractViewRes[]>([
                ...QUERY_KEYS.VEHICLE_SEGMENTS,
                params
            ])
        },
        enabled
    })
    return query
}

export const useCreateRentalContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.create,
        onSuccess: () => {
            toast.success(t("contral_form.wait_for_confirm"), {
                position: "top-center",
                duration: 5000
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useConfirmContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const acceptContract = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            await rentalContractApi.acceptContract({ id })
        },

        onSuccess: () => {
            onSuccess?.()
            toast.success(t("contract.update_success"))
            queryClient.invalidateQueries({ queryKey: ["rental-contracts"] })
            if (onSuccess) onSuccess()
        },

        onError: (error: BackendError) => {
            toast.error(
                translateWithFallback(t, error.detail) ||
                    t("contract.update_failed") ||
                    "Failed to update contract status!"
            )
        }
    })

    const rejectContract = useMutation({
        mutationFn: async ({ id, vehicalStatus }: { id: string; vehicalStatus: VehicleStatus }) => {
            await rentalContractApi.rejectContract({ id, vehicalStatus })
        },

        onSuccess: () => {
            onSuccess?.()
            toast.success(t("contract.update_success"))
            queryClient.invalidateQueries({ queryKey: ["rental-contracts"] })
            if (onSuccess) onSuccess()
        },

        onError: (error: BackendError) => {
            toast.error(
                translateWithFallback(t, error.detail) ||
                    t("contract.update_failed") ||
                    "Failed to update contract status!"
            )
        }
    })

    return { acceptContract, rejectContract }
}

export const useSearchRentalContracts = ({
    onSuccess
}: {
    onSuccess?: (data: RentalContractViewRes[]) => void
}) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: async (filters: {
            status?: RentalContractStatus
            phone?: string
            citizenIdentity?: CitizenIdentityRes
            driverLicense?: string
        }) => {
            const res = await rentalContractApi.getAll(filters)
            return res
        },

        onSuccess: (data) => {
            onSuccess?.(data)
            toast.success(t("staff.search_success"))
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail) || t("staff.search_failed"))
        }
    })
}
