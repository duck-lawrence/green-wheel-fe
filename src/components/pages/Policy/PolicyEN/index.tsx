"use client"

import React from "react"

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Highlight key phrases (XSS-safe: escape first, then inject <strong>)
 */
function highlight(raw: string, patterns: string[]) {
  let html = escapeHtml(raw)
  patterns.forEach((p) => {
    const re = new RegExp(escapeRegExp(p), "g")
    html = html.replace(
      re,
      `<strong class="text-gray-900 dark:text-white">${p}</strong>`
    )
  })
  return html
}

// ======================
// Highlights (EN)
// ======================
const HIGHLIGHTS = [
  // core terms
  "GTC",
  "Service Contract",
  "Information Channel",
  "Service Booking",
  "Base Fee",
  "Service Fee",
  "Surcharge",
  "Expense",
  "Mileage Limit",
  "Business Day",
  "Working Hours",
  "Deposit",
  "Service Fee Summary Table",

  // important policy blocks
  "FORCE MAJEURE",
  "CONFIDENTIALITY",
  "LIMITATION OF LIABILITY",

  // sensitive numbers/conditions
  "10,000 VND/hour",
  "50%",
  "100%",
  "10 days",
  "22:00",
  "08:00",
  "08:00–17:00",

  // action phrases
  "set off",
  "refund",
  "vehicle repossession",
]

// ======================
// Policy Content (EN)
// ======================

const INTRO_PURPOSE = String.raw`These General Terms and Conditions (“GTC”) apply to Customers who use the car rental services of Green Wheel Trading and Service Joint Stock Company (“Green Wheel”). In these GTC, Green Wheel and the Customer are referred to individually as a “Party” and collectively as the “Parties”.`

const INTRO_DEFINITIONS = String.raw`2.1. “Service Fee Summary Table” means the consolidated list of all Service Fees payable by the Customer, prepared and sent by Green Wheel after the Vehicle return minutes are signed or at the end of each billing cycle (for long-term contracts).
2.2. “Expense” means actual out-of-pocket amounts Green Wheel pays on behalf of the Customer (charging fees, road tolls, traffic fines, etc.).
2.3. “Service Booking” means the Customer submitting a rental request for a Vehicle via Green Wheel’s system.
2.4. “Mileage Limit” means the mileage cap corresponding to the Base Fee stated in the Service Contract.
2.5. “Working Hours” means the period from 08:00–17:00 (Vietnam time).
2.6. “Service Contract” means the rental contract between Green Wheel and the Customer, including any amending or supplementary appendices.
2.7. “Information Channel” includes: (i) the website https://greenwheel.site/; and (ii) other electronic pages and channels under Green Wheel’s management.
2.8. “Customer” means an individual/organization that signs a Vehicle rental contract with Green Wheel, is at least 21 years old, and holds a valid car driver’s license throughout the rental term.
2.9. “User” means any individual who uses the Vehicle during the rental period (including the driver).
2.10. “Business Day” means Monday to Saturday, excluding Sunday and public holidays.
2.11. “Base Fee” is the fee for using the Vehicle within the Mileage Limit.
2.12. “Service Fee” includes the Base Fee, Surcharges, Expenses, and all other amounts arising under the contract.
2.13. “Surcharge” means any amount charged in addition to the Base Fee (late return, early return, cleaning, maintenance, etc.).
2.14. “Vehicle” means a car legally owned or lawfully managed by Green Wheel.`

const SERVICE_DESCRIPTION = String.raw`The Service is charged by hour, day, month, or year depending on the package. Each Customer account may have only one (01) active rental contract at any given time.`

const BOOKING_REDUCE_CANCEL = String.raw`2.1. Booking method: Via the Information Channel or Green Wheel’s official email.
2.2. Booking lead time:
- Booked 07:00–18:00: earliest handover after 03 Working Hours.
- Booked 18:00–21:00: earliest handover at 08:00 on the next day.
- Booked after 21:00: Green Wheel will confirm the handover time.
2.3. Reduce/Cancel:
- Free if canceled ≥24 hours in advance (regular) or ≥72 hours (peak).
- Refund 50% of the Base Fee if canceled after the above thresholds (per posted tariff).
- No refund if canceled <24 hours (peak) or no-show at handover.
- For monthly/yearly packages: apply 50–100% of the Deposit based on notice period per the posted tariff.`

