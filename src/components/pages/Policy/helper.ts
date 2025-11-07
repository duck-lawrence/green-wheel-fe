export function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Highlight important terms (XSS-safe: escape before injecting <strong>)
 */
export function highlight(raw: string, patterns: string[]) {
    let html = escapeHtml(raw)
    patterns.forEach((p) => {
        const re = new RegExp(escapeRegExp(p), "g")
        html = html.replace(re, `<span class="text-gray-900 font-bold dark:text-white">${p}</span>`)
    })
    return html
}
