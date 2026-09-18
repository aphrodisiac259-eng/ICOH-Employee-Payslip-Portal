import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PayslipRequest, RequestStatus, AuditLog, SystemSettings } from '../types';

/**
 * Generate a sequential/timestamp-based institutional reference number:
 * Format: ICOH-PS-YYYY-XXXXXX
 */
export function generateReferenceNumber(): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `ICOH-PS-${currentYear}-${randomSuffix}`;
}

/**
 * Check if a similar request has already been submitted for the same identifier & month.
 */
export async function checkDuplicateRequest(
  officialEmail: string,
  payslipMonth: string,
  ippisNumber?: string | null
): Promise<{ isDuplicate: boolean; duplicateOf?: string }> {
  try {
    const qEmail = query(
      collection(db, 'payslipRequests'),
      where('officialEmail', '==', officialEmail.toLowerCase().trim()),
      where('payslipMonth', '==', payslipMonth.trim()),
      limit(1)
    );
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      const match = snapEmail.docs[0];
      return { isDuplicate: true, duplicateOf: match.data().referenceNumber };
    }

    if (ippisNumber && ippisNumber.trim()) {
      const qIppis = query(
        collection(db, 'payslipRequests'),
        where('ippisNumber', '==', ippisNumber.trim()),
        where('payslipMonth', '==', payslipMonth.trim()),
        limit(1)
      );
      const snapIppis = await getDocs(qIppis);
      if (!snapIppis.empty) {
        const match = snapIppis.docs[0];
        return { isDuplicate: true, duplicateOf: match.data().referenceNumber };
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.warn('Could not run duplicate check query (might be unauthenticated):', error);
    return { isDuplicate: false };
  }
}

/**
 * Submit a new payslip request (Public user action)
 */
export async function submitPayslipRequest(data: {
  employeeName: string;
  ippisNumber?: string | null;
  officialEmail: string;
  payslipMonth: string;
  additionalNotes?: string | null;
}): Promise<{ referenceNumber: string; id: string }> {
  const referenceNumber = generateReferenceNumber();

  // Try checking duplicate if possible
  const duplicateCheck = await checkDuplicateRequest(
    data.officialEmail, 
    data.payslipMonth, 
    data.ippisNumber
  );

  const newDocData: Omit<PayslipRequest, 'id'> = {
    referenceNumber,
    employeeName: data.employeeName.trim(),
    ippisNumber: data.ippisNumber ? data.ippisNumber.trim() : null,
    officialEmail: data.officialEmail.toLowerCase().trim(),
    payslipMonth: data.payslipMonth.trim(),
    additionalNotes: data.additionalNotes ? data.additionalNotes.trim() : null,
    status: 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    processedAt: null,
    processedBy: null,
    processedByName: null,
    internalNotes: null,
    isDuplicate: duplicateCheck.isDuplicate,
    duplicateOf: duplicateCheck.duplicateOf || null,
  };

  const docRef = await addDoc(collection(db, 'payslipRequests'), newDocData);
  return { referenceNumber, id: docRef.id };
}

/**
 * Fetch all payslip requests (Admin action)
 */
export async function fetchAllRequests(): Promise<PayslipRequest[]> {
  try {
    const q = query(
      collection(db, 'payslipRequests'),
      orderBy('createdAt', 'desc'),
      limit(500)
    );
    const snap = await getDocs(q);
    return snap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PayslipRequest[];
  } catch (error) {
    // If index or ordering issue, fallback to unconstrained query
    const fallbackSnap = await getDocs(collection(db, 'payslipRequests'));
    const items = fallbackSnap.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as PayslipRequest[];
    return items.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
  }
}

/**
 * Update request status & internal notes + create audit log
 */
export async function updateRequestStatusAndNotes(params: {
  requestId: string;
  referenceNumber: string;
  previousStatus: RequestStatus;
  newStatus: RequestStatus;
  internalNotes?: string | null;
  adminId: string;
  adminEmail: string;
  adminName: string;
  documentName?: string | null;
}): Promise<void> {
  const reqRef = doc(db, 'payslipRequests', params.requestId);
  
  const updatePayload: Record<string, any> = {
    status: params.newStatus,
    updatedAt: serverTimestamp(),
    processedBy: params.adminId,
    processedByName: params.adminName,
  };

  if (params.internalNotes !== undefined) {
    updatePayload.internalNotes = params.internalNotes;
  }

  if (params.newStatus === 'Completed/Sent') {
    updatePayload.processedAt = serverTimestamp();
  }

  if (params.documentName) {
    updatePayload.payslipDocumentName = params.documentName;
  }

  await updateDoc(reqRef, updatePayload);

  // Record Audit Log
  try {
    await addDoc(collection(db, 'auditLogs'), {
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.previousStatus !== params.newStatus 
        ? `Status updated to ${params.newStatus}` 
        : `Notes / details updated`,
      requestId: params.requestId,
      referenceNumber: params.referenceNumber,
      details: params.internalNotes ? `Notes: "${params.internalNotes}"` : 'Status modified',
      previousStatus: params.previousStatus,
      newStatus: params.newStatus,
      timestamp: serverTimestamp(),
    });
  } catch (auditErr) {
    console.error('Audit log write error:', auditErr);
  }
}

/**
 * Fetch Audit Logs (SuperAdmin only)
 */
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      orderBy('timestamp', 'desc'),
      limit(200)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AuditLog[];
  } catch (err) {
    const fallbackSnap = await getDocs(collection(db, 'auditLogs'));
    return fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() })) as AuditLog[];
  }
}

/**
 * System Settings fetch and update
 */
export async function fetchSystemSettings(): Promise<SystemSettings> {
  const defaultSettings: SystemSettings = {
    organizationName: 'INTERCOUNTRY CENTRE FOR ORAL HEALTH (ICOH) FOR AFRICA',
    abbreviation: 'ICOH',
    primaryColor: '#008C45', // Nigerian Federal Green
    secondaryColor: '#FFFFFF',
    maintenanceMode: false,
    supportEmail: 'payroll@icoh.gov.ng',
    payrollOfficeLocation: 'ICOH Headquarters, Jos, Plateau State, Nigeria',
    processingTurnaround: '24 - 48 working hours',
  };

  try {
    const sDoc = await getDoc(doc(db, 'systemSettings', 'general'));
    if (sDoc.exists()) {
      return { ...defaultSettings, ...sDoc.data() } as SystemSettings;
    }
  } catch (err) {
    console.warn('Using default system settings:', err);
  }

  return defaultSettings;
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
  const sRef = doc(db, 'systemSettings', 'general');
  await updateDoc(sRef, {
    ...settings,
    settingsUpdatedAt: serverTimestamp()
  });
}
