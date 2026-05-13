# Maintane Conversion Architecture + Event Taxonomy

Last updated: 2026-05-11
Owner: Mercury + Athena + Atlas

## Primary conversion goal

Primary conversion goal right now: **join the Maintane waitlist for 10% off and early access**.

Reason: the live site routes product intent to `/waitlist/`; Shopify checkout should not be treated as the primary path until the product/checkout destination is verified live. The offer can still mention the $49.99 first jar, but the CTA action should stay consistent: get early access / get 10% off.

## CTA hierarchy

| Priority | Visitor state | CTA language | Destination | Measurement |
| --- | --- | --- | --- | --- |
| Primary | Ready for Maintane | `Get 10% Off + Early Access` | `/waitlist/` or `https://getmaintane.com/waitlist/` | `waitlist_cta_click` -> `form_start` -> `lead_form_submit` -> `waitlist_complete` |
| Secondary | Needs product clarity | `See How It Works` / `See the dosing guide` | `/how-it-works.html` or `/dosing-guide.html` | `dosing_guide_click` / `funnel_cta_click` |
| Tertiary | Research mode | `Get the septic checklist` | `/septic-care-checklist.html` | `checklist_cta_click` -> `checklist_lead_submit` |

Rules:

1. Do not mix `Buy Now`, `Shop Maintane`, `Join Waitlist`, and checklist CTAs in the same priority slot.
2. Use **Get 10% Off + Early Access** as the main purchase-intent CTA until checkout is verified live.
3. Keep checklist capture as a secondary route for research-mode visitors, not the dominant CTA on product-intent pages.
4. Internal links should stay clean. No internal UTMs.

## Page-level architecture

| Surface | Primary CTA | Secondary CTA | Notes |
| --- | --- | --- | --- |
| Homepage | Get 10% Off + Early Access | Dosing guide / checklist | Nav and hero now point high-intent users to waitlist language rather than Buy Now. |
| Blog posts | Get 10% Off + Early Access | Dosing guide | Priority blog posts now include intro, mid-article, and end-of-article waitlist bridges. |
| Product/routine page | Get 10% Off + Early Access | Dosing guide / checklist | `/monthly-septic-treatment.html` should behave like the product/routine page until Shopify is verified. |
| Dosing guide | Get 10% Off + Early Access | Checklist | User has learned how to use it; next step is waitlist. |
| Waitlist page | Get 10% Off | None/minimal | Squeeze page keeps one form-driven action. |

## Blog-to-product bridge standard

Priority educational posts should include:

1. **Intro CTA** after the direct answer/introduction.
2. **Mid-article CTA** at the first natural product/routine explanation.
3. **End CTA** after FAQs or before related posts.
4. Optional sidebar/card CTA only if the template supports it without clutter.

Current Chunk 4 local updates added intro bridges to:

- `/blog/septic-tank-cleaning-cost.html`
- `/blog/how-to-maintain-septic-tank.html`
- `/blog/how-bacteria-keep-septic-healthy.html`
- `/blog/how-often-septic-treatment.html`

## Popup audit and change

Observed input from GA4: **173 popup shown**, **64 dismissed**, **37% dismissal rate**.

Interpretation: dismissal is not catastrophic, but the previous behavior was too aggressive for SEO/blog traffic because it showed quickly, allowed early scroll/exit triggers, and did not persist dismissals. That could inflate `popup_shown`, create friction, and compete with page-level CTA bridges.

Local change made:

- Time delay: `1.2s` -> `7s`.
- Scroll trigger: `28%` -> `55%`.
- Dismissal persistence: no persistence -> `7 days` via `maintane_popup_dismissed` cookie.
- Converted visitors still suppressed for `365 days`.

## Clean event taxonomy

| Funnel step | Event | Key event? | Description |
| --- | --- | --- | --- |
| CTA click | `waitlist_cta_click` | No | Any CTA click to `/waitlist/`. Main denominator after impressions. |
| CTA click | `checklist_cta_click` | No | Click toward checklist lead magnet. |
| CTA click | `dosing_guide_click` | No | Click toward dosing education. |
| Form start | `form_start` | No | GA4-friendly form-start event fired once on email-field focus. |
| Form start | `lead_form_start` | No | Maintane-specific lead form start with source/list params. |
| Form submit | `lead_form_submit` | Yes, if used as lead key event | Successful Klaviyo lead capture. |
| Form submit | `generate_lead` | Yes, recommended primary lead key event | GA4 recommended lead event. Use this or `lead_form_submit`, not both in total reports. |
| Waitlist complete | `waitlist_complete` | Yes | Successful waitlist capture from popup, footer, or waitlist page. |
| Checkout start | `checkout_start` | Yes only after checkout is live | Fires only on verified Shopify checkout/product destination clicks. |
| Checkout click | `checkout_click` | Optional micro-conversion | Legacy/diagnostic checkout click. |
| Checkout complete | `purchase` | Yes after Shopify integration | Should come from Shopify/checkout integration, not static-site click tracking. |

## Reporting rule

For weekly funnel readout, use this sequence:

`waitlist_cta_impression` -> `waitlist_cta_click` -> `form_start` / `lead_form_start` -> `lead_form_submit` or `generate_lead` -> `waitlist_complete`.

Do not count CTA impressions, popup shown, popup dismissed, nav clicks, or scroll events as success.
