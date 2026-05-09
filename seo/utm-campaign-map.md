# Maintane UTM Campaign Map

Use this file to keep external traffic clean in GA4. The rule is simple: use UTMs on outside links only. Do not use UTMs on internal links between Maintane pages.

## Base Template

```text
https://getmaintane.com/{page}?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={creative}
```

## Recommended Fields

- `utm_source`: platform or placement, such as `meta`, `ig`, `tiktok`, `youtube`, `directory`, `newsletter`, or a partner/site name.
- `utm_medium`: channel type, such as `paid_social`, `organic_social`, `referral`, `email`, or `creator`.
- `utm_campaign`: stable campaign theme, not the individual post.
- `utm_content`: creative angle, placement, or hook.

## Main Campaigns

| Funnel lane | Campaign | Primary page | Job |
| --- | --- | --- | --- |
| Problem-aware | `problem_aware_septic_smell` | `/septic-smell.html` or `/waitlist/` | Catch smell, slow drain, alarm, and gurgling traffic. |
| Solution-aware | `natural_septic_waitlist` | `/waitlist/` | Convert natural septic treatment interest into email capture. |
| Solution-aware | `natural_septic_treatment` | `/natural-septic-treatment.html` | Educate searchers comparing natural treatment options. |
| Trust-aware | `trust_kid_pet_safe` | `/septic-treatment-for-homes-with-kids-and-pets.html` or `/waitlist/` | Capture safety-conscious households. |
| Resource/backlink | `seo_footprint` | `/septic-care-checklist.html` | Give referral sites a useful homeowner resource to link to. |
| Founder education | `founder_education` | `/dosing-guide.html` | Route organic social viewers into the routine explanation. |

## Paid Meta Starter Links

Problem-aware smell angle:

```text
https://getmaintane.com/waitlist/?utm_source=meta&utm_medium=paid_social&utm_campaign=natural_septic_waitlist&utm_content=problem_smell_static
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

Instagram story explaining dosing:

```text
https://getmaintane.com/dosing-guide.html?utm_source=ig&utm_medium=organic_social&utm_campaign=founder_education&utm_content=story_dosing
```

TikTok septic smell educational post:

```text
https://getmaintane.com/septic-smell.html?utm_source=tiktok&utm_medium=organic_social&utm_campaign=problem_aware_septic_smell&utm_content=smell_hook_video
```

YouTube description for natural treatment video:

```text
https://getmaintane.com/natural-septic-treatment.html?utm_source=youtube&utm_medium=organic_social&utm_campaign=natural_septic_treatment&utm_content=video_description
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

## Weekly Reporting View

In GA4, review these dimensions together:

- `Session source / medium`
- `Session campaign`
- `Session manual ad content`
- `Page path and screen class`
- `Event name`

The question is not just "which source got traffic?" The real question is: which lane moved people one step deeper into the funnel?

## Naming Guardrails

- Keep campaign names stable for at least 2-4 weeks.
- Change `utm_content` when testing hook, creative, placement, or format.
- Never use UTMs for links from one Maintane page to another.
- Do not mix paid and organic under the same `utm_medium`.
- Use lowercase and underscores so GA4 stays readable.
