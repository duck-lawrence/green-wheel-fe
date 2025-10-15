import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { rentalContractApi } from "@/services/rentalContractApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"

import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useGetAllRentalContract = ({
    params,
    enabled = true
}: {
    params: ContractQueryParams
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

export const useGetMyContract = ({
    status,
    enabled = true
}: {
    status?: RentalContractStatus
    enabled?: boolean
}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS, ...QUERY_KEYS.ME, status],
        queryFn: () => rentalContractApi.getMyContract({ status }),
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
            toast.success(t("rental_contract.update_success"))
            queryClient.invalidateQueries({ queryKey: ["rental-contracts"] })
        },

        onError: (error: BackendError) => {
            toast.error(
                translateWithFallback(t, error.detail) || t("rental_contract.update_failed")
            )
        }
    })

    const rejectContract = useMutation({
        mutationFn: async ({ id, vehicalStatus }: { id: string; vehicalStatus: VehicleStatus }) => {
            await rentalContractApi.rejectContract({ id, vehicalStatus })
        },

        onSuccess: () => {
            onSuccess?.()
            toast.success(t("rental_contract.update_success"))
            queryClient.invalidateQueries({ queryKey: ["rental-contracts"] })
        },

        onError: (error: BackendError) => {
            toast.error(
                translateWithFallback(t, error.detail) || t("rental_contract.update_failed")
            )
        }
    })

    return { acceptContract, rejectContract }
}

export const useSearchRentalContracts = ({
    params,
    enabled = true
}: {
    params: ContractQueryParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, params],
        queryFn: () => rentalContractApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<RentalContractViewRes[]>([
                ...QUERY_KEYS.RENTAL_CONTRACTS,
                params
            ])
        },
        enabled
    })
    return query
}

export const useGetByIdRentalContract = ({
    id,
    enabled = true
}: {
    id: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id],
        queryFn: () => rentalContractApi.getById(id),
        initialData: () => {
            return queryClient.getQueryData<RentalContractViewRes>([
                ...QUERY_KEYS.RENTAL_CONTRACTS,
                id
            ])
        },
        enabled
    })
    return query
}

export const useUpdateContractStatus = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const { t } = useTranslation()
    const pathName = usePathname()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            await rentalContractApi.updateContractStatus({ id })
            queryClient.refetchQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id] })
        },
        onSuccess: () => {
            router.replace(pathName)
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useCreateContractOffline = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.createOffline,
        onSuccess: () => {
            toast.success(t("success.create"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useHandoverContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.handover,
        onSuccess: () => {
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useReturnContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.return,
        onSuccess: (data) => {
            console.log("Invoice id: " + data.returnInvoiceId)
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useCancelContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.cancel,
        onSuccess: () => {
            toast.success(t("success.cancel"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
