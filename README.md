# RootShala

<div align="center">
  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200&h=400" alt="RootShala Banner" width="100%" />
</div>

**RootShala** is a next-generation Educational ERP (Enterprise Resource Planning) and school management dashboard designed for the future of education. It leverages automation, simulated AI agents, and collaborative tools to streamline school operations, from fee reconciliation to timetable generation.

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Highly secure and tailored dashboards for various roles including Super Admins, Principals, Teachers, Accountants, and Receptionists.
- **AI-Powered Automation**: Built-in simulated AI Agents (Finance, Timetable, Admission, Attendance) that automate routine tasks and log actions transparently.
- **Human-in-the-Loop Escalations**: A "Needs Attention" module that flags critical issues (e.g., fee mismatches, absent teachers) for manual approval.
- **Smart Attendance**: Intelligent tracking with automatic risk detection and parental alerts.
- **Fee & Bank Ledger**: Automated OCR parsing for fee receipts with discrepancy detection.
- **Timetable Management**: Conflict-free scheduling and automated substitute assignments.
- **Collaborative Task Board**: Staff task management integrated across all modules.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase Realtime Database](https://firebase.google.com/)
- **State Management**: Custom React Hooks for seamless real-time Firebase synchronization.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Firebase Project (with Realtime Database enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VedrajSingh1926/RootShala.git
   cd RootShala/RootShala
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Configure your Firebase credentials in the project. (Refer to `firebase.ts` for expected config fields).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Populate Mock Database (Optional):**
   Navigate to `/init-db` in your browser to populate the Firebase Realtime Database with initial mock data (students, teachers, fees, etc.).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/VedrajSingh1926/RootShala/issues).

---
*Built for the future of education.*
