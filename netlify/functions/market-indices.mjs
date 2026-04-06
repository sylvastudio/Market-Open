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

let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 3000;

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

export default async (req, context) => {
  const cacheKey = "market-indices";

  try {
    const cached = getCache(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = [];
    for (const idxDef of INDEX_SYMBOLS) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idxDef.symbol)}?range=1d&interval=1d`;
      try {
        const response = await throttledFetch(url, { headers: YAHOO_HEADERS });
        const text = await response.text();

        if (!response.ok) {
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
        results.push({ symbol: idxDef.name, name: idxDef.name, price: 0, changePercent: 0 });
      }
    }

    const hasAnyData = results.some((r) => r.price !== 0);
    if (!hasAnyData) {
      throw new Error("No data returned from Yahoo Finance");
    }

    setCache(cacheKey, results, 15 * 60_000);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch market indices", message: err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
