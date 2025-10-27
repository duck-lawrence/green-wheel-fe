"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
    BreadCrumbsStyled,
    ButtonStyled,
    FieldStyled,
    CreateRentalContractModal,
    TempInvoice,
    AlertStyled,
    ImageStyled
} from "@/components"
import { GasPump, UsersFour, RoadHorizon, BatteryChargingIcon } from "@phosphor-icons/react"
import { formatCurrency } from "@/utils/helpers/currency"
import { useParams, useRouter } from "next/navigation"
import {
    useBookingFilterStore,
    useGetVehicleModelById,
    useGetMe,
    useDay,
    useTokenStore
} from "@/hooks"
import { useTranslation } from "react-i18next"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { Spinner, useDisclosure } from "@heroui/react"
import { ROLE_CUSTOMER, ROLE_STAFF } from "@/constants/constants"
import toast from "react-hot-toast"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { Icon } from "@iconify/react"

export default function VehicleDetailPage() {
    const { id } = useParams()
    const modelId = id?.toString()
    const router = useRouter()

    const { t } = useTranslation()
    const { getDiffDaysCeil } = useDay()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: user } = useGetMe()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const isCustomer = useMemo(() => {
        return user?.role?.name === ROLE_CUSTOMER
    }, [user])
    const isStaff = useMemo(() => {
        return user?.role?.name === ROLE_STAFF
    }, [user])

    // handle render picture
    const [active, setActive] = useState(0)

    const stationId = useBookingFilterStore((s) => s.stationId)
    const startDate = useBookingFilterStore((s) => s.startDate)
    const endDate = useBookingFilterStore((s) => s.endDate)

    const {
        data: model,
        isLoading: isModelLoading,
        error: modelError
    } = useGetVehicleModelById({
        modelId: modelId || "",
        query: {
            stationId: stationId || "",
            startDate: startDate || "",
            endDate: endDate || ""
        }
    })
    const subImgUrls = useMemo(() => {
        if (!model) return []
        return [model.imageUrl, ...model.imageUrls].filter((img) => !!img)
    }, [model])

    // redirect if filter not valid
    useEffect(() => {
        if (!stationId || !startDate || !endDate) {
            toast.error(t("vehicle_filter.require"))
            router.replace("/vehicle-rental")
        }
        if (modelError) {
            const error = modelError as BackendError
            toast.error(translateWithFallback(t, error.detail))
            router.replace("/vehicle-rental")
        }
    }, [endDate, modelError, router, startDate, stationId, t])

    const { totalDays, totalPrice } = useMemo(() => {
        if (!model) return { totalDays: 0, totalPrice: 0 }

        const totalDays = getDiffDaysCeil({ startDate, endDate })
        return {
            totalDays,
            totalPrice: totalDays * model.costPerDay + model.depositFee
        }
    }, [endDate, getDiffDaysCeil, model, startDate])

    // display item similar
    // const similarVehicles = vehicleModels
    //     .filter((v) => v.id !== id)
    //     .sort(() => Math.random() - 0.5)
    //     .slice(0, 3)

    const handleClickBooking = useCallback(() => {
        if (
            !user?.phone
            // || !user.citizenUrl || !user.licenseUrl
        ) {
            toast.error(t("user.enter_required_info"))
        } else {
            onOpen()
        }
    }, [onOpen, t, user])

    function mapSpecs(vehicle: VehicleModelViewRes) {
        return [
            {
                icon: <UsersFour size={18} />,
                key: t("vehicle_model.seating_capacity"),
                value: vehicle.seatingCapacity.toString()
            },
            {
                icon: <GasPump size={18} weight="duotone" />,
                key: t("vehicle_model.motor_power"),
                value: vehicle.motorPower + " kW"
            },
            {
                icon: <BatteryChargingIcon size={18} />,
                key: t("vehicle_model.battery_capacity"),
                value: vehicle.batteryCapacity + " kWh"
            },
            {
                icon: <RoadHorizon size={18} />,
                key: t("vehicle_model.eco_range_km"),
                value: vehicle.ecoRangeKm + " km"
            },
            {
                icon: <RoadHorizon size={18} />,
                key: t("vehicle_model.sport_range_km"),
                value: vehicle.sportRangeKm + " km"
            },
            {
                icon: <Icon icon="mdi:airbag" width="18" height="18" className="text-primary" />,
                key: t("vehicle_model.airbag"),
                value: vehicle.numberOfAirbags.toString()
            }
        ]
    }

    // const basePolicies = (deposite: number) => [
    const basePolicies = () => [
        { title: "Giấy tờ", text: "CCCD gắn chip + GPLX B1 trở lên." },
        // { title: "Cọc", text: `${deposite}đ hoặc xe máy giấy tờ chính chủ. ` },
        {
            title: "Phụ phí",
            text: "Phát sinh giờ: quá 45 phút tính phụ phí 10%/giờ, quá 5 giờ tính 1 ngày."
        },
        {
            title: "Hình thức thanh toán",
            text: "Trả trước. Thời hạn thanh toán: đặt cọc giữ xe thanh toán 100% khi kí hợp đồng và nhận xe"
        }
    ]

    if (!model || isModelLoading) return <Spinner />

    return (
        <div className="min-h-dvh bg-neutral-50 text-neutral-900 rounded">
            <CreateRentalContractModal
                isOpen={isOpen}
                isCustomer={isCustomer}
                isStaff={isStaff}
                onClose={onClose}
                modelViewRes={model}
                totalDays={totalDays}
                totalPrice={totalPrice}
            />

            {/* Breadcrumb */}
            <div className="p-4">
                <BreadCrumbsStyled
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Vehicle Rental", href: "/vehicle-rental" },
                        { label: "Detail", href: "/detail" }
                    ]}
                />
            </div>

            {/* Header */}
            <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <div className="flex gap-2 items-center">
                            <h1 className="text-3xl/tight sm:text-4xl font-bold tracking-tight">
                                {model.name}
                            </h1>
                            <p className="text-3xl/tight sm:text-[2.1rem] font-semibold text-neutral-600">
                                {`- ${model.description}`}
                            </p>
                        </div>
                        {/* <p className="mt-1 text-sm text-neutral-500">
                            Hãng xe: <span className="font-medium">{vehicle.brand_name}</span> •
                            Phân khúc: <span className="font-medium">{vehicle.segment_name}</span>
                        </p> */}
                        <p className="text-lg text-neutral-500 font-semibold">
                            {t("vehicle_model.remaining_vehicle_count")} &nbsp;
                            <span className="font-extrabold text-emerald-600">
                                {model.availableVehicleCount}
                            </span>
                        </p>
                    </div>
                    {/*  font-extrabold*/}
                    <div className="text-right">
                        <p className="text-2xl sm:text-3xl font-semibold text-emerald-600">
                            {formatCurrency(model.costPerDay)} &nbsp;
                            <span className="text-base font-normal text-neutral-500">
                                {t("vehicle_model.vnd_per_day")}
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Gallery */}
                <section className="lg:col-span-8">
                    {/* Images */}
                    <div className="grid grid-rows-4 gap-3">
                        <div
                            className={`${
                                subImgUrls.length > 0 ? "row-span-3" : "row-span-4"
                            } aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-200`}
                        >
                            <motion.img
                                key={active}
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35 }}
                                src={model.imageUrls && model.imageUrls[active]}
                                alt={`${model.name} - ${active + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* List sub img */}
                        {subImgUrls.length > 0 && (
                            <div className="row-span-1 grid grid-cols-4 gap-3">
                                {subImgUrls.map((src, idx) => (
                                    <button
                                        key={src}
                                        onClick={() => setActive(idx)}
                                        className={`group relative aspect-[4/3] overflow-hidden rounded-2xl outline-none ring-2 ring-transparent focus:ring-emerald-500 ${
                                            active === idx ? "ring-emerald-500" : ""
                                        }`}
                                    >
                                        <ImageStyled
                                            src={src}
                                            alt={`thumb ${idx + 1}`}
                                            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thông số */}
                    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">{t("vehicle_model.specs")}</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {mapSpecs(model).map(({ icon, key, value }) => (
                                // <div key={key} className="rounded-xl border border-neutral-200 p-4">
                                //     <p className="text-xs uppercase tracking-wide text-neutral-500">
                                //         {key}
                                //     </p>
                                //     <p className="mt-1 font-medium">{value}</p>
                                // </div>
                                <FieldStyled key={key} label={key} value={value} icon={icon} />
                            ))}
                        </div>
                    </div>

                    {/*================ Policies =======================*/}
                    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-2">
                            {basePolicies().map((p) => (
                                <div key={p.title} className="rounded-2xl bg-white p-5 shadow-sm">
                                    <h3 className="font-semibold">{p.title}</h3>
                                    <p className="mt-1 text-sm text-neutral-600">{p.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>
                {/* ========================================================= */}
                {/* Booking Card (sticky on desktop) */}
                {/* lỗi nên chưa làm en chỗ này */}
                <aside className="self-start lg:col-span-4 lg:sticky lg:top-30 space-y-6">
                    <div className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-100">
                        <h2 className="text-lg font-semibold">{t("invoice.temp")}</h2>
                        <div className="mt-4 grid gap-4">
                            {/* Đơn tạm tính */}
                            <TempInvoice
                                model={model}
                                totalDays={totalDays}
                                totalPrice={totalPrice}
                            />

                            <div>
                                <ButtonStyled
                                    isDisabled={
                                        model.availableVehicleCount == 0 ||
                                        (!isCustomer && !isStaff)
                                    }
                                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    onPress={handleClickBooking}
                                >
                                    {t("rental_contract.rent")}
                                </ButtonStyled>
                                {!isLogined && (
                                    <AlertStyled className="mt-1">
                                        {t("rental_contract.please_login")}
                                    </AlertStyled>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    )
}
