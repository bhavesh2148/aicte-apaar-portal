import {
  Institution,
  CourseIntake,
  StudentRecord,
  GhostEnrolmentFlag,
  AnomalyRecord,
  AuditBlock,
  VerifiableStudentPass
} from '../types';
import { sha256Sim } from '../services/validationEngine';

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'AICTE-DEL-101',
    name: 'Delhi Institute of Engineering & Advanced Technology',
    code: 'DIEAT-101',
    region: 'Northern',
    state: 'Delhi',
    type: 'Govt',
    trustScore: 96,
    trustGrade: 'A+',
    totalSanctioned: 720,
    totalEnrolled: 694,
    excessIntakeAlerts: 0,
    duplicateAlerts: 1,
    anomalyScore: 4,
    lastAuditTimestamp: '2026-10-28 14:32 IST'
  },
  {
    id: 'AICTE-MAH-204',
    name: 'Maharashtra State Institute of Technology (MSIT)',
    code: 'MSIT-PUN',
    region: 'Western',
    state: 'Maharashtra',
    type: 'Govt-Aided',
    trustScore: 91,
    trustGrade: 'A',
    totalSanctioned: 600,
    totalEnrolled: 588,
    excessIntakeAlerts: 1,
    duplicateAlerts: 2,
    anomalyScore: 9,
    lastAuditTimestamp: '2026-10-29 09:15 IST'
  },
  {
    id: 'AICTE-KAR-312',
    name: 'Bangalore Apex Academy of Technical Studies',
    code: 'BAATS-BLR',
    region: 'Southern',
    state: 'Karnataka',
    type: 'Private',
    trustScore: 78,
    trustGrade: 'B',
    totalSanctioned: 480,
    totalEnrolled: 472,
    excessIntakeAlerts: 2,
    duplicateAlerts: 3,
    anomalyScore: 22,
    lastAuditTimestamp: '2026-10-27 18:40 IST'
  },
  {
    id: 'AICTE-UP-902',
    name: 'National Grand Institute of Management & Science',
    code: 'NGIMS-NOI',
    region: 'Northern',
    state: 'Uttar Pradesh',
    type: 'Private',
    trustScore: 54,
    trustGrade: 'High Risk',
    totalSanctioned: 360,
    totalEnrolled: 412, // Exceeded!
    excessIntakeAlerts: 3,
    duplicateAlerts: 7,
    anomalyScore: 46,
    lastAuditTimestamp: '2026-10-29 11:04 IST'
  }
];