const BASE_FEE = String.raw`The Base Fee reflects the right to use the Vehicle under the selected package (hour/day/month/year) within the Mileage Limit. The Base Fee includes compulsory insurance, road maintenance fee, periodic inspection, and scheduled maintenance in accordance with regulations.`

const LATE_RETURN_FEE = String.raw`- Late ≤ 3 hours: 10,000 VND/hour (rounded to the next hour).
- Late > 3 → 6 hours: surcharge 50% of the 1-day Base Fee.
- Late > 6 hours: surcharge 100% of the 1-day Base Fee.
- If the due time falls after 22:00 but total lateness is not over 6 hours: surcharge 50% of the 1-day Base Fee and the Vehicle must be returned before 08:00 the next day; late past 08:00 will incur an additional 1-day charge.`

const EARLY_RETURN_FEE = String.raw`- Notice ≥ 5 days: free; refund the unused portion of the Base Fee (for daily packages).
- Notice 3–5 days: refund 50% of the unused portion.
- Notice < 3 days: no refund.
- For monthly/yearly packages: apply 30/15 day thresholds with 50–100% of the Deposit per posted tariff.`

const DUNNING_ALERT = String.raw`(1) When the Customer returns the Vehicle late, besides surcharges, Green Wheel will:
   (a) Call up to 02 times/day;
   (b) Send a warning email;
   (c) Send a final notice before repossession.
(2) The system will not remotely lock charging, GPS, or otherwise interfere with the Vehicle. If the Customer does not cooperate, Green Wheel will proceed with vehicle repossession procedures in accordance with applicable law.
(3) Any coercive measures must be logged and notified at least 24 hours in advance.`

const DEPOSIT = String.raw`- A Deposit is mandatory prior to receiving the Vehicle; payable via MoMo or cash at the station.
- The Deposit is non-interest-bearing and maintained throughout the rental term.
- Green Wheel will refund the Deposit within 10 days from signing the Vehicle return minutes and completing reconciliation; if compensation/fees arise, they will be set off before refund.`

const PAYMENT = String.raw`- The Base Fee is paid upon handover; no prepayment required.
- Billing cycle: closes from the 23rd of the previous month to the 22nd of the following month.
- The Service Fee Summary Table is sent within 02 Business Days after cycle close; the Customer has 02 days to respond; payment deadline is 05 Business Days and no later than the 15th of the next month.
- If payment is over 10 days late, Green Wheel may initiate vehicle repossession per “Dunning & Alerts”.`

const HANDOVER_RETURN = String.raw`- Handover/return occurs during Working Hours (08:00–17:00). Outside these hours, a surcharge may apply, but not later than 22:00.
- Both Parties sign handover/return minutes; note condition, photos, mileage, and battery level.`

const CUSTOMER_DUTIES = String.raw`- Do not use the Vehicle for unlawful purposes; do not pledge/mortgage/re-pledge; do not lend or sub-lease to third parties.
- Only drive if at least 21 years old and holding a valid car driver’s license; present documents upon request.
- Do not alter structure, remove parts, or interfere with technical systems.
- Immediately inform Green Wheel in case of incidents/accidents/authorities’ actions; cooperate with insurance per guidance.
- Fully compensate damages caused by the Customer’s fault.
- If violations are not remedied within 03 days after notice, Green Wheel may proceed with vehicle repossession procedures in accordance with law.`

const LIMITATION_OF_LIABILITY = String.raw`Green Wheel is liable for direct damages caused by its fault, not exceeding the total Service Fee paid by the Customer for the relevant billing period. Green Wheel is not liable for indirect, special, consequential damages, or loss of profit.`

