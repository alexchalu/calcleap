#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/convert-mph-to-kph.html',
  'https://alexchalu.github.io/toolpulse/convert-kph-to-mph.html',
  'https://alexchalu.github.io/toolpulse/convert-mph-to-ms.html',
  'https://alexchalu.github.io/toolpulse/convert-kph-to-ms.html',
  'https://alexchalu.github.io/toolpulse/convert-ms-to-mph.html',
  'https://alexchalu.github.io/toolpulse/convert-ms-to-kph.html',
  'https://alexchalu.github.io/toolpulse/convert-knots-to-mph.html',
  'https://alexchalu.github.io/toolpulse/convert-knots-to-kph.html',
  'https://alexchalu.github.io/toolpulse/convert-mph-to-knots.html',
  'https://alexchalu.github.io/toolpulse/convert-kph-to-knots.html',
  'https://alexchalu.github.io/toolpulse/convert-mach-to-mph.html',
  'https://alexchalu.github.io/toolpulse/convert-mach-to-kph.html',
  'https://alexchalu.github.io/toolpulse/convert-mph-to-fps.html',
  'https://alexchalu.github.io/toolpulse/convert-fps-to-mph.html',
  'https://alexchalu.github.io/toolpulse/convert-kph-to-fps.html',
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
    console.log('✅ Successfully submitted 15 speed URLs to IndexNow');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
