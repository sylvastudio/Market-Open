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

export default async (req, context) => {
  const cacheKey = "gainers-losers";

  try {
    const cached = getCache(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const gainersUrl =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_gainers&count=10&offset=0";
    const losersUrl =
      "https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_losers&count=10&offset=0";

    const gainersResponse = await throttledFetch(gainersUrl, { headers: YAHOO_HEADERS });
    const gainersText = await gainersResponse.text();

    if (!gainersResponse.ok) {
      throw new Error(`Yahoo Finance API error: ${gainersResponse.status}`);
    }

    const gainersJson = JSON.parse(gainersText);
    const gainersQuotes = gainersJson.finance?.result?.[0]?.quotes || [];

    const losersResponse = await throttledFetch(losersUrl, { headers: YAHOO_HEADERS });
    const losersText = await losersResponse.text();

    if (!losersResponse.ok) {
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

    setCache(cacheKey, data, 15 * 60_000);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch gainers/losers", message: err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
