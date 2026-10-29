import React, { useState } from 'react';
import { GhostEnrolmentFlag } from '../types';
import { Radio, ShieldAlert, GitBranch, AlertCircle, FileText, CheckCircle2, MapPin } from 'lucide-react';

interface GhostRadarProps {
  flags: GhostEnrolmentFlag[];
  onResolveFlag: (id: string, resolution: 'FROZEN' | 'CLEARED') => void;
}

export const GhostRadar: React.FC<GhostRadarProps> = ({
  flags,
  onResolveFlag
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SIMULTANEOUS' | 'INACTIVE'>('ALL');
  const [selectedFlagId, setSelectedFlagId] = useState<string>(flags[0]?.id || '');
  const [activeDossierModal, setActiveDossierModal] = useState<GhostEnrolmentFlag | null>(null);

  const filteredFlags = flags.filter(flag => {
    if (filterType === 'SIMULTANEOUS') return flag.flagType === 'SIMULTANEOUS_DUAL_REGULAR';
    if (filterType === 'INACTIVE') return flag.flagType === 'GHOST_STUDENT_INACTIVE';
    return true;
  });

  const selectedFlag = flags.find(f => f.id === selectedFlagId) || flags[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Feature 2: Ghost Enrolment Radar
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Zero-knowledge cross-institutional matching detecting overlapping regular degree enrollments and inactive ghost students without academic trails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-danger font-mono">ACTIVE COLLISIONS: {flags.filter(f => f.status === 'DETECTED').length}</span>
          <span className="badge badge-info font-mono">PRIVACY: HMAC-SHA256 ANONYMIZED</span>
        </div>
      </div>

      {/* Top Topology Graphic Card */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Radio size={16} color="var(--navy-900)" />
            <span>Cross-Campus Collision Topology & Link Graph</span>
          </div>
          <span className="badge badge-purple font-mono">GRAPH MATCHING ALGORITHM: BIPARTITE_OVERLAP_V4</span>
        </div>

        <div className="gov-card-body" style={{ backgroundColor: 'var(--navy-950)', color: '#ffffff', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
          {selectedFlag ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                    {selectedFlag.flagType === 'SIMULTANEOUS_DUAL_REGULAR' ? 'SIMULTANEOUS REGULAR ENROLMENT' : 'INACTIVE GHOST STUDENT'}
                  </span>
                  <span className="font-mono text-xs text-muted">ID: {selectedFlag.id}</span>
                </div>
                <div className="font-mono text-xs" style={{ color: '#93c5fd' }}>
                  Detection Confidence: <strong>{selectedFlag.confidenceScore}%</strong>
                </div>
              </div>

              {/* Topology Nodes visual */}
              {selectedFlag.flagType === 'SIMULTANEOUS_DUAL_REGULAR' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1.5rem', margin: '1.5rem 0' }}>
                  {/* Node 1 */}
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PRIMARY ENROLMENT CAMPUS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
                      {selectedFlag.primaryCollege}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.35rem' }}>
                      Programme: {selectedFlag.primaryCourse}
                    </div>
                    <div className="font-mono text-xs" style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                      Status: Active Full-Time Seat
                    </div>
                  </div>

                  {/* Conflict Vector Bridge */}
                  <div style={{ textAlign: 'center', minWidth: '180px' }}>
                    <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '50%' }}>
                      <GitBranch size={22} color="#f87171" />
                    </div>
                    <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.8rem', marginTop: '0.4rem' }}>
                      APAAR HASH COLLISION
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.725rem', color: '#cbd5e1' }}>
                      Distance: ~{selectedFlag.distanceKm} km
                    </div>
                    <div style={{ borderTop: '1px dashed #ef4444', width: '100%', margin: '0.5rem 0' }} />
                    <span className="badge badge-neutral font-mono" style={{ fontSize: '0.65rem' }}>
                      Concurrent Attendance Impossible
                    </span>
                  </div>

                  {/* Node 2 */}
                  <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CONCURRENT SECONDARY CAMPUS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.25rem' }}>
                      {selectedFlag.secondaryCollege}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.35rem' }}>
                      Programme: {selectedFlag.secondaryCourse}
                    </div>
                    <div className="font-mono text-xs" style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                      Status: Duplicate Seat Occupied
                    </div>
                  </div>
                </div>
              ) : (
                /* Inactive Ghost Student View */
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '1.25rem', margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>
                        ZERO-ACTIVITY DORMANT RECORD (&gt;180 DAYS)
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.25rem' }}>
                        {selectedFlag.primaryCollege}
                      </div>
                      <div style={{ color: '#38bdf8', fontSize: '0.825rem' }}>Course: {selectedFlag.primaryCourse}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono text-xs" style={{ color: '#94a3b8' }}>Academic Trail Score</div>
                      <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>4 / 100</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.75rem' }}>
                    Evidence: {selectedFlag.evidence}
                  </p>
                </div>
              )}

              {/* Privacy Preserving Key Hash Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Privacy Hash: <span className="font-mono" style={{ color: '#cbd5e1' }}>{selectedFlag.hashedIdentity}</span> (DPDP Act 2023 Compliant)
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveDossierModal(selectedFlag)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <FileText size={14} /> View Evidence Dossier
                  </button>
                  {selectedFlag.status === 'DETECTED' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onResolveFlag(selectedFlag.id, 'FROZEN')}
                    >
                      <ShieldAlert size={14} /> Freeze Duplicate Enrolment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No active ghost flags matching this criterion.</div>
          )}
        </div>
      </div>

      {/* Flagged Records Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <span>Detected Collisions Registry</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('ALL')}
            >
              All Anomalies ({flags.length})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'SIMULTANEOUS' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('SIMULTANEOUS')}
            >
              Dual Regular Enrolments ({flags.filter(f => f.flagType === 'SIMULTANEOUS_DUAL_REGULAR').length})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'INACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('INACTIVE')}
            >
              Ghost Students ({flags.filter(f => f.flagType === 'GHOST_STUDENT_INACTIVE').length})
            </button>
          </div>
        </div>

        <div className="gov-card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Detection ID</th>
                  <th>Student Candidate</th>
                  <th>APAAR Masked ID</th>
                  <th>Flag Type</th>
                  <th>Primary Institution</th>
                  <th>Secondary Collision</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlags.map(flag => (
                  <tr
                    key={flag.id}
                    onClick={() => setSelectedFlagId(flag.id)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedFlagId === flag.id ? 'var(--navy-50)' : undefined
                    }}
                  >
                    <td className="font-mono text-xs">{flag.id}</td>
                    <td><strong>{flag.studentName}</strong></td>
                    <td className="font-mono text-xs">{flag.apaarId}</td>
                    <td>
                      {flag.flagType === 'SIMULTANEOUS_DUAL_REGULAR' ? (
                        <span className="badge badge-danger">Dual Regular Degree</span>
                      ) : (
                        <span className="badge badge-warning">Zero Academic Trail</span>
                      )}
                    </td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {flag.primaryCollege}
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {flag.secondaryCollege || 'N/A (Single Institution Ghost)'}
                    </td>
                    <td className="font-mono">{flag.confidenceScore}%</td>
                    <td>
                      {flag.status === 'DETECTED' ? (
                        <span className="badge badge-danger">Active Collision</span>
                      ) : flag.status === 'UNDER_REVIEW' ? (
                        <span className="badge badge-warning">Notice Dispatched</span>
                      ) : (
                        <span className="badge badge-success">Seat De-registered</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDossierModal(flag);
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Dossier Modal */}
      {activeDossierModal && (
        <div className="modal-overlay" onClick={() => setActiveDossierModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gov-card-header">
              <div className="gov-card-title">
                <AlertCircle size={18} color="var(--status-danger)" />
                <span>Forensic Evidence Dossier: {activeDossierModal.id}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveDossierModal(null)}
              >
                Close
              </button>
            </div>

            <div className="gov-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Candidate Details</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '0.2rem' }}>{activeDossierModal.studentName}</div>
                  <div className="font-mono text-xs" style={{ marginTop: '0.25rem' }}>APAAR: {activeDossierModal.apaarId}</div>
                  <div className="font-mono text-xs text-muted">Hash: {activeDossierModal.hashedIdentity}</div>
                </div>

                <div style={{ padding: '0.85rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Detection Algorithm</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)', marginTop: '0.2rem' }}>AICTE Cross-Registry Collision V4</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>Confidence: <strong>{activeDossierModal.confidenceScore}%</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>Date: {activeDossierModal.detectionDate}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Verifiable Forensic Evidence Summary
                </h4>
                <div style={{ padding: '0.85rem', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--status-danger)', lineHeight: 1.5 }}>
                  {activeDossierModal.evidence}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveDossierModal(null)}
                >
                  Dismiss
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onResolveFlag(activeDossierModal.id, 'FROZEN');
                    setActiveDossierModal(null);
                  }}
                >
                  <ShieldAlert size={14} /> Dispatch Regulatory Freeze Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
