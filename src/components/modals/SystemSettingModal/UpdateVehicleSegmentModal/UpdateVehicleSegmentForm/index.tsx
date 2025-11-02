import { ButtonStyled, InputStyled, TextareaStyled } from "@/components/styled"
import { useGetVehicleSegmentById, useUpdateVehicleSegment } from "@/hooks"
import { VehicleSegmentReq } from "@/models/vehicle/schema/request"
import { useFormik } from "formik"
import { Building2, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function UpdateVehicleSegmentForm({
    id,
    onClose
}: {
    id: string
    onClose: () => void
}) {
    const { t } = useTranslation()
    const { data: vehicleSegment } = useGetVehicleSegmentById({ id, enabled: true })
    const UpdateVehicleSegmentForm = useUpdateVehicleSegment()

    const handleUpdate = useCallback(
        (id: string, req: VehicleSegmentReq) => {
            UpdateVehicleSegmentForm.mutateAsync({ id, req })
        },
        [UpdateVehicleSegmentForm]
    )

    const formik = useFormik({
        initialValues: {
            name: vehicleSegment?.name || "",
            description: vehicleSegment?.description || ""
        },
        onSubmit: async (values) => {
            await handleUpdate(id, values)
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
                        {t("system.update_vehicle_segment")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.update_vehicle_segment_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputStyled
                        name="name"
                        label={t("system.segment_name")}
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        required
                    />
                </div>

                <TextareaStyled
                    name="description"
                    label={t("system.brand_description")}
                    placeholder={t("system.vehicle_segment_description_placeholder")}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={UpdateVehicleSegmentForm.isPending}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> {t("common.create")}
                    </ButtonStyled>
                </div>
            </form>
        </div>
    )
}
