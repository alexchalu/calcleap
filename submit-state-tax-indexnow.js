#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/california-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/texas-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/florida-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/new-york-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/pennsylvania-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/illinois-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/ohio-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/georgia-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/north-carolina-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/michigan-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/new-jersey-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/virginia-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/washington-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/arizona-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/massachusetts-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/tennessee-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/indiana-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/maryland-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/colorado-income-tax-calculator.html',
  'https://alexchalu.github.io/toolpulse/minnesota-income-tax-calculator.html',
];

const payload = JSON.stringify({
  host: 'alexchalu.github.io',
  key: 'a1b2c3d4e5f6g7h8',
  keyLocation: 'https://alexchalu.github.io/toolpulse/a1b2c3d4e5f6g7h8.txt',
  urlList: urls
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log(`✅ IndexNow response: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('✅ Successfully submitted 20 state tax URLs to IndexNow (Bing + Yandex)');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
