"use client"
import {
    useLoginDiscloresureCore,
    useRegisterDiscloresureCore,
    useForgotPasswordDiscloresureCore
} from "@/hooks"
import { useConfirmDiscloresureCore } from "@/hooks/singleton/disclosures/useComfirmDiscloresure"
import { createContext } from "react"

export interface DisclosureContextType {
    useLoginDiscloresure: ReturnType<typeof useLoginDiscloresureCore>
    useRegisterDiscloresure: ReturnType<typeof useRegisterDiscloresureCore>
    useForgotPasswordDiscloresure: ReturnType<typeof useForgotPasswordDiscloresureCore>
    useConfirmDiscloresure: ReturnType<typeof useConfirmDiscloresureCore>
}

export const DisclosureContext = createContext<DisclosureContextType | null>(null)
