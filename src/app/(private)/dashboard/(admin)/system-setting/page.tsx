"use client"
import { Brand, ButtonStyled, InputStyled, SectionStyled, VehicleSegment } from "@/components"
import { BusinessVariableKey } from "@/constants/enum"
import { BusinessVariableKeyLabels } from "@/constants/labels"
import { useGetBusinessVariables, useUpdateBusinessVariables } from "@/hooks"
import { Car, Pencil, Save, Settings } from "lucide-react"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export default function SystemSettingPage() {
    const { t } = useTranslation()
    const [isEditing, setEditing] = useState(false)

    const { data: businessVariables } = useGetBusinessVariables()
    const updateBusinessVariables = useUpdateBusinessVariables()

    const [values, setValues] = useState<Record<string, string>>({})
    const handleChange = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }))
    }

    const handleUpdate = useCallback(() => {
        Object.entries(values).forEach(([id, value]) => {
            updateBusinessVariables.mutate({ id, value })
        })
    }, [updateBusinessVariables, values])

    return (
        <div className="max-w-6xl mx-auto w-full bg-white/70 p-10 rounded-2xl shadow-md border border-gray-100">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span>
                            <Settings size={25} className="mt-1" />
                        </span>
                        {t("system.system_setting")}
                    </h1>
                </div>
            </header>

            <SectionStyled title={t("system.business_variables")}>
                <div className="flex justify-end m-2">
                    {!isEditing ? (
                        <ButtonStyled
                            onPress={() => setEditing(true)}
                            className="border border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
                        >
                            <Pencil className="w-4 h-4" />
                            {t("common.edit")}
                        </ButtonStyled>
                    ) : (
                        <ButtonStyled
                            onPress={() => {
                                handleUpdate()
                                setEditing(!isEditing)
                            }}
                            color="primary"
                            className="flex items-center gap-2 hover:text-black"
                        >
                            <Save className="w-4 h-4" />
                            {t("common.save")}
                        </ButtonStyled>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {businessVariables?.map((variable) => (
                        <InputStyled
                            key={variable.id}
                            disabled={!isEditing}
                            label={BusinessVariableKeyLabels[variable.key as BusinessVariableKey]}
                            defaultValue={variable.value}
                            onChange={(e) => handleChange(variable.id, e.target.value)}
                            className={`transition-all `}
                        />
                    ))}
                </div>
            </SectionStyled>

            <SectionStyled title={t("system.brand")}>
                <Brand />
            </SectionStyled>

            <SectionStyled title={t("system.vehicle_segment")} icon={Car}>
                <VehicleSegment />
            </SectionStyled>
        </div>
    )
}
