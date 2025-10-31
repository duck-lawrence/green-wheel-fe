// "use client"

// import { ButtonIconStyled, ButtonStyled, InputStyled } from "@/components/"
// import { useDeleteBankAccount, useUpdateBankAccount } from "@/hooks"
// import { Spinner } from "@heroui/react"
// import { NotePencilIcon } from "@phosphor-icons/react"
// import { useFormik } from "formik"
// import React, { useCallback, useState } from "react"
// import { useTranslation } from "react-i18next"
// import * as Yup from "yup"
// import { UserProfileViewRes } from "@/models/user/schema/response"
// import { UpdateBankAccountReq } from "@/models/user/schema/request"

// export function BankInfoProfile({ user }: { user: UserProfileViewRes }) {
//     const { t } = useTranslation()
//     const [editable, setEditable] = useState(false)
//     const updateMutation = useUpdateBankAccount({ onSuccess: undefined })
//     const deleteMutation = useDeleteBankAccount({ onSuccess: undefined })

//     const handleUpdate = useCallback(
//         async (req: UpdateBankAccountReq) => {
//             await updateMutation.mutateAsync(req)
//             setEditable((prev) => !prev)
//         },
//         [updateMutation]
//     )

//     const handleDelete = useCallback(async () => {
//         await deleteMutation.mutateAsync()
//         setEditable((prev) => !prev)
//     }, [deleteMutation])

//     const formik = useFormik<UpdateBankAccountReq>({
//         enableReinitialize: true,
//         initialValues: {
//             bankName: user.bankName || "",
//             bankAccountNumber: user.bankAccountNumber || "",
//             bankAccountName: user.bankAccountName || ""
//         },
//         validationSchema: Yup.object({
//             bankName: Yup.string().required(t("user.bank_account_name_require")),
//             bankAccountNumber: Yup.string()
//                 .matches(/^\d+$/, t("user.invalid_bank_account_number"))
//                 .required(t("user.bank_account_number_require")),
//             bankAccountName: Yup.string().required(t("user.bank_account_name_require"))
//         }),
//         onSubmit: handleUpdate
//     })

//     return (
//         <>
//             <div className="flex flex-wrap justify-between text-2xl mb-2 font-bold">
//                 {t("user.bank_account_info")}
//                 <div className="flex justify-end">
//                     {!editable ? (
//                         <ButtonIconStyled
//                             color="primary"
//                             variant="ghost"
//                             onPress={() => setEditable(!editable)}
//                         >
//                             <NotePencilIcon />
//                         </ButtonIconStyled>
//                     ) : formik.isSubmitting || deleteMutation.isPending ? (
//                         <Spinner />
//                     ) : (
//                         <div className="flex flex-col items-end gap-2">
//                             <div className="flex gap-2">
//                                 <ButtonStyled
//                                     color="primary"
//                                     variant="ghost"
//                                     isDisabled={!formik.isValid || !formik.dirty}
//                                     onPress={formik.submitForm}
//                                 >
//                                     {t("common.save")}
//                                 </ButtonStyled>
//                                 <ButtonStyled onPress={handleDelete}>
//                                     {t("common.delete")}
//                                 </ButtonStyled>
//                                 <ButtonStyled
//                                     onPress={() => {
//                                         setEditable(!editable)
//                                         formik.resetForm()
//                                     }}
//                                 >
//                                     {t("common.cancel")}
//                                 </ButtonStyled>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <div className="mb-8">
//                 {/* Button enable show change */}
//                 <form
//                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
//                     onSubmit={formik.submitForm}
//                 >
//                     <InputStyled
//                         isReadOnly={!editable}
//                         label={t("user.bank_name")}
//                         variant="bordered"
//                         value={formik.values.bankName}
//                         onValueChange={(value) => formik.setFieldValue("bankName", value)}
//                         isInvalid={
//                             editable && !!(formik.touched.bankName && formik.errors.bankName)
//                         }
//                         errorMessage={formik.errors.bankName}
//                         onBlur={() => {
//                             formik.setFieldTouched("bankName")
//                         }}
//                     />

//                     <InputStyled
//                         isReadOnly={!editable}
//                         label={t("user.bank_account_number")}
//                         variant="bordered"
//                         value={formik.values.bankAccountNumber}
//                         onValueChange={(value) => formik.setFieldValue("bankAccountNumber", value)}
//                         isInvalid={
//                             editable &&
//                             !!(formik.touched.bankAccountNumber && formik.errors.bankAccountNumber)
//                         }
//                         errorMessage={formik.errors.bankAccountNumber}
//                         onBlur={() => {
//                             formik.setFieldTouched("bankAccountNumber")
//                         }}
//                     />

//                     <InputStyled
//                         isReadOnly={!editable}
//                         label={t("user.bank_account_name")}
//                         variant="bordered"
//                         value={formik.values.bankAccountName}
//                         onValueChange={(value) => formik.setFieldValue("bankAccountName", value)}
//                         isInvalid={
//                             editable &&
//                             !!(formik.touched.bankAccountName && formik.errors.bankAccountName)
//                         }
//                         errorMessage={formik.errors.bankAccountName}
//                         onBlur={() => {
//                             formik.setFieldTouched("bankAccountName")
//                         }}
//                     />
//                 </form>
//             </div>
//         </>
//     )
// }
