"use client"
import type { Tour } from "nextstepjs"
import React from "react"
import {
    Hand,
    UserRound,
    IdCard,
    CarFront,
    Search,
    CalendarRange,
    MapPin,
    Settings2
} from "lucide-react"
import i18n from "../i18n"

export const onboardingSteps: Tour[] = [
    {
        tour: "greenwheel",
        steps: [
            // ─────────────────────────────
            {
                icon: <Hand size={20} className="text-primary" />,
                title: i18n.t("nextstep.welcome_title"),
                content: (
                    <>
                        {/* {i18n.t("nextstep.welcome_content_1")} <br /> */}
                        <b>{i18n.t("nextstep.welcome_content_2")}</b>
                    </>
                ),
                showControls: true,
                showSkip: true
            },
            // ─────────────────────────────
            {
                icon: <UserRound size={20} className="text-primary" />,
                title: i18n.t("nextstep.access_profile_title"),
                content: (
                    <>
                        {i18n.t("nextstep.access_profile_content_1")}{" "}
                        <b>{i18n.t("nextstep.access_profile_content_2")}</b>.
                    </>
                ),
                selector: "#navbar-user",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            },
            // ─────────────────────────────
            {
                icon: <Settings2 size={20} className="text-primary" />,
                title: i18n.t("nextstep.open_profile_title"),
                content: (
                    <>
                        {i18n.t("nextstep.open_profile_content_1")}{" "}
                        <b>{i18n.t("nextstep.open_profile_content_2")}</b>.
                    </>
                ),
                selector: "#navbar-profile",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/profile"
            },
            // ─────────────────────────────
            {
                icon: <Settings2 size={20} className="text-primary" />,
                title: i18n.t("nextstep.update_profile_title"),
                content: <>{i18n.t("nextstep.update_profile_content")}</>,
                selector: "#upload-profile-info",
                side: "right",
                showControls: true,
                showSkip: true,
                pointerPadding: 20,
                pointerRadius: 20,
                prevRoute: "/"
            },
            // ─────────────────────────────
            {
                icon: <IdCard size={20} className="text-primary" />,
                title: i18n.t("nextstep.upload_cccd_title"),
                content: (
                    <>
                        {i18n.t("nextstep.upload_cccd_content_1")}{" "}
                        <b>{i18n.t("nextstep.upload_cccd_content_2")}</b>.
                    </>
                ),
                selector: "#upload-cccd",
                side: "top",
                showControls: true,
                showSkip: true,
                pointerPadding: 20,
                pointerRadius: 20
            },
            // ─────────────────────────────
            {
                icon: <IdCard size={20} className="text-primary" />,
                title: i18n.t("nextstep.upload_license_title"),
                content: (
                    <>
                        {i18n.t("nextstep.upload_license_content_1")}{" "}
                        <b>{i18n.t("nextstep.upload_license_content_2")}</b>.
                    </>
                ),
                selector: "#upload-license",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 20,
                pointerRadius: 20
            },
            // ─────────────────────────────
            {
                icon: <CarFront size={20} className="text-primary" />,
                title: i18n.t("nextstep.start_rent_title"),
                content: (
                    <>
                        {i18n.t("nextstep.start_rent_content_1")}{" "}
                        <b>{i18n.t("nextstep.start_rent_content_2")}</b>.
                    </>
                ),
                selector: "#navbar-vehicle",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 2,
                pointerRadius: 10,
                nextRoute: "/vehicle-rental"
            },
            // ─────────────────────────────
            {
                icon: <Search size={20} className="text-primary" />,
                title: i18n.t("nextstep.search_vehicle_title"),
                content: (
                    <>
                        {i18n.t("nextstep.search_vehicle_content_1")}{" "}
                        <b>{i18n.t("nextstep.search_vehicle_content_2")}</b>.
                    </>
                ),
                selector: "#vehicle-search-filters",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 8,
                pointerRadius: 10,
                prevRoute: "/profile"
            },
            // ─────────────────────────────
            {
                icon: <MapPin size={20} className="text-primary" />,
                title: i18n.t("nextstep.select_station_title"),
                content: (
                    <>
                        {i18n.t("nextstep.select_station_content_1")}{" "}
                        <b>{i18n.t("nextstep.select_station_content_2")}</b>.
                    </>
                ),
                selector: "#station-select",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            },
            // ─────────────────────────────
            {
                icon: <CarFront size={20} className="text-primary" />,
                title: i18n.t("nextstep.select_segment_title"),
                content: (
                    <>
                        {i18n.t("nextstep.select_segment_content_1")}{" "}
                        <b>{i18n.t("nextstep.select_segment_content_2")}</b>.
                    </>
                ),
                selector: "#segment-select",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            },
            // ─────────────────────────────
            {
                icon: <CalendarRange size={20} className="text-primary" />,
                title: i18n.t("nextstep.pickup_time_title"),
                content: (
                    <>
                        {i18n.t("nextstep.pickup_time_content_1")}{" "}
                        <b>{i18n.t("nextstep.pickup_time_content_2")}</b>.
                    </>
                ),
                selector: "#pick-up-select",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10,
                blockKeyboardControl: true
            },
            // ─────────────────────────────
            {
                icon: <CalendarRange size={20} className="text-primary" />,
                title: i18n.t("nextstep.return_time_title"),
                content: (
                    <>
                        {i18n.t("nextstep.return_time_content_1")}{" "}
                        <b>{i18n.t("nextstep.return_time_content_2")}</b>.
                    </>
                ),
                selector: "#return-select",
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            }
        ]
    }
]
