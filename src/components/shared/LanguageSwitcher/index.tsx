"use client"
import { ButtonStyled } from "@/components/styled"
import { cn } from "@heroui/theme"
import { useRouter } from "next/navigation"
import React from "react"
import { useTranslation } from "react-i18next"

export function LanguageSwitcher({
    isChangeTextColor,
    wrapperClassName = "",
    onClick = undefined
}: {
    isChangeTextColor: boolean
    wrapperClassName?: string
    onClick?: () => void
}) {
    const { i18n } = useTranslation()
    const router = useRouter()

    const switchLang = (lang: string) => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang)
            router.refresh()
        }
        if (onClick) onClick()
    }

    return (
        <div className={cn("flex justify-end", wrapperClassName)}>
            {i18n.language !== "en" && (
                <ButtonStyled
                    className={`bg-transparent p-0 max-w-fit min-w-fit ${
                        isChangeTextColor ? "text-white" : "text-black"
                    }`}
                    onPress={() => switchLang("en")}
                >
                    VI
                </ButtonStyled>
            )}
            {i18n.language !== "vi" && (
                <ButtonStyled
                    className={`bg-transparent p-0 max-w-fit min-w-fit ${
                        isChangeTextColor ? "text-white" : "text-black"
                    }`}
                    onPress={() => switchLang("vi")}
                >
                    EN
                </ButtonStyled>
            )}
        </div>
    )
}
