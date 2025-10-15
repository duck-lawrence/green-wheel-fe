export const useName = () => {
    const toFullName = ({ firstName, lastName }: { firstName?: string; lastName?: string }) => {
        return `${lastName || ""} ${firstName || ""}`
    }

    return { toFullName }
}
