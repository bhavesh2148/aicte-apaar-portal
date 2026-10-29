import React, { useState } from 'react';
import { StudentRecord, VerifiableStudentPass } from '../types';
import { Search, ShieldCheck, CheckCircle2, AlertOctagon, Printer, ExternalLink, QrCode } from 'lucide-react';

interface PublicVerifierViewProps {
  students: StudentRecord[];
  pass: VerifiableStudentPass;
}

export const PublicVerifierView: React.FC<PublicVerifierViewProps> = ({
  students,
  pass
}) => {
  const [query, setQuery] = useState<string>('9812-4412-8819');
  const [searched, setSearched] = useState<boolean>(true);
  const [tokenInput, setTokenInput] = useState<string>('');

  const targetStudent = students.find(s => s.apaarId.includes(query.trim()) || s.id === query.trim());

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Authorized Stakeholder Verification Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Instant zero-latency academic verification for corporate employers, state universities, embassies, and regulatory councils.
          </p>
        </div>

        <span className="badge badge-success font-mono">
          <ShieldCheck size={14} /> AICTE CRYPTOGRAPHIC TRUST ROOT: ONLINE
        </span>
      </div>

      {/* Search Bar */}
      <div className="gov-card">
        <div className="gov-card-body">
          <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter 12-digit APAAR ID (e.g. 9812-4412-8819) or Signed Token..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Search size={15} /> Verify Academic Record
            </button>
          </form>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            <span>Quick Test APAARs:</span>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setQuery('9812-4412-8819'); setSearched(true); }}
            >
              9812-4412-8819 (Aarav Sharma - Active)
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setQuery('8934-2201-9943'); setSearched(true); }}
            >
              8934-2201-9943 (Priya - Dual Collision)
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setQuery('6610-8823-4501'); setSearched(true); }}
            >
              6610-8823-4501 (Vikram - Ghost Dormant)
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Sheet */}
      {searched && (
        <div>
          {targetStudent ? (
            <div className="gov-card">
              <div className="gov-card-header">
                <div className="gov-card-title">
                  <CheckCircle2 size={18} color={targetStudent.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--status-danger)'} />
                  <span>AICTE National Academic Identity Verification Result</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handlePrintCertificate}>
                    <Printer size={13} /> Print Verification Slip
                  </button>
                </div>
              </div>

              <div className="gov-card-body">
                {/* Status Callout */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: targetStudent.status === 'ACTIVE' ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
                  border: `1px solid ${targetStudent.status === 'ACTIVE' ? 'var(--status-success-border)' : 'var(--status-danger-border)'}`,
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: targetStudent.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--status-danger)'
                    }}>
                      {targetStudent.status === 'ACTIVE' ? 'AUTHENTICATED & ACCREDITED ENROLMENT RECORD' : 'REGULATORY INTEGRITY ALERT'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginTop: '0.2rem' }}>
                      {targetStudent.status === 'ACTIVE'
                        ? 'Enrolment verified against AICTE Central Registry with valid APAAR ID and institutional seat clearance.'
                        : 'Record flagged for cross-institutional duplicate occupancy or dormancy. Regulatory audit in progress.'}
                    </div>
                  </div>

                  <span className={`badge ${targetStudent.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                    {targetStudent.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Details Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Academic Identity Metadata
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Full Name: </span>
                        <strong>{targetStudent.studentName}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>APAAR ID: </span>
                        <strong className="font-mono">{targetStudent.apaarId}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Academic Session: </span>
                        <span>{targetStudent.academicYear}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Enrolment Date: </span>
                        <span>{targetStudent.admissionDate}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Institutional & Affiliation Authority
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Approved Institution: </span>
                        <strong>{targetStudent.institutionName}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Approved Programme: </span>
                        <strong>{targetStudent.courseName}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Intake Status: </span>
                        <span className="badge badge-success">Approved Sanctioned Quota</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--slate-500)' }}>Cryptographic Verification Hash: </span>
                        <div className="font-mono text-xs text-muted" style={{ wordBreak: 'break-all' }}>
                          {targetStudent.verificationHash}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statutory Stamp on Bottom */}
                <div style={{ borderTop: '1px solid var(--slate-200)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)' }}>
                    Verified through AICTE DigiLocker / ABC Gateway under Rule 4.1 of the National Academic Depository Regulations.
                  </div>
                  <div className="font-mono text-xs" style={{ color: 'var(--navy-900)', fontWeight: 600 }}>
                    AICTE-TRUST-NODE-VERIFIED
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="gov-card">
              <div className="gov-card-body" style={{ textAlign: 'center', padding: '2rem' }}>
                <AlertOctagon size={32} color="var(--status-danger)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)' }}>No Record Found on AICTE Central Registry</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                  The queried APAAR identifier does not correspond to an enrolled student in an AICTE-approved institution.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
