// The .md format for blog posts (downloadable from the admin). Kept separate so the browser can load it.
export const MARKDOWN_TEMPLATE = `---
# Prayag blog post. Lines starting with # inside this header are comments.
# Put a value in "double quotes" when it contains a colon (:) or starts with a special character.
title: "How to Choose the Right Kitchen Sink"
# The address of the post: /how-to-choose-the-right-kitchen-sink
# (optional: made from the title when left out; lower-case words joined by hyphens)
slug: how-to-choose-the-right-kitchen-sink
# Publication date, YYYY-MM-DD (optional: today)
date: 2026-11-04
# Search results / social preview (optional)
metaTitle: "How to Choose the Right Kitchen Sink | Prayag"
description: "Single or double bowl, steel or quartz: a quick guide to picking a kitchen sink that fits your space."
# Banner: a site path such as /sites/prayag/files/2024-08/blog.webp,
# or the file name of an image you upload together with this file (e.g. banner.jpg)
bannerImage: banner.jpg
bannerAlt: Stainless steel kitchen sink
# Related posts shown under the article (optional): slugs of existing posts
related:
  - double-bowl-kitchen-sink-price
  - single-bowl-kitchen-sink-price
---

Write the article in **Markdown** below the header.

## A heading

A paragraph with a [link to the faucets](/faucets) and a list:

- first point
- second point

![An image uploaded with this file](photo-1.jpg)
`;