export const INITIAL_COURSES: CourseIntake[] = [
  {
    courseId: 'CSE-101',
    courseName: 'B.Tech - Computer Science & Engineering',
    level: 'UG',
    sanctionedIntake: 180,
    approvedSupernumerary: {
      tfws: 9, // 5%
      pmsss: 4,
      nri: 12,
      oci: 4,
      fn: 5
    },
    enrolled: {
      general: 90,
      obc: 48,
      sc_st: 32,
      ews: 10,
      tfws: 9,
      pmsss: 3,
      nri: 11,
      oci: 4,
      fn: 4
    } // Total enrolled: 211 / Total capacity 214 (98.6% - WARNING STAGE)
  },
  {
    courseId: 'AIML-102',
    courseName: 'B.Tech - Artificial Intelligence & Machine Learning',
    level: 'UG',
    sanctionedIntake: 120,
    approvedSupernumerary: {
      tfws: 6,
      pmsss: 2,
      nri: 8,
      oci: 2,
      fn: 3
    },
    enrolled: {
      general: 60,
      obc: 32,
      sc_st: 20,
      ews: 8,
      tfws: 5,
      pmsss: 2,
      nri: 5,
      oci: 1,
      fn: 2
    } // Total 135 / 141 (95.7% - WARNING STAGE)
  },
  {
    courseId: 'ECE-103',
    courseName: 'B.Tech - Electronics & Communication Engineering',
    level: 'UG',
    sanctionedIntake: 120,
    approvedSupernumerary: {
      tfws: 6,
      pmsss: 2,
      nri: 6,
      oci: 2,
      fn: 2
    },
    enrolled: {
      general: 45,
      obc: 24,
      sc_st: 16,
      ews: 5,
      tfws: 4,
      pmsss: 1,
      nri: 3,
      oci: 1,
      fn: 1
    } // Total 100 / 138 (72.4% - HEALTHY)
  },
  {
    courseId: 'MBA-201',
    courseName: 'Post Graduate Diploma in Management (PGDM / MBA)',
    level: 'PG',
    sanctionedIntake: 120,
    approvedSupernumerary: {
      tfws: 0,
      pmsss: 0,
      nri: 15,
      oci: 5,
      fn: 5
    },
    enrolled: {
      general: 65,
      obc: 30,
      sc_st: 18,
      ews: 7,
      tfws: 0,
      pmsss: 0,
      nri: 16, // Breached NRI by 1!
      oci: 4,
      fn: 4
    } // Total 144 / 145 (99.3% with quota spillover)
  }
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'STU-001',
    apaarId: '9812-4412-8819',
    hashedId: sha256Sim('9812-4412-8819'),
    studentName: 'Aarav Sharma',
    gender: 'Male',
    dob: '2004-05-14',
    institutionId: 'AICTE-DEL-101',
    institutionName: 'Delhi Institute of Engineering & Advanced Technology',
    courseId: 'CSE-101',
    courseName: 'B.Tech - Computer Science & Engineering',
    academicYear: '2026-27',
    quota: 'General',
    admissionDate: '2026-08-12',
    isSupernumerary: false,
    status: 'ACTIVE',
    academicActivityScore: 94,
    daysSinceLastActivity: 2,
    verificationHash: sha256Sim('STU-001-9812-4412-8819')
  },
  {
    id: 'STU-002',
    apaarId: '8934-2201-9943',
    hashedId: sha256Sim('8934-2201-9943'),
    studentName: 'Priya Narayanan',
    gender: 'Female',
    dob: '2004-11-20',
    institutionId: 'AICTE-DEL-101',
    institutionName: 'Delhi Institute of Engineering & Advanced Technology',
    courseId: 'CSE-101',
    courseName: 'B.Tech - Computer Science & Engineering',
    academicYear: '2026-27',
    quota: 'General',
    admissionDate: '2026-08-14',
    isSupernumerary: false,
    status: 'FLAGGED_DUPLICATE',
    academicActivityScore: 88,
    daysSinceLastActivity: 5,
    verificationHash: sha256Sim('STU-002-8934-2201-9943')
  },
  {
    id: 'STU-003',
    apaarId: '7721-9034-1120',
    hashedId: sha256Sim('7721-9034-1120'),
    studentName: 'Tariq Ahmad Mir',
    gender: 'Male',
    dob: '2003-09-02',
    institutionId: 'AICTE-DEL-101',
    institutionName: 'Delhi Institute of Engineering & Advanced Technology',
    courseId: 'CSE-101',
    courseName: 'B.Tech - Computer Science & Engineering',
    academicYear: '2026-27',
    quota: 'PMSSS',
    admissionDate: '2026-08-10',
    isSupernumerary: true,
    status: 'ACTIVE',
    academicActivityScore: 92,
    daysSinceLastActivity: 3,
    verificationHash: sha256Sim('STU-003-7721-9034-1120')
  },
  {
    id: 'STU-004',
    apaarId: '6610-8823-4501',
    hashedId: sha256Sim('6610-8823-4501'),
    studentName: 'Vikramaditya Rao',
    gender: 'Male',
    dob: '2004-01-29',
    institutionId: 'AICTE-UP-902',
    institutionName: 'National Grand Institute of Management & Science',
    courseId: 'MBA-201',
    courseName: 'PGDM / MBA',
    academicYear: '2026-27',
    quota: 'General',
    admissionDate: '2026-08-28',
    isSupernumerary: false,
    status: 'GHOST_FLAGGED',
    academicActivityScore: 4, // Almost zero!
    daysSinceLastActivity: 198,
    verificationHash: sha256Sim('STU-004-6610-8823-4501')
  },
  {
    id: 'STU-005',
    apaarId: '5542-1190-7733',
    hashedId: sha256Sim('5542-1190-7733'),
    studentName: 'Amina Al-Mansoor',
    gender: 'Female',
    dob: '2003-07-18',
    institutionId: 'AICTE-DEL-101',
    institutionName: 'Delhi Institute of Engineering & Advanced Technology',
    courseId: 'CSE-101',
    courseName: 'B.Tech - Computer Science & Engineering',
    academicYear: '2026-27',
    quota: 'FN',
    passportVisaNumber: 'IND-VISA-FN-2026-904',
    admissionDate: '2026-08-16',
    isSupernumerary: true,
    status: 'ACTIVE',
    academicActivityScore: 90,
    daysSinceLastActivity: 1,
    verificationHash: sha256Sim('STU-005-5542-1190-7733')
  }
];

