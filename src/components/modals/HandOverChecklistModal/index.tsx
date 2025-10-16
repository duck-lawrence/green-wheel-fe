"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled, VehicleChecklistDetail } from "@/components/"

interface HandOverChecklistModalProps {
    id: string
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
}

export function HandOverChecklistModal({
    id,
    isOpen,
    onOpenChange,
    onClose
}: HandOverChecklistModalProps) {
    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
            <ModalContent className="max-w-150 w-full p-14">
                {/* <ModalHeader className="flex flex-col gap-1">{t("login.login")}</ModalHeader> */}
                <ModalBody>
                    <VehicleChecklistDetail id={id} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
