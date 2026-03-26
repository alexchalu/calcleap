#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

// Read sitemap to get all URLs
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urlMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));

console.log(`Found ${urls.length} URLs in sitemap`);

// IndexNow has a limit of 10,000 URLs per request
const BATCH_SIZE = 10000;
const BASE_DOMAIN = 'alexchalu.github.io';
const INDEX_KEY = '071ad5122b9fb544c1c7a823d667a1f3';

const batches = [];
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  batches.push(urls.slice(i, i + BATCH_SIZE));
}

console.log(`Submitting ${batches.length} batch(es) to IndexNow`);

let completed = 0;

batches.forEach((batch, idx) => {
  const data = JSON.stringify({
    host: BASE_DOMAIN,
    key: INDEX_KEY,
    keyLocation: `https://${BASE_DOMAIN}/${INDEX_KEY}.txt`,
    urlList: batch
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, res => {
    console.log(`Batch ${idx + 1}/${batches.length} - Status: ${res.statusCode}`);
    res.on('data', d => {
      if (d.toString().trim()) {
        console.log(`Response: ${d}`);
      }
    });
    res.on('end', () => {
      completed++;
      if (completed === batches.length) {
        console.log('\n✓ All batches submitted to IndexNow');
      }
    });
  });

  req.on('error', e => {
    console.error(`Error in batch ${idx + 1}:`, e.message);
    completed++;
  });

  req.write(data);
  req.end();
});
