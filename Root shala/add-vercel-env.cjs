const { spawnSync } = require('child_process');
const fs = require('fs');

const serviceAccount = fs.readFileSync('eduone-2047-firebase-adminsdk-fbsvc-3a3f4a42f2.json', 'utf8');
const serviceAccountBase64 = Buffer.from(serviceAccount).toString('base64');
require('dotenv').config();
const geminiKey = process.env.GEMINI_API_KEY;

function addEnv(name, value) {
  console.log(`Adding ${name}...`);
  const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', name, 'production', 'preview', 'development'], {
    input: value,
    encoding: 'utf8'
  });
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
}

addEnv('FIREBASE_SERVICE_ACCOUNT_BASE64', serviceAccountBase64);
addEnv('GEMINI_API_KEY', geminiKey);
