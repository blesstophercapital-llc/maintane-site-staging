# Maintane Funnel System

This file defines the reusable funnel structure so future landing pages stay organized instead of becoming one-off builds. The strategy follows a simple funnel model:

1. Define the dream customer.
2. Find where that customer is already looking for answers.
3. Use a clear hook to earn attention.
4. Tell a short, trustworthy story that reframes the problem.
5. Ask for the first yes.
6. Offer the second yes when intent is warm.

## Core Flow

1. Organic blog traffic answers a specific homeowner problem.
2. Problem-aware visitors go to `/septic-treatment.html`.
3. Research-mode visitors go to `/septic-care-checklist.html`.
4. Ready-to-buy visitors go directly to Shopify.
5. Email leads enter Klaviyo through `js/lead-capture.js`.
6. Confirmed leads see an immediate second-step offer to buy the first jar.

## Dream Customer

The primary customer is a homeowner with a septic system who is problem-aware but not yet confident:

- They noticed a smell, slow drain, gurgle, recent pump-out, or another small warning sign.
- They are searching online because they want to avoid a large repair bill.
- They do not want a harsh chemical routine in a home with kids, pets, guests, or everyday household use.
- They want simple instructions more than technical overload.
- They value a premium, trustworthy brand that feels calm instead of alarmist.

Maintane should speak to the homeowner before they know the answer. They are not looking for a science lecture first. They are looking for reassurance, clarity, and the next safe step.

Use `/seo/avatar-awareness-map.md` before creating new SEO pages, blogs, lead magnets, or outreach assets. That map breaks the broad homeowner audience into buyer avatars, awareness stages, hooks, proof needs, and internal-link paths.

## Where They Congregate

Future content, outreach, and paid tests should be organized around the places this customer already goes:

- Google searches for septic smell, slow drains, septic tank treatment, natural septic treatment, septic-safe products, and monthly maintenance.
- Homeowner and rural-living communities on Reddit, Facebook groups, neighborhood groups, and homesteading forums.
- YouTube channels from plumbers, septic pros, home inspectors, homesteaders, rural property creators, and DIY home maintenance educators.
- Local septic company blogs, state extension resources, real estate/new-homeowner guides, and product comparison pages.
- Marketplaces and reviews where homeowners compare common additives and natural alternatives.

The future "Dream 100" list should be built from creators, publications, and communities already trusted by septic homeowners. Work into those audiences through useful content and relationships, then buy into them with targeted ads once the hooks are proven.

## Hook, Story, Offer

Every funnel page should map to this sequence before copy is written:

- Hook: "Researching septic treatment because something feels off?" This meets the visitor at the smell, slow drain, or maintenance worry that caused the search.
- Story: Your septic system is biological. Panic-buying harsh additives is not the only option. A simple monthly routine can support the bacteria the system already depends on.
- Offer: Get the free septic checklist first, or buy the first jar of Maintane for $39.99 if ready.

The hook earns attention. The story creates trust. The offer gives a clean next step.

## First Yes And Second Yes

The first yes is not always a purchase. For research-mode traffic, the first yes is the email signup:

- "Get the free septic checklist"
- "Send me the checklist"
- "How to use Maintane"

The second yes happens after the visitor has raised their hand:

- Post-opt-in product offer: "Shop Maintane - $39.99"
- Follow-up email CTA to the Shopify product page.
- Retargeting around the 10-second monthly routine.

Future upsell paths should stay simple until the product system supports them:

- Multi-jar bundle for larger homes.
- Subscribe-and-save monthly or quarterly refill.
- Seasonal septic care reminders.
- New-homeowner septic care kit.

## Current Funnel Pages

