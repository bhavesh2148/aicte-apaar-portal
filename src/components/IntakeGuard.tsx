import React, { useState } from 'react';
import { CourseIntake, QuotaCategory } from '../types';
import { calculateIntakeStatus, validateApaarChecksum } from '../services/validationEngine';
import { AlertTriangle, ShieldAlert, CheckCircle2, UserPlus, Info, Lock } from 'lucide-react';

interface IntakeGuardProps {
  courses: CourseIntake[];
  onAddStudentToCourse: (courseId: string, quota: QuotaCategory, apaarId: string, studentName: string) => { success: boolean; message: string };
}

export const IntakeGuard: React.FC<IntakeGuardProps> = ({
  courses,
  onAddStudentToCourse
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.courseId || '');
  const [candidateName, setCandidateName] = useState<string>('Siddharth Mukherjee');
  const [candidateApaar, setCandidateApaar] = useState<string>('9812-4412-8819');
  const [candidateQuota, setCandidateQuota] = useState<QuotaCategory>('General');
  const [simulationLog, setSimulationLog] = useState<{ type: 'SUCCESS' | 'WARNING' | 'BLOCKED'; message: string; timestamp: string } | null>(null);

  const activeCourse = courses.find(c => c.courseId === selectedCourseId) || courses[0];
  const stats = activeCourse ? calculateIntakeStatus(activeCourse) : null;

  const handleSimulateAdmission = (e: React.FormEvent) => {
    e.preventDefault();

    // Check APAAR format first
    const clean = candidateApaar.replace(/[^0-9]/g, '');
    if (clean.length !== 12 || !validateApaarChecksum(clean)) {
      setSimulationLog({
        type: 'BLOCKED',
        message: `VALIDATION FAILURE: APAAR ID '${candidateApaar}' does not satisfy the Verhoeff ISO-7064 checksum. Student record cannot be enrolled.`,
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    const result = onAddStudentToCourse(selectedCourseId, candidateQuota, candidateApaar, candidateName);

    if (!result.success) {
      setSimulationLog({
        type: 'BLOCKED',
        message: result.message,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      setSimulationLog({
        type: stats && (stats.totalPercentage >= 88) ? 'WARNING' : 'SUCCESS',
        message: result.message,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Feature 1: Intake Guard (Live Seat Ledger)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Real-time seat counter per programme split by General, Supernumerary, NRI, OCI, and Foreign National. Proactively prevents excess admissions before final registration.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-info font-mono">ENFORCEMENT: STRICT_CEILING_V2</span>
          <span className="badge badge-warning font-mono">ALERT THRESHOLD: 90%</span>
        </div>
      </div>

      {/* Real-time Summary Cards Across All Programmes */}
      <div className="metrics-grid">
        {courses.map(course => {
          const cStats = calculateIntakeStatus(course);
          return (
            <div
              key={course.courseId}
              onClick={() => setSelectedCourseId(course.courseId)}
              className={`metric-tile ${cStats.isBreached ? 'danger' : cStats.isWarning ? 'warning' : 'highlight'}`}
              style={{
                cursor: 'pointer',
                borderColor: selectedCourseId === course.courseId ? 'var(--navy-900)' : undefined,
                boxShadow: selectedCourseId === course.courseId ? '0 0 0 2px var(--navy-800)' : undefined
              }}
            >
              <div className="metric-title">
                <span>{course.courseId}</span>
                {cStats.isBreached ? (
                  <span className="badge badge-danger">CAP EXCEEDED</span>
                ) : cStats.isWarning ? (
                  <span className="badge badge-warning">CAPACITY ALERT (&gt;90%)</span>
                ) : (
                  <span className="badge badge-success">IN COMPLIANCE</span>
                )}
              </div>

              <div className="metric-value">
                {cStats.totalEnrolled} <span style={{ fontSize: '1rem', color: 'var(--slate-400)', fontWeight: 500 }}>/ {cStats.totalCapacity}</span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${cStats.isBreached ? 'progress-danger' : cStats.isWarning ? 'progress-warning' : 'progress-healthy'}`}
                  style={{ width: `${Math.min(100, cStats.totalPercentage)}%` }}
                />
              </div>

              <div className="metric-sub" style={{ justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span>Occupancy: <strong>{cStats.totalPercentage}%</strong></span>
                <span>Remaining: <strong>{cStats.availableSeats} seats</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Ledger & Admission Simulator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Detailed Quota Ledger */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <span>Intake Allocation Ledger: {activeCourse.courseName}</span>
              </div>
              <div className="gov-card-subtitle font-mono">
                AICTE Sanctioned: {activeCourse.sanctionedIntake} | Supernumerary Ceiling: {
                  activeCourse.approvedSupernumerary.tfws +
                  activeCourse.approvedSupernumerary.pmsss +
                  activeCourse.approvedSupernumerary.nri +
                  activeCourse.approvedSupernumerary.oci +
                  activeCourse.approvedSupernumerary.fn
                }
              </div>
            </div>

            {stats?.isBreached ? (
              <span className="badge badge-danger">
                <ShieldAlert size={14} /> HARD BLOCK TRIGGERED
              </span>
            ) : stats?.isWarning ? (
              <span className="badge badge-warning">
                <AlertTriangle size={14} /> 90% THRESHOLD WARN
              </span>
            ) : (
              <span className="badge badge-success">
                <CheckCircle2 size={14} /> SEATS AVAILABLE
              </span>
            )}
          </div>

          <div className="gov-card-body">
            {/* Warning Alert Banner if >=90% */}
            {stats?.isWarning && (
              <div style={{
                backgroundColor: 'var(--status-warning-bg)',
                border: '1px solid var(--status-warning-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <AlertTriangle color="var(--status-warning)" size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.8125rem', color: 'var(--status-warning)' }}>
                  <strong>INTAKE SURGE WARNING:</strong> Total enrolment in {activeCourse.courseId} has reached <strong>{stats.totalPercentage}%</strong> of the approved ceiling. Only <strong>{stats.availableSeats}</strong> seat(s) remain. Automatic intake lock will activate once quota is exhausted.
                </div>
              </div>
            )}

            {/* Quota Breakdown Table */}
            <div className="table-container">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Quota Category</th>
                    <th>Classification</th>
                    <th>Approved Cap</th>
                    <th>Current Enrolled</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* General / Sanctioned */}
                  <tr>
                    <td><strong>Open & State Reservation</strong></td>
                    <td>Sanctioned Intake</td>
                    <td className="font-mono">{activeCourse.sanctionedIntake}</td>
                    <td className="font-mono">{activeCourse.enrolled.general + activeCourse.enrolled.obc + activeCourse.enrolled.sc_st + activeCourse.enrolled.ews}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.sanctionedIntake - (activeCourse.enrolled.general + activeCourse.enrolled.obc + activeCourse.enrolled.sc_st + activeCourse.enrolled.ews))}</td>
                    <td>
                      <span className="badge badge-neutral">Standard</span>
                    </td>
                  </tr>

                  {/* TFWS */}
                  <tr>
                    <td><strong>TFWS (Tuition Fee Waiver)</strong></td>
                    <td>Supernumerary (5% Max)</td>
                    <td className="font-mono">{activeCourse.approvedSupernumerary.tfws}</td>
                    <td className="font-mono">{activeCourse.enrolled.tfws}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.approvedSupernumerary.tfws - activeCourse.enrolled.tfws)}</td>
                    <td>
                      {activeCourse.enrolled.tfws >= activeCourse.approvedSupernumerary.tfws ? (
                        <span className="badge badge-danger">Quota Full</span>
                      ) : (
                        <span className="badge badge-purple">Supernumerary</span>
                      )}
                    </td>
                  </tr>

                  {/* PMSSS */}
                  <tr>
                    <td><strong>PMSSS (J&K and Ladakh)</strong></td>
                    <td>Supernumerary (AICTE Scheme)</td>
                    <td className="font-mono">{activeCourse.approvedSupernumerary.pmsss}</td>
                    <td className="font-mono">{activeCourse.enrolled.pmsss}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.approvedSupernumerary.pmsss - activeCourse.enrolled.pmsss)}</td>
                    <td>
                      <span className="badge badge-purple">Supernumerary</span>
                    </td>
                  </tr>

                  {/* NRI */}
                  <tr>
                    <td><strong>NRI (Non-Resident Indian)</strong></td>
                    <td>Supernumerary Quota</td>
                    <td className="font-mono">{activeCourse.approvedSupernumerary.nri}</td>
                    <td className="font-mono">{activeCourse.enrolled.nri}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.approvedSupernumerary.nri - activeCourse.enrolled.nri)}</td>
                    <td>
                      {activeCourse.enrolled.nri >= activeCourse.approvedSupernumerary.nri ? (
                        <span className="badge badge-danger">Cap Exhausted</span>
                      ) : (
                        <span className="badge badge-info">NRI Clearance</span>
                      )}
                    </td>
                  </tr>

                  {/* OCI */}
                  <tr>
                    <td><strong>OCI (Overseas Citizen of India)</strong></td>
                    <td>Supernumerary Quota</td>
                    <td className="font-mono">{activeCourse.approvedSupernumerary.oci}</td>
                    <td className="font-mono">{activeCourse.enrolled.oci}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.approvedSupernumerary.oci - activeCourse.enrolled.oci)}</td>
                    <td>
                      <span className="badge badge-info">MEA Clearance</span>
                    </td>
                  </tr>

                  {/* Foreign National */}
                  <tr>
                    <td><strong>Foreign National (FN)</strong></td>
                    <td>Supernumerary (MEA Visa Req)</td>
                    <td className="font-mono">{activeCourse.approvedSupernumerary.fn}</td>
                    <td className="font-mono">{activeCourse.enrolled.fn}</td>
                    <td className="font-mono">{Math.max(0, activeCourse.approvedSupernumerary.fn - activeCourse.enrolled.fn)}</td>
                    <td>
                      {activeCourse.enrolled.fn >= activeCourse.approvedSupernumerary.fn ? (
                        <span className="badge badge-danger">Quota Full</span>
                      ) : (
                        <span className="badge badge-neutral">Embassy Validated</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={14} />
                <span>Statutory Authority: AICTE Approval Process Handbook (APH 2026-27). Excess seats forfeit AICTE affiliation.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Admission Simulator with Proactive Block Demonstration */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <UserPlus size={16} />
              <span>Proactive Admission Simulator</span>
            </div>
          </div>

          <div className="gov-card-body">
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              Test admission enrollment against live ledger. System intercepts and blocks excess intake before submission to central repository.
            </p>

            <form onSubmit={handleSimulateAdmission} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                  Target Programme
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.8125rem'
                  }}
                >
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseId} — {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.8125rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                  Candidate APAAR ID (12 Digits)
                </label>
                <input
                  type="text"
                  value={candidateApaar}
                  onChange={(e) => setCandidateApaar(e.target.value)}
                  className="font-mono"
                  placeholder="xxxx-xxxx-xxxx"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.8125rem'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Validated via ISO-7064 Verhoeff checksum algorithm.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                  Quota Allocation
                </label>
                <select
                  value={candidateQuota}
                  onChange={(e) => setCandidateQuota(e.target.value as QuotaCategory)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <option value="General">General / Open Category</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="TFWS">TFWS (Tuition Fee Waiver Scheme - Supernumerary)</option>
                  <option value="PMSSS">PMSSS (Prime Minister Special Scholarship - J&K)</option>
                  <option value="NRI">NRI (Non-Resident Indian)</option>
                  <option value="OCI">OCI (Overseas Citizen of India)</option>
                  <option value="FN">FN (Foreign National - Visa Mandated)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                <UserPlus size={16} />
                Validate & Enrol Candidate
              </button>
            </form>

            {/* Simulation Response Feedback Box */}
            {simulationLog && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: simulationLog.type === 'BLOCKED' ? 'var(--status-danger-bg)' : simulationLog.type === 'WARNING' ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                  border: `1px solid ${simulationLog.type === 'BLOCKED' ? 'var(--status-danger-border)' : simulationLog.type === 'WARNING' ? 'var(--status-warning-border)' : 'var(--status-success-border)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: simulationLog.type === 'BLOCKED' ? 'var(--status-danger)' : simulationLog.type === 'WARNING' ? 'var(--status-warning)' : 'var(--status-success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    {simulationLog.type === 'BLOCKED' ? <Lock size={14} /> : <CheckCircle2 size={14} />}
                    {simulationLog.type === 'BLOCKED' ? 'REGULATORY INTAKE BLOCK' : 'INTAKE UPDATE PROCESSED'}
                  </span>
                  <span className="font-mono text-xs text-muted">{simulationLog.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--slate-800)', lineHeight: 1.4 }}>
                  {simulationLog.message}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
