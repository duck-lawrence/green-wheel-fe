"use client"

import React, { useState } from "react"
import { ButtonIconStyled, ImageStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { NotePencilIcon } from "@phosphor-icons/react"
import { Spinner } from "@heroui/react"

export type DocumentProfileCoreProps = {
    title: "citizen_identity" | "driver_license"
    data: { imageUrl: string } | null
    isLoading: boolean
    uploader: React.ReactNode
    children: React.ReactNode
    editable?: boolean
    setEditable?: (val: boolean) => void
}

export function DocumentProfileCore({
    title,
    data,
    isLoading,
    uploader,
    children,
    editable: editableProp,
    setEditable: setEditableProp
}: DocumentProfileCoreProps) {
    const { t } = useTranslation()
    const [internalEditable, setInternalEditable] = useState(false)
    const editable = editableProp ?? internalEditable
    const setEditable = setEditableProp ?? setInternalEditable

    return (
        <>
            <div className="flex flex-wrap justify-between text-2xl mb-2 font-bold">
                {t(`user.${title}`)}
                {data && (
                    <div className="flex justify-end">
                        {!editable ? (
                            <ButtonIconStyled
                                color="primary"
                                variant="ghost"
                                onPress={() => setEditable(!editable)}
                            >
                                <NotePencilIcon />
                            </ButtonIconStyled>
                        ) : (
                            <Spinner />
                        )}
                    </div>
                )}
            </div>

            <div className="mb-8">
                {isLoading ? (
                    <Spinner />
                ) : !data ? (
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-center text-md mt-[-0.75rem]">
                        <p>{t(`user.please_upload_${title}`)}</p>
                        {uploader}
                    </div>
                ) : (
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-3">
                        <div>
                            <ImageStyled
                                alt={t(`user.${title}`)}
                                src={data.imageUrl}
                                width={400}
                                height={250}
                            />
                        </div>
                        <div className="w-full">{children}</div>
                    </div>
                )}
            </div>
        </>
    )
}
