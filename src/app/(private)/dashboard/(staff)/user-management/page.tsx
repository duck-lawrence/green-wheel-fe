"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FunnelSimple } from "@phosphor-icons/react"
import { useFormik } from "formik"
import * as Yup from "yup"

import {
    ButtonStyled,
    FilterTypeStyle,
    FilterTypeOption,
    ImageStyled,
    InputStyled,
    ModalStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    TableUserManagement,
    useModalDisclosure
} from "@/components"
import { useSearchUsers } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"

type UserFilterFormValues = {
    name: string
    phone: string
    hasDocument: "all" | "license" | "citizen" | "none"
}

export default function StaffUserManagementPage() {
    const { t } = useTranslation()
    const [users, setUsers] = useState<UserProfileViewRes[]>([])
    const [clientFilters, setClientFilters] = useState<{
        name: string
        phone: string
        hasDocument: UserFilterFormValues["hasDocument"]
    }>({
        name: "",
        phone: "",
        hasDocument: "all"
    })
    const [preview, setPreview] = useState<{ url: string; label: string } | null>(null)
    const { isOpen, onOpen, onOpenChange, onClose } = useModalDisclosure()

    const { data, isFetching } = useSearchUsers({
        params: {},
        enabled: true
    })

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    }, [data])

    const initialValues = useMemo<UserFilterFormValues>(
        () => ({
            name: "",
            phone: "",
            hasDocument: "all"
        }),
        []
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            name: Yup.string().trim(),
            phone: Yup.string().trim(),
            hasDocument: Yup.mixed<UserFilterFormValues["hasDocument"]>().oneOf([
                "all",
                "license",
                "citizen",
                "none"
            ])
        })
    }, [])

    const handleSubmit = useCallback((values: UserFilterFormValues) => {
        setClientFilters({
            name: values.name.trim().toLowerCase(),
            phone: values.phone.trim(),
            hasDocument: values.hasDocument
        })
    }, [])

    const formik = useFormik<UserFilterFormValues>({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit
    })

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
            const fullNameLower = fullName.toLowerCase()

            const matchesName = clientFilters.name
                ? fullNameLower.includes(clientFilters.name)
                : true

            const matchesPhone = clientFilters.phone
                ? (user.phone ?? "").includes(clientFilters.phone)
                : true

            const matchesDocument =
                clientFilters.hasDocument === "all"
                    ? true
                    : clientFilters.hasDocument === "license"
                      ? Boolean(user.licenseUrl)
                      : clientFilters.hasDocument === "citizen"
                        ? Boolean(user.citizenUrl)
                        : !user.licenseUrl && !user.citizenUrl

            return matchesName && matchesPhone && matchesDocument
        })
    }, [clientFilters.name, clientFilters.phone, clientFilters.hasDocument, users])

    const handleOpenPreview = useCallback(
        (label: string, url: string) => {
            setPreview({ label, url })
            onOpen()
        },
        [onOpen]
    )

    const handleClosePreview = useCallback(() => {
        setPreview(null)
        onClose()
    }, [onClose])

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("staff.user_management_title")}</p>
            </div>

            <div className="mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col gap-6 md:gap-8"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FunnelSimple size={22} className="text-primary" />
                            {t("staff.user_filter_title")}
                        </h3>
                        <ButtonStyled
                            type="submit"
                            isLoading={isFetching}
                            className="bg-gradient-to-r from-primary to-teal-400 hover:from-teal-500 hover:to-green-400 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                        >
                            {t("staff.handovers_filters_search")}
                        </ButtonStyled>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputStyled
                            label={t("table.name")}
                            placeholder={t("staff.user_filter_name_placeholder")}
                            value={formik.values.name}
                            onChange={(value) => formik.setFieldValue("name", value.target.value)}
                            onClear={() => formik.setFieldValue("name", "")}
                            classNames={{
                                inputWrapper:
                                    "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                                label: "text-gray-700",
                                input: "text-gray-900"
                            }}
                        />
                        <InputStyled
                            label={t("user.phone")}
                            placeholder={t("staff.user_filter_phone_placeholder")}
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                            classNames={{
                                inputWrapper:
                                    "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                                label: "text-gray-700",
                                input: "text-gray-900"
                            }}
                        />
                        <FilterTypeStyle
                            label={t("staff.user_filter_has_document_label")}
                            className="sm:w-52"
                            selectedKeys={new Set([formik.values.hasDocument])}
                            disallowEmptySelection
                            onSelectionChange={(keys) => {
                                if (keys === "all") {
                                    formik.setFieldValue("hasDocument", "all")
                                    return
                                }

                                const key = Array.from(keys)[0]
                                const value =
                                    typeof key === "string"
                                        ? key
                                        : key != null
                                          ? key.toString()
                                          : "all"

                                formik.setFieldValue(
                                    "hasDocument",
                                    value as UserFilterFormValues["hasDocument"]
                                )
                            }}
                        >
                            <FilterTypeOption key="all">
                                {t("staff.user_filter_has_document_all")}
                            </FilterTypeOption>
                            <FilterTypeOption key="license">
                                {t("staff.user_filter_has_document_license")}
                            </FilterTypeOption>
                            <FilterTypeOption key="citizen">
                                {t("staff.user_filter_has_document_citizen")}
                            </FilterTypeOption>
                            <FilterTypeOption key="none">
                                {t("staff.user_filter_has_document_none")}
                            </FilterTypeOption>
                        </FilterTypeStyle>
                    </div>
                </form>
            </div>

            <TableUserManagement
                users={filteredUsers}
                onPreviewDocument={({ label, url }) => handleOpenPreview(label, url)}
            />

            <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-3xl">
                <ModalContentStyled>
                    <ModalHeaderStyled>{preview?.label}</ModalHeaderStyled>
                    <ModalBodyStyled>
                        {preview?.url ? (
                            <ImageStyled
                                src={preview.url}
                                alt={preview.label}
                                className="w-full h-auto"
                            />
                        ) : null}
                    </ModalBodyStyled>
                    <ModalFooterStyled>
                        <ButtonStyled
                            className="bg-primary text-white px-6"
                            onPress={handleClosePreview}
                        >
                            {t("common.cancel")}
                        </ButtonStyled>
                    </ModalFooterStyled>
                </ModalContentStyled>
            </ModalStyled>
        </div>
    )
}
