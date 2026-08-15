import React from 'react';
import { OperationsDashboard } from './OperationsDashboard';
import { CurrentUser, AIActionLog, EscalationItem } from '../../types';

interface DashboardProps {
  onNavigate: (moduleId: string) => void;
  onOpenCommandCenter: (prompt?: string) => void;
  escalations: EscalationItem[];
  aiLogs: AIActionLog[];
  onOpenAddStudent: () => void;
  onOpenDocUpload: () => void;
  currentUser: CurrentUser | null;
}

export const PrincipalDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const VicePrincipalDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const ClassTeacherDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const SubjectTeacherDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const ExamCoordinatorDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const AccountantDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const ReceptionistDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const LibrarianDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const CounselorDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const TransportDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const ITSupportDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const SecurityDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const StudentDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;
export const ParentDashboard: React.FC<DashboardProps> = (props) => <OperationsDashboard {...props} />;

export const DashboardRouter: React.FC<DashboardProps> = (props) => {
  if (!props.currentUser) return <OperationsDashboard {...props} />;
  switch (props.currentUser.role) {
    case 'Principal': return <PrincipalDashboard {...props} />;
    case 'Vice Principal': return <VicePrincipalDashboard {...props} />;
    case 'Class Teacher': return <ClassTeacherDashboard {...props} />;
    case 'Subject Teacher': return <SubjectTeacherDashboard {...props} />;
    case 'Exam Coordinator': return <ExamCoordinatorDashboard {...props} />;
    case 'Accountant': return <AccountantDashboard {...props} />;
    case 'Receptionist': return <ReceptionistDashboard {...props} />;
    case 'Librarian': return <LibrarianDashboard {...props} />;
    case 'Counselor': return <CounselorDashboard {...props} />;
    case 'Transport Manager': return <TransportDashboard {...props} />;
    case 'IT Support': return <ITSupportDashboard {...props} />;
    case 'Security Guard': return <SecurityDashboard {...props} />;
    case 'Student': return <StudentDashboard {...props} />;
    case 'Parent': return <ParentDashboard {...props} />;
    default: return <OperationsDashboard {...props} />;
  }
};
