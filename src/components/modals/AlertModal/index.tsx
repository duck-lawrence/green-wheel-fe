"use client"

import { ButtonStyled, ModalHeaderStyled, ModalStyled } from "@/components"
import { ModalBody, ModalContent, ModalFooter } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

interface AlertModalProps {
    header: string
    body: string
    isOpen: boolean
    isDismissable?: boolean
    onOpenChange: () => void
    onClose: () => void
    onConfirm: () => void
}

export function AlertModal({
    header,
    body,
    isOpen,
    isDismissable = true,
    onOpenChange,
    onClose,
    onConfirm
}: AlertModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={isDismissable}
            placement="center"
        >
            <ModalContent className="w-fit max-w-screen">
                <ModalHeaderStyled>{header}</ModalHeaderStyled>
                <ModalBody>{body}</ModalBody>
                <ModalFooter>
                    <ButtonStyled
                        color="primary"
                        variant="ghost"
                        onPress={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {t("common.confirm")}
                    </ButtonStyled>
                    <ButtonStyled onPress={onClose}>{t("common.cancel")}</ButtonStyled>
                </ModalFooter>
            </ModalContent>
        </ModalStyled>
    )
}
