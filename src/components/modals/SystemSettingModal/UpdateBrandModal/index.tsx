"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled } from "@/components/"
import UpdateBrandForm from "./UpdateBrandForm"

interface UpdateBrandModalProps {
    id: string
    isOpen: boolean
    onClose: () => void
}

export function UpdateBrandModal({ isOpen, onClose, id }: UpdateBrandModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={true}
            className="min-w-full max-w-screen sm:w-sm"
        >
            <ModalContent className="px-0 py-3 sm:min-w-fit sm:px-8 sm:py-4">
                <ModalBody className="px-3 py-2 sm:px-6">
                    <UpdateBrandForm onClose={onClose} id={id} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
