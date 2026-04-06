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

## Deployment

The app is deployed on **Netlify**. The Express backend is converted into serverless functions for production — no persistent server required.

- `netlify/functions/market-indices.mjs` — proxies Yahoo Finance chart API
- `netlify/functions/gainers-losers.mjs` — proxies Yahoo Finance screener API
- `netlify.toml` — build config, API redirects, SPA fallback

Push to `main` and Netlify handles the rest.

## Local Development

```bash
# Backend
cd backend && npm install && npm start
# Runs on http://localhost:4000

# Frontend (in a separate terminal)
cd frontend && npm install && npm run dev
# Runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the local Express backend automatically.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/market-indices` | Current index prices and daily change % |
| `GET /api/gainers-losers` | Top 5 gainers and losers with price data |

Both endpoints cache responses for 15 minutes to stay within Yahoo Finance rate limits.

## Routes

- `/` — Market indices dashboard
- `/gainers-losers` — Top gainers and losers

---

## About Sylva Studio

We build technical automation for teams that are tired of doing things manually. Data pipelines, content generation, API integrations, internal tools — if it's repetitive and technical, we automate it.

**Get in touch:** [github.com/sylvastudio](https://github.com/sylvastudio)

## License

MIT
