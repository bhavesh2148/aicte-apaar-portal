export type QuotaCategory = 
  | 'General'
  | 'OBC'
  | 'SC_ST'
  | 'EWS'
  | 'TFWS'       // Tuition Fee Waiver Scheme (Supernumerary)
  | 'PMSSS'      // Prime Minister Special Scholarship Scheme (Supernumerary)
  | 'NRI'        // Non-Resident Indian
  | 'OCI'        // Overseas Citizen of India
  | 'FN';        // Foreign National

export interface CourseIntake {
  courseId: string;
  courseName: string;
  level: 'UG' | 'PG' | 'Diploma';
  sanctionedIntake: number;
  approvedSupernumerary: {
    tfws: number;
    pmsss: number;
    nri: number;
    oci: number;
    fn: number;
  };
  enrolled: {
    general: number;
    obc: number;
    sc_st: number;
    ews: number;
    tfws: number;
    pmsss: number;
    nri: number;
    oci: number;
    fn: number;
  };
}

export interface StudentRecord {
  id: string;
  apaarId: string; // 12 digits: e.g. "9812-4412-8819"
  hashedId: string;
  studentName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseName: string;
  academicYear: string;
  quota: QuotaCategory;
  admissionDate: string;
  isSupernumerary: boolean;
  status: 'ACTIVE' | 'FLAGGED_DUPLICATE' | 'GHOST_FLAGGED' | 'EXCESS_ESCALATED';
  academicActivityScore: number; // 0-100 (attendance/exams)
  daysSinceLastActivity: number;
  passportVisaNumber?: string;
  verificationHash: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North-West' | 'Central';
  state: string;
  type: 'Govt' | 'Govt-Aided' | 'Private' | 'University Dept';
  trustScore: number; // 0-100
  trustGrade: 'A+' | 'A' | 'B' | 'C' | 'High Risk';
  totalSanctioned: number;
  totalEnrolled: number;
  excessIntakeAlerts: number;
  duplicateAlerts: number;
  anomalyScore: number;
  lastAuditTimestamp: string;
}

export interface GhostEnrolmentFlag {
  id: string;
  apaarId: string;
  studentName: string;
  flagType: 'SIMULTANEOUS_DUAL_REGULAR' | 'GHOST_STUDENT_INACTIVE' | 'CROSS_STATE_SUSPICIOUS';
  primaryCollege: string;
  secondaryCollege?: string;
  primaryCourse: string;
  secondaryCourse?: string;
  detectionDate: string;
  distanceKm?: number;
  confidenceScore: number;
  hashedIdentity: string;
  evidence: string;
  status: 'DETECTED' | 'UNDER_REVIEW' | 'CONFIRMED_GHOST' | 'CLEARED';
}

export interface AnomalyRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  anomalyType: 'LATE_CYCLE_BULK_ADMISSION' | 'SUDDEN_NRI_SPIKE' | 'CATEGORY_RATIO_DRIFT' | 'INTAKE_CAP_BREACH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  plainLanguageExplanation: string;
  dataEvidence: {
    metric: string;
    expected: string;
    observed: string;
    deviation: string;
  };
  detectedOn: string;
  actionTaken?: string;
  status: 'PENDING_OFFICER_REVIEW' | 'SHOW_CAUSE_ISSUED' | 'JUSTIFICATION_RECEIVED' | 'RESOLVED';
}

export interface AuditBlock {
  blockNumber: number;
  timestamp: string;
  actor: string;
  actorRole: string;
  institutionId: string;
  action: 'BATCH_UPLOAD' | 'INTAKE_ALTERATION' | 'STUDENT_ENROLMENT' | 'ANOMALY_CLEARED' | 'REVOCATION';
  recordsAffected: number;
  dataHash: string;
  previousBlockHash: string;
  merkleRoot: string;
  signatureReceipt: string;
}

export interface VerifiableStudentPass {
  passId: string;
  apaarId: string;
  studentName: string;
  institutionName: string;
  courseName: string;
  enrolmentYear: string;
  academicStatus: 'CONFIRMED_ACTIVE' | 'PROVISIONAL' | 'COMPLETED';
  consentExpiry: string;
  allowedFields: {
    showGrades: boolean;
    showCategory: boolean;
    showGuardianDetails: boolean;
    showAttendance: boolean;
  };
  isRevoked: boolean;
  signedToken: string;
  issuedAt: string;
  issuedByAICTE: boolean;
}

export interface DryRunIssue {
  rowNumber: number;
  field: string;
  rawInput: string;
  errorCode: 'INVALID_APAAR_CHECKSUM' | 'INTAKE_CAP_EXCEEDED' | 'MISSING_MANDATORY_FIELD' | 'NRI_MISSING_PASSPORT' | 'DUPLICATE_IN_FILE';
  message: string;
  suggestedFix: string;
  severity: 'ERROR' | 'WARNING';
}

export interface DryRunResult {
  totalRowsProcessed: number;
  validRows: number;
  invalidRows: number;
  dataHealthScore: number; // 0-100%
  issues: DryRunIssue[];
  intakeProjection: {
    courseName: string;
    currentEnrolled: number;
    newProposed: number;
    sanctionedLimit: number;
    willExceed: boolean;
  }[];
}
