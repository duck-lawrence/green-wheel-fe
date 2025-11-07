"use client"
import React from "react"
import { CardBody, CardFooter } from "@heroui/react"
import { BatteryChargingIcon, Couch, FireIcon, Users } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next"
import { formatCurrency } from "@/utils/helpers/currency"
import { CardStyled, ImageStyled } from "@/components"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { Icon } from "@iconify/react"
import { useGetBestBrandModels } from "@/hooks"
// import { DEFAULT_VEHICLE_MODEL } from "@/constants/constants"

// cắt chuỗi để chỉnh format cho đẹp =)
// function splitTitle(title: string) {
//     const parts = title.split(" ")
//     const brand = parts[0] || ""
//     const model = parts.slice(1).join(" ") || ""
//     return { brand, model }
// }

// className="gap-8 grid grid-cols-2 sm:grid-cols-3 "
export function CardVehicalStyled({ vehicleModel }: { vehicleModel: VehicleModelViewRes }) {
    const { t } = useTranslation()
    const { data: bestBrandModels } = useGetBestBrandModels()

    return (
        <CardStyled className="hover:shadow-xl interactive-scale" shadow="sm">
            <CardBody className="overflow-visible ">
                <ImageStyled
                    alt={vehicleModel.name}
                    className="w-[300px] object-cover h-[188px] shadow-lg"
                    src={vehicleModel.imageUrl}
                    width={300}
                    height={188}
                />
                {vehicleModel.availableVehicleCount === 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-xs rounded z-10">
                        {t("fleet.status_unavailable")}
                    </span>
                )}
                {bestBrandModels?.some((item) => item.modelId === vehicleModel.id) && (
                    <span
                        className="absolute flex flex-col top-3 left-3
                  text-white font-semibold bg-gradient-to-r from-primary to-teal-400 
                     shadow-md transition-all duration-300 z-10 rounded-t-0 rounded-br-md"
                    >
                        <FireIcon size={20} />
                    </span>
                )}
            </CardBody>

            <CardFooter className="flex flex-col text-small justify-between">
                <div className="flex justify-between items-center text-2xl mb-2">
                    <b>{vehicleModel.name}</b>
                </div>
                {/* </div> */}
                <hr className=" text-gray-300 border-1 w-full m-1" />

                <div className=" flex items-center justify-center mt-2 mb-2 p-2 ">
                    <span className="text-2xl font-bold text-green-600 whitespace-nowrap">
                        {formatCurrency(vehicleModel.costPerDay)} &nbsp;
                    </span>

                    <span className="text-black">{"   " + t("vehicle_model.vnd_per_day")}</span>
                </div>
                {/* segmentName */}
                <div className="grid grid-cols-2 gap-2 mt-2 mr-0 max-w-60 w-full">
                    <div className="flex gap-2 ">
                        <Couch className="flex w-6 h-6" />
                        <span>{vehicleModel.segment.name}</span>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <BatteryChargingIcon className="h-6 w-6" />
                        <span>{vehicleModel.ecoRangeKm} Km</span>
                    </div>

                    <div className="flex gap-2">
                        <Users className="h-6 w-6" />
                        <span>
                            {vehicleModel.seatingCapacity} {t("vehicle_model.seating_capacity")}
                        </span>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Icon icon="mdi:airbag" width="20" height="20" className="text-gray-700" />
                        <span>
                            {vehicleModel.numberOfAirbags} {t("vehicle_model.airbag")}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </CardStyled>
    )
}
