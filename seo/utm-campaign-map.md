# Maintane UTM Campaign Map

Last updated: 2026-05-11

Use this file to keep external traffic clean in GA4. The rule is simple: **use UTMs on outside links only. Do not use UTMs on internal links between Maintane pages.**

## Why this exists

The last-60-day GA4 readout showed Direct + Unassigned at **61.8% of sessions**. That makes it hard to know which social, paid, referral, and creator activity is actually working. This map is the operating standard for all external Maintane links going forward.

## Base Template

```text
https://getmaintane.com/{page}?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={creative_or_placement}
```

Optional when useful:

```text
&utm_term={audience_or_keyword}
```

## Required Fields

| Field | Rule | Good examples | Avoid |
| --- | --- | --- | --- |
| `utm_source` | Platform, publisher, creator, or placement. | `instagram`, `facebook`, `tiktok`, `meta`, `youtube`, `newsletter`, `home_inspector_blog` | `ig` sometimes and `instagram` other times; vague names like `social` |
| `utm_medium` | Channel type. | `paid_social`, `organic_social`, `referral`, `email`, `creator`, `community`, `paid_search` | `(not set)`, `paid`, `social` if paid/organic matters |
| `utm_campaign` | Stable campaign theme for 2-4+ weeks. | `natural_septic_waitlist`, `founder_education`, `seo_footprint`, `septic_cost_content` | Individual post names or constantly changing labels |
| `utm_content` | Creative, hook, placement, or variant. | `profile_link`, `story_dosing`, `smell_hook_video`, `trust_kid_pet_static` | Leaving blank on social/paid links |
| `utm_term` | Optional audience/keyword/ad-set detail. | `homeowners_with_septic`, `septic_smell`, `rural_homeowners` | Duplicating campaign/content |

## Canonical source names

Use these exactly unless there is a specific named partner/publication.

| Platform/context | `utm_source` |
| --- | --- |
| Instagram organic | `instagram` |
| Facebook organic | `facebook` |
| TikTok organic | `tiktok` |
| YouTube organic | `youtube` |
| Meta paid ads when platform split is unknown | `meta` |
| Instagram paid ads when known | `instagram` |
| Facebook paid ads when known | `facebook` |
| Google paid search | `google` |
| Klaviyo/email | `klaviyo` |
| Creator/influencer | creator handle or name, e.g. `septicdad` |
| Directory/resource sites | site or category, e.g. `home_inspector_blog`, `septic_resource_page` |
| Reddit/Quora/community answers | `reddit`, `quora`, or the community name |

## Canonical medium names

| Channel | `utm_medium` |
| --- | --- |
| Paid social | `paid_social` |
| Organic social | `organic_social` |
| Creator/influencer | `creator` |
| Referral/editorial/resource link | `referral` |
| Email | `email` |
| Community answers/posts | `community` |
| Paid search | `paid_search` |
| Affiliate, if launched later | `affiliate` |

## Main Campaigns

| Funnel lane | Campaign | Primary page | Job |
| --- | --- | --- | --- |
| Problem-aware | `problem_aware_septic_smell` | `/septic-smell.html` or `/waitlist/` | Catch smell, slow drain, alarm, and gurgling traffic. |
| Solution-aware | `natural_septic_waitlist` | `/waitlist/` | Convert natural septic treatment interest into email capture. |
| Solution-aware | `natural_septic_treatment` | `/natural-septic-treatment.html` | Educate searchers comparing natural treatment options. |
| Trust-aware | `trust_kid_pet_safe` | `/septic-treatment-for-homes-with-kids-and-pets.html` or `/waitlist/` | Capture safety-conscious households. |
| Cost/commercial | `septic_cost_content` | `/blog/septic-tank-cleaning-cost.html` | Convert cost research into prevention/maintenance education. |
| Resource/backlink | `seo_footprint` | `/septic-care-checklist.html` | Give referral sites a useful homeowner resource to link to. |
| Founder education | `founder_education` | `/dosing-guide.html` | Route organic social viewers into the routine explanation. |
| Launch/email | `launch_waitlist` | `/waitlist/` | Route owned email and launch reminders. |

## Paid Meta Starter Links

Meta paid default when placement split is unknown:

