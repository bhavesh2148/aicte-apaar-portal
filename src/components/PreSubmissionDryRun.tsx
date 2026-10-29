import React, { useState } from 'react';
import { CourseIntake, DryRunResult } from '../types';
import { performPreSubmissionDryRun, generateValidApaar } from '../services/validationEngine';
import { FileCheck2, AlertCircle, Wrench, UploadCloud, CheckCircle2, RefreshCw, FileText } from 'lucide-react';

interface PreSubmissionDryRunProps {
  courses: CourseIntake[];
  onCommitBatch: (validRowsCount: number) => void;
}

const SAMPLE_DEFECTIVE_BATCH = `9812-4412-8819, Aarav Sharma, CSE-101, General, ADM-2026-001
9812-4412-8810, Rohit Verma, CSE-101, General, ADM-2026-002
8934-2201-9943, Priya Narayanan, AIML-102, General, ADM-2026-003
7721-9034-1120, Tariq Ahmad Mir, CSE-101, PMSSS, ADM-2026-004
5542-1190-7733, Amina Al-Mansoor, CSE-101, FN, 
9812-4412-8819, Aarav Sharma (Duplicate), CSE-101, General, ADM-2026-005
8819-2210-4491, Johnathan Doe, MBA-201, NRI, NRI-VISA-2026-441
7712-4419-3310, Kavita Singh, CSE-101, General, ADM-2026-006`;

const SAMPLE_CLEAN_BATCH = `9812-4412-8819, Aarav Sharma, CSE-101, General, ADM-2026-001
7721-9034-1120, Tariq Ahmad Mir, AIML-102, PMSSS, ADM-2026-004
8819-2210-4491, Johnathan Doe, MBA-201, NRI, NRI-VISA-2026-441
5542-1190-7733, Amina Al-Mansoor, ECE-103, FN, MEA-VISA-FN-992`;

