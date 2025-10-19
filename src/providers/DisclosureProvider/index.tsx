import React, { type PropsWithChildren } from "react"
import { DisclosureContext } from "./DisclosureContext"
import {
    useForgotPasswordDiscloresureCore,
    useLoginDiscloresureCore,
    useRegisterDiscloresureCore
} from "@/hooks"
import { useConfirmDiscloresureCore } from "@/hooks/singleton/disclosures/useComfirmDiscloresure"

export const DisclosureProvider = ({ children }: PropsWithChildren) => {
    const useLoginDiscloresure = useLoginDiscloresureCore()
    const useRegisterDiscloresure = useRegisterDiscloresureCore()
    const useForgotPasswordDiscloresure = useForgotPasswordDiscloresureCore()
    const useConfirmDiscloresure = useConfirmDiscloresureCore()

    return (
        <DisclosureContext.Provider
            value={{
                useLoginDiscloresure,
                useRegisterDiscloresure,
                useForgotPasswordDiscloresure,
                useConfirmDiscloresure
            }}
        >
            {children}
        </DisclosureContext.Provider>
    )
}
