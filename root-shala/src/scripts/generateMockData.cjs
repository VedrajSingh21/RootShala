const fs = require('fs');
const path = require('path');

const generateStudents = () => {
  const students = [];
  const firstNames = ['Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Ansh', 'Isha', 'Rohan', 'Sneha', 'Priya', 'Rahul', 'Amit', 'Sunil', 'Rajesh', 'Vikram'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Mehta', 'Reddy', 'Joshi', 'Desai', 'Singh', 'Kumar', 'Das'];
  
  let idCounter = 1000;
  for (let grade = 1; grade <= 12; grade++) {
    for (let section of ['A', 'B', 'C']) {
      // 30 students per class
      for (let roll = 1; roll <= 30; roll++) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const parentFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
        
        students.push({
          id: `STU-${idCounter++}`,
          name: `${first} ${last}`,
          rollNo: `${grade}-${section}-${roll.toString().padStart(2, '0')}`,
          grade: `Grade ${grade}`,
          section: section,
          parentName: `${parentFirst} ${last}`,
          parentPhone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
          parentEmail: `${parentFirst.toLowerCase()}.${last.toLowerCase()}@example.com`,
          attendancePct: Math.floor(65 + Math.random() * 35),
          feeStatus: Math.random() > 0.8 ? 'PENDING' : 'PAID',
          totalFees: 45000,
          paidFees: 45000,
          pendingFees: 0,
          documentsStatus: 'VERIFIED',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        });
      }
    }
  }
  return students;
};

const generateTeachers = () => {
  const teachers = [];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Physical Education', 'Arts'];
  const firstNames = ['Alok', 'Sunita', 'Rajesh', 'Priyamvada', 'David', 'Anjali', 'Vikram', 'Priya', 'Rahul', 'Sneha', 'Amit', 'Neha', 'Karan', 'Pooja', 'Ravi'];
  const lastNames = ['Nath', 'Deshmukh', 'Kulkarni', 'Sen', 'Miller', 'Desai', 'Sharma', 'Patel', 'Verma', 'Reddy', 'Singh', 'Gupta', 'Joshi'];
  
  let idCounter = 201;
  for (let i = 0; i < 40; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const subject = subjects[i % subjects.length];
    
    const grades = [];
    for(let g=0; g<3; g++) {
       grades.push(`Grade ${Math.floor(Math.random() * 12) + 1}-${['A','B','C'][Math.floor(Math.random()*3)]}`);
    }

    teachers.push({
      id: `TCH-${idCounter++}`,
      name: `${i%2==0 ? 'Mr.' : 'Ms.'} ${first} ${last}`,
      subject: subject,
      secondarySubjects: [subjects[(i+1) % subjects.length]],
      gradeClasses: [...new Set(grades)],
      status: Math.random() > 0.85 ? 'ABSENT' : 'PRESENT',
      availability: 'Available',
      lecturesPerWeek: Math.floor(15 + Math.random() * 10),
      maxLecturesPerDay: 5,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@rootshala.com`
    });
  }
  return teachers;
};

// Generate some basic static data to keep the UI functioning
const INITIAL_FEES = [];
const INITIAL_DOCUMENTS = [];
const INITIAL_TIMETABLE = [];
const INITIAL_ESCALATIONS = [];
const INITIAL_AI_LOGS = [];
const INITIAL_SUPPLY_ITEMS = [];
const INITIAL_TASKS = [];
const INITIAL_ATTENDANCE_RECORDS = [];

const students = generateStudents();
const teachers = generateTeachers();

const output = `
import { Student, Teacher, FeeRecord, DocumentItem, TimetableSlot, EscalationItem, AIActionLog, SupplyItem, CollaborativeTask, AttendanceRecord } from '../types';

export const INITIAL_STUDENTS: Student[] = ${JSON.stringify(students, null, 2)};
export const INITIAL_TEACHERS: Teacher[] = ${JSON.stringify(teachers, null, 2)};

export const INITIAL_FEES: FeeRecord[] = ${JSON.stringify(INITIAL_FEES, null, 2)};
export const INITIAL_DOCUMENTS: DocumentItem[] = ${JSON.stringify(INITIAL_DOCUMENTS, null, 2)};
export const INITIAL_TIMETABLE: TimetableSlot[] = ${JSON.stringify(INITIAL_TIMETABLE, null, 2)};
export const INITIAL_ESCALATIONS: EscalationItem[] = ${JSON.stringify(INITIAL_ESCALATIONS, null, 2)};
export const INITIAL_AI_LOGS: AIActionLog[] = ${JSON.stringify(INITIAL_AI_LOGS, null, 2)};
export const INITIAL_SUPPLY_ITEMS: SupplyItem[] = ${JSON.stringify(INITIAL_SUPPLY_ITEMS, null, 2)};
export const INITIAL_TASKS: CollaborativeTask[] = ${JSON.stringify(INITIAL_TASKS, null, 2)};
export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = ${JSON.stringify(INITIAL_ATTENDANCE_RECORDS, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../data/mockDatabase.ts'), output);
console.log(`Generated mock database with ${students.length} students and ${teachers.length} teachers.`);
