# Maintane GA4 Event Taxonomy

Last updated: 2026-05-11

This file defines the working GA4 interpretation standard for Maintane. It exists so reports separate traffic acquisition, funnel intent, lead capture, and noisy interaction events.

## Current measurement context

Last 60 days showed:

- 437 sessions
- 303 active users
- 2,091 page views
- 7,254 events
- 9 key events
- Direct + Unassigned: 61.8% of sessions
- Organic Search: 2.3% of sessions

Primary problem for Chunk 1: attribution and event interpretation need to be cleaner before scaling paid, social, SEO, or creator traffic.

## Event priority levels

| Level | Meaning | Use in reporting |
| --- | --- | --- |
| P0 | Revenue or purchase intent | Treat as the strongest conversion signal. |
| P1 | Lead capture / owned-audience growth | Treat as a key event if lead quality is acceptable. |
| P2 | High-intent CTA click | Use as funnel progression, not final conversion. |
| P3 | Engagement / content depth | Use to diagnose page quality. |
| P4 | Exposure / impression / navigation | Use for context only, not success. |

## Recommended event classification

| Event | Level | Keep as key event? | Meaning | Notes |
| --- | --- | --- | --- | --- |
| `generate_lead` | P1 | Yes | Successful email lead generated. | GA4 recommended event; should be primary lead key event. |
| `waitlist_complete` | P1 | Yes | Successful waitlist capture from popup, footer, or waitlist page. | Use as the clean waitlist completion event while checkout is not verified live. |
| `form_start` | P2 | No | Email field focused on an onsite form. | Funnel diagnostic only. |
| `lead_form_start` | P2 | No | Maintane-specific form-start event with source/list params. | Use to diagnose form-start to submit rate. |
| `lead_form_submit` | P1 | Yes, if not duplicating `generate_lead` in key-event totals | Successful onsite lead form submission. | Useful for all lead forms. Avoid double-counting when reporting. |
| `email_signup` | P1 | Optional | Email signup succeeded. | Useful but overlaps with lead events. |
| `popup_lead_submit` | P1 | Optional/source detail | Popup form succeeded. | Source-specific, do not add to total conversions with generic lead events. |
| `footer_waitlist_submit` | P1 | Optional/source detail | Footer waitlist form succeeded. | Source-specific, do not double-count. |
| `checklist_lead_submit` | P1 | Optional/source detail | Checklist/landing form succeeded. | Source-specific, do not double-count. |
| `checkout_start` | P0/P2 | Yes only after checkout is live | Visitor started verified Shopify checkout/product path. | Do not use as primary while traffic routes to waitlist. |
| `checkout_click` | P2 | Maybe | Visitor clicked verified checkout/product destination. | Strong purchase-intent click, but not revenue. |
| `product_cta_click` | P2 | Maybe | Product CTA clicked. | Could duplicate checkout clicks depending on destination. |
| `product_waitlist_click` | P2 | No | Product CTA routed to waitlist. | Funnel step, not conversion. |
| `waitlist_cta_click` | P2 | No | Waitlist link clicked. | Funnel step. Use with landing page/source. |
| `funnel_cta_click` | P2 | No | Click into a funnel page or checklist path. | Progression event. |
| `checklist_cta_click` | P2 | No | Click toward checklist. | Intent signal before lead. |
| `dosing_guide_click` | P2/P3 | No | Click to dosing guide. | Useful education signal. |
| `blog_read_75pct` | P3 | No | Blog post read depth. | Content quality indicator. |
| `dosing_guide_viewed` | P3 | No | Dosing guide viewed to depth threshold. | Education signal. |
| `product_page_scroll_50` | P3 | No | Homepage/product page scroll depth. | Quality signal. |
| `external_link_click` | P3/P4 | No | Click to TikTok/Instagram/Amazon/etc. | Use cautiously. |
| `nav_click` | P4 | No | Navigation clicked. | Diagnostic only. |
| `mobile_menu_open` | P4 | No | Mobile menu opened. | UX diagnostic. |
| `checkout_cta_impression` | P4 | No | Checkout/product CTA was visible. | Impression only; not success. |
| `waitlist_cta_impression` | P4 | No | Waitlist CTA was visible. | Impression only; not success. |
| `popup_shown` | P4 | No | Popup displayed. | Context for popup performance. |
| `popup_dismissed` | P4 | No | Popup closed. | Friction signal. |

## Reporting rules

1. Report one lead total using either `generate_lead` or `lead_form_submit`, not every source-specific lead event added together.
2. Treat CTA impressions as denominators only. They are not success metrics.
3. Treat CTA clicks as micro-conversions, not revenue.
4. Separate waitlist clicks from confirmed lead submissions.
5. Use `signup_source` for onsite form source labels. Do not use `source` as a GA4 event parameter for lead events.
6. Use UTMs only for external acquisition links. Internal page-to-page links should stay clean.
7. When reporting paid/social effectiveness, use session source/medium + campaign + content, then segment by landing page and lead events.

## Event parameter standard

### Lead events

Use:

- `signup_source`
- `source_page`
- `form_id`
- `list_id`

Avoid:

- `source` for GA4 event params, because it can muddy reporting and conflict mentally with traffic-source dimensions.

### CTA click events

Use:

- `source_page`
- `virtual_page`, if homepage SPA panel applies
- `destination`
- `destination_path`
- `cta_text`
- `button_location`
- `destination_type`, when useful

### Content engagement events

Use:

- `source_page`
- `page_title`
- `blog_post`
- `url`

## Current cleanup completed locally

- Popup source label changed from `pre_launch_popup` to `popup_waitlist`.
- Lead-form GA4 params changed from `source` to `signup_source` in:
  - `/js/popup.js`
  - `/js/lead-capture.js`
  - `/js/footer-waitlist.js`
- Meta Pixel still receives its own `source` field because that is separate from GA4 event parameter reporting.

## Recommended GA4 admin settings

No admin changes made yet. If approved later, review GA4 key events so the main operating view uses:

- Primary key event: `generate_lead` or `lead_form_submit`, choose one.
- Optional purchase-intent key event: `checkout_click` only if Shopify checkout is live and verified.
- Do not mark impression, nav, popup shown/dismissed, or generic scroll events as key events.

## Weekly dashboard questions

1. Which external source/medium/campaign drove sessions?
2. Which landing pages converted those sessions into leads?
3. Which CTA locations created clicks but not leads?
4. Which pages have high engagement but weak CTA clicks?
5. Which channels are still falling into Direct or Unassigned?


## Chunk 4 conversion goal

Primary conversion goal right now is waitlist completion: `waitlist_cta_click` -> `form_start` / `lead_form_start` -> `lead_form_submit` / `generate_lead` -> `waitlist_complete`. Checkout events remain defined but should not be the main success metric until Shopify checkout is verified live.
