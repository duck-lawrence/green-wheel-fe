"use client"

import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import React from "react"

function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Highlight important terms (XSS-safe: escape before injecting <strong>)
 */
function highlight(raw: string, patterns: string[]) {
    let html = escapeHtml(raw)
    patterns.forEach((p) => {
        const re = new RegExp(escapeRegExp(p), "g")
        html = html.replace(re, `<strong class="text-gray-900 dark:text-white">${p}</strong>`)
    })
    return html
}

// Keywords to highlight
const HIGHLIGHTS = [
    "GTCs",
    "GTC",
    "Rental Agreement",
    "Information Channels",
    "Customers",
    "Customer",
    "User",
    "Vehicle Checklist",
    "Vehicle",
    "Rental Fee",
    "Service Booking",
    "Reservation Invoice",
    "Handover Invoice",
    "Rental Fee",
    "Deposit Fee",
    "Additional Fee",
    "Damage Fee",
    "Cost",
    "Working Day",
    "Working Hour",
    "offset",
    "refunded",
    "refund",
    "vehicle repossession",
    "07:00",
    "17:00",
    "10 days"
]

// ======================
// Policy Content
// ======================

const INTRO_PURPOSE = String.raw`These General Terms and Conditions ("GTC") apply to Customers using the car rental services provided by Green Wheel Trading and Service Joint Stock Company ("Green Wheel"). In these GTCs, Green Wheel and the Customer are each referred to as a "Party" and collectively as the "Parties".`

const INTRO_DEFINITIONS = String.raw`2.1. "Cost" refers to any amount paid or collected by Green Wheel ("GW") on behalf of the Customer during the rental period, including but not limited to the Rental Fee, Deposit Fee, and Additional Fees (if any).
2.2. "Service Booking" means the act of a Customer submitting a vehicle rental request via GW’s system. Upon booking, the system automatically generates two invoices: (i) a Reservation Invoice and (ii) a Handover Invoice.
2.3. "Reservation Invoice" is a prepayment invoice to secure a vehicle for the Customer. If the Reservation Invoice is paid, the amount will be deducted directly from the Handover Invoice. If the Customer does not pay the Reservation Invoice but pays the Handover Invoice directly, the Reservation Invoice will be canceled and no deduction will apply.
2.4. "Handover Invoice" is the official invoice that must be paid before vehicle handover, including the Rental Fee, Deposit Fee, and other applicable charges.
2.5. "Rental Fee" refers to the usage fee for the vehicle, calculated based on the daily rental rate multiplied by the total number of rental days specified in the Rental Agreement. The Rental Fee must be paid in full prior to vehicle handover; partial payments are not accepted.
2.6. "Deposit Fee" is a security deposit ensuring the Customer’s obligations during the rental period. GW reserves the right to offset this deposit against any arising costs such as traffic fines or Damage Fees. Any remaining amount will be refunded (if applicable) at least 10 days after the vehicle is returned, unless there are pending costs or penalties.
2.7. "Additional Fee" refers to any charges not included in the Rental Fee or Deposit Fee, including but not limited to cleaning fees, late return fees, or other surcharges incurred during vehicle use.
2.8. "Damage Fee" is the amount payable by the Customer if the vehicle is damaged, involved in an accident, or lost due to the Customer’s fault; compensation is based on actual damages.
2.9. "Working Day" refers to the time frame 07:00–17:00 (GMT+7), applicable to all days of the year (including Sundays and public holidays).
2.10. "Working Hour" refers to the time frame 07:00–17:00 (GMT+7).
2.11. "Rental Agreement" is a written or electronic document recording the rental terms between GW and the Customer, including vehicle information, rental duration, fees, and related conditions.
2.12. "Information Channels" include: (i) Green Wheel’s official website and (ii) other digital channels managed by GW.
2.13. "Customer" means any individual or organization renting a vehicle from GW, aged at least 21 years old (for individuals) and holding a valid driving license throughout the rental period.
2.14. "User" means any individual operating or using the vehicle during the rental period (including drivers).
2.15. "Vehicle" means any automobile owned or legally managed by GW.
2.16. "Vehicle Checklist" records the current condition of each vehicle part, rated across five damage levels (Good/Minor/Moderate/Severe/Totaled), and must include photos taken during inspection.`

