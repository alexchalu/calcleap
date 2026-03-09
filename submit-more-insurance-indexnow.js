#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/travel-insurance-calculator.html',
  'https://alexchalu.github.io/toolpulse/business-insurance-calculator.html',
  'https://alexchalu.github.io/toolpulse/flood-insurance-calculator.html',
  'https://alexchalu.github.io/toolpulse/earthquake-insurance-calculator.html',
  'https://alexchalu.github.io/toolpulse/long-term-care-insurance-calculator.html',
  'https://alexchalu.github.io/toolpulse/workers-comp-calculator.html',
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
    console.log('✅ Successfully submitted 6 insurance calculator URLs to IndexNow (Bing + Yandex)');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
