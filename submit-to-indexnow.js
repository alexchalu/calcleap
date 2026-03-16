#!/usr/bin/env node

const https = require('https');

const url = process.argv[2];
if (!url) {
    console.error('Usage: node submit-to-indexnow.js <URL>');
    process.exit(1);
}

const data = JSON.stringify({
    host: 'calcleap.com',
    key: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    keyLocation: 'https://calcleap.com/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.txt',
    urlList: [url]
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

const req = https.request(options, (res) => {
    console.log(`IndexNow Response: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log(`✓ Successfully submitted: ${url}`);
    } else {
        console.log(`✗ Submission may have failed for: ${url}`);
    }
});

req.on('error', (error) => {
    console.error('Error:', error.message);
});

req.write(data);
req.end();