- `/septic-treatment.html`: broad SEO landing page for septic treatment, smell, slow drains, and monthly maintenance.
- `/septic-care-checklist.html`: focused lead magnet page for checklist signups.
- `/septic-smell.html`: symptom page for homeowners researching septic odor.
- `/slow-drains.html`: symptom page for slow drains, clogs, and septic stress.
- `/natural-septic-treatment.html`: product-choice page for natural septic treatment searches.
- `/ridx-alternative.html`: comparison page for high-intent Rid-X alternative searches.
- `/septic-treatment-for-homes-with-kids-and-pets.html`: audience page for safety-conscious households.
- `/septic-treatment-after-pumping.html`: audience/timing page for post-pump-out maintenance.
- `/toilets-gurgling-septic.html`: symptom page for gurgling toilets and early septic warning signs.
- `/septic-alarm-going-off.html`: symptom page for homeowners researching septic alarm causes.
- `/septic-backup.html`: urgent problem page that routes crisis traffic toward pro help, checklist capture, and post-issue maintenance.
- `/standing-water-drain-field.html`: symptom page for standing water, soggy yard, and drain field concern searches.
- `/septic-treatment-for-new-homeowners.html`: audience page for first-time septic owners.
- `/septic-treatment-for-vacation-homes.html`: audience page for cabins, rentals, and seasonal homes.
- `/septic-treatment-for-older-homes.html`: audience page for older septic systems and older homes.
- `/septic-treatment-for-garbage-disposals.html`: audience/usage page for homes with garbage disposals.
- `/monthly-septic-treatment.html`: routine page for monthly septic treatment and maintenance searches.
- `/septic-treatment-powder.html`: product-format page for powder septic treatment searches.
- `/chemical-free-septic-treatment.html`: product-choice page for chemical-free septic treatment searches.
- `/best-septic-treatment.html`: high-intent evaluation page for best septic treatment searches.
- `/septic-tank-smell-in-house.html`: symptom page for indoor septic odor searches.
- `/septic-smell-outside.html`: symptom page for yard, tank, and drain-field odor searches.
- `/rotten-egg-smell-septic.html`: symptom/source-triage page for sulfur or rotten egg odor searches.
- `/toilet-bubbling-septic.html`: symptom page for bubbling toilets and air-movement warning signs.
- `/shower-drain-smells-septic.html`: symptom page for bathroom drain odor in septic homes.
- `/septic-tank-full-signs.html`: symptom page for full tank warning signs and pumping intent.
- `/septic-safe-drain-cleaner.html`: product-choice page for septic-safe drain cleaner searches.
- `/septic-safe-toilet-cleaner.html`: product-choice page for septic-safe toilet cleaner searches.
- `/septic-safe-laundry-detergent.html`: product-choice page for septic-safe laundry detergent and water-load searches.
- `/septic-treatment-for-rental-homes.html`: audience page for rental homes, cabins, and Airbnb septic care.
- `/septic-safe-home-cleaning-guide.html`: backlink/referral asset for whole-home septic-safe cleaning guidance.

## Cannibalization Guardrails

- `/septic-treatment.html` is the broad parent guide for problem-aware visitors. Keep it broad and use it to route into symptom, audience, and product-choice pages.
- `/natural-septic-treatment.html` owns natural septic treatment and bacteria-first language. Avoid making it primarily about chemical avoidance.
- `/chemical-free-septic-treatment.html` owns no-harsh-chemical and chemical-conscious searches. Avoid making it a generic natural treatment page.
- `/monthly-septic-treatment.html` owns schedule, cadence, reminders, and dosing routine searches. Avoid buyer-guide language here.
- `/best-septic-treatment.html` owns buyer evaluation searches. Keep it focused on comparison criteria, honest limits, and product fit.
- `/septic-treatment-for-new-homeowners.html` owns first-time septic ownership education. Keep it focused on first rules, what not to flush, tank location, pump schedule, and warning signs.
- `/septic-smell.html` owns broad septic odor intent. Keep smell subpages focused by location or odor type instead of repeating the broad page.
- `/septic-safe-home-cleaning-guide.html` is the broad linkable asset for household cleaning habits. Keep cleaner subpages focused on one product category.
- `/septic-tank-full-signs.html` owns full-tank and pumping-warning intent. Do not make treatment pages imply that Maintane replaces pumping.

## Current Support Blog Posts For New Landing Pages

