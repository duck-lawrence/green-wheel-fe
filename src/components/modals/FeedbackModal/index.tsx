"use client"
import { CreateFeedback } from "@/components/shared"
import { ModalStyled } from "@/components/styled"
import { ModalBody, ModalContent } from "@heroui/react"
import React from "react"

interface FeedbackModalProps {
    id: string
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
}
export function FeedbackModal({ id, isOpen, onOpenChange, onClose }: FeedbackModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            isDismissable={true}
        >
            <ModalContent className="min-w-fit p-14">
                <ModalBody id={id}>
                    <CreateFeedback onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
