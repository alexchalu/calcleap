#!/usr/bin/env node
const https = require('https');

const urls = [
  'https://alexchalu.github.io/toolpulse/convert-bytes-to-kb.html',
  'https://alexchalu.github.io/toolpulse/convert-bytes-to-mb.html',
  'https://alexchalu.github.io/toolpulse/convert-bytes-to-gb.html',
  'https://alexchalu.github.io/toolpulse/convert-bytes-to-tb.html',
  'https://alexchalu.github.io/toolpulse/convert-kb-to-bytes.html',
  'https://alexchalu.github.io/toolpulse/convert-kb-to-mb.html',
  'https://alexchalu.github.io/toolpulse/convert-kb-to-gb.html',
  'https://alexchalu.github.io/toolpulse/convert-kb-to-tb.html',
  'https://alexchalu.github.io/toolpulse/convert-mb-to-bytes.html',
  'https://alexchalu.github.io/toolpulse/convert-mb-to-kb.html',
  'https://alexchalu.github.io/toolpulse/convert-mb-to-gb.html',
  'https://alexchalu.github.io/toolpulse/convert-mb-to-tb.html',
  'https://alexchalu.github.io/toolpulse/convert-gb-to-bytes.html',
  'https://alexchalu.github.io/toolpulse/convert-gb-to-kb.html',
  'https://alexchalu.github.io/toolpulse/convert-gb-to-mb.html',
  'https://alexchalu.github.io/toolpulse/convert-gb-to-tb.html',
  'https://alexchalu.github.io/toolpulse/convert-tb-to-bytes.html',
  'https://alexchalu.github.io/toolpulse/convert-tb-to-kb.html',
  'https://alexchalu.github.io/toolpulse/convert-tb-to-mb.html',
  'https://alexchalu.github.io/toolpulse/convert-tb-to-gb.html',
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
    console.log('✅ Successfully submitted 20 data storage URLs to IndexNow');
  }
});

req.on('error', (error) => {
  console.error('❌ IndexNow error:', error);
});

req.write(payload);
req.end();
