// "use client"

// import { EnumPicker } from "@/components/modules"
// import { ButtonStyled, InputStyled } from "@/components/styled"
// import { RentalContractStatus } from "@/constants/enum"
// import { RentalContractStatusLabels } from "@/constants/labels"
// import { useFormik } from "formik"
// import React, { useMemo } from "react"
// import { useTranslation } from "react-i18next"
// import * as Yup from "yup"
// import { FunnelSimple } from "@phosphor-icons/react"
// import { ContractQueryParams } from "@/models/rental-contract/schema/request"

// export default function FilterContractStaff({
//     onFilterChange
// }: {
//     onFilterChange: (values: ContractQueryParams) => void
// }) {
//     const { t } = useTranslation()

//     const initialValues = useMemo(
//         () => ({
//             status: null as RentalContractStatus | null,
//             phone: "",
//             citizenIdentityNumber: "",
//             driverLicense: ""
//         }),
//         []
//     )

//     const validationSchema = useMemo(() => {
//         return Yup.object({
//             status: Yup.mixed<RentalContractStatus>().nullable(),
//             phone: Yup.string(),
//             citizenIdentityNumber: Yup.string(),
//             driverLicense: Yup.string()
//         })
//     }, [])

//     const formik = useFormik({
//         initialValues,
//         validationSchema,
//         onSubmit: (values) => (console.log(values), onFilterChange(values))
//     })

//     return (
//         <form
//             onSubmit={formik.handleSubmit}
//             className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5
//                  flex flex-col gap-6 md:gap-8"
//         >
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                     <FunnelSimple size={22} className="text-primary" />
//                     {t("staff.handovers_filters_title") || "Contract Filters"}
//                 </h3>
//                 <ButtonStyled
//                     type="submit"
//                     className="btn-gradient
//                      px-6 py-2 rounded-lg"
//                 >
//                     {t("staff.handovers_filters_search") || "Search"}
//                 </ButtonStyled>
//             </div>

//             {/* Filter inputs */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <EnumPicker
//                     label="Status"
//                     labels={RentalContractStatusLabels}
//                     value={formik.values.status ?? null}
//                     onChange={(val) => formik.setFieldValue("status", val)}
//                 />
//                 <InputStyled
//                     label="Phone"
//                     placeholder="e.g. 0901234567"
//                     value={formik.values.phone}
//                     onChange={(value) => formik.setFieldValue("phone", value.target.value)}
//                     onClear={() => formik.setFieldValue("phone", "")}
//                 />
//                 <InputStyled
//                     label="Citizen ID"
//                     placeholder="e.g. 079123456789"
//                     value={formik.values.citizenIdentityNumber}
//                     onChange={(value) =>
//                         formik.setFieldValue("citizenIdentityNumber", value.target.value)
//                     }
//                     onClear={() => formik.setFieldValue("citizenIdentityNumber", "")}
//                 />
//                 <InputStyled
//                     label="Driver License"
//                     placeholder="e.g. 60K-99999"
//                     value={formik.values.driverLicense}
//                     onChange={(value) => formik.setFieldValue("driverLicense", value.target.value)}
//                     onClear={() => formik.setFieldValue("driverLicense", "")}
//                 />
//             </div>
//         </form>
//     )
// }
