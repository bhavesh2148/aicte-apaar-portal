import React, { useState } from 'react';
import { AnomalyRecord, Institution } from '../types';
import { ShieldCheck, AlertTriangle, Scale, CheckCircle2, ChevronRight, FileSpreadsheet, Eye } from 'lucide-react';

interface AnomalyEngineProps {
  anomalies: AnomalyRecord[];
  institutions: Institution[];
  onUpdateAnomalyStatus: (anomalyId: string, newStatus: AnomalyRecord['status'], note: string) => void;
}

export const AnomalyEngine: React.FC<AnomalyEngineProps> = ({
  anomalies,
  institutions,
  onUpdateAnomalyStatus
}) => {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>(anomalies[0]?.id || '');
  const [officerNote, setOfficerNote] = useState<string>('');
  const [selectedInstitutionFilter, setSelectedInstitutionFilter] = useState<string>('ALL');

  const selectedAnomaly = anomalies.find(a => a.id === selectedAnomalyId) || anomalies[0];

  const handleDecision = (status: AnomalyRecord['status']) => {
    if (!selectedAnomaly) return;
    onUpdateAnomalyStatus(selectedAnomaly.id, status, officerNote || 'Processed by AICTE Central Directorate');
    setOfficerNote('');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            Feature 3: Explainable Anomaly Engine & Institution Trust Score
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
            Unsupervised statistical models detecting late-cycle surges, sudden NRI/FN spikes, and category-ratio drift with plain-language explanations. AI flags; Regulatory Officers decide.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-warning font-mono">PENDING OFFICER ACTIONS: {anomalies.filter(a => a.status === 'PENDING_OFFICER_REVIEW').length}</span>
          <span className="badge badge-info font-mono">MODEL: ISOLATION_FOREST_V2.1</span>
        </div>
      </div>

      {/* Top Section: Transparent Institutional Trust Score Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Scale size={16} color="var(--navy-900)" />
            <span>AICTE Institutional Compliance & Trust Score Index</span>
          </div>
          <span className="badge badge-neutral font-mono">UPDATED: REAL-TIME INGESTION METRICS</span>
        </div>

        <div className="gov-card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Institute Code</th>
                  <th>Institution Name</th>
                  <th>Region / State</th>
                  <th>Type</th>
                  <th>Intake / Enrolled</th>
                  <th>Trust Score</th>
                  <th>Regulatory Grade</th>
                  <th>Risk Tier</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map(inst => (
                  <tr key={inst.id}>
                    <td className="font-mono text-xs">{inst.code}</td>
                    <td><strong>{inst.name}</strong></td>
                    <td>{inst.region} ({inst.state})</td>
                    <td>
                      <span className="badge badge-neutral">{inst.type}</span>
                    </td>
                    <td className="font-mono">
                      {inst.totalEnrolled} / {inst.totalSanctioned}
                      {inst.totalEnrolled > inst.totalSanctioned && (
                        <span className="badge badge-danger" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>EXCESS</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--slate-200)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${inst.trustScore}%`,
                              height: '100%',
                              backgroundColor: inst.trustScore >= 90 ? 'var(--status-success)' : inst.trustScore >= 70 ? 'var(--status-warning)' : 'var(--status-danger)'
                            }}
                          />
                        </div>
                        <span className="font-mono font-bold" style={{ fontSize: '0.85rem' }}>{inst.trustScore}/100</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${inst.trustGrade.startsWith('A') ? 'badge-success' : inst.trustGrade === 'B' ? 'badge-info' : 'badge-danger'}`}>
                        Grade {inst.trustGrade}
                      </span>
                    </td>
                    <td>
                      {inst.trustScore >= 90 ? (
                        <span style={{ color: 'var(--status-success)', fontSize: '0.75rem', fontWeight: 600 }}>Low Risk / Exemplary</span>
                      ) : inst.trustScore >= 70 ? (
                        <span style={{ color: 'var(--status-warning)', fontSize: '0.75rem', fontWeight: 600 }}>Moderate Review</span>
                      ) : (
                        <span style={{ color: 'var(--status-danger)', fontSize: '0.75rem', fontWeight: 700 }}>High Risk / Under Audit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Split: Left Anomaly Feed | Right Explainable Decision Desk */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Anomaly Feed */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <AlertTriangle size={16} />
              <span>Statistical Anomaly Detections</span>
            </div>
            <span className="badge badge-neutral">{anomalies.length} Flagged Incidents</span>
          </div>

          <div className="gov-card-body" style={{ padding: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {anomalies.map(anom => (
                <div
                  key={anom.id}
                  onClick={() => setSelectedAnomalyId(anom.id)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${selectedAnomalyId === anom.id ? 'var(--navy-900)' : 'var(--slate-200)'}`,
                    backgroundColor: selectedAnomalyId === anom.id ? 'var(--navy-50)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <span className={`badge ${anom.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}`}>
                      {anom.severity} ANOMALY
                    </span>
                    <span className="font-mono text-xs text-muted">{anom.detectedOn}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.3 }}>
                    {anom.title}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
                    Institution: <strong>{anom.institutionName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                      {anom.anomalyType.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--navy-800)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Inspect Evidence <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Explainable Decision Workbench */}
        {selectedAnomaly && (
          <div className="gov-card">
            <div className="gov-card-header">
              <div>
                <div className="gov-card-title">
                  <span>Explainable AI Resolution Desk</span>
                </div>
                <div className="gov-card-subtitle font-mono">Incident Reference: {selectedAnomaly.id}</div>
              </div>

              <span className={`badge ${selectedAnomaly.status === 'SHOW_CAUSE_ISSUED' ? 'badge-danger' : selectedAnomaly.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                {selectedAnomaly.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="gov-card-body">
              {/* Institution Context */}
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>Target Institution</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '0.15rem' }}>
                  {selectedAnomaly.institutionName}
                </div>
                <div className="font-mono text-xs text-muted" style={{ marginTop: '0.2rem' }}>
                  ID: {selectedAnomaly.institutionId}
                </div>
              </div>

              {/* Plain-Language Explanation */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Plain-Language AI Diagnostic Reasoning
                </h4>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--navy-50)',
                  border: '1px solid var(--navy-100)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  color: 'var(--navy-950)',
                  lineHeight: 1.55
                }}>
                  {selectedAnomaly.plainLanguageExplanation}
                </div>
              </div>

              {/* Statistical Metrics Grid */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '0.4rem' }}>
                  Empirical Data Evidence & Baseline Deviation
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Metric Analyzed</div>
                    <div style={{ fontSize: '0.785rem', fontWeight: 600, color: 'var(--navy-900)', marginTop: '0.2rem' }}>{selectedAnomaly.dataEvidence.metric}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Expected Baseline</div>
                    <div style={{ fontSize: '0.785rem', fontWeight: 600, color: 'var(--slate-700)', marginTop: '0.2rem' }}>{selectedAnomaly.dataEvidence.expected}</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Observed Deviation</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-danger)', marginTop: '0.2rem' }}>{selectedAnomaly.dataEvidence.observed}</div>
                  </div>
                </div>
              </div>

              {/* Regulatory Decision Form: AI Flags; Officers Decide */}
              <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--navy-800)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    Officer Adjudication (AI Flags; Human Officers Decide)
                  </span>
                </div>

                <textarea
                  placeholder="Enter official remarks, show-cause directive, or validation reasoning..."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-300)',
                    fontSize: '0.8125rem',
                    marginBottom: '0.85rem'
                  }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDecision('SHOW_CAUSE_ISSUED')}
                  >
                    Issue Formal Show-Cause Notice
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDecision('PENDING_OFFICER_REVIEW')}
                  >
                    Order On-Site Vigilance Audit
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--status-success)' }}
                    onClick={() => handleDecision('RESOLVED')}
                  >
                    Accept Justification & Clear Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
