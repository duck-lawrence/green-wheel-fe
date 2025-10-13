"use client"
import React from "react"
import { motion } from "framer-motion"
import {
    AccordionStyled,
    InputStyled,
    renderInvoiceForm,
    SectionStyled,
    SpinnerStyled,
    TextareaStyled
} from "@/components"
import {
    Car,
    IdentificationBadge,
    ClipboardText,
    ArrowsLeftRight,
    Invoice
} from "@phosphor-icons/react"
import { DatePicker } from "@heroui/react"
import { InvoiceTypeLabels, RentalContractStatusLabels } from "@/constants/labels"
import { useDay, useGetByIdRentalContract } from "@/hooks"
import { InvoiceType } from "@/constants/enum"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function RentalContractPage() {
    const { id } = useParams()
    const modelId = id?.toString()

    const { t } = useTranslation()
    const { toCalenderDateTime } = useDay()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const { data: dataContract, isLoading } = useGetByIdRentalContract({
        id: modelId ?? "",
        enabled: true
    })

    // data mẫu
    // const dataContract = mockContracts.find((v) => v.id === "CON001")!
    const dateStart = dataContract?.invoices.find((item) => item.type === InvoiceType.Handover)
        ?.paidAt!

    // render accordion
    const invoiceAccordion = (dataContract?.invoices || []).map((invoice) => ({
        key: invoice.id,
        ariaLabel: invoice.id,
        title: `${InvoiceTypeLabels[invoice.type]}`,
        status: invoice.status,
        content: renderInvoiceForm(invoice),
        invoice: invoice
    }))

    if (isLoading || !dataContract)
        return (
            <div className="flex justify-center mt-65">
                <SpinnerStyled />
            </div>
        )

    return (
        <div className="relative min-h-screen flex items-center justify-center dark:bg-gray-950 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-6xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12"
            >
                <Link
                    className="absolute top-3 left-5 hover:cursor-pointer text-gray-500 italic"
                    href={"/rental-contracts"}
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
                                {t("rental_contract.rental_date")}:
                                {dateStart && formatDateTime({ date: dateStart })}{" "}
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
                            value={dataContract.vehicle.model.name}
                            placeholder="VinFast VF8"
                            startContent={
                                <Car size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.license_plate")}
                            value={dataContract.vehicle.licensePlate}
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
                        <DatePicker
                            value={toCalenderDateTime(dataContract.startDate)}
                            label={t("rental_contract.start_date")}
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.actualStartDate)}
                            label={t("rental_contract.actual_start_date")}
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.endDate)}
                            label={t("rental_contract.end_date")}
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.actualEndDate)}
                            label={t("rental_contract.actual_end_date")}
                            isReadOnly
                        />
                    </div>
                </SectionStyled>

                {/*Staff Info */}
                <SectionStyled title={t("rental_contract.staff_and_invoice")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_handover_staff")}
                            value={dataContract.handoverStaffId}
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
                            value={dataContract.returnStaffId}
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

                {/* Invoice Accordion */}
                <SectionStyled title={t("rental_contract.payment_invoice_list")}>
                    <AccordionStyled items={invoiceAccordion} />
                </SectionStyled>
            </motion.div>
        </div>
    )
}
