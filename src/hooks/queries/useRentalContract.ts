import { RentalContractStatus, VehicleIssueResolutionOption } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { PaginationParams } from "@/models/common/request"
import { BackendError, PageResult } from "@/models/common/response"
import {
    ConfirmContractReq,
    ContractQueryParams,
    HandoverContractReq
} from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { rentalContractApi } from "@/services/rentalContractApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"

import { useTranslation } from "react-i18next"

export const useInvalidateContractQueries = () => {
    const queryClient = useQueryClient()

    const invalidateById = async (id: string) => {
        await queryClient.invalidateQueries({
            queryKey: [...QUERY_KEYS.RENTAL_CONTRACTS, id]
        })
    }
    return { invalidateById }
}

export const useCreateRentalContract = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const router = useRouter()

    return useMutation({
        mutationFn: rentalContractApi.create,
        onSuccess: () => {
            router.push("/rental-contracts")
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("contral_form.wait_for_confirm"),
                color: "success"
            })
            onSuccess?.()
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

export const useCreateContractManual = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: rentalContractApi.createManual,
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
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
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

export const useGetAllRentalContracts = ({
    params = {},
    pagination = {},
    enabled = true
}: {
    params: ContractQueryParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.RENTAL_CONTRACTS, params, pagination]

    return useQuery({
        queryKey: key,
        queryFn: async () => await rentalContractApi.getAll({ query: params, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<RentalContractViewRes>>(key)
        },
        enabled
    })
}

export const useGetMyContracts = ({
    status,
    pagination = {},
    enabled = true
}: {
    status?: RentalContractStatus
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_SEGMENTS, ...QUERY_KEYS.ME, status, pagination],
        queryFn: () => rentalContractApi.getMyContract({ status, pagination }),
        enabled
    })
    return query
}

// export const useConfirmContract = ({
//     params,
//     pagination = {},
//     onSuccess
// }: {
//     params: ContractQueryParams
//     pagination: PaginationParams
//     onSuccess?: () => void
// }) => {
//     const { t } = useTranslation()
//     const queryClient = useQueryClient()
//     const key = [...QUERY_KEYS.RENTAL_CONTRACTS, params, pagination]

//     const acceptContract = useMutation({
//         mutationFn: async ({ id }: { id: string }) => {
//             await rentalContractApi.acceptContract({ id })
//         },

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: key })
//             onSuccess?.()
//             toast.success(t("rental_contract.update_success"))
//         },

//         onError: (error: BackendError) => {
//             toast.error(
//                 translateWithFallback(t, error.detail) || t("rental_contract.update_failed")
//             )
//         }
//     })

//     const rejectContract = useMutation({
//         mutationFn: async ({ id, vehicalStatus }: { id: string; vehicalStatus: VehicleStatus }) => {
//             await rentalContractApi.rejectContract({ id, vehicalStatus })
//         },

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: key })
//             onSuccess?.()
//             toast.success(t("rental_contract.update_success"))
//         },

//         onError: (error: BackendError) => {
//             toast.error(
//                 translateWithFallback(t, error.detail) || t("rental_contract.update_failed")
//             )
//         }
//     })

//     return { acceptContract, rejectContract }
// }

export const useConfirmContract = ({
    params,
    pagination = {},
    onSuccess
}: {
    params: ContractQueryParams
    pagination: PaginationParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.RENTAL_CONTRACTS, params, pagination]
    return useMutation({
        mutationFn: async ({ id, req }: { id: string; req: ConfirmContractReq }) => {
            await rentalContractApi.confirmContract({ id, req })
        },
        onSuccess: () => {
            onSuccess?.()
            queryClient.invalidateQueries({ queryKey: key })
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

export const useUpdateContractStatus = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const { t } = useTranslation()
    const pathName = usePathname()
    const router = useRouter()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            await rentalContractApi.updateContractStatus({ id })
            await invalidateById(id)
        },
        onSuccess: () => {
            router.replace(pathName)
            onSuccess?.()
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

export const useHandoverContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async ({ req }: { req: HandoverContractReq }) => {
            await rentalContractApi.handover({ id, req })
        },
        onSuccess: async () => {
            await invalidateById(id)
            onSuccess?.()
            // toast.success(t("success.handover"))
            addToast({
                title: t("toast.success"),
                description: t("success.handover"),
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

export const useReturnContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        // mutationFn: rentalContractApi.return,
        mutationFn: async () => {
            await rentalContractApi.return({ id })
        },
        onSuccess: async () => {
            await invalidateById(id)
            onSuccess?.()
            // toast.success(t("success.return"))
            addToast({
                title: t("toast.success"),
                description: t("success.return"),
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

export const useCancelContract = ({ id, onSuccess }: { id: string; onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async () => {
            await rentalContractApi.cancel({ id })
        },
        onSuccess: async () => {
            await invalidateById(id)
            onSuccess?.()
            // toast.success(t("success.cancel"))
            addToast({
                title: t("toast.success"),
                description: t("success.cancel"),
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

export const useChangeVehicleByContractId = ({
    id,
    onSuccess
}: {
    id: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async () => {
            await rentalContractApi.changeVehicle({ id })
        },
        onSuccess: async () => {
            await invalidateById(id)
            onSuccess?.()
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

export const useConfirmChangeVehicle = ({
    id,
    onSuccess
}: {
    id: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async ({
            req
        }: {
            req: { resolutionOption: VehicleIssueResolutionOption }
        }) => {
            await rentalContractApi.confirmChangeVehicle({ id, req })
        },
        onSuccess: async () => {
            await invalidateById(id)
            onSuccess?.()
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
