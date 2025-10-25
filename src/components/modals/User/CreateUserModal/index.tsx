"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { CreateUserForm, CreateUserFormProps } from "./CreateUserForm"
import { ModalContentStyled, ModalStyled } from "@/components/styled"
import { ModalBody, ModalHeader } from "@heroui/react"

interface CreateUserModalProps extends CreateUserFormProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
}

export function CreateUserModal({
    isOpen,
    onOpenChange,
    createMutation,
    isCreateCustomer
}: CreateUserModalProps) {
    const { t } = useTranslation()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContentStyled className="max-w-150 w-full">
                <ModalHeader className="flex flex-col items-center font-semibold text-3xl">
                    {isCreateCustomer ? t("user.create_anonymous") : t("user.create_staff")}
                </ModalHeader>
                <ModalBody>
                    <CreateUserForm
                        createMutation={createMutation}
                        isCreateCustomer={isCreateCustomer}
                    />
                </ModalBody>
            </ModalContentStyled>
        </ModalStyled>
    )
}
