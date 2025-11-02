"use client"

import React from "react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import React from "react"
// import { useGetBusinessVariables } from "@/hooks/queries/useBusinessVariables"
// export default function NotFound() {
//     const router = useRouter()
//     const { data: businessVariables } = useGetBusinessVariables()
//     console.log("businessVariables", businessVariables)
//     return (
//         <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-[#0B0F0C] text-white">
//             <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F0C] via-[#0F2612] to-[#0B0F0C] opacity-90" />

//             <motion.img
//                 src="/images/a2.jpg"
//                 alt="Car silhouette"
//                 className="absolute  opacity-20  select-none pointer-events-none w-full"
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 0.2, y: 0 }}
//                 transition={{ duration: 1.2, ease: "easeOut" }}
//             />

//             <motion.h1
//                 className="text-[140px] sm:text-[180px] font-extrabold z-10 text-white drop-shadow-[0_0_15px_rgba(0,166,62,0.8)]"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8 }}
//             >
//                 404
//             </motion.h1>

//             <p className="mt-2 text-gray-300 z-10 text-lg sm:text-xl">
//                 Oops! Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
//             </p>

//             <motion.button
//                 onClick={() => router.push("/")}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-full shadow-lg z-10 transition-colors"
//             >
//                 Back to Home
//             </motion.button>

//             <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-lime-400 to-green-600 shadow-[0_0_15px_#00A63E]" />
//         </div>
//     )
// }

import Link from "next/link"

// export default function NotFoundPage() {
//   useEffect(() => {
//     const visual = document.getElementById("visual")
//     const handleResize = () => {
//       const width = window.innerWidth
//       const height = window.innerHeight
//       const ratio = 45 / (width / height)
//       if (visual) {
//         visual.style.transform = `translate(-50%, -50%) rotate(-${ratio}deg)`
//       }
//     }
//     window.addEventListener("resize", handleResize)
//     handleResize()
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   return (
//     <main
//       className="relative h-screen w-full overflow-hidden bg-[#121212] text-[#dadada] font-[Poppins] p-4"
//       style={{
//         // import font ngay tại page
//         fontFamily: `'Poppins', sans-serif`,
//       }}
//     >
//       {/* link quay về home */}
//       <Link
//         href="/"
//         className="group fixed z-10 flex items-center border-2 border-[#555] text-[#555] px-3 py-2 no-underline transition-all duration-150 hover:text-[#333] hover:bg-[#dadada] hover:border-transparent"
//       >
//         <svg
//           height="0.8em"
//           width="0.8em"
//           viewBox="0 0 2 1"
//           preserveAspectRatio="none"
//           className="mr-2"
//         >
//           <polyline
//             fill="none"
//             stroke="#777777"
//             strokeWidth="0.1"
//             points="0.9,0.1 0.1,0.5 0.9,0.9"
//             className="transition-all duration-150 group-hover:stroke-black"
//           />
//         </svg>
//         Home
//       </Link>

//       {/* khối chữ 404 xoay */}
//       <div className="relative w-full h-full select-none">
//         <h1
//           id="visual"
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] text-[60vmax] text-[#282828] font-extrabold tracking-[0.025em] m-0 transition-all duration-[750ms] ease-in-out"
//           style={{
//             fontFamily: `'Eczar', serif`,
//           }}
//         >
//           404
//         </h1>
//       </div>

//       {/* nội dung mô tả */}
//       <p
//         className="fixed bottom-4 right-6 text-right text-[calc(1em+3vmin)] m-0"
//         style={{
//           textShadow:
//             "-1px -1px 0 #121212, 1px 1px 0 #121212, -1px 1px 0 #121212, 1px -1px 0 #121212",
//           color: "#dadada",
//           width:
//             typeof window !== "undefined"
//               ? window.innerWidth > 1300
//                 ? "25%"
//                 : window.innerWidth > 940
//                 ? "30%"
//                 : window.innerWidth > 560
//                 ? "50%"
//                 : window.innerWidth > 340
//                 ? "70%"
//                 : "100%"
//               : "50%",
//         }}
//       >
//         The page you’re looking for does not exist.
//       </p>

//       {/* import font Google ngay trong page */}
//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css?family=Eczar:800");
//         @import url("https://fonts.googleapis.com/css?family=Poppins:600");
//       `}</style>
//     </main>
//   )
// }

import { motion } from "framer-motion"

export default function NotFound() {
    return (
        //bg-[#121212]
        <div
            className="relative flex h-screen w-full flex-col justify-between 
        overflow-hidden mt-[-6.25rem] bg-gradient-to-t from-teal-400 to-teal-800"
        >
            {/* Nút Home */}
            <Link
                href="/"
                className="absolute top-4 left-4 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all px-3 py-1 rounded-sm text-sm flex items-center gap-1"
            >
                <span className="text-xs">‹</span> Home
            </Link>

            {/* 404 lớn ở giữa */}
            <motion.h1
                initial={{ rotate: -5, scale: 1 }}
                // animate={{ rotate: [-5, -10, -5], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center text-[45vw] font-[800] text-[#282828] leading-none select-none"
            >
                404
            </motion.h1>

            {/* Dòng mô tả dưới cùng bên phải */}
            <div className="absolute bottom-10 right-10">
                <p className="text-white text-right font-[Poppins] text-[40px]  font-semibold">
                    The page you’re looking
                    <br />
                    for does not exist.
                </p>
            </div>
        </div>
    )
}
