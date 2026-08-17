# RootShala AI

<div align="center">
  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200&h=400" alt="RootShala Banner" width="100%" />
</div>

**RootShala** is a next-generation Educational ERP (Enterprise Resource Planning) and school management dashboard designed for the future of education. It leverages automation, generative AI, and collaborative tools to streamline school operations, from fee reconciliation to intelligent timetable generation.

## 🔐 Demo Login Credentials

You can test the Role-Based Access Control (RBAC) and role-specific dashboards using the following pre-configured demo accounts. 

| Role | Staff ID (Username) | Password |
| :--- | :--- | :--- |
| **Super Admin** | `EMP-739` | `vikram@739` |
| **Principal** | `EMP-902` | `anjali@902` |
| **IT Support** | `IT-999` | `admin@999` |
| **Class Teacher** | `TCH-202` | `priya@202` |
| **Subject Teacher** | `TCH-105` | `karan@105` |
| **Accountant** | `ACT-511` | `rahul@511` |
| **Receptionist** | `REC-114` | `sneha@114` |

*(Note: Navigate to `/init-db` in your browser first if the database needs to be initialized).*

## 🤖 AI-Powered Features

RootShala integrates **Google Gemini 1.5** to automate heavy administrative workflows:

- **AI Command Center**: A natural language chatbot available to all staff. Users can type commands like *"Show me absent teachers today"* or *"Send fee reminders to defaulters"* and the AI will execute the complex backend operations automatically.
- **Smart OCR Document Processing**: Simply upload a photo of a handwritten Admission Form, ID card, or Bank Fee Receipt. The Gemini Vision API will instantly read the document, extract the structured data, and flag mismatches without any manual data entry.
- **Automated Timetable Generation**: A powerful CSP (Constraint Satisfaction Problem) AI solver that can generate an entire school's weekly schedule instantly—guaranteeing zero room collisions, respecting teacher workload caps, and automatically assigning substitute teachers when someone is absent. (Generation restricted to Admins/Principals, viewing open to all).
- **Predictive Student Radar & Smart Attendance**: The AI analyzes historical attendance and academic data to detect at-risk students, dropping grades, and negative behavioural patterns, allowing educators to intervene early.

## 🌟 Comprehensive Feature List

RootShala is a monolithic ERP packed with features tailored for modern school administration. 

### 1. Advanced Role-Based Access Control (RBAC)
- **10+ Pre-configured Roles**: Including Super Admin, Principal, Vice Principal, Class Teacher, Subject Teacher, Accountant, Receptionist, IT Support, Librarian, Counselor, Student, and Parent.
- **Granular Permissions**: Modules dynamically lock and unlock depending on the authenticated user's exact permissions.
- **Data Scoping**: Teachers only see data for their specific homeroom class; financial data is strictly siloed to the Accountant and Admins.

### 2. Core Administrative Operations
- **Student Directory Management**: Maintain comprehensive profiles with academic, behavioural, and fee records.
- **Staff & Teacher Management**: Track teacher workloads, subject expertise, and availability.
- **Class & Subject Management**: Map which teachers are handling which subjects for every class grade.

### 3. Financial & Fee Ledger
- **Fee Collection & Tracking**: Real-time overview of paid vs. pending fees.
- **Automated Defaulter Management**: AI tools to identify overdue payments and draft reminder notices.
- **Fee Receipt Reconciliation**: Upload physical bank receipts and have the system cross-check them against expected ledger values automatically.

### 4. Smart Attendance System
- **Rapid Homeroom Marking**: Class teachers can mark daily attendance with a few clicks.
- **Automated Parent Alerts**: The system can trigger automated SMS/Email notifications to parents of absent students.
- **Chronic Absence Detection**: Analytics identify students with problematic attendance trends.

### 5. Document & Admissions Management
- **Centralized Document Vault**: Securely store and verify student ID cards, previous transcripts, and admission forms.
- **Automated OCR Parsing**: Upload an image of a document, and the AI extracts the data and checks for anomalies instantly.

### 6. Dynamic Timetable & Scheduling
- **Master Timetable Generation**: Generates conflict-free schedules across the entire school.
- **Teacher Substitutions**: Automatically identifies available and qualified teachers to cover classes when a staff member calls in sick.

### 7. Collaborative Task Board
- **Cross-Department Tasks**: Assign tasks to different roles (e.g., "Principal assigning a discipline review to a Counselor").
- **Real-time Status Tracking**: Monitor pending tasks directly from the main operations dashboard.

### 8. Analytics & Reporting (Predictive Radar)
- **Predictive Student Radar**: Highlights students who are falling behind academically or displaying concerning behavioral trends.
- **Needs Attention Flags**: A centralized inbox for the Principal to approve high-stakes decisions (fee waivers, disciplinary actions).

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase Realtime Database](https://firebase.google.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) (@google/genai)
- **State Management**: Custom React Hooks for seamless real-time Firebase synchronization.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Firebase Project (with Realtime Database enabled)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VedrajSingh21/RootShala.git
   cd RootShala/EduOne-2047
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `EduOne-2047` root and add your keys:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   VITE_GEMINI_API_KEY_2=your_fallback_key_here
   ```
   *(Configure your Firebase credentials in `src/lib/firebase.ts`)*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Populate Mock Database:**
   Navigate to `/init-db` in your browser to populate the Firebase Realtime Database with initial mock data and the demo user accounts.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/VedrajSingh21/RootShala/issues).

---
*Built for the future of education.*
