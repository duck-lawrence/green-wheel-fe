import { ButtonStyled, InputStyled, TextareaStyled } from "@/components/styled"
import { useCreateVehicleSegment } from "@/hooks"
import { VehicleSegmentReq } from "@/models/vehicle/schema/request"
import { Spinner } from "@heroui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Building2, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function CreateVehicleSegmentForm({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation()
    const createVehicleSegment = useCreateVehicleSegment()

    const handleCreate = useCallback(
        async (req: VehicleSegmentReq) => {
            const payload: VehicleSegmentReq = {
                name: req.name,
                description: req.description
            }
            await createVehicleSegment.mutateAsync(payload)
        },
        [createVehicleSegment]
    )

    const formik = useFormik({
        initialValues: { name: "", description: "" },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(t("common.required")),
            description: Yup.string().required(t("common.required"))
        }),
        onSubmit: async (values) => {
            await handleCreate(values)
            onClose()
        }
    })
    return (
        <div className="max-w-3xl mx-auto bg-white/80 0 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("system.create_vehicle_segment")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.create_vehicle_segment_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <InputStyled
                    name="name"
                    label={t("system.segment_name")}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                    errorMessage={formik.errors.name}
                    onBlur={() => formik.setFieldTouched("name")}
                    required
                />

                <TextareaStyled
                    name="description"
                    label={t("system.brand_description")}
                    placeholder={t("system.vehicle_segment_description_placeholder")}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    isInvalid={!!(formik.touched.description && formik.errors.description)}
                    errorMessage={formik.errors.description}
                    onBlur={() => formik.setFieldTouched("description")}
                    required
                />

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        disabled={createVehicleSegment.isPending}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={createVehicleSegment.isPending}
                        className="flex items-center gap-2"
                    >
                        {createVehicleSegment.isPending ? (
                            <Spinner color="white" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> {t("common.create")}
                            </>
                        )}
                    </ButtonStyled>
                </div>
            </form>
        </div>
    )
}
