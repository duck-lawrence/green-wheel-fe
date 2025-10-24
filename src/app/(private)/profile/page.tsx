"use client"
import {
    AvatarStyled,
    ButtonStyled,
    CitizenIdentityProfile,
    DatePickerStyled,
    DropdownStyled,
    EnumPicker,
    ImageUploadButton,
    ImageUploaderModal,
    InputStyled
} from "@/components"
import {
    useDay,
    useDeleteAvatar,
    useGetMe,
    useImageUploadModal,
    useName,
    useUpdateMe,
    useUploadAvatar
} from "@/hooks"
import { UserUpdateReq } from "@/models/user/schema/request"
import { NotePencilIcon } from "@phosphor-icons/react/dist/ssr"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"
import { DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import { DriverLicenseProfile } from "@/components/shared/Profile/DriverLicenseProfile"

export default function ProfilePage() {
    const { t } = useTranslation()
    const [editable, setEditable] = useState(false)
    const { toDate, formatDateTime } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const { toFullName } = useName()
    const { data: user } = useGetMe()
    const updateMeMutation = useUpdateMe({ onSuccess: undefined })
    // avatar
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

    // ===== Update Me =====
    const handleUpdateMe = useCallback(
        async (values: UserUpdateReq) => {
            await updateMeMutation.mutateAsync(values)
            setEditable(!editable)
        },
        [updateMeMutation, editable, setEditable]
    )

    const updateMeFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phone: user?.phone || undefined,
            sex: user?.sex || Sex.Male,
            dateOfBirth: user?.dateOfBirth || ""
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            phone: Yup.string()
                .required(t("user.phone_require"))
                .matches(PHONE_REGEX, t("user.invalid_phone")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require"))
        }),
        onSubmit: handleUpdateMe
    })

    return (
        <div className="px-4">
            {/* Title */}
            <div className="text-3xl mb-8 font-bold">{t("user.account_information")}</div>

            {/* Avatar Upload Modal */}
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

            <div className="flex justify-between mb-8 items-center">
                {/* Avatar */}
                <DropdownStyled
                    placement="right-end"
                    classNames={{ content: "min-w-fit max-w-fit" }}
                    isOpen={isDropdownOpen}
                    onOpenChange={onDropdownOpenChange}
                    closeOnSelect={false}
                >
                    <DropdownTrigger className="w-47 h-47 cursor-pointer">
                        <AvatarStyled src={user?.avatarUrl || DEFAULT_AVATAR_URL} />
                    </DropdownTrigger>
                    <DropdownMenu variant="flat" classNames={{ base: "p-0 w-fit" }}>
                        <DropdownItem key="upload_avatar" className="block p-0">
                            <ImageUploadButton
                                label={t("user.upload_avatar")}
                                onFileSelect={onFileSelect}
                            />
                        </DropdownItem>
                        <DropdownItem key="delete_avatar" className="block p-0">
                            <ButtonStyled
                                className="block w-fit bg-transparent"
                                onPress={handleDeleteAvatar}
                            >
                                {t("user.delete_avatar")}
                            </ButtonStyled>
                        </DropdownItem>
                    </DropdownMenu>
                </DropdownStyled>

                {/* Preview info */}
                <div>
                    {/* Top container */}
                    <div className="flex justify-between items-center">
                        {/* user full name */}
                        <div
                            className="text-3xl" //
                        >
                            {`${toFullName({
                                firstName: user?.firstName,
                                lastName: user?.lastName
                            })} ${user?.station && `- ${user?.station?.name}`}`}
                        </div>

                        {/* Button enable show change */}
                        <div>
                            {!editable ? (
                                <ButtonStyled
                                    className="border-primary
                                    bg-white border text-primary   
                                    hover:text-white hover:bg-primary"
                                    onPress={() => setEditable(!editable)}
                                >
                                    <div>
                                        <NotePencilIcon />
                                    </div>
                                    {t("common.edit")}
                                </ButtonStyled>
                            ) : (
                                <div className="flex gap-2">
                                    <ButtonStyled
                                        className="border-primary 
                                            bg-white border text-primary 
                                            hover:text-white hover:bg-primary"
                                        isLoading={updateMeFormik.isSubmitting}
                                        isDisabled={
                                            !updateMeFormik.isValid || !updateMeFormik.dirty
                                        }
                                        onPress={updateMeFormik.submitForm}
                                    >
                                        {t("common.save")}
                                    </ButtonStyled>
                                    <ButtonStyled
                                        isDisabled={updateMeFormik.isSubmitting}
                                        onPress={() => {
                                            setEditable(!editable)
                                            updateMeFormik.resetForm()
                                        }}
                                    >
                                        {t("common.cancel")}
                                    </ButtonStyled>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form for update */}
                    <form
                        onSubmit={updateMeFormik.submitForm}
                        className="flex flex-col mt-5 gap-2 min-w-xl max-w-xl"
                    >
                        <div className="flex justify-center gap-2">
                            <InputStyled
                                isReadOnly={!editable}
                                label={t("user.last_name")}
                                variant="bordered"
                                value={updateMeFormik.values.lastName}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("lastName", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.lastName &&
                                        updateMeFormik.errors.lastName
                                    )
                                }
                                errorMessage={updateMeFormik.errors.lastName}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("lastName")
                                }}
                            />

                            <InputStyled
                                isReadOnly={!editable}
                                label={t("user.first_name")}
                                variant="bordered"
                                value={updateMeFormik.values.firstName}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("firstName", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.firstName &&
                                        updateMeFormik.errors.firstName
                                    )
                                }
                                errorMessage={updateMeFormik.errors.firstName}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("firstName")
                                }}
                            />
                        </div>

                        <div className="flex justify-center gap-2">
                            {/* Phone */}
                            <InputStyled
                                isRequired
                                isReadOnly={!editable}
                                variant="bordered"
                                label={t("user.phone")}
                                maxLength={10}
                                value={updateMeFormik.values.phone}
                                onValueChange={(value) =>
                                    updateMeFormik.setFieldValue("phone", value)
                                }
                                isInvalid={
                                    editable &&
                                    !!(updateMeFormik.touched.phone && updateMeFormik.errors.phone)
                                }
                                errorMessage={updateMeFormik.errors.phone}
                                onBlur={() => {
                                    updateMeFormik.setFieldTouched("phone")
                                }}
                            />

                            <EnumPicker
                                isReadOnly={!editable}
                                label={t("user.sex")}
                                labels={SexLabels}
                                value={updateMeFormik.values.sex}
                                onChange={(val) => updateMeFormik.setFieldValue("sex", val)}
                            />

                            <DatePickerStyled
                                isRequired
                                isReadOnly={!editable}
                                label={t("user.date_of_birth")}
                                isInvalid={
                                    editable &&
                                    !!(
                                        updateMeFormik.touched.dateOfBirth &&
                                        updateMeFormik.errors.dateOfBirth
                                    )
                                }
                                errorMessage={updateMeFormik.errors.dateOfBirth}
                                value={
                                    updateMeFormik.values.dateOfBirth
                                        ? toDate(updateMeFormik.values.dateOfBirth)
                                        : null
                                }
                                onChange={(value) => {
                                    if (!value) {
                                        updateMeFormik.setFieldValue("dateOfBirth", null)
                                        return
                                    }

                                    const dob = formatDateTime({ date: value })

                                    updateMeFormik.setFieldValue("dateOfBirth", dob)
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <CitizenIdentityProfile />
            <DriverLicenseProfile />
        </div>
    )
}
