const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./eduone-2047-firebase-adminsdk-fbsvc-3a3f4a42f2.json');

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

const uids = ['EMP-739', 'EMP-902', 'TCH-202', 'ACT-511', 'REC-114'];

async function verifyClaims() {
  console.log('--- CLAIMS VERIFICATION OUTPUT ---');
  for (const uid of uids) {
    try {
      const userRecord = await auth.getUser(uid);
      console.log(`\nUser: ${uid}`);
      console.log(`Email: ${userRecord.email}`);
      console.log(`Custom Claims:`, userRecord.customClaims);
    } catch (error) {
      console.error(`\nUser: ${uid} - ERROR: ${error.message}`);
    }
  }
  console.log('\n----------------------------------');
  process.exit(0);
}

verifyClaims();
