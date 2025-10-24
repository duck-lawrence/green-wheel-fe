"use client"
import { CheckboxStyled, CheckboxStyledProps, SectionStyled } from "@/components/styled"
import { cn } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

interface SignatureSectionProps {
    sectionClassName?: string
    childrenClassName?: string
    isReadOnly: boolean
    staffSign: CheckboxStyledProps
    customerSign: CheckboxStyledProps
}

export function SignatureSection({
    sectionClassName = "",
    childrenClassName = "",
    isReadOnly,
    staffSign,
    customerSign
}: SignatureSectionProps) {
    const { t } = useTranslation()

    return (
        <SectionStyled
            title={t("signature.signature")}
            sectionClassName={cn("mb-3", sectionClassName)}
        >
            <div
                className={cn(
                    "flex flex-col sm:flex-row sm:justify-between gap-2 sm:px-16",
                    childrenClassName
                )}
            >
                <CheckboxStyled
                    isReadOnly={isReadOnly}
                    {...staffSign}
                    // onValueChange={(value) => formik.setFieldValue("isSignedByStaff", value)}
                >
                    {t("signature.signed_by_staff")}
                </CheckboxStyled>
                <CheckboxStyled
                    isReadOnly={isReadOnly}
                    {...customerSign}
                    // onValueChange={(value) => formik.setFieldValue("isSignedByCustomer", value)}
                >
                    {t("signature.signed_by_customer")}
                </CheckboxStyled>
            </div>
        </SectionStyled>
    )
}