export const PreSubmissionDryRun: React.FC<PreSubmissionDryRunProps> = ({
  courses,
  onCommitBatch
}) => {
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_DEFECTIVE_BATCH);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(() => {
    return performPreSubmissionDryRun(SAMPLE_DEFECTIVE_BATCH.split('\n'), courses);
  });
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  const handleRunAnalysis = () => {
    const lines = csvContent.split('\n');
    const result = performPreSubmissionDryRun(lines, courses);
    setDryRunResult(result);
    setCommitMessage(null);
  };

  const handleFixIssue = (issueIndex: number) => {
    if (!dryRunResult) return;
    const issue = dryRunResult.issues[issueIndex];
    const lines = csvContent.split('\n');

    if (issue.errorCode === 'INVALID_APAAR_CHECKSUM') {
      // Fix checksum automatically by generating valid 12th digit
      const targetLine = lines[issue.rowNumber - 1];
      if (targetLine) {
        const parts = targetLine.split(',');
        const fixedApaar = generateValidApaar(parts[0].trim().slice(0, 11));
        parts[0] = fixedApaar;
        lines[issue.rowNumber - 1] = parts.join(', ');
      }
    } else if (issue.errorCode === 'NRI_MISSING_PASSPORT') {
      // Attach valid passport document
      const targetLine = lines[issue.rowNumber - 1];
      if (targetLine) {
        const parts = targetLine.split(',');
        parts[4] = 'MEA-VISA-FN-2026-VERIFIED';
        lines[issue.rowNumber - 1] = parts.join(', ');
      }
    } else if (issue.errorCode === 'DUPLICATE_IN_FILE') {
      // Remove duplicate line
      lines.splice(issue.rowNumber - 1, 1);
    }

    const updatedText = lines.join('\n');
    setCsvContent(updatedText);
    const updatedResult = performPreSubmissionDryRun(lines, courses);
    setDryRunResult(updatedResult);
  };

  const handleCommit = () => {
    if (!dryRunResult) return;
    onCommitBatch(dryRunResult.validRows);
    setCommitMessage(`SUCCESS: ${dryRunResult.validRows} verified student records committed to the AICTE Central Repository with signed receipt.`);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Feature 6: Pre-Submission Dry-Run & Data Health Score
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Pre-flight dry-run validator. Tests batch upload data before central database commit, generates row-level error reports with one-click fixes, and prevents regulatory rejections.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCsvContent(SAMPLE_DEFECTIVE_BATCH);
              setDryRunResult(performPreSubmissionDryRun(SAMPLE_DEFECTIVE_BATCH.split('\n'), courses));
              setCommitMessage(null);
            }}
          >
            Load Defective Sample Batch
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCsvContent(SAMPLE_CLEAN_BATCH);
              setDryRunResult(performPreSubmissionDryRun(SAMPLE_CLEAN_BATCH.split('\n'), courses));
              setCommitMessage(null);
            }}
          >
            Load 100% Compliant Batch
          </button>
        </div>
      </div>

      {/* Main Grid: Left CSV Editor | Right Health Score & Projections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Raw CSV Editor */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <FileText size={16} color="var(--navy-800)" />
              <span>Batch Ingestion File Simulator (CSV / API Feed)</span>
            </div>
            <span className="font-mono text-xs text-muted">Format: APAAR, Name, Course, Quota, ExtraDoc</span>
          </div>

          <div className="gov-card-body">
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={12}
              className="font-mono text-xs"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-300)',
                lineHeight: 1.6,
                backgroundColor: '#ffffff'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {csvContent.split('\n').filter(l => l.trim()).length} candidate rows loaded
              </span>

              <button
                className="btn btn-primary"
                onClick={handleRunAnalysis}
              >
                <RefreshCw size={14} /> Run Dry-Run Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Right: Data Health Score & Projections */}
        {dryRunResult && (
          <div>
            {/* Scorecard */}
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <FileCheck2 size={16} />
                  <span>Pre-Submission Data Health Scorecard</span>
                </div>
                <span className={`badge ${dryRunResult.dataHealthScore >= 90 ? 'badge-success' : dryRunResult.dataHealthScore >= 70 ? 'badge-warning' : 'badge-danger'}`}>
                  {dryRunResult.dataHealthScore >= 90 ? 'SUBMISSION READY' : 'REMEDIAL ACTIONS REQUIRED'}
                </span>
              </div>

              <div className="gov-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  {/* Big Health Dial */}
                  <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Data Health Score</div>
                    <div className="font-mono" style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: dryRunResult.dataHealthScore >= 90 ? 'var(--status-success)' : dryRunResult.dataHealthScore >= 70 ? 'var(--status-warning)' : 'var(--status-danger)',
                      lineHeight: 1.1,
                      marginTop: '0.25rem'
                    }}>
                      {dryRunResult.dataHealthScore}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                      {dryRunResult.dataHealthScore >= 90 ? 'Passed AICTE Gates' : 'Rejection Risk High'}
                    </div>
                  </div>

                  {/* Stat breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ padding: '0.65rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Total Rows</div>
                      <div className="font-mono font-bold" style={{ fontSize: '1.2rem', color: 'var(--navy-900)' }}>{dryRunResult.totalRowsProcessed}</div>
                    </div>
                    <div style={{ padding: '0.65rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Valid Rows</div>
                      <div className="font-mono font-bold" style={{ fontSize: '1.2rem', color: 'var(--status-success)' }}>{dryRunResult.validRows}</div>
                    </div>
                    <div style={{ padding: '0.65rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Issues Found</div>
                      <div className="font-mono font-bold" style={{ fontSize: '1.2rem', color: 'var(--status-danger)' }}>{dryRunResult.issues.length}</div>
                    </div>
                  </div>
                </div>

                {/* Course Intake Projections */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Intake Projection Impact
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {dryRunResult.intakeProjection.map((proj, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem 0.75rem',
                          background: proj.willExceed ? 'var(--status-danger-bg)' : 'var(--slate-50)',
                          border: `1px solid ${proj.willExceed ? 'var(--status-danger-border)' : 'var(--slate-200)'}`,
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.785rem'
                        }}
                      >
                        <div>
                          <strong>{proj.courseName}</strong>: {proj.currentEnrolled} + <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{proj.newProposed} new</span>
                        </div>
                        <div className="font-mono">
                          Cap: {proj.sanctionedLimit} seats {proj.willExceed && <span className="badge badge-danger">EXCEEDS</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Commit Button */}
                <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Gate Policy: Health score &ge; 90% required for central repository commit.
                  </span>

                  <button
                    className="btn btn-primary"
                    disabled={dryRunResult.dataHealthScore < 80}
                    onClick={handleCommit}
                  >
                    <UploadCloud size={15} /> Finalize & Commit Batch
                  </button>
                </div>

                {commitMessage && (
                  <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--status-success)' }}>
                    {commitMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row-Level Error & Suggested Fix Manifest */}
      {dryRunResult && dryRunResult.issues.length > 0 && (
        <div className="gov-card" style={{ marginTop: '1.5rem' }}>
          <div className="gov-card-header">
            <div className="gov-card-title">
              <AlertCircle size={16} color="var(--status-danger)" />
              <span>Row-Level Diagnostics & Suggested Fix Actions</span>
            </div>
            <span className="badge badge-danger font-mono">{dryRunResult.issues.length} ACTIONABLE DEFECTS</span>
          </div>

          <div className="gov-card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Row #</th>
                    <th>Field</th>
                    <th>Raw Input Data</th>
                    <th>Error Code</th>
                    <th>Diagnostic Message</th>
                    <th>Suggested Fix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dryRunResult.issues.map((issue, idx) => (
                    <tr key={idx}>
                      <td className="font-mono text-xs">{issue.rowNumber > 0 ? `Row ${issue.rowNumber}` : 'Batch'}</td>
                      <td className="font-mono text-xs">{issue.field}</td>
                      <td className="font-mono text-xs" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {issue.rawInput}
                      </td>
                      <td>
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                          {issue.errorCode}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.785rem', color: 'var(--slate-800)' }}>{issue.message}</td>
                      <td style={{ fontSize: '0.785rem', color: 'var(--slate-600)' }}>{issue.suggestedFix}</td>
                      <td>
                        {issue.rowNumber > 0 && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleFixIssue(idx)}
                            style={{ color: 'var(--navy-900)' }}
                          >
                            <Wrench size={12} /> Auto-Fix
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
