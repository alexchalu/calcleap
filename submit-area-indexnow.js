#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/convert-square-feet-to-square-meters.html',
  'https://alexchalu.github.io/toolpulse/convert-square-meters-to-square-feet.html',
  'https://alexchalu.github.io/toolpulse/convert-square-feet-to-acres.html',
  'https://alexchalu.github.io/toolpulse/convert-acres-to-square-feet.html',
  'https://alexchalu.github.io/toolpulse/convert-acres-to-hectares.html',
  'https://alexchalu.github.io/toolpulse/convert-hectares-to-acres.html',
  'https://alexchalu.github.io/toolpulse/convert-acres-to-square-meters.html',
  'https://alexchalu.github.io/toolpulse/convert-square-meters-to-acres.html',
  'https://alexchalu.github.io/toolpulse/convert-square-meters-to-hectares.html',
  'https://alexchalu.github.io/toolpulse/convert-hectares-to-square-meters.html',
  'https://alexchalu.github.io/toolpulse/convert-square-kilometers-to-square-miles.html',
  'https://alexchalu.github.io/toolpulse/convert-square-miles-to-square-kilometers.html',
  'https://alexchalu.github.io/toolpulse/convert-square-inches-to-square-centimeters.html',
  'https://alexchalu.github.io/toolpulse/convert-square-centimeters-to-square-inches.html',
  'https://alexchalu.github.io/toolpulse/convert-square-yards-to-square-meters.html',
  'https://alexchalu.github.io/toolpulse/convert-square-meters-to-square-yards.html',
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
    console.log('✅ Successfully submitted 16 area conversion URLs to IndexNow');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