export const INITIAL_GHOST_FLAGS: GhostEnrolmentFlag[] = [
  {
    id: 'GH-2026-01',
    apaarId: '8934-2201-9943',
    studentName: 'Priya Narayanan',
    flagType: 'SIMULTANEOUS_DUAL_REGULAR',
    primaryCollege: 'Delhi Institute of Engineering & Advanced Technology',
    secondaryCollege: 'Maharashtra State Institute of Technology (MSIT)',
    primaryCourse: 'B.Tech CSE (Full-time Regular)',
    secondaryCourse: 'B.Tech Computer Technology (Full-time Regular)',
    detectionDate: '2026-09-04',
    distanceKm: 1420,
    confidenceScore: 99.4,
    hashedIdentity: sha256Sim('8934-2201-9943'),
    evidence: 'Exact APAAR collision detected across two state admission portals. Biometric and matriculation hashes match with 100% precision. Geographic distance precludes concurrent attendance.',
    status: 'DETECTED'
  },
  {
    id: 'GH-2026-02',
    apaarId: '6610-8823-4501',
    studentName: 'Vikramaditya Rao',
    flagType: 'GHOST_STUDENT_INACTIVE',
    primaryCollege: 'National Grand Institute of Management & Science',
    primaryCourse: 'PGDM / MBA',
    detectionDate: '2026-10-12',
    confidenceScore: 94.2,
    hashedIdentity: sha256Sim('6610-8823-4501'),
    evidence: 'Student record enrolled during late approval cycle. Zero LMS logins, 0 mid-term exam marks recorded, and 198 days without verifiable academic credit transaction on the ABC ledger.',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'GH-2026-03',
    apaarId: '4419-7720-3318',
    studentName: 'Rohan Deshmukh',
    flagType: 'SIMULTANEOUS_DUAL_REGULAR',
    primaryCollege: 'Bangalore Apex Academy of Technical Studies',
    secondaryCollege: 'National Grand Institute of Management & Science',
    primaryCourse: 'B.Tech Mechanical Engineering',
    secondaryCourse: 'Diploma in Mechatronics (Concurrent Regular)',
    detectionDate: '2026-10-18',
    distanceKm: 2150,
    confidenceScore: 98.1,
    hashedIdentity: sha256Sim('4419-7720-3318'),
    evidence: 'Enrolled under full-time regular scheme in both Southern and Northern regions simultaneously. Dual seat occupancy blocks second seat from legitimate candidate.',
    status: 'DETECTED'
  }
];

export const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANOM-2026-881',
    institutionId: 'AICTE-UP-902',
    institutionName: 'National Grand Institute of Management & Science',
    anomalyType: 'LATE_CYCLE_BULK_ADMISSION',
    severity: 'CRITICAL',
    title: 'Surge Ingestion: 48 Admissions Processed 3 Hours Prior to National Cut-Off',
    plainLanguageExplanation: 'An automated batch of 48 student enrolments was uploaded between 23:14 and 01:45 IST on the final cutoff night. 84% of records lack state counseling seat allotment identifiers.',
    dataEvidence: {
      metric: 'Admissions in Final 24h Window',
      expected: 'Avg 2 to 4 students',
      observed: '48 students (1200% deviation)',
      deviation: '+1100%'
    },
    detectedOn: '2026-10-22 03:00 IST',
    status: 'SHOW_CAUSE_ISSUED'
  },
  {
    id: 'ANOM-2026-724',
    institutionId: 'AICTE-KAR-312',
    institutionName: 'Bangalore Apex Academy of Technical Studies',
    anomalyType: 'SUDDEN_NRI_SPIKE',
    severity: 'HIGH',
    title: 'Supernumerary Quota Anomaly: 350% Spike in NRI Enrolments Without Embassy Attestation',
    plainLanguageExplanation: 'The institution filled 15 NRI seats within 4 days. However, cross-referencing with Ministry of External Affairs portal indicated 9 candidates have resident domestic secondary school certificates.',
    dataEvidence: {
      metric: 'NRI Quota Utilization Rate',
      expected: 'Historical 15% to 30%',
      observed: '100% capacity within 96 hours',
      deviation: '+233%'
    },
    detectedOn: '2026-10-25 16:20 IST',
    status: 'PENDING_OFFICER_REVIEW'
  },
  {
    id: 'ANOM-2026-619',
    institutionId: 'AICTE-MAH-204',
    institutionName: 'Maharashtra State Institute of Technology (MSIT)',
    anomalyType: 'INTAKE_CAP_BREACH',
    severity: 'HIGH',
    title: 'Sanctioned Ceiling Warning: Computer Science at 98.6% Capacity',
    plainLanguageExplanation: 'Department of Computer Science has reached 211 active students against sanctioned + supernumerary ceiling of 214 seats. Any further registrations will trigger immediate regulatory block.',
    dataEvidence: {
      metric: 'Total Headcount vs Approved Capacity',
      expected: '<= 90% at this cycle date',
      observed: '98.6% (Only 3 seats remaining)',
      deviation: '+8.6% above alert threshold'
    },
    detectedOn: '2026-10-28 10:15 IST',
    status: 'JUSTIFICATION_RECEIVED'
  }
];

