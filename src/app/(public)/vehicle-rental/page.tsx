"use client"
import { FilterVehicleRental, CardVehicalStyled } from "@/components"
import { useBookingFilterStore, useNavbarItemStore } from "@/hooks"
import { Spinner } from "@heroui/react"
import Link from "next/link"
import React, { useEffect } from "react"

export default function VehicleModelsPage() {
    const setActiveMenuKey = useNavbarItemStore((s) => s.setActiveMenuKey)
    const vehicleModels = useBookingFilterStore((s) => s.filteredVehicleModels)
    // const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData)
    useEffect(() => {
        setActiveMenuKey("vehicle-rental")
    }, [setActiveMenuKey])

    return (
        <div className="min-h-[80vh] h-fit max-w-screen p-4">
            <FilterVehicleRental />

            <div className="mt-10 gap-8 grid grid-cols-2 sm:grid-cols-3 ">
                {vehicleModels ? (
                    vehicleModels.map((vehicleModel) => (
                        <Link key={vehicleModel.id} href={`/vehicle-rental/${vehicleModel.id}`}>
                            <CardVehicalStyled vehicleModel={vehicleModel} />
                        </Link>
                    ))
                ) : (
                    <Spinner />
                )}
            </div>
        </div>
    )
}
