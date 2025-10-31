import { AlertStyled, ButtonStyled, CheckboxStyled, DropdownStyled } from "@/components/styled"
import { RentalContractStatus, VehicleIssueResolutionOption } from "@/constants/enum"
import { VehicleStatusLabels } from "@/constants/labels"
import {
    useCancelContract,
    useConfirmChangeVehicle,
    useConfirmContract,
    useReturnContract
} from "@/hooks"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { ConfirmContractReq, HandoverContractReq } from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@heroui/react"
import { useFormik } from "formik"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

interface BottomActionButtonsProps {
    isStaff: boolean
    isCustomer: boolean
    isReturnChecked: boolean
    setIsReturnChecked: React.Dispatch<React.SetStateAction<boolean>>
    contract: RentalContractViewRes
    handoverFormik: ReturnType<typeof useFormik<HandoverContractReq>>
    hanoverChecklist: VehicleChecklistViewRes | undefined
}

export function BottomActionButtons({
    isStaff,
    isCustomer,
    isReturnChecked,
    setIsReturnChecked,
    contract,
    handoverFormik,
    hanoverChecklist
}: BottomActionButtonsProps) {
    const { t } = useTranslation()

    // ======================================= //
    // Confirm
    // ======================================= //
    const confirmContract = useConfirmContract({ id: contract.id })
    const handleConfirm = useCallback(
        (id: string, req: ConfirmContractReq) => {
            confirmContract.mutateAsync({ id, req })
        },
        [confirmContract]
    )

    // ======================================= //
    // Return
    // ======================================= //
    const returnMutation = useReturnContract({ id: contract.id })
    const handleReturn = useCallback(async () => {
        await returnMutation.mutateAsync()
    }, [returnMutation])

    // ======================================= //
    // Cancel
    // ======================================= //
    const cancelMutation = useCancelContract({ id: contract.id })
    const handleCancel = useCallback(async () => {
        await cancelMutation.mutateAsync()
    }, [cancelMutation])

    // ====================================== //
    // Customer confirm change vehicle
    // ====================================== //
    const confirmChangeVehicle = useConfirmChangeVehicle({ id: contract.id })
    const handleConfirmChangeVehicle = useCallback(
        async (resolutionOption: VehicleIssueResolutionOption) => {
            await confirmChangeVehicle.mutateAsync({ req: { resolutionOption } })
        },
        [confirmChangeVehicle]
    )

    return (
        <>
            {/* STAFF */}
            {isStaff && (
                <>
                    {/* Khi contract đang Request Pending */}
                    {confirmContract.isPending && <Spinner />}
                    {!confirmContract.isPending &&
                        contract.status === RentalContractStatus.RequestPending && (
                            <div className="flex flex-wrap justify-center gap-2">
                                <ButtonStyled
                                    color="primary"
                                    variant="ghost"
                                    className="py-2 px-4"
                                    onPress={() => {
                                        handleConfirm(contract.id, { hasVehicle: true })
                                    }}
                                >
                                    {t("rental_contract.accept")}
                                </ButtonStyled>

                                {/* Reject */}
                                <DropdownStyled placement="bottom-end">
                                    <DropdownTrigger>
                                        <ButtonStyled
                                            color="danger"
                                            variant="ghost"
                                            className="py-2 px-4"
                                        >
                                            {t("rental_contract.reject")}
                                        </ButtonStyled>
                                    </DropdownTrigger>

                                    <DropdownMenu
                                        onAction={(key) => {
                                            const selected = Number(key)
                                            handleConfirm(contract.id, {
                                                hasVehicle: false,
                                                vehicleStatus: selected
                                            })
                                        }}
                                    >
                                        {Object.entries(VehicleStatusLabels).map(([key, label]) => (
                                            <DropdownItem key={key}>{label}</DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </DropdownStyled>
                            </div>
                        )}

                    {/* Khi chưa bắt đầu và contract đang Active */}
                    {!contract.actualStartDate &&
                        contract.status === RentalContractStatus.Active && (
                            <ButtonStyled
                                variant="bordered"
                                color="primary"
                                className="hover:text-white hover:bg-primary"
                                isDisabled={
                                    !handoverFormik.isValid ||
                                    handoverFormik.isSubmitting ||
                                    !hanoverChecklist
                                }
                                onPress={() => handoverFormik.handleSubmit()}
                            >
                                {handoverFormik.isSubmitting ? (
                                    <Spinner />
                                ) : (
                                    t("rental_contract.handover")
                                )}
                            </ButtonStyled>
                        )}

                    {/* Khi contract đã Active và có thể trả xe */}
                    {contract.actualStartDate &&
                        contract.status === RentalContractStatus.Active && (
                            <div className="flex flex-col items-center gap-2">
                                <CheckboxStyled
                                    checked={isReturnChecked}
                                    onChange={(e) => setIsReturnChecked(e.target.checked)}
                                >
                                    {t("rental_contract.return_comfirm")}
                                </CheckboxStyled>

                                <ButtonStyled
                                    variant="bordered"
                                    color="primary"
                                    className="hover:text-white hover:bg-primary"
                                    isDisabled={!isReturnChecked || returnMutation.isPending}
                                    onPress={handleReturn}
                                >
                                    {returnMutation.isPending ? (
                                        <Spinner />
                                    ) : (
                                        t("rental_contract.return")
                                    )}
                                </ButtonStyled>
                            </div>
                        )}
                </>
            )}

            {/* CUSTOMER */}
            {isCustomer && (
                <>
                    {/* Pending -> Có thể cancel */}
                    {(contract.status === RentalContractStatus.RequestPending ||
                        contract.status === RentalContractStatus.PaymentPending) && (
                        <ButtonStyled
                            variant="ghost"
                            color="primary"
                            isDisabled={cancelMutation.isPending}
                            onPress={handleCancel}
                        >
                            {cancelMutation.isPending ? <Spinner /> : t("rental_contract.cancel")}
                        </ButtonStyled>
                    )}

                    {/* Đang xử lý xác nhận đổi/hoàn xe */}
                    {confirmChangeVehicle.isPending && <Spinner />}

                    {/* Xe không khả dụng */}
                    {contract.status === RentalContractStatus.UnavailableVehicle &&
                        !confirmChangeVehicle.isPending && (
                            <div>
                                <div className="flex gap-2 justify-center items-center mb-3">
                                    {contract.vehicle && (
                                        <ButtonStyled
                                            variant="ghost"
                                            color="primary"
                                            isDisabled={confirmChangeVehicle.isPending}
                                            onPress={() =>
                                                handleConfirmChangeVehicle(
                                                    VehicleIssueResolutionOption.ChangeVehicle
                                                )
                                            }
                                        >
                                            {t("enum.change_vehicle")}
                                        </ButtonStyled>
                                    )}

                                    <ButtonStyled
                                        isDisabled={confirmChangeVehicle.isPending}
                                        onPress={() =>
                                            handleConfirmChangeVehicle(
                                                VehicleIssueResolutionOption.Refund
                                            )
                                        }
                                    >
                                        {t("enum.refund")}
                                    </ButtonStyled>
                                </div>

                                <AlertStyled
                                    hideIcon
                                    color="warning"
                                    className="whitespace-pre-line max-w-full"
                                >
                                    {contract.vehicle
                                        ? t("rental_contract.confirm_change_vehicle")
                                        : t("rental_contract.unavailable_vehicle_refund")}
                                </AlertStyled>
                            </div>
                        )}
                </>
            )}
        </>
    )
}
