// Post a tweet as Adam de Cristio using OAuth 1.0a
// Usage: node tweet.mjs "Your tweet text here"

import crypto from 'crypto';
import https from 'https';

const consumerKey = 'LPOxL2ANE2ibQKgxMiphySYjc';
const consumerSecret = 'fzZUb8NEuRsXvfkvSE3cGjUPlx17DM6RG7KCWqc00UsFCol3Yy';
const accessToken = '1480591571888349185-U995MM4uCyM7enrxfArrw23ZatJw4r';
const tokenSecret = 'gbBwfhLrJKnkrMJPXIQ234nQS4okM0m2LB0i0qBQzlKe7';

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function hmacSha1(key, str) {
  return crypto.createHmac('sha1', key).update(str).digest('base64');
}

function getNonce() {
  return crypto.randomBytes(16).toString('hex');
}

async function tweet(text) {
  const url = 'https://api.twitter.com/2/tweets';
  const method = 'POST';
  const params = {};
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = getNonce();

  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: '1.0',
  };

  const allParams = { ...oauth, ...params };
  const paramString = Object.keys(allParams).sort().map(k => `${percentEncode(k)}=${percentEncode(String(allParams[k]))}`).join('&');

  const sigBase = [method, percentEncode(url), percentEncode(paramString)].join('&');
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  oauth.oauth_signature = hmacSha1(signingKey, sigBase);

  const authHeader = 'OAuth ' + Object.entries(oauth).map(([k, v]) => `${percentEncode(k)}="${percentEncode(String(v))}"`).join(', ');

  const body = JSON.stringify({ text });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 201) resolve(JSON.parse(data));
        else reject(new Error(`${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node tweet.mjs "Your tweet text here"');
  process.exit(1);
}

try {
  const result = await tweet(args.join(' '));
  console.log('Tweeted:', result.data?.id);
} catch (e) {
  console.error('Error:', e.message);
}
