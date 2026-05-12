# Homepage Brand Search CTR Fix

Last updated: 2026-05-11

Owner: Lincoln + Atlas  
Priority: High  
Effort: Low  
Success metric: branded Search Console CTR improves from 0.19% toward a normal branded baseline.

## Problem

Search Console showed branded query demand for `maintane` with 514 impressions, average position 4.89, and only 1 click. That implies the branded SERP result is not making the product category or click value obvious enough.

## Local Homepage SEO Package

### Title tag

Before:

```txt
Maintane | Monthly Septic Tank Treatment for Homeowners
```

After:

```txt
Maintane | Monthly Septic Tank Treatment & Maintenance
```

Rationale: keeps the brand first, but makes the product category and maintenance use case immediately visible in branded search results.

### Meta description

After:

```txt
Maintane is a monthly septic tank treatment powder for homeowners. Support septic maintenance with live bacteria, no harsh chemicals, and one-scoop dosing.
```

Rationale: explicitly answers “what is Maintane?” and gives homeowners concrete reasons to click: monthly treatment, septic maintenance, live bacteria, no harsh chemicals, one-scoop dosing.

### Robots meta

Added:

```html
<meta name="robots" content="index,follow,max-image-preview:large">
```

Rationale: explicit index/follow and stronger image-preview eligibility.

### H1 and above-the-fold clarity

Before:

```txt
Your system. Maintained. Naturally.
```

After:

```txt
Monthly septic tank treatment for homeowners.
```

Hero eyebrow after:

```txt
MONTHLY SEPTIC TANK TREATMENT
```

Hero subhead after:

```txt
Maintane is a natural septic maintenance powder with 12B live bacteria per dose. One scoop per toilet, once a month.
```

Rationale: above-the-fold now states the category clearly before the visitor has to infer it from brand copy.

## Structured Data Package

Updated homepage JSON-LD into one `@graph` containing:

- `Organization`
- `WebSite`
- `Product`

Product offer availability is set to:

```txt
https://schema.org/PreOrder
```

Rationale: this is safer than claiming `InStock` while the public Shopify checkout is not yet verified live and the homepage still routes product CTAs to the waitlist.

## Technical Index Sanity Check

Live checks performed locally on 2026-05-11:

| URL checked | Result |
| --- | --- |
| `https://getmaintane.com/` | 200, final canonical homepage |
| `http://getmaintane.com/` | Redirects once to `https://getmaintane.com/` |
| `https://www.getmaintane.com/` | Redirects once to `https://getmaintane.com/` |
| `http://www.getmaintane.com/` | Redirects once to `https://getmaintane.com/` |

Canonical found live:

```html
<link rel="canonical" href="https://getmaintane.com/">
```

Robots file live:

```txt
Sitemap: https://getmaintane.com/sitemap.xml
```

Sitemap local homepage entry now:

```xml
<url>
  <loc>https://getmaintane.com/</loc>
  <lastmod>2026-05-11</lastmod>
  <priority>1.0</priority>
</url>
```

Sitemap sanity result:

- Homepage appears once.
- Homepage is first URL in sitemap.
- Sitemap total URL count: 137.

## Files Changed Locally

```txt
index.html
sitemap.xml
seo/homepage-brand-search-ctr-fix.md
```

No deploy, commit, push, Search Console validation, or external platform change was performed.

## Post-Deploy Watch

After approved deployment and recrawl, check Search Console for branded queries:

- Query: `maintane`
- Page: `https://getmaintane.com/`
- CTR
- Average position
- Impressions
- Clicks

Expected first improvement target: move branded CTR from 0.19% toward at least low single digits while Google refreshes the title/snippet.
