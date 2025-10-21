import { DEFAULT_DATE_TIME_FORMAT, DEFAULT_TIMEZONE } from "@/constants/constants"
import dayjs from "dayjs"
import { DateValue, parseDate, parseZonedDateTime } from "@internationalized/date"

export const useDay = ({
    defaultFormat = DEFAULT_DATE_TIME_FORMAT,
    timeZone = DEFAULT_TIMEZONE
}: {
    defaultFormat?: string
    timeZone?: string
} = {}) => {
    const toZonedDateTime = (dateTime: string | number | Date | dayjs.Dayjs | null | undefined) => {
        if (!dateTime) return null
        const d = dayjs(dateTime)
        const str = `${d.format(defaultFormat)}[${timeZone}]`
        return parseZonedDateTime(str)
    }

    const toDate = (date: string | number | Date | dayjs.Dayjs | null | undefined) => {
        if (!date) return null
        const str = dayjs(date).format(defaultFormat)
        return parseDate(str)
    }

    const formatDateTime = ({
        date,
        timeZone = DEFAULT_TIMEZONE
    }: {
        date: DateValue | string
        timeZone?: string
    }): string => {
        if (!date) return ""
        if (typeof date === "string") {
            return dayjs(date).format(defaultFormat)
        }

        const dateJs = dayjs(date.toDate(timeZone))
        return dateJs.format(defaultFormat)
    }

    const getDiffDaysCeil = ({
        startDate,
        endDate
    }: {
        startDate?: string | Date | dayjs.Dayjs | null
        endDate?: string | Date | dayjs.Dayjs | null
    }) => {
        if (!startDate || !endDate) return -1
        return Math.ceil(dayjs(endDate).diff(dayjs(startDate), "day", true))
    }

    return { toDate, toZonedDateTime, formatDateTime, getDiffDaysCeil }
}
