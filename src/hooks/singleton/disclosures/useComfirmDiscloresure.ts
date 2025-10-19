import { DisclosureContext } from "@/providers/DisclosureProvider/DisclosureContext"
import { useDisclosure } from "@heroui/react"
import { useContext } from "react"

export const useConfirmDiscloresureCore = () => {
    return useDisclosure()
}

export const useConfirmDiscloresureSingleton = () => {
    const { useConfirmDiscloresure } = useContext(DisclosureContext)!
    return useConfirmDiscloresure
}
