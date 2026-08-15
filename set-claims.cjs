const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./eduone-2047-firebase-adminsdk-fbsvc-3a3f4a42f2.json');

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();

const usersToCreate = [
  {
    uid: 'EMP-739',
    email: 'emp-739@eduone.local',
    password: 'admin123',
    displayName: 'Super Admin',
    claims: { role: 'Super Admin' }
  },
  {
    uid: 'EMP-902',
    email: 'emp-902@eduone.local',
    password: 'admin123',
    displayName: 'Principal',
    claims: { role: 'Principal' }
  },
  {
    uid: 'TCH-202',
    email: 'tch-202@eduone.local',
    password: 'admin123',
    displayName: 'Elena Rostova',
    claims: { role: 'Class Teacher', class_id: '10A' }
  },
  {
    uid: 'ACT-511',
    email: 'act-511@eduone.local',
    password: 'admin123',
    displayName: 'Michael Chang',
    claims: { role: 'Accountant' }
  },
  {
    uid: 'REC-114',
    email: 'rec-114@eduone.local',
    password: 'admin123',
    displayName: 'Sarah Connor',
    claims: { role: 'Receptionist' }
  }
];

async function setupAuthUsers() {
  console.log('Starting Auth User creation and Claims assignment...');
  for (const u of usersToCreate) {
    try {
      // Create user
      const userRecord = await auth.createUser({
        uid: u.uid,
        email: u.email,
        password: u.password,
        displayName: u.displayName,
      });
      console.log(`Created user: ${userRecord.uid}`);
      
      // Set custom claims
      await auth.setCustomUserClaims(userRecord.uid, u.claims);
      console.log(`Set custom claims for ${userRecord.uid}:`, u.claims);
    } catch (error) {
      if (error.code === 'auth/uid-already-exists' || error.code === 'auth/email-already-exists') {
        console.log(`User ${u.uid} already exists, updating claims only...`);
        // If they exist, just set the claims
        await auth.setCustomUserClaims(u.uid, u.claims);
        console.log(`Updated custom claims for existing user ${u.uid}:`, u.claims);
      } else {
        console.error(`Error processing ${u.uid}:`, error);
      }
    }
  }
  console.log('Finished setting up Firebase Auth users and claims.');
  process.exit(0);
}

setupAuthUsers();
