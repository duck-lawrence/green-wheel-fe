"use client"

import {
    AvatarStyled,
    ButtonStyled,
    DropdownStyled,
    ImageUploadButton,
    ImageUploaderModal
} from "@/components"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"
import { useDeleteAvatar, useImageUploadModal, useUploadAvatar } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react"
import { X } from "@phosphor-icons/react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export function AvatarProfile({ user }: { user: UserProfileViewRes }) {
    const { t } = useTranslation()
    const uploadAvatar = useUploadAvatar({ onSuccess: undefined })
    const deleteAvatarMutation = useDeleteAvatar({ onSuccess: undefined })

    const {
        isOpen: isDropdownOpen,
        onOpenChange: onDropdownOpenChange,
        onClose: onDropdownClose
    } = useDisclosure()

    const { imgSrc, setImgSrc, isOpen, onOpenChange, onClose, onFileSelect } = useImageUploadModal({
        onBeforeOpenModal: onDropdownClose
    })

    // ===== Avatar =====
    const handleDeleteAvatar = useCallback(async () => {
        await deleteAvatarMutation.mutateAsync()
    }, [deleteAvatarMutation])

    return (
        <div>
            <ImageUploaderModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                uploadFn={uploadAvatar.mutateAsync}
                isUploadPending={uploadAvatar.isPending}
                aspect={1}
                cropShape="round"
                cropSize={{ width: 300, height: 300 }}
                label={t("user.upload_avatar")}
            />
            <DropdownStyled
                placement="right-end"
                classNames={{ content: "min-w-fit max-w-fit" }}
                isOpen={isDropdownOpen}
                onOpenChange={onDropdownOpenChange}
                closeOnSelect={false}
            >
                <DropdownTrigger className="w-24 h-24 sm:w-47 sm:h-47 cursor-pointer">
                    <AvatarStyled src={user.avatarUrl || DEFAULT_AVATAR_URL} />
                </DropdownTrigger>
                <DropdownMenu variant="flat" classNames={{ base: "p-0 w-fit" }}>
                    <DropdownItem key="upload_avatar" className="block p-0">
                        <ImageUploadButton
                            color={undefined}
                            label={t("common.upload")}
                            onFileSelect={onFileSelect}
                        />
                    </DropdownItem>
                    <DropdownItem
                        key="delete_avatar"
                        className="block p-0"
                        hidden={!user.avatarUrl}
                    >
                        <ButtonStyled
                            className="w-fit bg-transparent flex items-center justify-center"
                            onPress={handleDeleteAvatar}
                        >
                            <X size={18} fontWeight="fill" />
                            {t("common.delete")}
                        </ButtonStyled>
                    </DropdownItem>
                </DropdownMenu>
            </DropdownStyled>
        </div>
    )
}
