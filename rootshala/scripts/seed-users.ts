import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

async function run() {
  let serviceAccount;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      serviceAccount = JSON.parse(fs.readFileSync(path.join(process.cwd(), "eduone-2047-firebase-adminsdk-fbsvc-3a3f4a42f2.json"), "utf8"));
    }
  } catch (error) {
    console.error("Could not load service account credentials:", error);
    process.exit(1);
  }

  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://eduone-2047-default-rtdb.firebaseio.com"
  });

  const db = getDatabase();
  console.log("Connected to Firebase Admin SDK.");

  const ACCOUNTS = [
    { role: 'Super Admin', id: 'EMP-739', pass: 'vikram@739', name: 'Vikram Sharma', email: 'emp-739@eduone.local' },
    { role: 'Principal', id: 'EMP-902', pass: 'anjali@902', name: 'Anjali Desai', email: 'emp-902@eduone.local' },
    { role: 'Class Teacher', id: 'TCH-202', pass: 'priya@202', name: 'Priya Patel', email: 'tch-202@eduone.local' },
    { role: 'Accountant', id: 'ACT-511', pass: 'rahul@511', name: 'Rahul Verma', email: 'act-511@eduone.local' },
    { role: 'Receptionist', id: 'REC-114', pass: 'sneha@114', name: 'Sneha Reddy', email: 'rec-114@eduone.local' }
  ];

  console.log("Hashing passwords and building user objects...");
  const usersObj: Record<string, any> = {};

  for (const acc of ACCOUNTS) {
    const hashedPassword = await bcrypt.hash(acc.pass, 10);
    usersObj[acc.id] = {
      id: acc.id,
      name: acc.name,
      role: acc.role,
      email: acc.email,
      password: hashedPassword,
      mustResetPassword: false
    };
  }

  console.log("Wiping existing /users node...");
  await db.ref('users').remove();

  console.log("Seeding new /users node...");
  await db.ref('users').set(usersObj);

  console.log("User seeding complete!");
  process.exit(0);
}

run().catch(console.error);
