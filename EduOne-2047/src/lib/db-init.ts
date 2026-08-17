import { ref, set } from 'firebase/database';
import { db } from './firebase';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_FEES,
  INITIAL_DOCUMENTS,
  INITIAL_TIMETABLE,
  INITIAL_ESCALATIONS,
  INITIAL_AI_LOGS,
  INITIAL_SUPPLY_ITEMS,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE_RECORDS
} from '../data/mockDatabase';

export const initializeDatabase = async () => {
  try {
    console.log("Initializing database with starter data...");
    
    // Convert arrays to objects keyed by ID for easier fetching in RTDB
    const studentsObj = INITIAL_STUDENTS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const teachersObj = INITIAL_TEACHERS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const feesObj = INITIAL_FEES.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const docsObj = INITIAL_DOCUMENTS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const timetableObj = INITIAL_TIMETABLE.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const escalationsObj = INITIAL_ESCALATIONS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const logsObj = INITIAL_AI_LOGS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const suppliesObj = INITIAL_SUPPLY_ITEMS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const tasksObj = INITIAL_TASKS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
    const attendanceObj = INITIAL_ATTENDANCE_RECORDS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

    // Create Demo Accounts for Landing Page
    const usersObj = {
      "EMP-739": {
        id: "EMP-739",
        password: "vikram@739",
        role: "Super Admin",
        name: "Vikram Sharma",
        email: "emp-739@rootshala.local"
      },
      "EMP-902": {
        id: "EMP-902",
        password: "anjali@902",
        role: "Principal",
        name: "Anjali Desai",
        email: "emp-902@rootshala.local"
      },
      "TCH-202": {
        id: "TCH-202",
        password: "priya@202",
        role: "Class Teacher",
        name: "Priya Patel",
        email: "tch-202@rootshala.local"
      },
      "ACT-511": {
        id: "ACT-511",
        password: "rahul@511",
        role: "Accountant",
        name: "Rahul Verma",
        email: "act-511@rootshala.local"
      },
      "REC-114": {
        id: "REC-114",
        password: "sneha@114",
        role: "Receptionist",
        name: "Sneha Reddy",
        email: "rec-114@rootshala.local"
      },
      "IT-999": {
        id: "IT-999",
        password: "admin@999",
        role: "IT Support",
        name: "Arjun Tech",
        email: "it-999@rootshala.local"
      },
      "TCH-105": {
        id: "TCH-105",
        password: "karan@105",
        role: "Subject Teacher",
        name: "Karan Singh",
        email: "tch-105@rootshala.local"
      }
    };

    // Save all to RTDB
    await Promise.all([
      set(ref(db, 'students'), studentsObj),
      set(ref(db, 'teachers'), teachersObj),
      set(ref(db, 'fees'), feesObj),
      set(ref(db, 'documents'), docsObj),
      set(ref(db, 'timetable'), timetableObj),
      set(ref(db, 'escalations'), escalationsObj),
      set(ref(db, 'ai_logs'), logsObj),
      set(ref(db, 'supplies'), suppliesObj),
      set(ref(db, 'tasks'), tasksObj),
      set(ref(db, 'attendance'), attendanceObj),
      set(ref(db, 'users'), usersObj) // The manual auth users table
    ]);

    console.log("Database successfully populated!");
    return true;
  } catch (error) {
    console.error("Error populating database:", error);
    return false;
  }
};

// If run directly via node/tsx
if (typeof require !== 'undefined' && require.main === module) {
  initializeDatabase().then(() => process.exit(0));
}
