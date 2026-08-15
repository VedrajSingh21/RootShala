import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function migrate() {
  const serviceAccount = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'eduone-2047-firebase-adminsdk-fbsvc-3a3f4a42f2.json'), 'utf8'));
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://eduone-2047-default-rtdb.firebaseio.com'
  });

  const db = getDatabase();

  const usersRef = db.ref('users');
  const snapshot = await usersRef.once('value');
  
  if (!snapshot.exists()) {
    console.log('No users found.');
    return;
  }

  const users = snapshot.val();
  for (const staffId in users) {
    if (staffId === 'hacker-hk' || staffId === 'HKS-1724') {
      console.log(`Deleting ${staffId}...`);
      await usersRef.child(staffId).remove();
      continue;
    }

    const userData = users[staffId];
    // If the password starts with a bcrypt signature, it's already hashed
    if (userData.password && !userData.password.startsWith('$2b$')) {
      console.log(`Hashing password for ${staffId}...`);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await usersRef.child(staffId).update({
        password: hashedPassword,
        mustResetPassword: true
      });
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate();