// const FORCE_MAJEURE = String.raw`Force majeure events include natural disasters, war, epidemics, fire, changes in law/policy… beyond the Parties’ reasonable control. If lasting more than 60 days, either Party may terminate the contract by written notice.`

const CONFIDENTIALITY = String.raw`Green Wheel processes personal data pursuant to its publicly available Data Policy to operate and improve Service quality. The breaching Party must compensate all damages arising from any breach of confidentiality.`

const MISC = String.raw`Green Wheel may amend or supplement the GTC and announce such changes on the Information Channel. The updated version takes effect from the date of notice.`

export function PolicyPageEN() {
  // highlighted HTML
  const intro_purpose = highlight(INTRO_PURPOSE, HIGHLIGHTS)
  const intro_definitions = highlight(INTRO_DEFINITIONS, HIGHLIGHTS)
  const service_desc = highlight(SERVICE_DESCRIPTION, HIGHLIGHTS)
  const booking = highlight(BOOKING_REDUCE_CANCEL, HIGHLIGHTS)
  const base_fee = highlight(BASE_FEE, HIGHLIGHTS)
  const late_fee = highlight(LATE_RETURN_FEE, HIGHLIGHTS)
  const early_fee = highlight(EARLY_RETURN_FEE, HIGHLIGHTS)
  const dunning = highlight(DUNNING_ALERT, HIGHLIGHTS)
  const deposit = highlight(DEPOSIT, HIGHLIGHTS)
  const payment = highlight(PAYMENT, HIGHLIGHTS)
  const handover = highlight(HANDOVER_RETURN, HIGHLIGHTS)
  const customer_duties = highlight(CUSTOMER_DUTIES, HIGHLIGHTS)
  const limitation = highlight(LIMITATION_OF_LIABILITY, HIGHLIGHTS)
  // const force_majeure = highlight(FORCE_MAJEURE, HIGHLIGHTS)
  const confidentiality = highlight(CONFIDENTIALITY, HIGHLIGHTS)
  const misc = highlight(MISC, HIGHLIGHTS)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-justify">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-green-600 uppercase">
          <span>GREEN WHEEL TRADING AND SERVICE</span>
          <span className="block mt-1">JOINT STOCK COMPANY</span>
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

          <h3 className="mt-4 text-xl font-bold">1. GREEN WHEEL’S SERVICE</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: service_desc }}
          />

          <h3 className="mt-6 text-xl font-bold">2. BOOKING, REDUCTION, CANCELLATION</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: booking }}
          />

          <h3 className="mt-6 text-xl font-bold">3. PRICING PRINCIPLES &amp; SURCHARGES</h3>

          <h4 className="mt-4 text-lg font-bold">3.1. Base Fee</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: base_fee }}
          />

          <h4 className="mt-4 text-lg font-bold">3.2. Late Return</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: late_fee }}
          />

          <h4 className="mt-4 text-lg font-bold">3.3. Early Return</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: early_fee }}
          />

          <h4 className="mt-4 text-lg font-bold">3.4. Dunning &amp; Alerts</h4>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: dunning }}
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

          <h3 className="mt-6 text-xl font-bold">6. HANDOVER / RETURN</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: handover }}
          />

          <h3 className="mt-6 text-xl font-bold">7. CUSTOMER’S RESPONSIBILITIES</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: customer_duties }}
          />

          <h3 className="mt-6 text-xl font-bold">8. LIMITATION OF LIABILITY</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: limitation }}
          />

          {/* <h3 className="mt-6 text-xl font-bold">9. FORCE MAJEURE</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: force_majeure }}
          /> */}

          <h3 className="mt-6 text-xl font-bold">9. CONFIDENTIALITY</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: confidentiality }}
          />

          <h3 className="mt-6 text-xl font-bold">10. MISCELLANEOUS</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: misc }}
          />
        </section>

        {/* <p className="text-center italic mt-10 text-gray-500">
          © 2025 Green Wheel Trading and Service Joint Stock Company – All rights reserved.
        </p> */}
      </article>
    </main>
  )
}
