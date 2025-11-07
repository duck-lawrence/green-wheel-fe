import { ButtonStyled, InputStyled, TextareaStyled } from "@/components/styled"
import { useGetStationById, useUpdateStation } from "@/hooks"
import { StationUpdateReq } from "@/models/station/schema/request"
import { Spinner } from "@heroui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { LocationEdit, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function UpdateStationForm({ id, onClose }: { id: string; onClose: () => void }) {
    const { t } = useTranslation()
    const updateStation = useUpdateStation()
    const { data: station } = useGetStationById({ id, enabled: !!id })

    const handleUpdate = useCallback(
        async (id: string, updatedData: StationUpdateReq) => {
            await updateStation.mutateAsync({
                id,
                req: updatedData
            })
            onClose()
        },
        [updateStation, onClose]
    )

    const formik = useFormik({
        initialValues: {
            name: station?.name || "",
            address: station?.address || ""
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            name: Yup.string().required(t("common.required")),
            address: Yup.string().required(t("common.required"))
        }),
        onSubmit: async (values) => {
            await handleUpdate(id, values)
            onClose()
        }
    })
    return (
        <div className="max-w-3xl mx-auto bg-white/80 0 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <LocationEdit className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("system.update_station")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.update_station_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <InputStyled
                    name="name"
                    label={t("system.station_name")}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                    errorMessage={formik.errors.name}
                    onBlur={() => formik.setFieldTouched("name")}
                    required
                />

                <TextareaStyled
                    name="address"
                    label={t("system.station_address")}
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    isInvalid={!!(formik.touched.address && formik.errors.address)}
                    errorMessage={formik.errors.address}
                    onBlur={() => formik.setFieldTouched("address")}
                    required
                />

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        disabled={updateStation.isPending}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={updateStation.isPending}
                        className="flex items-center gap-2"
                    >
                        {updateStation.isPending ? (
                            <Spinner color="white" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> {t("common.update")}
                            </>
                        )}
                    </ButtonStyled>
                </div>
            </form>
        </div>
    )
}
