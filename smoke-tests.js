const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('js/core/app.js','utf8');
for(const id of ['symbol','timeframe','load','price','signal','chart','backtest','paper','strategy-file','backup','restore']) assert(html.includes(`id="${id}"`),`missing UI id ${id}`);
for(const token of ['function ema','function rsi','function atr','async function load','function analyze','localStorage','Notification.requestPermission']) assert(app.includes(token),`missing implementation ${token}`);
assert(!/apiKey\s*[:=]/i.test(app),'No API keys should be embedded');
assert(!/createOrder|placeOrder|withdraw|deposit/i.test(app),'No money/order actions');
console.log('BTC BRAIN NEXUS smoke tests passed');
