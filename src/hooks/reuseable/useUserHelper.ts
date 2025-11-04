import { UserProfileViewRes } from "@/models/user/schema/response"

export const useUserHelper = () => {
    const toFullName = ({ firstName, lastName }: { firstName?: string; lastName?: string }) => {
        return `${lastName || ""} ${firstName || ""}`
    }

    const isUserValidForBooking = (user?: UserProfileViewRes) => {
        if (!user) return false
        return !!(user.phone && user.dateOfBirth && user.citizenUrl && user.licenseUrl)
    }

    return { toFullName, isUserValidForBooking }
}
