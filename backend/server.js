import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple in-memory cache
const cache = new Map();

function setCache(key, data, ttlMs) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

// Rate limiting protection
let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 3000; // 3 seconds between requests

async function throttledFetch(url, options) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    const delay = MIN_REQUEST_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lastRequestTime = Date.now();
  return fetch(url, options);
}

const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://finance.yahoo.com/",
};

const INDEX_SYMBOLS = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^DJI", name: "Dow 30" },
  { symbol: "^IXIC", name: "Nasdaq" },
  { symbol: "^RUT", name: "Russell 2000" },
  { symbol: "^VIX", name: "VIX" },
  { symbol: "GC=F", name: "Gold" },
];

// GET /api/market-indices
app.get("/api/market-indices", async (req, res) => {
  const cacheKey = "market-indices";

  try {
    // Check cache first
    const cached = getCache(cacheKey);
    if (cached) {
      console.log("Returning cached market indices");
      return res.json(cached);
    }

    console.log("Fetching market indices from Yahoo Finance (v8 chart API)...");

    const results = [];
    for (const idxDef of INDEX_SYMBOLS) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idxDef.symbol)}?range=1d&interval=1d`;
      try {
        const response = await throttledFetch(url, { headers: YAHOO_HEADERS });
        const text = await response.text();

        if (!response.ok) {
          console.error(
            `Yahoo Finance chart error for ${idxDef.symbol} (${response.status}):`,
            text.substring(0, 200)
          );
          results.push({ symbol: idxDef.name, name: idxDef.name, price: 0, changePercent: 0 });
          continue;
        }

        const json = JSON.parse(text);
        const meta = json.chart?.result?.[0]?.meta;
        const price = meta?.regularMarketPrice ?? 0;
        const prevClose = meta?.chartPreviousClose ?? 0;
        const changePercent = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;

        results.push({
          symbol: idxDef.name,
          name: idxDef.name,
          price,
          changePercent: Math.round(changePercent * 100) / 100,
        });
      } catch (fetchErr) {
        console.error(`Error fetching ${idxDef.symbol}:`, fetchErr.message);
        results.push({ symbol: idxDef.name, name: idxDef.name, price: 0, changePercent: 0 });
      }
    }

    const hasAnyData = results.some((r) => r.price !== 0);
    if (!hasAnyData) {
      throw new Error("No data returned from Yahoo Finance");
    }

    const data = results;

    console.log("Successfully fetched market indices:", data.length, "items");

    // Cache for 15 minutes
    setCache(cacheKey, data, 15 * 60_000);
    res.json(data);
  } catch (err) {
    console.error("Error fetching market indices:", err.message);

    res.status(502).json({ error: "Failed to fetch market indices", message: err.message });
  }
});

// GET /api/gainers-losers
app.get("/api/gainers-losers", async (req, res) => {
  const cacheKey = "gainers-losers";

  try {
    // Check cache first
    const cached = getCache(cacheKey);
    if (cached) {
      console.log("Returning cached gainers/losers");
      return res.json(cached);
    }

    const gainersUrl =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_gainers&count=10&offset=0";
    const losersUrl =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_losers&count=10&offset=0";

    console.log("Fetching gainers from Yahoo Finance...");
    const gainersResponse = await throttledFetch(gainersUrl, {
      headers: YAHOO_HEADERS,
    });
    const gainersText = await gainersResponse.text();

    if (!gainersResponse.ok) {
      console.error(
        `Yahoo Finance error (${gainersResponse.status}):`,
        gainersText.substring(0, 200)
      );
      throw new Error(`Yahoo Finance API error: ${gainersResponse.status}`);
    }

    const gainersJson = JSON.parse(gainersText);
    const gainersQuotes = gainersJson.finance?.result?.[0]?.quotes || [];

    console.log("Fetching losers from Yahoo Finance...");
    const losersResponse = await throttledFetch(losersUrl, {
      headers: YAHOO_HEADERS,
    });
    const losersText = await losersResponse.text();

    if (!losersResponse.ok) {
      console.error(
        `Yahoo Finance error (${losersResponse.status}):`,
        losersText.substring(0, 200)
      );
      throw new Error(`Yahoo Finance API error: ${losersResponse.status}`);
    }

    const losersJson = JSON.parse(losersText);
    const losersQuotes = losersJson.finance?.result?.[0]?.quotes || [];

    const data = {
      gainers: gainersQuotes.slice(0, 5).map((q) => ({
        ticker: q.symbol,
        companyName: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
      })),
      losers: losersQuotes.slice(0, 5).map((q) => ({
        ticker: q.symbol,
        companyName: q.shortName || q.longName || q.symbol,
        price: q.regularMarketPrice ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
      })),
    };

    console.log(
      "Successfully fetched gainers/losers:",
      data.gainers.length,
      "gainers,",
      data.losers.length,
      "losers"
    );

    // Cache for 15 minutes
    setCache(cacheKey, data, 15 * 60_000);
    res.json(data);
  } catch (err) {
    console.error("Error fetching gainers/losers:", err.message);

    res.status(502).json({ error: "Failed to fetch gainers/losers", message: err.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    cacheKeys: Array.from(cache.keys()),
  });
});

app.listen(PORT, () => {
  console.log(`Market Open backend listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
