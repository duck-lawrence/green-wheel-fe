"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled } from "@/components/"
import CreateBrand from "./CreateBrandForm"

interface CreateBrandModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateBrandModal({ isOpen, onClose }: CreateBrandModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={true}
            className="min-w-full max-w-screen sm:w-sm"
        >
            <ModalContent className="px-0 py-3 sm:min-w-fit sm:px-8 sm:py-4">
                <ModalBody className="px-3 py-2 sm:px-6">
                    <CreateBrand onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
