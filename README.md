# BTC BRAIN NEXUS
**One Platform. Multiple Markets. Smarter Strategies.**

A free-first, browser-based, read-only market analysis dashboard. It never connects to a broker or places orders, and never accesses money. Educational use only; no profit guarantee.

## Start (no install)
1. Upload the contents of this folder to the root of a GitHub repository (not the ZIP itself).
2. In GitHub open **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
3. Open the Pages URL. Internet access is needed for Binance public candles.

You can also serve locally with `python -m http.server 8000` and visit `http://localhost:8000`.

## Included and usable
- Responsive dark dashboard; mobile friendly.
- Binance public spot OHLCV candles, pair input and 1m/3m/5m/15m/30m/1h/2h/4h/1d timeframes (subject to provider availability/rate limits).
- Canvas candlesticks; EMA20/50, RSI14, MACD line, ATR14, Bollinger bands, rolling support/resistance and volume comparison.
- Transparent rule-based LONG/SHORT/WAIT signal with reference entry, ATR stop and 2R target. This is not AI prediction or financial advice.
- Watchlist, browser notifications (while page/browser permits), local paper-trade journal, simplified backtest, JSON strategy metadata validation (never executes uploaded code), local backup/restore.
- Local storage persists on this browser/device only.

## Free data and honest limitations
- Crypto uses Binance's public unauthenticated REST endpoint. It is not guaranteed uptime, universal coin coverage or a licensed consolidated feed. Some symbols/regions/networks may fail; retry or choose a supported spot pair.
- No fabricated prices are used. When the endpoint fails, the dashboard reports an error.
- NSE/BSE, NIFTY 50, BANK NIFTY and CE/PE option chain/expiry/Greeks are **not live-connected in this free static build**. Free reliable public feeds are not guaranteed; exchange real-time data may require licensing. Do not infer a live quote from this app.
- No paid API key is required for the included crypto feature. No secret belongs in frontend code.

## Scope and safety
- No broker integration, account credentials, order execution, deposits, withdrawals or money transfers.
- Paper trading is a local simulation only. Backtest is simplified and excludes realistic fees, slippage, taxes, liquidity, latency and survivorship effects.
- Strategy import accepts JSON metadata only; it does not run JavaScript/Python. Learning journal is local statistics/records, not a trained autonomous AI. No background/cloud learning.
- Browser notifications require permission and the page/browser to remain available. Reliable background push needs a service worker and push backend; not included.
- Static GitHub Pages cannot safely host secret API keys, a persistent backend, durable cross-device database or continuous AI workers.

## Validation
Run `node --check js/core/app.js` and `node tests/smoke-tests.js` from this folder. Browser smoke test: open the Pages site, load BTCUSDT, change timeframe, add/remove a watch item, run backtest, record a paper signal, export backup. Verify status reports Binance data, not demo data.

## Architecture / next integrations
`js/data/` contains adapter and validation modules; `js/strategies/` contains indicator/risk/signal modules; `js/ai/` contains validation/backtest/paper/learning scaffolding; `js/alerts/` and `js/core/` provide local utilities. The dashboard's currently wired paths are documented above. Additional exchanges and Indian-market/options providers need separately tested adapters and permitted data access.