const SERVICE_DESCRIPTION = String.raw`The service is charged on a daily basis. Each Customer account may only have one (01) active Rental Agreement at a time.`

const BOOKING_CANCEL = String.raw`2.1. Booking Method:
Customers can only make bookings via the Information Channels or directly at Green Wheel stations. Green Wheel does not accept bookings made through any other means.
2.2. Booking Time:
- Customers may book vehicles only during Working Hours (07:00–17:00).
- The pickup time must be at least 03 hours after the booking time.
- If the requested pickup time is after 17:59, the system will automatically shift it to 07:00 the next morning.
- The return time must be at least 24 hours after the pickup time.
2.3. Service Cancellation:
If a Customer cancels a paid booking or returns the vehicle earlier than the end time stated in the Rental Agreement, all paid amounts are non-refundable under any circumstances, unless the cancellation is due to Green Wheel’s fault.`

const BASE_FEE = String.raw`The Rental Fee reflects the right to use the Vehicle per day. It includes mandatory regulatory charges (if any) and is calculated according to the Rental Agreement.`

const REMINDER_NOTICE = String.raw`(1) When the Customer returns the Vehicle late, in addition to applicable surcharges, Green Wheel will:
   (a) Make up to 02 phone calls per day;
   (b) Send email warnings;
   (c) Before repossession, issue a final notice.
(2) The system does not automatically disable charging/GPS; if the Customer does not cooperate, GW will proceed with repossession procedures as permitted by law.
(3) Any enforcement actions must be logged and notified at least 24 hours in advance.`

const DEPOSIT = String.raw`- A Deposit Fee is mandatory before vehicle handover and may be paid via online gateway or cash at the station.
- The Deposit Fee is non-interest-bearing and held throughout the rental period.
- Green Wheel reserves the right to offset the Deposit against any Additional Fees or Damage Fees. Any remaining balance (if any) will be refunded at least 10 days after the Vehicle Return Report is signed and final settlement completed.`

const PAYMENT = String.raw`- The Rental Fee must be paid upon vehicle handover. The system automatically generates both the Reservation Invoice and the Handover Invoice upon booking.
- If the Customer pays the Reservation Invoice, the amount will be deducted from the Handover Invoice.
- If the Customer skips the Reservation Invoice but pays the Handover Invoice directly, the Reservation Invoice will be canceled and no deduction will apply.`

const HANDOVER_RETURN = String.raw`- Vehicle handover and return are conducted during Working Hours.
- Both Parties confirm the Vehicle Checklist, verifying the vehicle’s condition, photographs, and relevant readings.`

const CUSTOMER_RESPONSIBILITY = String.raw`- The Customer shall not use the Vehicle for unlawful purposes; shall not pledge, mortgage, or sublease it; and shall not lend or rent it to third parties.
- Only individuals aged 21 or above with a valid driving license may operate the Vehicle and must present identification upon request.
- The Customer shall not modify or tamper with the vehicle’s structure, components, or systems.
- The Customer must immediately notify Green Wheel of any incidents, collisions, or interventions by authorities, and cooperate with the insurer as instructed.
- The Customer shall compensate for all damages caused by their fault (Damage Fee).
- If the Customer fails to remedy a violation within 03 days after receiving notice, Green Wheel reserves the right to initiate repossession procedures in accordance with the law.`

const LIABILITY_LIMIT = String.raw`Green Wheel shall only be liable for direct damages resulting from its own fault, up to the total amount paid by the Customer for the corresponding rental period. Green Wheel shall not be liable for any indirect, special, consequential, or loss-of-profit damages.`

const PRIVACY = String.raw`Green Wheel processes personal data in accordance with its publicly available Data Policy, serving operational and service improvement purposes. Any Party breaching confidentiality obligations must compensate for all resulting damages.`

