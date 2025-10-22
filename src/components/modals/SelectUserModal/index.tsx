"use client"
import React, { useCallback, useState } from "react"
import {
    ModalBody,
    ModalContent,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    User
} from "@heroui/react"
import {
    ButtonStyled,
    DatePickerStyled,
    EnumPicker,
    ImageStyled,
    InputStyled,
    ModalStyled,
    TableStyled
} from "@/components/"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { UserFilterParams } from "@/models/user/schema/request"
import { useDay, useGetAllUsers, useName } from "@/hooks"
import { RoleName } from "@/constants/enum"
import { NUMBER_REGEX, PHONE_REGEX } from "@/constants/regex"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"
import { SexLabels } from "@/constants/labels"

interface SelectUserModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    setUser: (user: UserProfileViewRes) => void
}

export function SelectUserModal({ isOpen, onOpenChange, onClose, setUser }: SelectUserModalProps) {
    const { t } = useTranslation()
    const { toFullName } = useName()
    const { toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })

    const [filter, setFilter] = useState<UserFilterParams>({ roleName: RoleName.Customer })
    const [selectedUser, setSelectedUser] = useState<UserProfileViewRes | null>(null)
    const { data: users, refetch } = useGetAllUsers({ params: filter })

    const handleSelect = useCallback(() => {
        if (selectedUser) {
            setUser(selectedUser)
            onClose()
        }
    }, [onClose, selectedUser, setUser])

    const handleSubmit = useCallback(
        (params: UserFilterParams) => {
            setFilter(params)
            refetch()
        },
        [refetch]
    )

    const formik = useFormik<UserFilterParams>({
        initialValues: filter,
        validationSchema: Yup.object({
            phone: Yup.string().matches(PHONE_REGEX, t("user.invalid_phone")),
            citizenIdNumber: Yup.string().matches(NUMBER_REGEX, t("user.citizen_identity_invalid")),
            driverLicenseNumber: Yup.string().matches(
                NUMBER_REGEX,
                t("user.driver_license_invalid")
            )
        }),
        onSubmit: handleSubmit
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
            <ModalContent className="min-w-[80vw] md:min-w-3xl lg:min-w-5xl py-3 px-5">
                <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <form
                            onSubmit={formik.handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
                        >
                            <InputStyled
                                label={t("user.citizen_identity")}
                                value={formik.values.citizenIdNumber}
                                onValueChange={(value) =>
                                    formik.setFieldValue("citizenIdNumber", value)
                                }
                                isInvalid={
                                    !!(
                                        formik.touched.citizenIdNumber &&
                                        formik.errors.citizenIdNumber
                                    )
                                }
                                errorMessage={formik.errors.citizenIdNumber}
                                onBlur={() => formik.setFieldTouched("citizenIdNumber")}
                            />
                            <InputStyled
                                label={t("user.driver_license")}
                                value={formik.values.driverLicenseNumber}
                                onValueChange={(value) =>
                                    formik.setFieldValue("driverLicenseNumber", value)
                                }
                                isInvalid={
                                    !!(
                                        formik.touched.driverLicenseNumber &&
                                        formik.errors.driverLicenseNumber
                                    )
                                }
                                errorMessage={formik.errors.driverLicenseNumber}
                                onBlur={() => formik.setFieldTouched("driverLicenseNumber")}
                            />
                            <InputStyled
                                label={t("user.phone")}
                                value={formik.values.phone}
                                onValueChange={(value) => formik.setFieldValue("phone", value)}
                                isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                                errorMessage={formik.errors.phone}
                                onBlur={() => formik.setFieldTouched("phone")}
                            />
                            <ButtonStyled
                                type="submit"
                                variant="ghost"
                                color="primary"
                                className="h-14"
                            >
                                {t("common.search")}
                            </ButtonStyled>
                        </form>
                        <TableStyled
                            selectionMode="single"
                            classNames={{
                                base: "max-h-[45rem]"
                            }}
                        >
                            <TableHeader>
                                <TableColumn className="text-center">{t("table.no")}</TableColumn>
                                <TableColumn className="text-center">
                                    {t("user.first_name")}
                                </TableColumn>
                                <TableColumn className="text-center">{t("user.phone")}</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {(users?.concat(users).concat(users) || []).map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:cursor-pointer"
                                        onClick={() => setSelectedUser(item)}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="flex items-center">
                                            <User
                                                as="button"
                                                avatarProps={{
                                                    isBordered: true,
                                                    src: item?.avatarUrl || DEFAULT_AVATAR_URL
                                                }}
                                                className="transition-transform"
                                                name={toFullName({
                                                    firstName: item?.firstName,
                                                    lastName: item?.lastName
                                                })}
                                                classNames={{
                                                    name: "text-[16px]"
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">{item.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableStyled>
                    </div>

                    <div className="md:border-l-2 md:pl-4">
                        {selectedUser && (
                            <>
                                <div className="text-center font-bold text-2xl my-3">
                                    {t("user.account_information")}
                                </div>
                                <User
                                    as="button"
                                    avatarProps={{
                                        isBordered: true,
                                        src: selectedUser.avatarUrl || DEFAULT_AVATAR_URL
                                    }}
                                    className="transition-transform"
                                    name={toFullName({
                                        firstName: selectedUser.firstName,
                                        lastName: selectedUser.lastName
                                    })}
                                    classNames={{
                                        name: "text-[16px]",
                                        base: "flex gap-4"
                                    }}
                                />

                                <div className="my-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <InputStyled
                                        label={t("auth.email")}
                                        value={selectedUser.email}
                                        isReadOnly
                                    />
                                    <InputStyled
                                        label={t("user.phone")}
                                        value={selectedUser.phone}
                                        isReadOnly
                                    />
                                    <EnumPicker
                                        value={selectedUser.sex}
                                        label={t("user.sex")}
                                        labels={SexLabels}
                                        isReadOnly
                                    />
                                    <DatePickerStyled
                                        isReadOnly
                                        label={t("user.date_of_birth")}
                                        value={toDate(selectedUser.dateOfBirth) || null}
                                    />
                                </div>

                                {selectedUser.citizenUrl && (
                                    <ImageStyled
                                        alt={t("user.citizen_identity")}
                                        src={selectedUser.citizenUrl}
                                        width={500}
                                        height={312.5}
                                        className="mb-3"
                                    />
                                )}

                                {selectedUser.licenseUrl && (
                                    <ImageStyled
                                        alt={t("user.driver_license")}
                                        src={selectedUser.licenseUrl}
                                        width={500}
                                        height={312.5}
                                        className="mb-3"
                                    />
                                )}

                                <div className="text-center">
                                    <ButtonStyled
                                        variant="ghost"
                                        color="default"
                                        onPress={handleSelect}
                                    >
                                        {t("common.choose")}
                                    </ButtonStyled>
                                </div>
                            </>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
