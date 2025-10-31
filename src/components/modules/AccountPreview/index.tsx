"use client"

import { DatePickerStyled, ImageStyled, InputStyled } from "@/components/styled"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"
import { useDay, useUserHelper } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { User } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { EnumPicker } from "../EnumPicker"
import { SexLabels } from "@/constants/labels"

export function AccountPreview({ user }: { user: UserProfileViewRes }) {
    const { t } = useTranslation()
    const { toFullName } = useUserHelper()
    const { toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })

    return (
        <>
            <div className="text-center font-bold text-2xl my-3">
                {t("user.account_information")}
            </div>
            <User
                as="button"
                avatarProps={{
                    isBordered: true,
                    src: user.avatarUrl || DEFAULT_AVATAR_URL
                }}
                className="transition-transform"
                name={toFullName({
                    firstName: user.firstName,
                    lastName: user.lastName
                })}
                classNames={{
                    name: "text-[16px]",
                    base: "flex gap-4"
                }}
            />

            <div className="my-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputStyled label={t("auth.email")} value={user.email || ""} isReadOnly />
                <InputStyled label={t("user.phone")} value={user.phone || ""} isReadOnly />
                <EnumPicker label={t("user.sex")} labels={SexLabels} value={user.sex} isReadOnly />
                <DatePickerStyled
                    isReadOnly
                    label={t("user.date_of_birth")}
                    value={toDate(user.dateOfBirth) || null}
                />
            </div>

            {user.citizenUrl && (
                <ImageStyled
                    alt={t("user.citizen_identity")}
                    src={user.citizenUrl}
                    width={500}
                    height={312.5}
                    className="mb-3 mx-auto"
                />
            )}

            {user.licenseUrl && (
                <ImageStyled
                    alt={t("user.driver_license")}
                    src={user.licenseUrl}
                    width={500}
                    height={312.5}
                    className="mb-3 mx-auto"
                />
            )}
        </>
    )
}
