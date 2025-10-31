import { animate } from "framer-motion"

export function scrollItemToCenter(
    container: HTMLElement | null,
    target: HTMLElement | null
): void {
    if (!container || !target) return

    const rect = target.getBoundingClientRect()
    const parentRect = container.getBoundingClientRect()

    const itemCenter = rect.left + rect.width / 2
    const containerCenter = parentRect.left + parentRect.width / 2

    const scrollOffset = itemCenter - containerCenter
    const targetScroll = container.scrollLeft + scrollOffset

    const maxScroll = container.scrollWidth - container.clientWidth
    const newX = Math.max(0, Math.min(targetScroll, maxScroll))

    animate(container.scrollLeft, newX, {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
        onUpdate: (v) => {
            container.scrollLeft = v
        }
    })
}
