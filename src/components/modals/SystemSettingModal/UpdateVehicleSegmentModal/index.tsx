"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled } from "@/components/"
import UpdateVehicleSegmentForm from "./UpdateVehicleSegmentForm"

interface UpdateVehicleSegmentModalProps {
    isOpen: boolean
    onClose: () => void
    id: string
}

export function UpdateVehicleSegmentModal({ id, isOpen, onClose }: UpdateVehicleSegmentModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onClose={onClose}
            isDismissable={true}
            className="min-w-full max-w-screen sm:w-sm"
        >
            <ModalContent className="px-0 py-3 sm:min-w-fit sm:px-8 sm:py-4">
                <ModalBody className="px-3 py-2 sm:px-6">
                    <UpdateVehicleSegmentForm onClose={onClose} id={id} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
