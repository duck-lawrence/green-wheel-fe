"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
    AlertStyled,
    InvoiceAccordion,
    InputStyled,
    renderInvoiceForm,
    SectionStyled,
    SpinnerStyled,
    TextareaStyled,
    DateTimeStyled,
    SignatureSection
} from "@/components"
import {
    useDay,
    useGetAllVehicleChecklists,
    useGetRentalContractById,
    useHandoverContract,
    useName,
    useNumber,
    useTokenStore,
    useUpdateContractStatus
} from "@/hooks"
import {
    Car,
    IdentificationBadge,
    ClipboardText,
    ArrowsLeftRight,
    Invoice
} from "@phosphor-icons/react"
import { InvoiceTypeLabels, RentalContractStatusLabels } from "@/constants/labels"

import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import * as Yup from "yup"
import { decodeJwt } from "@/utils/helpers/jwt"
import { InvoiceType, RentalContractStatus, VehicleChecklistType } from "@/constants/enum"
import { ChecklistSection } from "./ChecklistSection"
import { CreateInvoiceSection } from "./CreateInvoiceSection"
import { HandoverContractReq } from "@/models/rental-contract/schema/request"
import { BottomActionButtons } from "./BottomActionButtons"

export function RentalContractDetail({
    contractId,
    isCustomer = false,
    isStaff = false
}: {
    contractId: string
    isCustomer?: boolean
    isStaff?: boolean
}) {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const returnPath = pathName.startsWith("/dashboard")
        ? "/dashboard/rental-contracts"
        : "/rental-contracts"
    const router = useRouter()

    const { t } = useTranslation()
    const { toZonedDateTime } = useDay()
    const { parseNumber } = useNumber()
    const { toFullName } = useName()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const [isReturnChecked, setIsReturnChecked] = useState(false)

    const payload = decodeJwt(useTokenStore((s) => s.accessToken!))
    const { data: contract, isLoading } = useGetRentalContractById({
        id: contractId,
        enabled: true
    })
    const updateContractStatus = useUpdateContractStatus()

    // check owner if customer
    useEffect(() => {
        if (!contract || !payload.sid) return
        if (!isStaff && payload.sid != contract?.customer.id) {
            router.push("/")
            toast.error(t("user.unauthorized"))
        }
    }, [contract, isStaff, payload.sid, router, t])

    //======================================= //
    // Invoice accordion
    //======================================= //
    const invoiceAccordion = (contract?.invoices || []).map((invoice) => ({
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

    //======================================= //
    // Checklist
    //======================================= //
    const { data: checklists } = useGetAllVehicleChecklists({
        query: {
            contractId
        }
    })
    const hanoverChecklist = useMemo(() => {
        return checklists?.find((item) => item.type === VehicleChecklistType.Handover)
    }, [checklists])
    const returnChecklist = useMemo(() => {
        return checklists?.find((item) => item.type === VehicleChecklistType.Return)
    }, [checklists])

    //======================================= //
    // Handover
    //======================================= //
    const handoverMutation = useHandoverContract({ id: contractId })
    const handoverInitValue = useMemo(() => {
        return {
            isSignedByStaff: contract?.isSignedByStaff ?? false,
            isSignedByCustomer: contract?.isSignedByCustomer ?? false
        }
    }, [contract?.isSignedByCustomer, contract?.isSignedByStaff])

    const handoverFormik = useFormik<HandoverContractReq>({
        initialValues: handoverInitValue,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            isSignedByStaff: Yup.boolean().oneOf([true], t("signature.signed_by_staff_require")),
            isSignedByCustomer: Yup.boolean().oneOf(
                [true],
                t("signature.signed_by_customer_require")
            )
        }),
        onSubmit: async (value) => {
            if (!contract?.id) return
            await handoverMutation.mutateAsync({
                req: {
                    isSignedByStaff: value.isSignedByStaff,
                    isSignedByCustomer: value.isSignedByCustomer
                }
            })
        }
    })

    //======================================= //
    if (isLoading || !contract)
        return (
            <div className="flex justify-center mt-65">
                <SpinnerStyled />
            </div>
        )

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen w-full max-w-6xl bg-white shadow-xl rounded-2xl border border-gray-200 px-3 py-2 pt-12 md:px-12"
        >
            <Link
                className="absolute top-3 left-5 hover:cursor-pointer text-gray-500 italic hidden sm:block"
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

            {/* Contract Info */}
            <SectionStyled title={t("rental_contract.rental_contract_information")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <div>
                            {t("table.customer")}
                            {": "}
                            {toFullName({
                                firstName: contract.customer.firstName,
                                lastName: contract.customer.lastName
                            })}
                        </div>
                        <div>
                            {t("rental_contract.create_at")}
                            {": "}
                            {contract.createdAt && formatDateTime({ date: contract.createdAt })}
                        </div>
                    </div>

                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.contract_code")}
                        value={contract.id}
                        startContent={
                            <Invoice size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                        // className="sm:col-span-2"
                    />
                    <div className="flex gap-4">
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_name")}
                            value={contract.vehicle.model.name || ""}
                            placeholder="VinFast VF8"
                            startContent={
                                <Car size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.license_plate")}
                            value={contract.vehicle.licensePlate || ""}
                            startContent={
                                <IdentificationBadge
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                    </div>

                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.contract_status")}
                        value={RentalContractStatusLabels[contract.status]}
                        startContent={
                            <ClipboardText size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                    <InputStyled
                        isReadOnly
                        label={t("station.station")}
                        value={`${contract.station.name} - ${contract.station.address}`}
                        startContent={
                            <ClipboardText size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />

                    <TextareaStyled
                        isReadOnly
                        label={t("rental_contract.contract_description")}
                        value={contract.description}
                        placeholder=". . ."
                        variant="bordered"
                        className="sm:col-span-2"
                    />
                </div>
            </SectionStyled>

            {/*Rental Dates */}
            <SectionStyled title={t("rental_contract.rental_duration")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <DateTimeStyled
                        value={toZonedDateTime(contract.startDate)}
                        label={t("rental_contract.start_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.actualStartDate)}
                        label={t("rental_contract.actual_start_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.endDate)}
                        label={t("rental_contract.end_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.actualEndDate)}
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
                        value={toFullName({
                            firstName: contract.handoverStaff?.firstName,
                            lastName: contract.handoverStaff?.lastName
                        })}
                        startContent={
                            <ArrowsLeftRight size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.vehicle_return_staff")}
                        value={toFullName({
                            firstName: contract.returnStaff?.firstName,
                            lastName: contract.returnStaff?.lastName
                        })}
                        startContent={
                            <ArrowsLeftRight size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                </div>
            </SectionStyled>

            {/* Vehicle checklists */}
            <SectionStyled
                title={t("vehicle_checklist.vehicle_checklist")}
                childrenClassName="flex gap-2"
            >
                {contract.status >= RentalContractStatus.Active && (
                    <ChecklistSection
                        isStaff={isStaff}
                        contract={contract}
                        checklist={hanoverChecklist}
                        type={VehicleChecklistType.Handover}
                    />
                )}
                {contract.status == RentalContractStatus.Returned && (
                    <ChecklistSection
                        isStaff={isStaff}
                        contract={contract}
                        checklist={returnChecklist}
                        type={VehicleChecklistType.Return}
                    />
                )}
            </SectionStyled>

            {/* Invoice Accordion  isLoading={isFetching}*/}
            <SectionStyled title={t("rental_contract.payment_invoice_list")}>
                <AlertStyled className="mb-3 mt-[-0.75rem] mx-2 max-w-fit">
                    {t("invoice.fees_include_tax")}
                </AlertStyled>
                <InvoiceAccordion
                    items={invoiceAccordion}
                    contractId={contract.id}
                    contractStatus={contract.status}
                    className="mb-3"
                />
                {isStaff &&
                    // contract.status == RentalContractStatus.Returned &&
                    !contract.invoices.find((item) => item.type == InvoiceType.Refund) && (
                        <CreateInvoiceSection contractId={contract.id} type={InvoiceType.Refund} />
                    )}
            </SectionStyled>

            {/* Signature */}
            <SignatureSection
                // className="pt-10"
                sectionClassName="mt-8 mb-8"
                isReadOnly={!isStaff || !!contract.actualStartDate}
                staffSign={{
                    id: "isSignedByStaff",
                    name: "isSignedByStaff",
                    checked: handoverFormik.values.isSignedByStaff,
                    isInvalid: !!(
                        handoverFormik.touched.isSignedByStaff &&
                        handoverFormik.errors.isSignedByStaff
                    ),
                    isSelected: handoverFormik.values.isSignedByStaff,
                    // onValueChange: (value) => handoverFormik.setFieldValue("isSignedByStaff", value)
                    onChange: handoverFormik.handleChange,
                    onBlur: handoverFormik.handleBlur
                }}
                customerSign={{
                    id: "isSignedByCustomer",
                    name: "isSignedByCustomer",
                    checked: handoverFormik.values.isSignedByCustomer,
                    isInvalid: !!(
                        handoverFormik.touched.isSignedByCustomer &&
                        handoverFormik.errors.isSignedByCustomer
                    ),
                    isSelected: handoverFormik.values.isSignedByCustomer,
                    // onValueChange: (value) => handoverFormik.setFieldValue("isSignedByCustomer", value)
                    onChange: handoverFormik.handleChange,
                    onBlur: handoverFormik.handleBlur
                }}
            />

            {/* Contract action button */}
            <div className="text-center mb-10">
                <BottomActionButtons
                    contract={contract}
                    isStaff={isStaff}
                    isCustomer={isCustomer}
                    isReturnChecked={isReturnChecked}
                    setIsReturnChecked={setIsReturnChecked}
                    handoverFormik={handoverFormik}
                    hanoverChecklist={hanoverChecklist}
                />
            </div>
        </motion.div>
    )
}
