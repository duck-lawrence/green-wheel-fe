"use client"

import React from "react"
import { Pagination, PaginationProps, cn } from "@heroui/react"

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
        />
    )
}

// "use client"

// import React from "react"
// import { Pagination, PaginationItemRenderProps, cn } from "@heroui/react"
// // KHÔNG ACTIVE "1" được khi click (nếu đang ở trang 1).
// //VÌ SAO: vì kế thừa thằng HeroUI, mà thằng HeroUI nó có sẵn cái isActive.
// //  Nên khi click vào "1" (đang active) thì nó không gọi onChange nữa.
// //  Mà ta muốn gọi onChange để set lại page=1 (dù vẫn là 1) để fetch lại dữ liệu.
// //  Nên click vào "1" vẫn gọi onChange nên nó không hiển thị màu. Cao nhân nào cao tay hơn
// // thì custom riêng .
// // Code Backend
// // public IEnumerable<T> Items { get; set; }      // mảng dữ liệu
// // public int PageNumber { get; set; }            // Số trang hiện tại (1-based)
// // public int PageSize { get; set; }              // Số bản ghi trên trang
// // public int TotalCount { get; set; }            // Tổng số bản ghi
// // public int TotalPage => (int)Math.Ceiling(TotalCount / (double)PageSize); // Tổng số trang

// // SET UP IN FRONT END
// // const [page, setPage] = useState(1)
// // import { PaginationStyled } from "@/components"
// // <PaginationStyled
// //   pageNumber={page}
// //   pageSize={pageSize}
// //   totalItems={totalCount}
// //   onPageChange={setPage}
// //   // Không truyền prevContent/nextContent → hệ thống hiển thị "<" và ">".
// //   // Nếu muốn "Prev"/"Next" thì truyền vào.
// // />

// export type PaginationStyledProps = {
//   pageNumber: number
//   totalItems: number
//   pageSize?: number
//   onPageChange?: (page: number) => void
//   ?: boolean
//   containerClassName?: string
//   className?: string
//   buttonClassName?: string
//   activeButtonClassName?: string
//   inactiveButtonClassName?: string
//   ellipsisClassName?: string
//   controlButtonClassName?: string
//   controlHoverClassName?: string
//   controlDisabledClassName?: string

//   // Nội dung Prev/Next (nếu không truyền -> sẽ hiển thị "<" / ">")
//   prevContent?: React.ReactNode | null
//   nextContent?: React.ReactNode | null

//   // Tuỳ biến màu (accent)
//   activeBgClass?: string
//   activeTextClass?: string
//   inactiveBgClass?: string
//   inactiveTextClass?: string

//   // Token nhận diện control (mặc định theo HeroUI "<" / ">" + có thể override)
//   prevTokens?: string[]
//   nextTokens?: string[]
// }

// const DEFAULT_PAGE_SIZE = 10

// const BASE_BUTTON_CLASS =
//   "mx-1 flex h-8 min-w-8 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors"

// const DEFAULT_ACTIVE_CLASS = "border-primary bg-primary text-white shadow-sm"
// const DEFAULT_INACTIVE_CLASS = "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200"
// const DEFAULT_DISABLED_CLASS = "cursor-not-allowed border-transparent bg-slate-100 text-slate-400"
// const DEFAULT_ELLIPSIS_CLASS =
//   "mx-1 flex h-8 min-w-8 items-center justify-center rounded-lg bg-transparent px-2 text-sm text-slate-400"
// const DEFAULT_CONTROL_CLASS = "border-transparent bg-slate-100 text-slate-700"
// const DEFAULT_CONTROL_HOVER_CLASS = "hover:bg-primary hover:text-white"

// export function PaginationStyled({
//   pageNumber,
//   totalItems,
//   pageSize = DEFAULT_PAGE_SIZE,
//   onPageChange,
//    = true,
//   containerClassName,
//   className,
//   buttonClassName,
//   activeButtonClassName,
//   inactiveButtonClassName,
//   ellipsisClassName,
//   controlButtonClassName,
//   controlHoverClassName = DEFAULT_CONTROL_HOVER_CLASS,
//   controlDisabledClassName,

//   prevContent = null,
//   nextContent = null,

//   activeBgClass,
//   activeTextClass,
//   inactiveBgClass,
//   inactiveTextClass,

//   prevTokens = ["<", "prev"],
//   nextTokens = [">", "next"]
// }: PaginationStyledProps) {
//   const safePageSize = Math.max(1, pageSize)
//   const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize))
//   const currentPage = clamp(pageNumber, 1, totalPages)
//   const isDisabled = totalPages <= 1

