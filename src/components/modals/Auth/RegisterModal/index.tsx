"use client"
import React from "react"
import { ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import { useTranslation } from "react-i18next"
import { ModalStyled } from "@/components"
import { useRegisterDiscloresureSingleton } from "@/hooks"
import { RegisterForm } from "./RegisterForm"

export function RegisterModal() {
    const { t } = useTranslation()
    const { isOpen, onOpenChange, onClose } = useRegisterDiscloresureSingleton() //onclose

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="w-full max-w-screen min-w-full sm:min-w-sm md:max-w-140 py-3">
                <ModalHeader className="flex justify-center items-center text-2xl front-bold mt">
                    {t("login.register")}
                </ModalHeader>
                <ModalBody>
                    <RegisterForm onSuccess={onClose} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
