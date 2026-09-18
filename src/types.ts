export type RequestStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Completed/Sent' 
  | 'Requires Clarification' 
  | 'Rejected';

export interface PayslipRequest {
  id: string;
  referenceNumber: string; // e.g. ICOH-PS-2026-000123
  employeeName: string;
  ippisNumber?: string | null;
  officialEmail: string;
  payslipMonth: string; // e.g. "January 2026"
  additionalNotes?: string | null;
  status: RequestStatus;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  processedAt?: any | null;
  processedBy?: string | null;
  processedByName?: string | null;
  internalNotes?: string | null;
  isDuplicate?: boolean;
  duplicateOf?: string | null;
  payslipDocumentName?: string | null; // For optional internal record-keeping metadata
}

export type AdminRole = 'SuperAdmin' | 'PayrollOfficer';

export interface AdminUser {
  userId: string;
  email: string;
  role: AdminRole;
  fullName: string;
  createdAt: any;
  lastLogin?: any | null;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  requestId?: string | null;
  referenceNumber?: string | null;
  details: string;
  timestamp: any;
  previousStatus?: RequestStatus | null;
  newStatus?: RequestStatus | null;
}

export interface SystemSettings {
  organizationName: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  settingsUpdatedAt?: any;
  maintenanceMode: boolean;
  supportEmail: string;
  payrollOfficeLocation?: string;
  processingTurnaround?: string;
}
