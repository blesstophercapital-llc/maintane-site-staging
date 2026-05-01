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

## Shared Assets

- `/css/funnel.css`: shared funnel page styling, nav, hero, cards, lead forms, FAQ, CTA bands, and mobile behavior.
- `/js/funnel.js`: shared mobile menu behavior.
- `/js/lead-capture.js`: reusable Klaviyo lead capture handler with post-signup second-step offer support.

## Tracking Sources

- `septic_treatment_landing`: embedded checklist form on the broad treatment page. Sends to Klaviyo list `XKHBEk`.
- `septic_checklist_landing`: dedicated checklist squeeze page. Sends to Klaviyo list `XKHBEk`.
- `funnel_cta_click`: GA4 event fired when visitors click links to the hub, checklist, or intent-specific landing pages.

## Future Pages To Add

- `/septic-maintenance-calendar.html`: second lead magnet for monthly reminder signups.

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