//   // Tính cửa sổ theo rule: đầu (1..3), giữa [p,p+1], cuối (N-2..N)
//   const { corePages, showFirst, showLeftDots, showRightDots, showLast } =
//     getLayout(currentPage, totalPages)

//   const coreSet = new Set(corePages)
//   const firstPage = 1
//   const lastPage = totalPages
//   const lastCore = corePages[corePages.length - 1] ?? lastPage

//   const activeClassName = buildClass(
//     DEFAULT_ACTIVE_CLASS,
//     activeButtonClassName,
//     activeBgClass,
//     activeTextClass
//   )
//   const inactiveClassName = buildClass(
//     DEFAULT_INACTIVE_CLASS,
//     inactiveButtonClassName,
//     inactiveBgClass,
//     inactiveTextClass
//   )
//   const ellipsisClass = buildClass(DEFAULT_ELLIPSIS_CLASS, ellipsisClassName)
//   const controlEnabledClass = buildClass(
//     DEFAULT_CONTROL_CLASS,
//     controlButtonClassName,
//     controlHoverClassName
//   )
//   const controlDisabledClass = buildClass(DEFAULT_DISABLED_CLASS, controlDisabledClassName)

//   // Fallback label: nếu dev không set content -> hiển thị "<" / ">"
//   const prevLabel = prevContent ?? "<"
//   const nextLabel = nextContent ?? ">"

//   return (
//     <nav className={cn("flex items-center justify-center", containerClassName)} aria-label="Pagination">
//       <Pagination
//         total={totalPages}
//         page={currentPage}
//         onChange={onPageChange}
//         ={}
//         className={className}
//         isDisabled={isDisabled}
//         siblings={1}
//         boundaries={1}
//         renderItem={(item) =>
//           renderItem(item, {
//             currentPage,
//             totalPages,
//             onPageChange,
//             buttonClassName,
//             activeClassName,
//             inactiveClassName,
//             ellipsisClass,
//             prevLabel,
//             nextLabel,
//             coreSet,
//             firstPage,
//             lastPage,
//             lastCore,
//             showFirst,
//             showLeftDots,
//             showRightDots,
//             showLast,
//             controlEnabledClass,
//             controlDisabledClass,
//             prevTokens,
//             nextTokens
//           })
//         }
//       />
//     </nav>
//   )
// }

// type Ctx = {
//   currentPage: number
//   totalPages: number
//   onPageChange?: (p: number) => void
//   buttonClassName?: string
//   activeClassName: string
//   inactiveClassName: string
//   ellipsisClass: string
//   prevLabel: React.ReactNode
//   nextLabel: React.ReactNode
//   coreSet: Set<number>
//   firstPage: number
//   lastPage: number
//   lastCore: number
//   showFirst: boolean
//   showLeftDots: boolean
//   showRightDots: boolean
//   showLast: boolean
//   controlEnabledClass: string
//   controlDisabledClass: string
//   prevTokens: string[]
//   nextTokens: string[]
// }

// function renderItem(
//   { key, value, isActive, className: itemCls, getAriaLabel }: PaginationItemRenderProps,
//   ctx: Ctx
// ) {
//   const {
//     currentPage, totalPages, onPageChange, buttonClassName,
//     activeClassName, inactiveClassName, ellipsisClass,
//     prevLabel, nextLabel,
//     coreSet, firstPage, lastPage, lastCore,
//     showFirst, showLeftDots, showRightDots, showLast,
//     controlEnabledClass, controlDisabledClass,
//     prevTokens, nextTokens
//   } = ctx

//   const baseBtn = cn(BASE_BUTTON_CLASS, buttonClassName, itemCls)

//   // Bỏ dots của lib — ta tự chèn theo rule
//   if (isDots(value)) return null

//   // Prev/Next theo token
//   if (typeof value === "string" && (prevTokens.includes(value) || nextTokens.includes(value))) {
//     const isPrev = prevTokens.includes(value)
//     const disabled = (isPrev && currentPage === 1) || (!isPrev && currentPage === totalPages)
//     const click = () => {
//       if (disabled) return
//       const next = isPrev ? currentPage - 1 : currentPage + 1
//       onPageChange?.(clamp(next, 1, totalPages))
//     }
//     return (
//       <button
//         key={String(key)}
//         type="button"
//         onClick={click}
//         disabled={disabled}
//         aria-label={isPrev ? "Previous page" : "Next page"}
//         className={cn(baseBtn, disabled ? controlDisabledClass : controlEnabledClass)}
//       >
//         {isPrev ? prevLabel : nextLabel}
//       </button>
//     )
//   }

