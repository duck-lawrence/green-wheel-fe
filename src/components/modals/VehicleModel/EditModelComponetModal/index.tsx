"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ModalBody, ModalHeader } from "@heroui/react"

import { ButtonStyled, ModalContentStyled, ModalFooterStyled, ModalStyled } from "@/components"
import { TableSelectionVehicleComponent as TableSelectionComponent } from "@/components/modules/TableSelectionComponent"
import { useGetVehicleComponents, useUpdateVehicleModelComponents } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

export type EditModelComponentModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
  modelId: string
  selectedComponentIds: string[]
  onUpdated?: () => void
}

export function EditModelComponentModal({
  isOpen,
  onOpenChange,
  onClose,
  modelId,
  selectedComponentIds,
  onUpdated
}: EditModelComponentModalProps) {
  // 1) i18n
  const { t } = useTranslation()

  // 2) server hooks
  const { data, isLoading, error: fetchError } = useGetVehicleComponents({
    enabled: isOpen,
    pagination: { pageNumber: 1, pageSize: 100 }
  })

  const updateMutation = useUpdateVehicleModelComponents({
    onSuccess: () => {
      onUpdated?.()
      onClose()
    }
  })

  // 3) local state
  const [selection, setSelection] = useState<Set<string>>(new Set(selectedComponentIds))

  // 4) sync props -> state khi mở modal
  useEffect(() => {
    if (isOpen) {
      setSelection(new Set(selectedComponentIds))
    }
  }, [isOpen, selectedComponentIds])

  // 5) memoized derived data
  const items = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.items ?? []
  }, [data])

  const errorMessage = useMemo(() => {
    if (!fetchError) return undefined
    const backendError = fetchError as BackendError
    if (backendError?.detail) return translateWithFallback(t, backendError.detail)
    if (fetchError instanceof Error) return fetchError.message
    return t("vehicle_component.fetch_error")
  }, [fetchError, t])

  // 6) callbacks
  const handleSave = useCallback(() => {
    updateMutation.mutate({
      id: modelId,
      payload: { componentIds: Array.from(selection) }
    })
  }, [modelId, selection, updateMutation])

  const handleCancel = useCallback(() => {
    setSelection(new Set(selectedComponentIds))
    onClose()
  }, [onClose, selectedComponentIds])

  // 7) derived flags
  const isSubmitting = updateMutation.isPending
  const isSaveDisabled = useMemo(
    () => isSubmitting || isLoading || Boolean(errorMessage),
    [isSubmitting, isLoading, errorMessage]
  )
  return (
    <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContentStyled className="w-full max-w-[720px]">
        <ModalHeader className="flex flex-col items-center text-2xl font-semibold">
          {t("fleet.detail_component_edit_title")}
        </ModalHeader>
        <ModalBody className="space-y-4">
          <TableSelectionComponent
            items={items}
            selectedIds={selection}
            onSelectionChange={setSelection}
            isLoading={isLoading}
            error={errorMessage}
          />
        </ModalBody>
        <ModalFooterStyled className="gap-3">
          <ButtonStyled
            color="secondary"
            className="bg-slate-200 text-slate-700"
            onPress={handleCancel}
            isDisabled={isSubmitting}
          >
            {t("common.cancel")}
          </ButtonStyled>
          <ButtonStyled
            color="primary"
            className="bg-primary text-white"
            onPress={handleSave}
            isDisabled={isSaveDisabled}
          >
            {t("common.save")}
          </ButtonStyled>
        </ModalFooterStyled>
      </ModalContentStyled>
    </ModalStyled>
  )
}
