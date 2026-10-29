import React from 'react';
import { ShieldCheck, Building2, UserCheck, Search, Activity, FileCheck2 } from 'lucide-react';

export type ActiveRole = 'AICTE_ADMIN' | 'INSTITUTION_REGISTRAR' | 'STUDENT_PORTAL' | 'PUBLIC_VERIFIER';
export type ActiveTab = 'INTAKE_GUARD' | 'GHOST_RADAR' | 'ANOMALY_ENGINE' | 'STUDENT_PASS' | 'AUDIT_CHAIN' | 'DRY_RUN';

interface NavbarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="main-header">
      {/* Gov Official Banner */}
      <div className="gov-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, color: '#93c5fd' }}>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</span>
          <span>|</span>
          <span>Ministry of Education, Government of India</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
          <span>PORTAL ID: AICTE-APAAR-NAT-2026</span>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }} />
            REGISTRY ONLINE (99.98% SLA)
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="header-content">
        <div className="brand-section">
          <div className="aicte-emblem">
            <span>AICTE</span>
          </div>
          <div>
            <div className="brand-title">APAAR Student Data Management & Verification System</div>
            <div className="brand-subtitle">Automated Intake Audit • Cross-Institution Anomaly Detection • Verifiable Pass</div>
          </div>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Active View:
          </span>
          <div className="role-badge">
            {activeRole === 'AICTE_ADMIN' && <ShieldCheck size={16} color="var(--navy-800)" />}
            {activeRole === 'INSTITUTION_REGISTRAR' && <Building2 size={16} color="var(--navy-800)" />}
            {activeRole === 'STUDENT_PORTAL' && <UserCheck size={16} color="var(--navy-800)" />}
            {activeRole === 'PUBLIC_VERIFIER' && <Search size={16} color="var(--navy-800)" />}
            
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as ActiveRole)}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 600,
                color: 'var(--navy-900)',
                cursor: 'pointer',
                outline: 'none',
                fontSize: '0.8rem'
              }}
            >
              <option value="AICTE_ADMIN">AICTE Apex Regulatory HQ</option>
              <option value="INSTITUTION_REGISTRAR">Institution Registrar (DIEAT Delhi)</option>
              <option value="STUDENT_PORTAL">Student Portal (Aarav Sharma)</option>
              <option value="PUBLIC_VERIFIER">Public / Employer Verification Desk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div style={{ borderTop: '1px solid var(--slate-200)', backgroundColor: '#ffffff', padding: '0.4rem 2rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'INTAKE_GUARD' ? 'active' : ''}`}
              onClick={() => onTabChange('INTAKE_GUARD')}
              title="Real-time seat counter per programme split by General, NRI, OCI, FN"
            >
              <Activity size={15} />
              Intake Guard (Seat Ledger)
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'GHOST_RADAR' ? 'active' : ''}`}
              onClick={() => onTabChange('GHOST_RADAR')}
              title="Detects overlapping enrollments & inactive ghost students"
            >
              <ShieldCheck size={15} />
              Ghost Enrolment Radar
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'ANOMALY_ENGINE' ? 'active' : ''}`}
              onClick={() => onTabChange('ANOMALY_ENGINE')}
              title="Explainable Anomaly Engine and Institutional Trust Scores"
            >
              <Activity size={15} />
              Anomaly Engine & Trust Score
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'DRY_RUN' ? 'active' : ''}`}
              onClick={() => onTabChange('DRY_RUN')}
              title="Pre-submission dry-run test uploader with data health score"
            >
              <FileCheck2 size={15} />
              Pre-Submission Dry-Run
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'AUDIT_CHAIN' ? 'active' : ''}`}
              onClick={() => onTabChange('AUDIT_CHAIN')}
              title="Tamper-evident hash-chained immutable audit log"
            >
              <FileCheck2 size={15} />
              Tamper-Evident Audit Chain
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'STUDENT_PASS' ? 'active' : ''}`}
              onClick={() => onTabChange('STUDENT_PASS')}
              title="Consent-gated verifiable QR academic pass"
            >
              <UserCheck size={15} />
              Verifiable Student Pass
            </button>
          </nav>

          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', gap: '0.75rem' }}>
            <span>Cycle: <strong style={{ color: 'var(--slate-700)' }}>2026-27 Autumn</strong></span>
            <span>•</span>
            <span>National Ingestion Cut-Off: <strong style={{ color: 'var(--slate-700)' }}>15 Nov 2026</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