//   // Số trang
//   if (typeof value === "number") {
//     const isFirst = value === firstPage
//     const isLast = value === lastPage
//     const inCore = coreSet.has(value)

//     if (!inCore && !(isFirst && showFirst) && !(isLast && showLast)) return null

//     const clickNum = () => {
//       // HeroUI skips onChange for the active page; we still invoke it so callers can refetch.
//       onPageChange?.(value)
//     }

//     const btn = (
//       <button
//         key={String(key)}
//         type="button"
//         onClick={clickNum}
//         aria-current={isActive ? "page" : undefined}
//         aria-label={getAriaLabel?.(value)}
//         className={cn(baseBtn, isActive ? activeClassName : inactiveClassName)}
//       >
//         {value}
//       </button>
//     )

//     // Chèn "…" SAU nút "1" khi cần (… bên trái)
//     if (isFirst && showFirst && showLeftDots) {
//       return [
//         React.cloneElement(btn, { key: `${String(key)}-first` }),
//         <span key={`${String(key)}-ldots`} className={ellipsisClass} aria-hidden>&hellip;</span>
//       ]
//     }

//     // Chèn "…" SAU số cuối của core khi cần (… bên phải)
//     if (inCore && value === lastCore && showRightDots) {
//       return [
//         React.cloneElement(btn, { key: `${String(key)}-core` }),
//         <span key={`${String(key)}-rdots`} className={ellipsisClass} aria-hidden>&hellip;</span>
//       ]
//     }

//     return btn
//   }

//   return null
// }
// function getLayout(p: number, N: number) {
//   // Nhỏ (<=5) → hiện hết, không cần dấu …
//   if (N <= 5) {
//     return {
//       corePages: Array.from({ length: N }, (_, i) => i + 1),
//       showFirst: false,
//       showLeftDots: false,
//       showRightDots: false,
//       showLast: false
//     }
//   }

//   // Chọn core theo vị trí
//   let corePages: number[]
//   if (p <= 3) corePages = [1, 2, 3]
//   else if (p >= N - 2) corePages = [N - 2, N - 1, N]
//   else corePages = [p, p + 1]

//   // Đảm bảo luôn có trang hiện tại
//   if (!corePages.includes(p)) corePages = [p, ...corePages]

//   // Dedupe + sort
//   corePages = Array.from(new Set(corePages.filter(x => x >= 1 && x <= N))).sort((a,b)=>a-b)

//   const firstCore = corePages[0]
//   const lastCore  = corePages[corePages.length - 1]

//   const showFirst     = firstCore > 1
//   const showLast      = lastCore  < N
//   const showLeftDots  = showFirst && firstCore > 2
//   const showRightDots = showLast  && lastCore  < N - 1

//   return { corePages, showFirst, showLeftDots, showRightDots, showLast }
// }

// function buildClass(...inputs: Array<string | undefined | null | false>) {
//   return cn(...inputs)
// }
// function clamp(n: number, min: number, max: number) {
//   return Math.min(Math.max(n, min), max)
// }
// function isDots(v: PaginationItemRenderProps["value"]) {
//   return typeof v === "string" && v === "dots"
// }

// function renderItem(item: PaginationItemRenderProps, onClick: (page: number) => void) {
//     const { key, value, isActive, className, getAriaLabel, page } = item

//     if (value === "dots") {
//         return (
//             <span key={key} className="mx-1 text-gray-400 select-none">
//                 …
//             </span>
//         )
//     }

//     if (typeof value === "string" && (value === "prev" || value === "next")) {
//         const isPrev = value === "prev"
//         const targetPage = isPrev ? page - 1 : page + 1
//         const isDisabled = targetPage < 1 || targetPage > (item.total || 1)

//         return (
//             <button
//                 key={key}
//                 type="button"
//                 onClick={() => !isDisabled && onClick(targetPage)}
//                 disabled={isDisabled}
//                 aria-label={getAriaLabel?.(value)}
//                 className={cn(
//                     "mx-1 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm transition-colors",
//                     isDisabled
//                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                         : "hover:bg-primary hover:text-white"
//                 )}
//             >
//                 {isPrev ? "<" : ">"}
//             </button>
//         )
//     }

//     if (typeof value === "number") {
//         return (
//             <button
//                 key={key}
//                 type="button"
//                 onClick={() => onClick(value)}
//                 aria-current={isActive ? "page" : undefined}
//                 aria-label={getAriaLabel?.(value)}
//                 className={cn(
//                     "mx-1 flex h-8 min-w-8 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
//                     isActive
//                         ? "border-primary bg-primary text-white shadow-sm"
//                         : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
//                     className
//                 )}
//             >
//                 {value}
//             </button>
//         )
//     }

//     return null
// }
