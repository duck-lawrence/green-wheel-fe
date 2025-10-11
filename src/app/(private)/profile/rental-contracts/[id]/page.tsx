"use client"
import React from "react"
import { motion } from "framer-motion"
import { AccordionStyled, InputStyled, SectionStyled, TextareaStyled } from "@/components"
import {
    Car,
    IdentificationBadge,
    ClipboardText,
    ArrowsLeftRight,
    Invoice
} from "@phosphor-icons/react"
import { DatePicker } from "@heroui/react"
import { mockContracts } from "@/data/mockContracts"
import { InvoiceTypeLabels, RentalContractStatusLabels } from "@/constants/labels"
import { useDay } from "@/hooks"
import { renderInvoiceForm } from "@/components/shared/InvoiceForm/renderInvoiceForm"
import { InvoiceType } from "@/constants/enum"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useParams, useRouter } from "next/navigation"

export default function RentalContractPage() {
    // const { id } = useParams()
    // const modelId = id?.toString()

    const { toCalenderDateTime } = useDay()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    // data mẫu
    const dataContract = mockContracts.find((v) => v.id === "CON001")!
    const dateStart = dataContract.invoices.find((item) => item.type === InvoiceType.Handover)
        ?.paidAt!

    // render accordion
    const invoiceAccordion = dataContract.invoices.map((invoice) => ({
        key: invoice.id,
        ariaLabel: invoice.id,
        title: `${InvoiceTypeLabels[invoice.type]}`,
        status: invoice.status,
        content: renderInvoiceForm(invoice),
        // Check payment of refund
        // data: dataContract.invoices.find((v) => v.total === InvoiceType.Reservation)?.total ?? 0,
        invoice: invoice
    }))

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12"
            >
                {/* Header */}
                <div className="text-center space-y-3 mb-12">
                    <h1 className="text-4xl font-bold text-primary">Hợp đồng thuê xe</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Thông tin chi tiết về hợp đồng thuê xe điện của khách hàng.
                    </p>
                </div>
                {/* Group 1 - Vehicle Info */}
                <SectionStyled title="Thông tin hợp đồng thuê xe">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <p>Ngày thuê:{dateStart && formatDateTime({ date: dateStart })} </p>
                        </div>

                        <InputStyled
                            isReadOnly
                            label="Mã hợp đồng"
                            value={dataContract.id}
                            placeholder="INV-2025-0012"
                            startContent={
                                <Invoice size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                            // className="sm:col-span-2"
                        />
                        <InputStyled
                            isReadOnly
                            label="Trạng thái hợp đồng"
                            value={RentalContractStatusLabels[dataContract.status]}
                            placeholder="Đang hoạt động / Hoàn thành / Hủy"
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
                            label="Tên xe"
                            value={dataContract.vehicle.model.name}
                            placeholder="VinFast VF8"
                            startContent={
                                <Car size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label="Biển số"
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
                            label="Mô tả hợp đồng"
                            value={dataContract.description}
                            placeholder=". . . "
                            variant="bordered"
                            className="sm:col-span-2"
                        />
                    </div>
                </SectionStyled>

                {/* Group 3 - Rental Dates */}
                <SectionStyled title="Thời gian thuê">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DatePicker
                            value={toCalenderDateTime(dataContract.startDate)}
                            label="Ngày bắt đầu"
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.actualStartDate)}
                            label="Ngày thực tế bắt đầu"
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.endDate)}
                            label="Ngày kết thúc"
                            isReadOnly
                        />
                        <DatePicker
                            value={toCalenderDateTime(dataContract.actualEndDate)}
                            label="Ngày thực tế kết thúc"
                            isReadOnly
                        />
                    </div>
                </SectionStyled>

                {/* Group 4 - Staff Info */}
                <SectionStyled title="Nhân viên xử lý & Hóa đơn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputStyled
                            isReadOnly
                            label="Nhân viên bàn giao xe"
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
                            label="Nhân viên nhận xe"
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
                <SectionStyled title="Danh sách hóa đơn thanh toán">
                    <AccordionStyled items={invoiceAccordion} />
                </SectionStyled>
            </motion.div>
        </div>
    )
}
