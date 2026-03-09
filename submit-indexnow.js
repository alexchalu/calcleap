#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/convert-fahrenheit-to-celsius.html',
  'https://alexchalu.github.io/toolpulse/convert-celsius-to-fahrenheit.html',
  'https://alexchalu.github.io/toolpulse/convert-cups-to-ml.html',
  'https://alexchalu.github.io/toolpulse/convert-cups-to-liters.html',
  'https://alexchalu.github.io/toolpulse/convert-tablespoons-to-ml.html',
  'https://alexchalu.github.io/toolpulse/convert-teaspoons-to-ml.html',
  'https://alexchalu.github.io/toolpulse/convert-fluid-ounces-to-ml.html',
  'https://alexchalu.github.io/toolpulse/convert-pints-to-liters.html',
  'https://alexchalu.github.io/toolpulse/convert-quarts-to-liters.html',
  'https://alexchalu.github.io/toolpulse/convert-gallons-to-liters.html',
  'https://alexchalu.github.io/toolpulse/convert-ml-to-cups.html',
  'https://alexchalu.github.io/toolpulse/convert-ml-to-tablespoons.html',
  'https://alexchalu.github.io/toolpulse/convert-ml-to-teaspoons.html',
  'https://alexchalu.github.io/toolpulse/convert-liters-to-cups.html',
  'https://alexchalu.github.io/toolpulse/convert-liters-to-gallons.html',
  'https://alexchalu.github.io/toolpulse/convert-ounces-to-grams.html',
  'https://alexchalu.github.io/toolpulse/convert-pounds-to-grams.html',
  'https://alexchalu.github.io/toolpulse/convert-pounds-to-kg.html',
  'https://alexchalu.github.io/toolpulse/convert-grams-to-ounces.html',
  'https://alexchalu.github.io/toolpulse/convert-grams-to-pounds.html',
  'https://alexchalu.github.io/toolpulse/convert-kg-to-pounds.html',
  'https://alexchalu.github.io/toolpulse/convert-cups-to-tablespoons.html',
  'https://alexchalu.github.io/toolpulse/convert-cups-to-teaspoons.html',
  'https://alexchalu.github.io/toolpulse/convert-tablespoons-to-teaspoons.html',
  'https://alexchalu.github.io/toolpulse/convert-tablespoons-to-cups.html',
  'https://alexchalu.github.io/toolpulse/convert-teaspoons-to-tablespoons.html',
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
    console.log('✅ Successfully submitted 26 URLs to IndexNow (Bing + Yandex)');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
