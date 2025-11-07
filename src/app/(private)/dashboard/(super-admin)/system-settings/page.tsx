"use client"
import {
    Brand,
    ButtonStyled,
    NumberInputStyled,
    SectionStyled,
    Station,
    VehicleSegment
} from "@/components"
import { BusinessVariableKeyLabels } from "@/constants/labels"
import { useGetBusinessVariables, useUpdateBusinessVariables } from "@/hooks"
import { Car, LocateFixed, Pencil, Save, Settings } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function SystemSettingPage() {
    const { t } = useTranslation()
    const [isEditing, setEditing] = useState(false)
    const [initialValues, setInitialValues] = useState<Record<string, number>>({})
    const [values, setValues] = useState<Record<string, number>>({})

    const { data: businessVariables } = useGetBusinessVariables()
    const updateBusinessVariables = useUpdateBusinessVariables()

    const handleChange = (id: string, value: number) => {
        setValues((prev) => ({ ...prev, [id]: value }))
    }

    const handleUpdate = useCallback(() => {
        Object.entries(values).forEach(([id, value]) => {
            if (value !== initialValues[id]) {
                updateBusinessVariables.mutate({ id, value })
            }
        })
        setEditing(false)
    }, [values, initialValues, updateBusinessVariables])

    const handleCancel = useCallback(() => {
        setValues(initialValues)
        setEditing(false)
    }, [initialValues, setValues])

    useEffect(() => {
        if (businessVariables) {
            const mapped = Object.fromEntries(businessVariables.map((v) => [v.id, v.value]))
            setInitialValues(mapped)
            setValues(mapped)
        }
    }, [businessVariables, setValues])

    return (
        <div className="max-w-6xl mx-auto w-full">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl mb-3 font-bold flex gap-1">
                    <span>
                        <Settings size={25} className="mt-2" />
                    </span>
                    {t("system.system_setting")}
                </h1>
            </header>

            <div className="w-full shadow-lg rounded-2xl p-6 mb-6">
                <SectionStyled title={t("system.business_variables")}>
                    <div className="flex justify-end m-2">
                        {!isEditing ? (
                            <ButtonStyled
                                onPress={() => setEditing(true)}
                                isDisabled={updateBusinessVariables.isPending}
                                className="btn-gradient flex items-center gap-2"
                            >
                                <Pencil className="w-4 h-4" />
                                {t("common.edit")}
                            </ButtonStyled>
                        ) : (
                            <div className="flex gap-2">
                                <ButtonStyled
                                    isDisabled={updateBusinessVariables.isPending}
                                    onPress={() => {
                                        handleUpdate()
                                        setEditing(!isEditing)
                                    }}
                                    color="primary"
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {t("common.save")}
                                </ButtonStyled>
                                <ButtonStyled
                                    isDisabled={updateBusinessVariables.isPending}
                                    onPress={() => {
                                        handleCancel()
                                        setEditing(!isEditing)
                                    }}
                                >
                                    {t("common.cancel")}
                                </ButtonStyled>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {businessVariables?.map((variable) => {
                            const value = values[variable.id] ?? 0

                            return (
                                <NumberInputStyled
                                    key={variable.id}
                                    disabled={!isEditing || updateBusinessVariables.isPending}
                                    label={BusinessVariableKeyLabels[variable.key]}
                                    step={0.01}
                                    minValue={0}
                                    value={value}
                                    onValueChange={(val) => handleChange(variable.id, val)}
                                />
                            )
                        })}
                    </div>
                </SectionStyled>
            </div>

            <div className="w-full shadow-lg rounded-2xl p-6 mb-6">
                <SectionStyled title={t("system.station")} icon={LocateFixed}>
                    <Station />
                </SectionStyled>
            </div>

            <div className="w-full shadow-lg rounded-2xl p-6 mb-6">
                <SectionStyled title={t("system.brand")}>
                    <Brand />
                </SectionStyled>
            </div>

            <div className="w-full shadow-lg rounded-2xl p-6 mb-6">
                <SectionStyled title={t("system.vehicle_segment")} icon={Car}>
                    <VehicleSegment />
                </SectionStyled>
            </div>
        </div>
    )
}
