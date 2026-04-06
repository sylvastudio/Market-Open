# Market Open

**Built by [Sylva Studio](https://github.com/sylvastudio) for [OptionsLab.app](https://optionslab.app)** — a daily market snapshot tool that powers their social media content with live financial data.

OptionsLab needed an automated way to generate professional, share-ready market graphics for their audience every trading day. Market Open pulls live data, formats it into clean visuals, and lets them download publication-ready images in one click. No manual data entry, no design work, no bottleneck.

This is the kind of thing we build at **Sylva Studio** — technical automation that removes repetitive work and lets teams focus on what matters. If your workflow involves pulling data, generating content, or stitching systems together, we can probably automate it.

---

## What It Does

- **Market Indices** — Live S&P 500, Dow 30, Nasdaq, Russell 2000, VIX, and Gold data
- **Top Gainers & Losers** — Top 5 movers in each direction, updated from Yahoo Finance
- **One-Click Image Export** — Download social-media-ready PNGs (1080px wide, branded layout)
- **Auto-Refresh** — Data refreshes every 15 minutes with built-in rate limit protection

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Vite |
| Backend (local) | Node.js, Express |
| Production | Netlify (static site + serverless functions) |
| Data | Yahoo Finance API (v8 chart + screener) |

---

## About Sylva Studio

We build technical automation for teams that are tired of doing things manually. Data pipelines, content generation, API integrations, internal tools — if it's repetitive and technical, we automate it.

**Get in touch:** [sylvastudio.com](http://sylvastudio.com)

## License

MIT
