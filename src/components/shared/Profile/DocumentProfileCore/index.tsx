"use client"

import React from "react"
import { ButtonIconStyled, ButtonStyled, ImageStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { NotePencilIcon } from "@phosphor-icons/react"
import { Spinner } from "@heroui/react"

export type DocumentProfileCoreProps = {
    title: "citizen_identity" | "driver_license"
    imageUrl?: string
    isLoading: boolean
    uploader: React.ReactNode
    formik: {
        isSubmitting: boolean
        isValid: boolean
        dirty: boolean
        submitForm: () => void
        resetForm: () => void
    }
    children: React.ReactNode
    editable: boolean
    setEditable: (val: boolean) => void
}

export function DocumentProfileCore({
    title,
    imageUrl,
    isLoading,
    uploader,
    formik,
    children,
    editable,
    setEditable
}: DocumentProfileCoreProps) {
    const { t } = useTranslation()

    return (
        <>
            <div className="flex flex-wrap justify-between text-2xl mb-2 font-bold">
                <div>{t(`user.${title}`)}</div>
                {imageUrl && (
                    <div className="flex justify-end">
                        {!editable ? (
                            <ButtonIconStyled
                                color="primary"
                                variant="ghost"
                                onPress={() => setEditable(!editable)}
                            >
                                <NotePencilIcon />
                            </ButtonIconStyled>
                        ) : formik.isSubmitting ? (
                            <Spinner />
                        ) : (
                            <ButtonStyled
                                isDisabled={formik.isSubmitting}
                                onPress={() => {
                                    setEditable(!editable)
                                    formik.resetForm()
                                }}
                            >
                                {t("common.cancel")}
                            </ButtonStyled>
                        )}
                    </div>
                )}
            </div>

            <div className="mb-8">
                {isLoading ? (
                    <Spinner />
                ) : !imageUrl ? (
                    <div
                        className="flex flex-wrap md:flex-nowrap justify-between items-center 
                        text-md mt-[-0.75rem]"
                    >
                        <p>{t(`user.please_upload_${title}`)}</p>
                        {uploader}
                    </div>
                ) : (
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-3">
                        <div className="w-full md:w-3xs space-y-2">
                            <div className="space-y-1">
                                <ImageStyled
                                    alt={t(`user.${title}`)}
                                    src={imageUrl}
                                    width={400}
                                    height={250}
                                />
                                <ImageStyled
                                    alt={t(`user.${title}`)}
                                    src={imageUrl}
                                    width={400}
                                    height={250}
                                />
                            </div>
                        </div>
                        <div>
                            {children}
                            {editable && (
                                <div className="flex flex-wrap justify-end gap-1">
                                    {uploader}
                                    <ButtonStyled
                                        color="primary"
                                        variant="ghost"
                                        isLoading={formik.isSubmitting}
                                        isDisabled={!formik.isValid || !formik.dirty}
                                        onPress={formik.submitForm}
                                    >
                                        {t("common.save")}
                                    </ButtonStyled>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
