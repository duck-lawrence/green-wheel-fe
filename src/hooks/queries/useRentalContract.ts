import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { ContractQueryParams, HandoverContractReq } from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { rentalContractApi } from "@/services/rentalContractApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"

import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

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

export const useCreateContractManual = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.createManual,
        onSuccess: () => {
            toast.success(t("success.create"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllRentalContract = ({
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

export const useGetRentalContractById = ({
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

export const useGetMyContracts = ({
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

export const useConfirmContract = ({
    params,
    onSuccess
}: {
    params: ContractQueryParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const acceptContract = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            await rentalContractApi.acceptContract({ id })
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, params] })
            onSuccess?.()
            toast.success(t("rental_contract.update_success"))
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
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, params] })
            onSuccess?.()
            toast.success(t("rental_contract.update_success"))
        },

        onError: (error: BackendError) => {
            toast.error(
                translateWithFallback(t, error.detail) || t("rental_contract.update_failed")
            )
        }
    })

    return { acceptContract, rejectContract }
}

export const useGetAllRentalContracts = ({
    params = {},
    enabled = true
}: {
    params: ContractQueryParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    // const key = [...QUERY_KEYS.RENTAL_CONTRACTS, params]

    return useQuery({
        queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, params],
        queryFn: async () => await rentalContractApi.getAll(params),
        initialData: () => {
            return queryClient.getQueryData<RentalContractViewRes[]>(QUERY_KEYS.RENTAL_CONTRACTS)
        },
        enabled
    })

    // const getCachedOrFetch = async (params: ContractQueryParams) => {
    //     const key = [...QUERY_KEYS.RENTAL_CONTRACTS, params]
    //     const cached = queryClient.getQueryData<RentalContractViewRes[]>(key)
    //     if (cached) return cached
    //     const data = await queryClient.fetchQuery({
    //         queryKey: key,
    //         queryFn: () => rentalContractApi.getAll(params)
    //     })
    //     return data
    // }

    // return { ...query, getCachedOrFetch }
}

export const useUpdateContractStatus = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const { t } = useTranslation()
    const pathName = usePathname()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            await rentalContractApi.updateContractStatus({ id })
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id] })
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

export const useHandoverContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ req }: { req: HandoverContractReq }) => {
            await rentalContractApi.handover({ id, req })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id] })
            onSuccess?.()
            toast.success(t("success.handover"))
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useReturnContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        // mutationFn: rentalContractApi.return,
        mutationFn: async () => {
            await rentalContractApi.return({ id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id] })
            onSuccess?.()
            toast.success(t("success.return"))
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useCancelContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await rentalContractApi.cancel({ id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id] })
            onSuccess?.()
            toast.success(t("success.cancel"))
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
