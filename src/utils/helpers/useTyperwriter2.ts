// import { useEffect, useState } from "react"

// export function useTypewriter(texts: string[], speed = 80, delayBetween = 2000) {
//     const [index, setIndex] = useState(0)
//     const [subIndex, setSubIndex] = useState(0)
//     const [forward, setForward] = useState(true)
//     const [displayed, setDisplayed] = useState("")

//     useEffect(() => {
//         if (index >= texts.length) return setIndex(0)
//         const current = texts[index]

//         if (forward) {
//             if (subIndex < current.length) {
//                 const timeout = setTimeout(() => {
//                     setSubIndex((prev) => prev + 1)
//                 }, speed)
//                 return () => clearTimeout(timeout)
//             } else {
//                 const timeout = setTimeout(() => setForward(false), delayBetween)
//                 return () => clearTimeout(timeout)
//             }
//         } else {
//             if (subIndex > 0) {
//                 const timeout = setTimeout(() => {
//                     setSubIndex((prev) => prev - 1)
//                 }, speed / 2)
//                 return () => clearTimeout(timeout)
//             } else {
//                 setForward(true)
//                 setIndex((prev) => (prev + 1) % texts.length)
//             }
//         }
//     }, [index, subIndex, forward, texts, speed, delayBetween])

//     useEffect(() => {
//         setDisplayed(texts[index]?.substring(0, subIndex))
//     }, [subIndex, index, texts])

//     return [displayed]
// }
