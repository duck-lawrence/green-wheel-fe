export const useNumber = () => {
    const parseNumber = (value: string | null) => {
        if (!value) return null
        const trimmed = value.trim()
        const isValid = /^-?\d+(\.\d+)?$/.test(trimmed)
        return isValid ? Number(trimmed) : null
    }

    return { parseNumber }
}
