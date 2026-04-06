# Alternative Market Data API Options (Option 3)

If Yahoo Finance continues to block requests or you need more reliable/production-ready data, here are solid alternatives:

## 1. **Alpha Vantage** (Popular, Free Tier Available)
- **Website**: https://www.alphavantage.co/
- **Free Tier**: 5 API calls/min, 500 calls/day
- **Pricing**: Free tier available, paid plans start at $49.99/month
- **What you get**: Real-time quotes, historical data, technical indicators
- **Pros**: Well-documented, reliable, free tier is generous for development
- **Cons**: Rate limits on free tier
- **Setup**: Sign up → Get API key → Use endpoints like:
  - `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=YOUR_KEY`
  - `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=YOUR_KEY`

---

## 2. **Finnhub** (Great for Real-time)
- **Website**: https://finnhub.io/
- **Free Tier**: 60 API calls/min
- **Pricing**: Free tier available, paid plans start at $9/month
- **What you get**: Real-time quotes, market movers, company profiles
- **Pros**: Fast, good free tier, real-time data
- **Cons**: Some endpoints require paid plan
- **Setup**: Sign up → Get API key → Use endpoints like:
  - `https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY`
  - `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=YOUR_KEY`

---

## 3. **Twelve Data** (Comprehensive)
- **Website**: https://twelvedata.com/
- **Free Tier**: 800 API calls/day
- **Pricing**: Free tier available, paid plans start at $7.99/month
- **What you get**: Real-time quotes, historical data, technical indicators, market movers
- **Pros**: Good free tier, comprehensive data
- **Cons**: Rate limits on free tier
- **Setup**: Sign up → Get API key → Use endpoints like:
  - `https://api.twelvedata.com/quote?symbol=SPY&apikey=YOUR_KEY`
  - `https://api.twelvedata.com/market_movers?apikey=YOUR_KEY`

---

## 4. **Polygon.io** (Professional Grade)
- **Website**: https://polygon.io/
- **Free Tier**: Limited (developer plan)
- **Pricing**: Free developer plan, paid plans start at $29/month
- **What you get**: Real-time quotes, aggregates, market movers, websockets
- **Pros**: Very reliable, professional-grade, websocket support
- **Cons**: More expensive, free tier is limited
- **Setup**: Sign up → Get API key → Use endpoints like:
  - `https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=YOUR_KEY`
  - `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apikey=YOUR_KEY`

---

## 5. **IEX Cloud** (Developer-Friendly)
- **Website**: https://iexcloud.io/
- **Free Tier**: 50,000 messages/month
- **Pricing**: Free tier available, paid plans start at $9/month
- **What you get**: Real-time quotes, market data, company info
- **Pros**: Good free tier, easy to use, well-documented
- **Cons**: Some advanced features require paid plan
- **Setup**: Sign up → Get API key → Use endpoints like:
  - `https://cloud.iexapis.com/stable/stock/AAPL/quote?token=YOUR_KEY`
  - `https://cloud.iexapis.com/stable/stock/market/list/gainers?token=YOUR_KEY`

---

## 6. **Yahoo Finance API (via yfinance library)** (Python Alternative)
- **Library**: `yfinance` (Python)
- **Website**: https://github.com/ranaroussi/yfinance
- **Pricing**: Free (uses Yahoo Finance data)
- **What you get**: Yahoo Finance data via Python library
- **Pros**: Free, no API key needed, comprehensive
- **Cons**: Requires Python backend, unofficial (can break)
- **Setup**: Install `pip install yfinance` → Use in Python backend

---

## Recommendation for Your Project

**For quick development/testing**: Try **Alpha Vantage** or **Finnhub** (both have good free tiers)

**For production**: Consider **Polygon.io** or **IEX Cloud** (more reliable, better support)

**If you want to stick with Yahoo**: The headers fix (Option 1) should work, but be aware it's unofficial and can break.

---

## How to Integrate Any of These

1. Sign up for the service and get an API key
2. Add the API key to your backend (use environment variables: `process.env.API_KEY`)
3. Replace the Yahoo Finance fetch calls in `backend/server.js` with calls to the new API
4. Map the response format to match your existing frontend expectations (same data shape)

Example `.env` file:
```
ALPHA_VANTAGE_API_KEY=your_key_here
```

Then in `server.js`:
```js
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${API_KEY}`;
```

