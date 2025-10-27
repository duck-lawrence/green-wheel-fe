import { AlertStyled, ButtonStyled, CheckboxStyled } from "@/components/styled"
import { RentalContractStatus, VehicleIssueResolutionOption } from "@/constants/enum"
import { useCancelContract, useConfirmChangeVehicle, useReturnContract } from "@/hooks"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { HandoverContractReq } from "@/models/rental-contract/schema/request"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { Spinner } from "@heroui/react"
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

    //======================================= //
    // Return
    //======================================= //
    const returnMutation = useReturnContract({ id: contract.id })
    const handleReturn = useCallback(async () => {
        await returnMutation.mutateAsync()
    }, [returnMutation])

    //======================================= //
    // Cancel
    //======================================= //
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
                                    color="success"
                                    className="whitespace-pre-line"
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
