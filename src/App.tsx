import React, { useState } from 'react';
import {
  ActiveRole,
  ActiveTab,
  Navbar
} from './components/Navbar';
import { IntakeGuard } from './components/IntakeGuard';
import { GhostRadar } from './components/GhostRadar';
import { AnomalyEngine } from './components/AnomalyEngine';
import { StudentPass } from './components/StudentPass';
import { AuditChain } from './components/AuditChain';
import { PreSubmissionDryRun } from './components/PreSubmissionDryRun';
import { PublicVerifierView } from './components/PublicVerifierView';

import {
  INITIAL_INSTITUTIONS,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_GHOST_FLAGS,
  INITIAL_ANOMALIES,
  INITIAL_AUDIT_BLOCKS,
  INITIAL_VERIFIABLE_PASS
} from './mockData/initialData';

import {
  CourseIntake,
  StudentRecord,
  GhostEnrolmentFlag,
  AnomalyRecord,
  AuditBlock,
  VerifiableStudentPass,
  QuotaCategory
} from './types';
import { sha256Sim } from './services/validationEngine';
import { ShieldCheck, Layers, Database, Lock, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<ActiveRole>('AICTE_ADMIN');
  const [activeTab, setActiveTab] = useState<ActiveTab>('INTAKE_GUARD');

  const [courses, setCourses] = useState<CourseIntake[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [ghostFlags, setGhostFlags] = useState<GhostEnrolmentFlag[]>(INITIAL_GHOST_FLAGS);
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(INITIAL_ANOMALIES);
  const [auditBlocks, setAuditBlocks] = useState<AuditBlock[]>(INITIAL_AUDIT_BLOCKS);
  const [verifiablePass, setVerifiablePass] = useState<VerifiableStudentPass>(INITIAL_VERIFIABLE_PASS);

  // Helper to append tamper-evident audit blocks
  const appendAuditBlock = (
    actor: string,
    role: string,
    action: AuditBlock['action'],
    recordsCount: number,
    dataSummary: string
  ) => {
    const prevBlock = auditBlocks[0];
    const newBlockNumber = (prevBlock?.blockNumber || 10482) + 1;
    const dataHash = sha256Sim(`${newBlockNumber}-${dataSummary}-${Date.now()}`);
    const newBlock: AuditBlock = {
      blockNumber: newBlockNumber,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      actor,
      actorRole: role,
      institutionId: 'AICTE-DEL-101',
      action,
      recordsAffected: recordsCount,
      dataHash,
      previousBlockHash: prevBlock?.dataHash || '0x0000000000000000',
      merkleRoot: sha256Sim(dataHash + 'merkle'),
      signatureReceipt: `SIG-ECDSA-AICTE-${newBlockNumber}`
    };

    setAuditBlocks([newBlock, ...auditBlocks]);
  };

  // Handler for Feature 1: Add student with real-time intake guard enforcement
  const handleAddStudentToCourse = (
    courseId: string,
    quota: QuotaCategory,
    apaarId: string,
    studentName: string
  ): { success: boolean; message: string } => {
    const courseIndex = courses.findIndex(c => c.courseId === courseId);
    if (courseIndex === -1) return { success: false, message: 'Course not found' };

    const target = courses[courseIndex];

    // Check specific quota limits
    if (quota === 'TFWS' && target.enrolled.tfws >= target.approvedSupernumerary.tfws) {
      return {
        success: false,
        message: `REGULATORY INTAKE BLOCK: TFWS supernumerary quota for ${target.courseName} is full (${target.enrolled.tfws}/${target.approvedSupernumerary.tfws}). Cannot exceed 5% statutory ceiling.`
      };
    }

    if (quota === 'NRI' && target.enrolled.nri >= target.approvedSupernumerary.nri) {
      return {
        success: false,
        message: `REGULATORY INTAKE BLOCK: Approved NRI quota capacity (${target.approvedSupernumerary.nri} seats) is completely exhausted. Supernumerary expansion requires prior AICTE Executive Council approval.`
      };
    }

    if (quota === 'FN' && target.enrolled.fn >= target.approvedSupernumerary.fn) {
      return {
        success: false,
        message: `REGULATORY INTAKE BLOCK: Foreign National quota cap (${target.approvedSupernumerary.fn} seats) reached. No further admissions permitted.`
      };
    }

    // Check total capacity
    const currentTotal = target.enrolled.general + target.enrolled.obc + target.enrolled.sc_st + 
                         target.enrolled.ews + target.enrolled.tfws + target.enrolled.pmsss + 
                         target.enrolled.nri + target.enrolled.oci + target.enrolled.fn;
    
    const maxCapacity = target.sanctionedIntake + 
      target.approvedSupernumerary.tfws + target.approvedSupernumerary.pmsss + 
      target.approvedSupernumerary.nri + target.approvedSupernumerary.oci + target.approvedSupernumerary.fn;

    if (currentTotal >= maxCapacity) {
      return {
        success: false,
        message: `HARD REGULATORY CEILING BREACH: ${target.courseId} has reached maximum sanctioned + supernumerary capacity (${currentTotal}/${maxCapacity}). AICTE Approval Handbook enforces automatic intake freeze.`
      };
    }

    // If passed, update enrolled count
    const updatedCourses = [...courses];
    const updatedEnrolled = { ...target.enrolled };

    if (quota === 'General') updatedEnrolled.general += 1;
    else if (quota === 'EWS') updatedEnrolled.ews += 1;
    else if (quota === 'TFWS') updatedEnrolled.tfws += 1;
    else if (quota === 'PMSSS') updatedEnrolled.pmsss += 1;
    else if (quota === 'NRI') updatedEnrolled.nri += 1;
    else if (quota === 'OCI') updatedEnrolled.oci += 1;
    else if (quota === 'FN') updatedEnrolled.fn += 1;

    updatedCourses[courseIndex] = {
      ...target,
      enrolled: updatedEnrolled
    };

    setCourses(updatedCourses);

    // Add student record
    const newStudent: StudentRecord = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      apaarId,
      hashedId: sha256Sim(apaarId),
      studentName,
      gender: 'Male',
      dob: '2004-06-15',
      institutionId: 'AICTE-DEL-101',
      institutionName: 'Delhi Institute of Engineering & Advanced Technology',
      courseId: target.courseId,
      courseName: target.courseName,
      academicYear: '2026-27',
      quota,
      admissionDate: new Date().toISOString().slice(0, 10),
      isSupernumerary: quota !== 'General' && quota !== 'EWS',
      status: 'ACTIVE',
      academicActivityScore: 90,
      daysSinceLastActivity: 0,
      verificationHash: sha256Sim(`${apaarId}-${target.courseId}`)
    };

    setStudents([newStudent, ...students]);

    // Append to audit chain
    appendAuditBlock(
      'REGISTRAR_DIEAT_101',
      'Institution Registrar',
      'STUDENT_ENROLMENT',
      1,
      `Enrolled ${studentName} (${apaarId}) in ${target.courseId} under ${quota}`
    );

    return {
      success: true,
      message: `ADMISSION ACCEPTED: Student ${studentName} successfully registered in ${target.courseId} under ${quota} quota. Record hash committed to local ledger.`
    };
  };

  // Handler for Feature 2: Resolve ghost flags
  const handleResolveGhostFlag = (id: string, resolution: 'FROZEN' | 'CLEARED') => {
    setGhostFlags(ghostFlags.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: resolution === 'FROZEN' ? 'CONFIRMED_GHOST' : 'CLEARED'
        };
      }
      return f;
    }));

    appendAuditBlock(
      'AICTE_VIGILANCE_HQ',
      'AICTE Regulatory Officer',
      'REVOCATION',
      1,
      `Regulatory freeze action dispatched for collision incident ${id}`
    );
  };

  // Handler for Feature 3: Update anomaly
  const handleUpdateAnomalyStatus = (
    anomalyId: string,
    newStatus: AnomalyRecord['status'],
    note: string
  ) => {
    setAnomalies(anomalies.map(a => {
      if (a.id === anomalyId) {
        return {
          ...a,
          status: newStatus,
          actionTaken: note
        };
      }
      return a;
    }));

    appendAuditBlock(
      'AICTE_CHAIRMAN_OFFICE',
      'Apex Directorate',
      'ANOMALY_CLEARED',
      1,
      `Adjudicated anomaly ${anomalyId} to status ${newStatus}. Note: ${note}`
    );
  };

  // Handler for Feature 4: Revoke verifiable pass
  const handleRevokePass = (passId: string) => {
    setVerifiablePass({
      ...verifiablePass,
      isRevoked: true
    });

    appendAuditBlock(
      'STUDENT_IDENTITY_VAULT',
      'Student Self-Service Consent',
      'REVOCATION',
      1,
      `Student Aarav Sharma revoked third-party verification consent for Pass ${passId}`
    );
  };

  // Handler for Feature 6: Commit Batch
  const handleCommitDryRunBatch = (count: number) => {
    appendAuditBlock(
      'REGISTRAR_DIEAT_101',
      'Institution Registrar',
      'BATCH_UPLOAD',
      count,
      `Pre-submission dry-run passed with 95% health score. Committed ${count} student records.`
    );
  };

  // Synchronize role switch with default tabs
  const handleRoleChange = (role: ActiveRole) => {
    setActiveRole(role);
    if (role === 'AICTE_ADMIN') setActiveTab('ANOMALY_ENGINE');
    else if (role === 'INSTITUTION_REGISTRAR') setActiveTab('INTAKE_GUARD');
    else if (role === 'STUDENT_PORTAL') setActiveTab('STUDENT_PASS');
    else if (role === 'PUBLIC_VERIFIER') setActiveTab('STUDENT_PASS');
  };

  return (
    <div className="app-container">
      {/* Top GovTech Navigation Header */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <main className="page-wrapper">
        
        {/* Apex Regulatory Scorecard Banner across all views */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="metric-tile highlight">
            <div className="metric-title">
              <span>National Approved Intake</span>
              <Layers size={14} color="var(--slate-400)" />
            </div>
            <div className="metric-value">2,160</div>
            <div className="metric-sub">Across 4 Sample AICTE Institutions</div>
          </div>

          <div className="metric-tile highlight">
            <div className="metric-title">
              <span>Actual Verified Enrolment</span>
              <Database size={14} color="var(--slate-400)" />
            </div>
            <div className="metric-value font-mono">2,166</div>
            <div className="metric-sub" style={{ color: 'var(--status-danger)', fontWeight: 600 }}>
              +6 Over-enrolled (AICTE Violation)
            </div>
          </div>

          <div className="metric-tile warning">
            <div className="metric-title">
              <span>Ghost Collisions Flagged</span>
              <AlertTriangle size={14} color="var(--status-warning)" />
            </div>
            <div className="metric-value font-mono" style={{ color: 'var(--status-warning)' }}>
              {ghostFlags.filter(f => f.status === 'DETECTED').length}
            </div>
            <div className="metric-sub">Zero-Activity & Dual Enrolments</div>
          </div>

          <div className="metric-tile">
            <div className="metric-title">
              <span>Immutable Chain Blocks</span>
              <Lock size={14} color="var(--navy-800)" />
            </div>
            <div className="metric-value font-mono">{auditBlocks[0]?.blockNumber || 10482}</div>
            <div className="metric-sub">
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>100% Tamper Evident</span>
            </div>
          </div>
        </div>

        {/* Feature 1: Intake Guard */}
        {activeTab === 'INTAKE_GUARD' && (
          <IntakeGuard
            courses={courses}
            onAddStudentToCourse={handleAddStudentToCourse}
          />
        )}

        {/* Feature 2: Ghost Enrolment Radar */}
        {activeTab === 'GHOST_RADAR' && (
          <GhostRadar
            flags={ghostFlags}
            onResolveFlag={handleResolveGhostFlag}
          />
        )}

        {/* Feature 3: Explainable Anomaly Engine */}
        {activeTab === 'ANOMALY_ENGINE' && (
          <AnomalyEngine
            anomalies={anomalies}
            institutions={INITIAL_INSTITUTIONS}
            onUpdateAnomalyStatus={handleUpdateAnomalyStatus}
          />
        )}

        {/* Feature 4: Verifiable Student Pass & Public Verifier Desk */}
        {activeTab === 'STUDENT_PASS' && (
          <div>
            {activeRole === 'PUBLIC_VERIFIER' ? (
              <PublicVerifierView
                students={students}
                pass={verifiablePass}
              />
            ) : (
              <div>
                <StudentPass
                  pass={verifiablePass}
                  onUpdateConsent={(updated) => setVerifiablePass(updated)}
                  onRevokePass={handleRevokePass}
                />
                
                <div style={{ marginTop: '2rem' }}>
                  <PublicVerifierView
                    students={students}
                    pass={verifiablePass}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature 5: Tamper-Evident Audit Chain */}
        {activeTab === 'AUDIT_CHAIN' && (
          <AuditChain blocks={auditBlocks} />
        )}

        {/* Feature 6: Pre-Submission Dry-Run */}
        {activeTab === 'DRY_RUN' && (
          <PreSubmissionDryRun
            courses={courses}
            onCommitBatch={handleCommitDryRunBatch}
          />
        )}

      </main>

      {/* Official Gov Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--slate-200)', backgroundColor: '#ffffff', padding: '1.25rem 2rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>All India Council for Technical Education (AICTE)</strong> — Nelson Mandela Marg, Vasant Kunj, New Delhi-110070.
            <div style={{ marginTop: '0.2rem' }}>
              APAAR National Academic Identity Integration Framework • Digital Personal Data Protection (DPDP) Act 2023 Compliant.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
            <span>REST API v2.4</span>
            <span>•</span>
            <span>ABC Ledger Connected</span>
            <span>•</span>
            <span>Security Seal: SHA-256 Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
