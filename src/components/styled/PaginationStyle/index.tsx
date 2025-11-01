"use client"

import React from "react"
import { Pagination, PaginationProps, cn } from "@heroui/react"

/**
 * Custom Pagination kế thừa HeroUI Pagination
 * - Vẫn gọi onChange khi click trang hiện tại (HeroUI mặc định không làm)
 * - Cho phép truyền className tùy chỉnh
 */
export function PaginationStyled({ page, onChange, className, ...rest }: PaginationProps) {
    const handleClick = (value: number) => {
        onChange?.(value)
    }

    return (
        <Pagination
            {...rest}
            page={page}
            onChange={handleClick}
            className={cn("flex justify-center items-center", className)}
            // renderItem={(item) => renderItem(item, handleClick)}
        />
    )
}