const MISC = String.raw`Green Wheel reserves the right to modify or supplement these GTCs and publish updates through its Information Channels. The updated version takes effect from the date of notice.`

export function PolicyPageEN({ lateReturnFee }: { lateReturnFee: BusinessVariableViewRes }) {
    const LATE_RETURN_FEE = String.raw`- A late return fee applies one hour after the scheduled return time stated in the Rental Agreement. For every additional hour, an extra charge of ${formatCurrencyWithSymbol(
        Number(lateReturnFee.value) || 0
    )} will be applied.`

    const intro_purpose = highlight(INTRO_PURPOSE, HIGHLIGHTS)
    const intro_definitions = highlight(INTRO_DEFINITIONS, HIGHLIGHTS)
    const service_desc = highlight(SERVICE_DESCRIPTION, HIGHLIGHTS)
    const booking_cancel = highlight(BOOKING_CANCEL, HIGHLIGHTS)
    const base_fee = highlight(BASE_FEE, HIGHLIGHTS)
    const late_fee = highlight(LATE_RETURN_FEE, HIGHLIGHTS)
    const reminder_notice = highlight(REMINDER_NOTICE, HIGHLIGHTS)
    const deposit = highlight(DEPOSIT, HIGHLIGHTS)
    const payment = highlight(PAYMENT, HIGHLIGHTS)
    const handover_return = highlight(HANDOVER_RETURN, HIGHLIGHTS)
    const customer_resp = highlight(CUSTOMER_RESPONSIBILITY, HIGHLIGHTS)
    const liability_limit = highlight(LIABILITY_LIMIT, HIGHLIGHTS)
    const privacy = highlight(PRIVACY, HIGHLIGHTS)
    const misc = highlight(MISC, HIGHLIGHTS)

    return (
        <main className="max-w-5xl mx-auto px-6 py-12 text-justify">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-green-600 uppercase">
                    <span>GREEN WHEEL TRADING AND SERVICE JOINT STOCK COMPANY</span>
                </h1>
                <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-200">
                    GENERAL TERMS AND CONDITIONS
                </h2>
            </header>

            <article className="prose dark:prose-invert max-w-none leading-relaxed">
                {/* PART I */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PART I. INTRODUCTION</h2>

                    <h3 className="mt-4 text-xl font-bold">1. PURPOSE</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_purpose }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. DEFINITIONS</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_definitions }}
                    />
                </section>

                {/* PART II */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PART II. GENERAL TERMS</h2>

                    <h3 className="mt-4 text-xl font-bold">1. GREEN WHEEL SERVICE</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: service_desc }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. BOOKING AND CANCELLATION</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: booking_cancel }}
                    />

                    <h3 className="mt-6 text-xl font-bold">3. FEES & SURCHARGES</h3>

                    <h4 className="mt-4 text-lg font-bold">3.1. Base Fee</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: base_fee }}
                    />

                    <h4 className="mt-4 text-lg font-bold">3.2. Late Return Fee</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: late_fee }}
                    />

                    <h4 className="mt-4 text-lg font-bold">3.3. Reminders & Warnings</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: reminder_notice }}
                    />

                    <h3 className="mt-6 text-xl font-bold">4. DEPOSIT</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: deposit }}
                    />

                    <h3 className="mt-6 text-xl font-bold">5. PAYMENT</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: payment }}
                    />

                    <h3 className="mt-6 text-xl font-bold">6. VEHICLE HANDOVER AND RETURN</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: handover_return }}
                    />

                    <h3 className="mt-6 text-xl font-bold">7. CUSTOMER RESPONSIBILITIES</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: customer_resp }}
                    />

                    <h3 className="mt-6 text-xl font-bold">8. LIMITATION OF LIABILITY</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: liability_limit }}
                    />

                    <h3 className="mt-6 text-xl font-bold">9. PRIVACY & DATA PROTECTION</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: privacy }}
                    />

                    <h3 className="mt-6 text-xl font-bold">10. MISCELLANEOUS</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: misc }}
                    />
                </section>
            </article>
        </main>
    )
}
