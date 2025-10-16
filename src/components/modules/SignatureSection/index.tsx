"use client"
import { CheckboxStyled, SectionStyled } from "@/components/styled"
import { cn } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

interface SignatureSectionProps {
    sectionClassName?: string
    childrenClassName?: string
    isReadOnly: boolean
    isStaffSelected: boolean
    onStaffValueChange: (isSelected: boolean) => void
    isCustomerSelected: boolean
    onCustomerValueChange: (isSelected: boolean) => void
}

export function SignatureSection({
    sectionClassName = "",
    childrenClassName = "",
    isReadOnly,
    isStaffSelected,
    onStaffValueChange,
    isCustomerSelected,
    onCustomerValueChange
}: SignatureSectionProps) {
    const { t } = useTranslation()

    return (
        <SectionStyled title={t("signature.signature")} className={cn("mb-3", sectionClassName)}>
            <div className={cn("flex justify-between gap-2 px-16", childrenClassName)}>
                <CheckboxStyled
                    isReadOnly={isReadOnly}
                    isSelected={isStaffSelected}
                    onValueChange={onStaffValueChange}
                    // onValueChange={(value) => formik.setFieldValue("isSignedByStaff", value)}
                >
                    {t("signature.signed_by_staff")}
                </CheckboxStyled>
                <CheckboxStyled
                    isReadOnly={isReadOnly}
                    isSelected={isCustomerSelected}
                    onValueChange={onCustomerValueChange}
                    // onValueChange={(value) => formik.setFieldValue("isSignedByCustomer", value)}
                >
                    {t("signature.signed_by_customer")}
                </CheckboxStyled>
            </div>
        </SectionStyled>
    )
}
