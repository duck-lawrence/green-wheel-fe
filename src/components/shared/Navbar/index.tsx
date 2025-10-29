"use client"
import React, { useEffect, useMemo, useState } from "react"
import "./index.css"
import { NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { ButtonStyled, NavbarStyled, LanguageSwitcher, LogoStyled } from "@/components/"
import { useLoginDiscloresureSingleton, useTokenStore } from "@/hooks"
import { ProfileDropdown } from "./ProfileDropdown"
import { usePathname } from "next/navigation"
import { GREENWHEEL } from "@/constants/constants"
import clsx from "clsx"

type MenuKey = "home" | "vehicle-rental" | "about" | "contact" | undefined
type MenuItem = { key: Exclude<MenuKey, undefined>; label: string }

export function Navbar() {
    const { t } = useTranslation()
    const pathname = usePathname()
    // handle when login
    const isLoggedIn = useTokenStore((s) => !!s.accessToken)
    const { onOpen: onOpenLogin } = useLoginDiscloresureSingleton()

    // handle navbar
    type NavbarState = "default" | "top" | "middle"
    const [scrollState, setScroledState] = useState<NavbarState>("default")
    const [isHiddenNavbar, setIsHiddenNavbar] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    // set active key
    const { menuKey } = useMemo(() => {
        const segment = pathname.split("/").filter(Boolean)[0]

        const mapSegmentToMenuKey = (segment: string | undefined): MenuKey => {
            switch (segment) {
                case "":
                case undefined:
                    return "home"
                case "vehicle-rental":
                    return "vehicle-rental"
                case "about":
                    return "about"
                case "contact":
                    return "contact"
                default:
                    return undefined
            }
        }

        return {
            firstSegment: segment,
            menuKey: mapSegmentToMenuKey(segment)
        }
    }, [pathname])
    const [activeMenuKey, setActiveMenuKey] = useState<MenuKey>(menuKey)
    const menus = useMemo(
        () =>
            [
                { key: "home", label: t("navbar.home") },
                { key: "vehicle-rental", label: t("navbar.vehicle_rental") },
                { key: "about", label: t("navbar.about_us") },
                { key: "contact", label: t("navbar.contact") }
            ] satisfies MenuItem[],
        [t]
    )
    useEffect(() => {
        setActiveMenuKey(menuKey)
    }, [menuKey])

    // handle navbar animation
    const baseClasses = clsx(
        "bg-transparent transition-all duration-400 ease-in-out fixed left-0 w-full z-50 h-xl mx-auto",
        "max-w-6xl mt-3 rounded-3xl justify-between",
        "data-[visible=false]:mt-0",
        {
            "-translate-y-full opacity-0": isHiddenNavbar,
            "translate-y-0 opacity-100": !isHiddenNavbar,
            "text-white rounded-3xl bg-[#080808]/60 backdrop-blur-md mx-auto max-w-3xl scale-95":
                scrollState === "top" || scrollState === "middle",
            "backdrop-blur-none": !(scrollState === "top" || scrollState === "middle"),
            "text-white": menuKey === "about"
        }
    )

    const itemClasses = [
        "flex",
        "relative",
        "h-full",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[3px]",
        "data-[active=true]:after:w-full",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-primary"
    ]

    // useEffect
    // handle navbar scroll
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY
            let nextScrollState: NavbarState
            // let nextHidden: boolean

            if (y >= 0 && y < 10) {
                nextScrollState = "default"
                // nextHidden = false
            } else if (y >= 10 && y < 400) {
                nextScrollState = "top"
                // nextHidden = false
            } else {
                nextScrollState = "middle"
                // nextHidden = true
            }

            setScroledState((prev) => (prev === nextScrollState ? prev : nextScrollState))
            // setIsHiddenNavbar((prev) =>
            //     prev === nextHidden ? prev : nextHidden
            // )

            if (y < 400) {
                setIsHiddenNavbar(false)
            } else {
                if (y > lastScrollY) {
                    // scroll xuống
                    setIsHiddenNavbar(true)
                } else {
                    // scroll lên
                    setIsHiddenNavbar(false)
                }
            }
            setLastScrollY(y)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    return (
        <NavbarStyled
            data-visible={!isHiddenNavbar}
            classNames={{
                base: [baseClasses],
                item: [itemClasses]
            }}
        >
            {/* start content */}
            <NavbarBrand>
                <Link href={"/"} className="flex items-center gap-2">
                    <LogoStyled className="w-8 h-8" />
                    <p className="font-bold text-inherit">{GREENWHEEL}</p>
                </Link>
            </NavbarBrand>
            {/* middle content */}
            <NavbarContent className="hidden sm:flex gap-4 justify-center">
                {menus.map((menu) => (
                    <NavbarItem
                        key={menu.key}
                        isActive={activeMenuKey == menu.key}
                        className={`""text-center px-3 w-fit"
                            ${
                                scrollState === "top" || scrollState === "middle"
                                    ? "text-white"
                                    : "text-inherit"
                            }`}
                    >
                        <Link
                            href={menu.key === "home" ? "/" : "/" + menu.key}
                            onClick={() => setActiveMenuKey(menu.key)}
                            className="h-full flex items-center"
                        >
                            {menu.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            {/* end content */}
            <NavbarContent justify="end">
                <LanguageSwitcher
                    isChangeTextColor={scrollState === "top" || scrollState === "middle"}
                />
                <NavbarItem className="flex items-center">
                    {isLoggedIn ? (
                        <ProfileDropdown />
                    ) : (
                        <ButtonStyled
                            onPress={onOpenLogin}
                            color="primary"
                            variant="solid"
                            className="rounded-3xl opacity-97"
                        >
                            {t("login.login")}
                        </ButtonStyled>
                    )}
                </NavbarItem>
            </NavbarContent>
        </NavbarStyled>
    )
}
