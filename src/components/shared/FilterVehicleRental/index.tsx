"use client"
import React, { useCallback, useEffect, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { CalendarDateTime, fromDate } from "@internationalized/date"
import { useTranslation } from "react-i18next"
import { AutocompleteItem, cn, Spinner } from "@heroui/react"
import { MapPinAreaIcon } from "@phosphor-icons/react"
import { AutocompleteStyle, DateTimeStyled } from "@/components"
import { useBookingFilterStore, useDay, useGetAllStations, useGetAllVehicleSegments } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import toast from "react-hot-toast"
import { DEFAULT_TIMEZONE, MAX_HOUR, MIN_HOUR } from "@/constants/constants"
import dayjs from "dayjs"
import { useSearchVehicleModels } from "@/hooks/queries/useVehicleModel"

export function FilterVehicleRental({ className = "" }: { className?: string }) {
    const { t } = useTranslation()
    const { formatDateTime, toCalenderDateTime } = useDay({})
    const {
        data: stations,
        isLoading: isGetStationsLoading,
        error: getStationsError,
        isError: isGetStationsError
    } = useGetAllStations()

    const {
        data: vehicleSegments,
        isLoading: isGetVehicleSegmentsLoading,
        error: getVehicleSegmentsError,
        isError: isGetVehicleSegmentsError
    } = useGetAllVehicleSegments()

    // manage filter store
    const stationId = useBookingFilterStore((s) => s.stationId)
    const segmentId = useBookingFilterStore((s) => s.segmentId)
    const startDate = useBookingFilterStore((s) => s.startDate)
    const endDate = useBookingFilterStore((s) => s.endDate)
    const setStationId = useBookingFilterStore((s) => s.setStationId)
    const setSegmentId = useBookingFilterStore((s) => s.setSegmentId)
    const setStartDate = useBookingFilterStore((s) => s.setStartDate)
    const setEndDate = useBookingFilterStore((s) => s.setEndDate)
    const setFilteredVehicleModels = useBookingFilterStore((s) => s.setFilteredVehicleModels)

    // setup date time
    const { minStartDate, minEndDate } = useMemo(() => {
        const zonedNow = fromDate(new Date(), DEFAULT_TIMEZONE)
        const nowTime = new CalendarDateTime(
            zonedNow.year,
            zonedNow.month,
            zonedNow.day,
            zonedNow.hour,
            zonedNow.minute
        )

        const isAfterMax = nowTime.hour + 3 >= MAX_HOUR
        const isBeforeMin = nowTime.hour + 3 < MIN_HOUR

        const initialStart =
            isBeforeMin || isAfterMax
                ? nowTime
                      .add({ days: isAfterMax ? 1 : 0 })
                      .set({ hour: MIN_HOUR, minute: 0, second: 0 })
                : nowTime.set({ hour: nowTime.hour + 3, second: 0 })

        return {
            minStartDate: initialStart,
            minEndDate: initialStart.add({ days: 1 })
        }
    }, [])

    useEffect(() => {
        if (!startDate) setStartDate(formatDateTime({ date: minStartDate }))
        if (!endDate) setEndDate(formatDateTime({ date: minEndDate }))
    }, [endDate, formatDateTime, minEndDate, minStartDate, setEndDate, setStartDate, startDate])

    // get models
    const { getCachedOrFetch } = useSearchVehicleModels({
        query: {
            stationId: stationId || "",
            startDate: startDate || formatDateTime({ date: minStartDate }),
            endDate: endDate || formatDateTime({ date: minEndDate }),
            segmentId
        }
    })

    const handleSearch = useCallback(async () => {
        const data = await getCachedOrFetch()
        setFilteredVehicleModels(data || [])
    }, [getCachedOrFetch, setFilteredVehicleModels])

    //  Validation schema
    const bookingSchema = useMemo(
        () =>
            Yup.object().shape({
                startDate: Yup.string()
                    .required(t("vehicle_filter.start_date_require"))
                    .test(
                        "is-valid-start-date",
                        t("vehicle_filter.invalid_start_date"),
                        (value) => {
                            const valueDatetime = toCalenderDateTime(value)
                            console.log(valueDatetime?.toString())
                            if (valueDatetime)
                                console.log(`result: ${valueDatetime.compare(minStartDate)}`)

                            return (
                                !!valueDatetime &&
                                valueDatetime.compare(minStartDate) >= 0 &&
                                valueDatetime.hour >= MIN_HOUR &&
                                valueDatetime.hour <= MAX_HOUR
                            )
                        }
                    ),
                endDate: Yup.string()
                    .required(t("vehicle_filter.return_date_require"))
                    .test(
                        "is-valid-end-date-range",
                        t("vehicle_filter.invalid_end_date_range"),
                        (value) => {
                            const valueDatetime = toCalenderDateTime(value)
                            return (
                                !!valueDatetime &&
                                valueDatetime.hour >= MIN_HOUR &&
                                valueDatetime.hour <= MAX_HOUR
                            )
                        }
                    )
                    .test(
                        "is-valid-min-end-date",
                        t("vehicle_filter.min_end_date"),
                        function (this: Yup.TestContext, value) {
                            const { startDate } = this.parent as { startDate?: string }
                            if (!startDate || !value) return true

                            return dayjs(startDate).isBefore(
                                dayjs(value).add(-1, "day").add(1, "minute")
                            )
                        }
                    )
            }),
        [minStartDate, t, toCalenderDateTime]
    )

    //  useFormik
    const formik = useFormik({
        initialValues: {
            stationId: stationId,
            segmentId: segmentId,
            startDate: startDate || minStartDate.toString(),
            endDate: endDate || minEndDate.toString()
        },
        validationSchema: bookingSchema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: true,
        onSubmit: () => {
            setStationId(formik.values.stationId)
            setSegmentId(formik.values.segmentId)
            setStartDate(formik.values.startDate)
            setEndDate(formik.values.endDate)
            handleSearch()
            formik.setSubmitting(false)
        }
    })

    // Load station
    useEffect(() => {
        if (!stationId && !isGetStationsLoading && stations!?.length > 0) {
            formik.values.stationId = stations![0].id
            setStationId(stations![0].id)
        }
        if (getStationsError) {
            const error = getStationsError as BackendError
            toast.error(translateWithFallback(t, error.detail))
        }
    }, [
        formik.values,
        getStationsError,
        isGetStationsLoading,
        setStationId,
        stationId,
        stations,
        t
    ])

    // Load segment
    useEffect(() => {
        if (getVehicleSegmentsError) {
            const error = getVehicleSegmentsError as BackendError
            toast.error(translateWithFallback(t, error.detail))
        }
    }, [getVehicleSegmentsError, t])

    // load filtered vehicle when enter page and if form is valid
    useEffect(() => {
        if (!formik.isValid) return

        const run = async () => {
            await handleSearch()
        }
        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (
        isGetStationsLoading ||
        isGetStationsError ||
        isGetVehicleSegmentsLoading ||
        isGetVehicleSegmentsError
    )
        return <Spinner />

    return (
        <>
            <form
                onSubmit={formik.handleSubmit}
                className={cn(
                    "bg-secondary border border-gray-300 rounded-4xl shadow-2xl",
                    "px-8 py-3 mx-auto max-w-screen md:w-3xl lg:w-4xl",
                    "flex gap-4 justify-center flex-col sm:flex-row",
                    className
                )}
            >
                {/* Left section */}
                <div>
                    <div className="grid md:flex gap-4">
                        <AutocompleteStyle
                            className="md:w-50"
                            label={t("vehicle_model.station")}
                            items={stations}
                            startContent={<MapPinAreaIcon className="text-xl" />}
                            selectedKey={formik.values.stationId}
                            onSelectionChange={async (id) => {
                                await formik.setFieldValue("stationId", id)
                                formik.handleSubmit()
                            }}
                            isClearable={false}
                        >
                            {(stations ?? []).map((item) => (
                                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                            ))}
                        </AutocompleteStyle>

                        <AutocompleteStyle
                            className="md:w-36"
                            label={t("vehicle_model.segment")}
                            items={vehicleSegments}
                            selectedKey={formik.values.segmentId}
                            onSelectionChange={async (id) => {
                                await formik.setFieldValue("segmentId", id)
                                formik.handleSubmit()
                            }}
                        >
                            {(vehicleSegments ?? []).map((item) => (
                                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                            ))}
                        </AutocompleteStyle>
                    </div>
                    <div className="hidden md:block">{`${t("station.address")}: ${
                        stations?.find((station) => station.id === formik.values.stationId)?.address
                    }`}</div>
                </div>

                {/* Right section */}
                <div className="md:w-md">
                    <div className="grid md:flex gap-4">
                        {/* STARTDate */}
                        <DateTimeStyled
                            label={t("vehicle_model.start_date_time")}
                            value={toCalenderDateTime(formik.values.startDate)}
                            minValue={minStartDate}
                            isInvalid={!!formik.errors.startDate}
                            onChange={async (value) => {
                                if (!value) {
                                    formik.setFieldValue("startDate", null)
                                    return
                                }
                                const date = formatDateTime({ date: value })
                                await formik.setFieldValue("startDate", date)
                                formik.handleSubmit()
                            }}
                        />

                        {/* ENDDate */}
                        <DateTimeStyled
                            label={t("vehicle_model.end_date_time")}
                            value={toCalenderDateTime(formik.values.endDate)}
                            minValue={
                                toCalenderDateTime(formik.values.startDate)?.add({ days: 1 }) ||
                                minEndDate
                            }
                            isInvalid={!!formik.errors.endDate}
                            onChange={async (value) => {
                                if (!value) {
                                    formik.setFieldValue("endDate", null)
                                    return
                                }
                                const date = formatDateTime({ date: value })
                                await formik.setFieldValue("endDate", date)
                                formik.handleSubmit()
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-danger-500 text-small">{formik.errors.startDate}</div>
                        <div className="text-danger-500 text-small">{formik.errors.endDate}</div>
                    </div>
                </div>
            </form>
        </>
    )
}
