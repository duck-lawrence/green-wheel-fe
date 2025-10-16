"use client"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import {
    InvoiceAccordion,
    InputStyled,
    renderInvoiceForm,
    SectionStyled,
    SpinnerStyled,
    TextareaStyled,
    DateTimeStyled,
    ButtonStyled,
    HandOverChecklistModal
} from "@/components"
import {
    Car,
    IdentificationBadge,
    ClipboardText,
    ArrowsLeftRight,
    Invoice
} from "@phosphor-icons/react"
import { InvoiceTypeLabels, RentalContractStatusLabels } from "@/constants/labels"
import {
    useCreateVehicleChecklist,
    useDay,
    useGetAllVehicleChecklists,
    useGetRentalContractById,
    useNumber,
    useUpdateContractStatus
} from "@/hooks"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { VehicleChecklistType } from "@/constants/enum"
import { Spinner, useDisclosure } from "@heroui/react"

export function RentalContractDetail({
    contractId,
    isStaff = false
}: {
    contractId: string
    isStaff?: boolean
}) {
    // const { id } = useParams()
    // const contractId = id?.toString()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const returnPath = pathName.startsWith("/dashboard")
        ? "/dashboard/rental-contracts"
        : "/rental-contracts"
    const router = useRouter()

    const { t } = useTranslation()
    const { toCalenderDateTime } = useDay()
    const { parseNumber } = useNumber()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const {
        isOpen: isHandoverChecklistOpen,
        onOpen: onHandoverChecklistOpen,
        onOpenChange: onHandoverChecklistOpenChange,
        onClose: onHandoverChecklistClose
    } = useDisclosure()

    const { data: dataContract, isLoading } = useGetRentalContractById({
        id: contractId,
        enabled: true
    })
    const updateContractStatus = useUpdateContractStatus()
    const { data: checklists } = useGetAllVehicleChecklists({
        query: {
            contractId
        }
    })

    const createAt = dataContract?.createdAt

    // render accordion
    const invoiceAccordion = (dataContract?.invoices || []).map((invoice) => ({
        key: invoice.id,
        ariaLabel: invoice.id,
        title: `${InvoiceTypeLabels[invoice.type]}`,
        status: invoice.status,
        content: renderInvoiceForm(invoice),
        invoice: invoice
    }))

    const hasRunUpdateRef = useRef(false)
    useEffect(() => {
        const resultCodeRaw = searchParams.get("resultCode")
        if (!resultCodeRaw || hasRunUpdateRef.current) return

        hasRunUpdateRef.current = true

        const resultCode = parseNumber(resultCodeRaw)

        const fn = async () => {
            if (resultCode === 0) {
                await updateContractStatus.mutateAsync({ id: contractId })
            } else {
                toast.error(t("failed.payment"))
            }
        }

        fn()
    }, [contractId, parseNumber, pathName, searchParams, t, updateContractStatus])

    //=======================================//

    const createVehicleChecklist = useCreateVehicleChecklist({})

    const handleCreateVehicleChecklist = useCallback(async () => {
        await createVehicleChecklist.mutateAsync({
            vehicleId: dataContract?.vehicle.id,
            contractId: dataContract?.id,
            type: VehicleChecklistType.Handover
        })
    }, [createVehicleChecklist, dataContract])

    const hanoverChecklist = useMemo(() => {
        return checklists?.find((item) => item.type === VehicleChecklistType.Handover)
    }, [checklists])

    console.log(hanoverChecklist)

    const handleOpenHanoverChecklist = useCallback(() => {
        if (!hanoverChecklist) return
        if (isStaff) {
            router.push(`/dashboard/vehicle-checklists/${hanoverChecklist.id}`)
        } else {
            onHandoverChecklistOpen()
        }
    }, [hanoverChecklist, isStaff, onHandoverChecklistOpen, router])

    //=======================================//
    if (isLoading || !dataContract)
        return (
            <div className="flex justify-center mt-65">
                <SpinnerStyled />
            </div>
        )

    return (
        <div className="relative min-h-screen flex items-center justify-center dark:bg-gray-950 px-0">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-6xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12"
            >
                <Link
                    className="absolute top-3 left-5 hover:cursor-pointer text-gray-500 italic"
                    href={returnPath}
                >
                    {t("rental_contract.back_to_rental_contract")}
                </Link>
                {/* Header */}
                <div className="text-center space-y-3 mb-12">
                    <h1 className="text-4xl font-bold text-primary">
                        {t("rental_contract.rental_contract")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t("rental_contract.rental_contract_details_description")}
                    </p>
                </div>
                {/* Vehicle Info */}
                <SectionStyled title={t("rental_contract.rental_contract_information")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <p>
                                {t("rental_contract.create_at")}
                                {": "}
                                {createAt && formatDateTime({ date: createAt })}
                            </p>
                        </div>

                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.contract_code")}
                            value={dataContract.id}
                            startContent={
                                <Invoice size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                            // className="sm:col-span-2"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.contract_status")}
                            value={RentalContractStatusLabels[dataContract.status]}
                            startContent={
                                <ClipboardText
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />

                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_name")}
                            value={dataContract.vehicle.model.name || ""}
                            placeholder="VinFast VF8"
                            startContent={
                                <Car size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.license_plate")}
                            value={dataContract.vehicle.licensePlate || ""}
                            startContent={
                                <IdentificationBadge
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                        <TextareaStyled
                            isReadOnly
                            label={t("rental_contract.contract_description")}
                            value={dataContract.description}
                            placeholder=". . . "
                            variant="bordered"
                            className="sm:col-span-2"
                        />
                    </div>
                </SectionStyled>

                {/*Rental Dates */}
                <SectionStyled title={t("rental_contract.rental_duration")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DateTimeStyled
                            value={toCalenderDateTime(dataContract.startDate)}
                            label={t("rental_contract.start_date")}
                            isReadOnly
                            endContent
                        />
                        <DateTimeStyled
                            value={toCalenderDateTime(dataContract.actualStartDate)}
                            label={t("rental_contract.actual_start_date")}
                            isReadOnly
                            endContent
                        />
                        <DateTimeStyled
                            value={toCalenderDateTime(dataContract.endDate)}
                            label={t("rental_contract.end_date")}
                            isReadOnly
                            endContent
                        />
                        <DateTimeStyled
                            value={toCalenderDateTime(dataContract.actualEndDate)}
                            label={t("rental_contract.actual_end_date")}
                            isReadOnly
                            endContent
                        />
                    </div>
                </SectionStyled>

                {/*Staff Info */}
                <SectionStyled title={t("rental_contract.staff")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_handover_staff")}
                            value={dataContract.handoverStaffId || ""}
                            startContent={
                                <ArrowsLeftRight
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_return_staff")}
                            value={dataContract.returnStaffId || ""}
                            startContent={
                                <ArrowsLeftRight
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                    </div>
                </SectionStyled>

                {/* Vehicle checklists */}
                <SectionStyled title={t("vehicle_checklist.vehicle_checklist")}>
                    <div className="flex gap-4">
                        {!hanoverChecklist ? (
                            isStaff && (
                                <ButtonStyled onPress={handleCreateVehicleChecklist}>
                                    {createVehicleChecklist.isPending ? (
                                        <Spinner />
                                    ) : (
                                        <div>{t("vehicle_checklist.create_handover")}</div>
                                    )}
                                </ButtonStyled>
                            )
                        ) : (
                            <>
                                <ButtonStyled onPress={handleOpenHanoverChecklist}>
                                    {createVehicleChecklist.isPending ? (
                                        <Spinner />
                                    ) : (
                                        <div>{t("vehicle_checklist.view_handover")}</div>
                                    )}
                                </ButtonStyled>
                                <HandOverChecklistModal
                                    id={hanoverChecklist.id}
                                    isOpen={isHandoverChecklistOpen}
                                    onOpenChange={onHandoverChecklistOpenChange}
                                    onClose={onHandoverChecklistClose}
                                />
                            </>
                        )}
                    </div>
                </SectionStyled>

                {/* Invoice Accordion  isLoading={isFetching}*/}
                <SectionStyled title={t("rental_contract.payment_invoice_list")}>
                    <InvoiceAccordion
                        items={invoiceAccordion}
                        contractStatus={dataContract.status}
                    />
                </SectionStyled>
            </motion.div>
        </div>
    )
}
