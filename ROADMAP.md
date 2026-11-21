# Feature status and external dependencies

| Requirement | Status in this free static build |
|---|---|
| Crypto public candles | Implemented via Binance REST; provider limits apply |
| Candles/timeframes | Implemented for Binance-supported intervals listed in README |
| EMA, RSI, MACD, ATR, Bollinger | Implemented in dashboard analysis |
| LONG/SHORT/WAIT, ATR risk levels | Implemented as transparent heuristic, not prediction |
| Support/resistance, volume context | Basic rolling levels and average-volume comparison |
| Watchlist, local storage, backup | Implemented locally per browser/device |
| Browser alerts | Permission flow; no reliable background push |
| Paper journal | Local simulated signal log; no fills/order routing |
| Backtest | Simplified; not realistic execution simulation |
| Strategy file validation | JSON metadata only; uploaded code is never executed |
| Local learning journal | Basic local records only; not autonomous model training |
| Multi-exchange crypto | Adapter scaffolding; only Binance adapter wired to dashboard |
| Delta Exchange | Not connected; requires a separately verified public adapter |
| NSE/BSE/NIFTY/BANK NIFTY | Not live-connected in free static build |
| Options CE/PE chain/Greeks | Not live-connected; requires source and instrument metadata |
| News confirmation | Not live-connected |
| Cloud AI / background learning / sync | Requires backend and hosting, not static Pages |

This status table is deliberate: no feature is marked complete merely because a placeholder module exists. Keep all signals educational; manual decision-making remains with the user.
