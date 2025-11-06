"use client"
import { ButtonStyled, InputStyled } from "@/components/styled"
import { useCreateStation } from "@/hooks"
import { StationViewReq } from "@/models/station/schema/request"
import { Spinner } from "@heroui/react"
import { useFormik } from "formik"
import { MapPin, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function CreateStation({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation()
    const createStation = useCreateStation()

    const handleCreate = useCallback(
        async (req: StationViewReq) => {
            const payload: StationViewReq = {
                name: req.name,
                address: req.address
            }
            await createStation.mutateAsync(payload)
        },
        [createStation]
    )

    const formik = useFormik({
        initialValues: { name: "", address: "" },
        onSubmit: async (values) => {
            await handleCreate(values)
            onClose()
        }
    })
    return (
        <div className="max-w-3xl mx-auto bg-white/80 0 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <MapPin className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("system.create_station")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.create_station_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputStyled
                        name="name"
                        label={t("system.station_name")}
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        required
                    />
                    <InputStyled
                        name="address"
                        label={t("system.station_address")}
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        disabled={createStation.isPending}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={createStation.isPending}
                        className="flex items-center gap-2"
                    >
                        {createStation.isPending ? (
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