export const INITIAL_AUDIT_BLOCKS: AuditBlock[] = [
  {
    blockNumber: 10482,
    timestamp: '2026-10-29 11:20:15 IST',
    actor: 'REGISTRAR_DIEAT_101',
    actorRole: 'Institution Registrar',
    institutionId: 'AICTE-DEL-101',
    action: 'BATCH_UPLOAD',
    recordsAffected: 45,
    dataHash: '0x8f4c2e91b5d3a7e0c4f1a2b3c4d5e6f7',
    previousBlockHash: '0x3a9b1c7d5e8f2a4c6e0b8d2f4a6c8e0b',
    merkleRoot: '0xd7a1f4b8c9e2d3f5a6b7c8d9e0f1a2b3',
    signatureReceipt: 'SIG-ECDSA-AICTE-DEL-2026-10482'
  },
  {
    blockNumber: 10481,
    timestamp: '2026-10-29 09:44:02 IST',
    actor: 'AICTE_OFFICER_NORTH_04',
    actorRole: 'AICTE Regulatory Officer',
    institutionId: 'AICTE-UP-902',
    action: 'INTAKE_ALTERATION',
    recordsAffected: 1,
    dataHash: '0x3a9b1c7d5e8f2a4c6e0b8d2f4a6c8e0b',
    previousBlockHash: '0x7e2d9a4f1c8b3e5d0a6c2f4e8b1d3a5c',
    merkleRoot: '0xc4b8d1e7f3a9c2e5b8d1a4f7c0e3b6a9',
    signatureReceipt: 'SIG-ECDSA-AICTE-HQ-2026-10481'
  },
  {
    blockNumber: 10480,
    timestamp: '2026-10-28 17:12:33 IST',
    actor: 'REGISTRAR_MSIT_PUN',
    actorRole: 'Institution Registrar',
    institutionId: 'AICTE-MAH-204',
    action: 'STUDENT_ENROLMENT',
    recordsAffected: 12,
    dataHash: '0x7e2d9a4f1c8b3e5d0a6c2f4e8b1d3a5c',
    previousBlockHash: '0x1b4d7a0c3e6f9b2d5a8c1e4f7a0b3d6e',
    merkleRoot: '0x9e2b5d8a1c4f7a0d3e6b9c2f5a8d1e4b',
    signatureReceipt: 'SIG-ECDSA-MSIT-2026-10480'
  },
  {
    blockNumber: 10479,
    timestamp: '2026-10-28 14:05:48 IST',
    actor: 'STUDENT_CONSENT_GATEWAY',
    actorRole: 'Student Identity Vault',
    institutionId: 'AICTE-DEL-101',
    action: 'REVOCATION',
    recordsAffected: 1,
    dataHash: '0x1b4d7a0c3e6f9b2d5a8c1e4f7a0b3d6e',
    previousBlockHash: '0x4f8a2d6e0b4c8e1a5d9b3f7c1e5a9d3b',
    merkleRoot: '0x2d6f0b4c8a1e5d9b3f7a1c5e9d3b7f1a',
    signatureReceipt: 'SIG-ECDSA-STU-PASSPORT-10479'
  }
];

export const INITIAL_VERIFIABLE_PASS: VerifiableStudentPass = {
  passId: 'PASS-AICTE-2026-8819',
  apaarId: '9812-4412-8819',
  studentName: 'Aarav Sharma',
  institutionName: 'Delhi Institute of Engineering & Advanced Technology',
  courseName: 'B.Tech - Computer Science & Engineering',
  enrolmentYear: '2026-27',
  academicStatus: 'CONFIRMED_ACTIVE',
  consentExpiry: '2026-11-29 (30 Days Remaining)',
  allowedFields: {
    showGrades: false,
    showCategory: false,
    showGuardianDetails: false,
    showAttendance: true
  },
  isRevoked: false,
  signedToken: 'JWT.eyJhbGciOiJFUzI1NiIsImtpZCI6IkFJQ1RFLUtFWVMyNiJ9.eyJzdWIiOiI5ODEyLTQ0MTItODgxOSIsInJvbGUiOiJzdHVkZW50IiwiaW5zdCI6IkRJRUFULTEwMSIsImFjYWRlbWljX3N0YXR1cyI6IkFDVElWRSJ9.c7b9e1f2a4c8d0e3',
  issuedAt: '2026-08-15 IST',
  issuedByAICTE: true
};