- `/blog/why-does-my-house-smell-like-septic.html`: support article for `/septic-tank-smell-in-house.html`.
- `/blog/septic-smell-outside-after-rain.html`: support article for `/septic-smell-outside.html`.
- `/blog/rotten-egg-smell-in-bathroom-septic.html`: support article for `/rotten-egg-smell-septic.html`.
- `/blog/toilet-bubbling-on-septic-system.html`: support article for `/toilet-bubbling-septic.html`.
- `/blog/shower-drain-smells-like-sewer-septic.html`: support article for `/shower-drain-smells-septic.html`.
- `/blog/septic-tank-full-or-clogged-drain.html`: support article for `/septic-tank-full-signs.html`.
- `/blog/septic-safe-drain-cleaner-alternatives.html`: support article for `/septic-safe-drain-cleaner.html`.
- `/blog/septic-safe-cleaning-rules-for-rentals.html`: support article for `/septic-treatment-for-rental-homes.html`.

## Blog Internal Linking Standard

- Older authority posts should include contextual links to relevant landing pages when the symptom or use case naturally appears.
- New support posts should link sideways to older authority articles as well as upward to the matching landing page.
- Keep guide blocks concise. Prefer 3-4 highly relevant links over broad link stuffing.

## Proof And Clarity Standard

- High-intent SEO landing pages should answer the plain user question immediately after the hero.
- Use simple language before clever phrasing: what is happening, what to do first, and what Maintane can honestly do.
- Pair every answer with product facts: $39.99, one level scoop per toilet once a month, kid and pet safe, Made in USA, no harsh chemicals, and a clear limit.
- For symptom pages, the limit should state that Maintane does not replace pumping, plumbing repairs, or professional diagnosis.

## Shared Assets

- `/css/funnel.css`: shared funnel page styling, nav, hero, cards, lead forms, FAQ, CTA bands, and mobile behavior.
- `/js/funnel.js`: shared mobile menu behavior.
- `/js/lead-capture.js`: reusable Klaviyo lead capture handler with post-signup second-step offer support.

## Tracking Sources

- `septic_treatment_landing`: embedded checklist form on the broad treatment page. Sends to Klaviyo list `XKHBEk`.
- `septic_checklist_landing`: dedicated checklist squeeze page. Sends to Klaviyo list `XKHBEk`.
- `funnel_cta_click`: GA4 event fired when visitors click links to the hub, checklist, or intent-specific landing pages.

## Future Pages To Add

- `/septic-safe-home-products.html`: safety-conscious parent/pet owner and backlink asset.
- `/septic-maintenance-calendar.html`: unaware/new homeowner lead magnet and reminder asset.
- `/printable-septic-rules-for-guests.html`: rental/vacation owner backlink and lead asset.
- `/septic-treatment-powder-vs-liquid.html`: natural/product-aware comparison page.
- `/first-30-days-with-a-septic-system.html`: new homeowner education asset.
- `/septic-maintenance-record-template.html`: older-home owner and backlink asset.
- State/use-case pages where search intent is specific enough, such as rain-heavy septic maintenance, cabin septic care, and older-home septic routines by region.

## Future Funnel Assets

- Checklist delivery email: send the checklist and link to the dosing guide.
- Three-email nurture: smell/slow drain triage, natural routine education, product CTA.
- Short product bridge page or VSL: explain the biological routine in under two minutes.
- Retargeting hooks: smell, slow drains, kid and pet safe, no harsh chemicals, one scoop per toilet.
- Creator outreach list: septic pros, home inspectors, rural living creators, and DIY maintenance educators.

## Build Rules

- Use `/css/funnel.css` instead of inline page-specific CSS unless a section is truly unique.
- Use `data-lead-form`, `data-lead-source`, and `data-lead-list-id` for every list-specific lead form.
- Use `data-lead-next` for the immediate second-step offer after successful signup.
- Purchase CTAs should go directly to `https://shop.getmaintane.com/products/maintane-natural-septic-tank-treatment`.
- Research CTAs should point to `/septic-care-checklist.html` or a relevant educational page.
- Every indexable funnel page needs canonical, SEO title, meta description, OG/Twitter tags, schema, and sitemap entry.
