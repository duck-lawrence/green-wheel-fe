"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled } from "@/components/"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { useTranslation } from "react-i18next"

interface SelectUserModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    setUser: (user: UserProfileViewRes) => void
}

export function SelectUserModal({ isOpen, onOpenChange, onClose, setUser }: SelectUserModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
            <ModalContent className="min-w-4xl py-3 px-5">
                <ModalBody></ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