```text
https://getmaintane.com/waitlist/?utm_source=meta&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=problem_smell_static
```

Instagram paid known placement:

```text
https://getmaintane.com/waitlist/?utm_source=instagram&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=story_problem_smell
```

Facebook paid known placement:

```text
https://getmaintane.com/waitlist/?utm_source=facebook&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=feed_trust_kid_pet
```

Solution-aware natural treatment angle:

```text
https://getmaintane.com/waitlist/?utm_source=meta&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=solution_natural_static
```

Trust-aware kid and pet safe angle:

```text
https://getmaintane.com/waitlist/?utm_source=meta&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=trust_kid_pet_static
```

Video hook for odor/slow drains:

```text
https://getmaintane.com/waitlist/?utm_source=meta&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=problem_smell_video
```

## Organic Social Starter Links

Instagram bio link:

```text
https://getmaintane.com/waitlist/?utm_source=instagram&utm_medium=organic_social&utm_campaign=natural_septic_waitlist&utm_content=bio_link
```

Instagram story explaining dosing:

```text
https://getmaintane.com/dosing-guide.html?utm_source=instagram&utm_medium=organic_social&utm_campaign=founder_education&utm_content=story_dosing
```

TikTok bio link:

```text
https://getmaintane.com/waitlist/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=natural_septic_waitlist&utm_content=bio_link
```

TikTok septic smell educational post:

```text
https://getmaintane.com/septic-smell.html?utm_source=tiktok&utm_medium=organic_social&utm_campaign=problem_aware_septic_smell&utm_content=smell_hook_video
```

YouTube description for natural treatment video:

```text
https://getmaintane.com/natural-septic-treatment.html?utm_source=youtube&utm_medium=organic_social&utm_campaign=natural_septic_treatment&utm_content=video_description
```

## Creator / Influencer Starter Links

Creator profile link:

```text
https://getmaintane.com/waitlist/?utm_source={creator_handle}&utm_medium=creator&utm_campaign=natural_septic_waitlist&utm_content=profile_link
```

Creator post/story:

```text
https://getmaintane.com/septic-care-checklist.html?utm_source={creator_handle}&utm_medium=creator&utm_campaign=seo_footprint&utm_content=checklist_story
```

## Email / Owned Links

Launch email CTA:

```text
https://getmaintane.com/waitlist/?utm_source=klaviyo&utm_medium=email&utm_campaign=launch_waitlist&utm_content=primary_cta
```

Educational email CTA:

```text
https://getmaintane.com/dosing-guide.html?utm_source=klaviyo&utm_medium=email&utm_campaign=founder_education&utm_content=dosing_guide_cta
```

## Referral And Backlink Starter Links

General homeowner resource profile:

```text
https://getmaintane.com/septic-care-checklist.html?utm_source=directory&utm_medium=referral&utm_campaign=seo_footprint&utm_content=profile_link
```

Septic-safe cleaning resource:

```text
https://getmaintane.com/septic-safe-home-cleaning-guide.html?utm_source=directory&utm_medium=referral&utm_campaign=seo_footprint&utm_content=cleaning_resource
```

Printable guest rules resource:

```text
https://getmaintane.com/printable-septic-rules-for-guests.html?utm_source=directory&utm_medium=referral&utm_campaign=seo_footprint&utm_content=guest_rules
```

## Reporting View

In GA4, review these dimensions together:

- `Session source / medium`
- `Session campaign`
- `Session manual ad content`
- `Landing page + query string`
- `Page path and screen class`
- `Event name`

The question is not just "which source got traffic?" The real question is: which lane moved people one step deeper into the funnel?

## Naming Guardrails

- Keep campaign names stable for at least 2-4 weeks.
- Change `utm_content` when testing hook, creative, placement, or format.
- Never use UTMs for links from one Maintane page to another.
- Do not mix paid and organic under the same `utm_medium`.
- Use lowercase and underscores so GA4 stays readable.
- Do not use popup/form/source labels as UTMs. Onsite form attribution belongs in GA4 event parameters like `signup_source`, not traffic-source parameters.
- Do not use event parameter name `source` in GA4 lead events. Use `signup_source` to avoid muddy attribution dimensions.
