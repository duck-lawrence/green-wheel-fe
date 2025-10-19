"use client"
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react"
import { useState } from "react"
import React from "react"
export function ConfirmForm({ onSuccess }: { onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button color="primary" onPress={() => setIsOpen(true)}>
                Show Alert
            </Button>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Thông báo</ModalHeader>
                            <ModalBody>Hành động của bạn đã được thực hiện thành công 🎉</ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    OK
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
