import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  FileCode,
  Printer,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Calendar,
  User as UserIcon,
  Layers,
  Wrench,
} from 'lucide-react';
import { reportApi, analysisApi } from '../api/endpoints';
import { ReportRecord, AnalysisRecord } from '../types';
import { RiskBadge } from '../components/ui/RiskBadge';
import { useToast } from '../hooks/useToast';
import { LoadingState, EmptyState } from '../components/ui/States';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // New report creation modal state
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('Cryptographic Security Assessment Report');
  const [assessorName, setAssessorName] = useState('Senior Cryptanalyst');
  const [targetSystem, setTargetSystem] = useState('Enterprise Database & Messaging Core');

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [repRes, anRes] = await Promise.all([
        reportApi.getAll(),
        analysisApi.getHistory({ limit: 10 }),
      ]);

      if (repRes.data.success) {
        setReports(repRes.data.data);
        if (repRes.data.data.length > 0) {
          setSelectedReport(repRes.data.data[0]);
        }
      }
      if (anRes.data.success) {
        setAnalyses(anRes.data.data);
      }
    } catch {
      // Fallback demo report for immediate visual display
      const fallbackReport: ReportRecord = {
        _id: 'rep_demo_01',
        userId: 'usr_01',
        reportTitle: 'Q3 Enterprise Cryptographic Posture Assessment',
        reportNumber: 'CS-REP-902144',
        reportData: {
          clientInfo: {
            assessorName: 'Lead Cryptanalyst',
            organization: 'CyberSec SOC Operations',
            targetSystem: 'Core Banking API & Storage Layer',
          },
          summary: {
            overallScore: 88,
            riskLevel: 'Low',
            criticalVulnerabilitiesCount: 0,
            highVulnerabilitiesCount: 0,
            entropyScore: 7.94,
          },
          technicalDetails: {
            algorithm: 'AES-256-CBC',
            keySize: '256-bit',
            mode: 'CBC',
            detectedCipherFamily: 'Modern Block Cipher (Rijndael)',
            entropy: 7.94,
            predictabilityScore: 2,
          },
          vulnerabilities: [
            {
              title: 'CBC Mode Without Cryptographic Authentication',
              severity: 'Medium',
              description: 'CBC mode ensures confidentiality but lacks ciphertext integrity verification, leaving it susceptible to padding oracle attacks if improperly deployed.',
              remediation: 'Migrate to AES-256-GCM (Galois/Counter Mode) with built-in authenticated GMAC tags.',
              cwe: 'CWE-327',
            },
          ],
          aiRecommendations: {
            primaryAlgorithm: 'AES-256-GCM',
            recommendedKeySize: '256-bit',
            rationale: 'Galois/Counter Mode (GCM) provides AEAD (Authenticated Encryption with Associated Data), preventing ciphertext tampering while sustaining hardware-accelerated wire speeds.',
          },
          actionPlan: [
            'Enforce AES-256-GCM across all transactional microservices.',
            'Schedule automated key rollover every 90 days.',
            'Enforce CSPRNG for all Initialization Vectors and salt generation.',
            'Conduct quarterly statistical entropy audits on database encrypted columns.',
          ],
        },
        createdAt: new Date().toISOString(),
      };
      setReports([fallbackReport]);
      setSelectedReport(fallbackReport);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await reportApi.createReport({
        analysisId: selectedAnalysisId || undefined,
        reportTitle,
        clientInfo: {
          assessorName,
          targetSystem,
          organization: 'CyberSec SOC Center',
        },
      });

      if (res.data.success) {
        showToast('success', 'Report Created', 'Assessment report generated and cataloged.');
        setReports((prev) => [res.data.data, ...prev]);
        setSelectedReport(res.data.data);
      }
    } catch (err: any) {
      showToast('error', 'Generation Error', err.response?.data?.message || 'Failed to build report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedReport) return;
    try {
      showToast('info', 'Preparing PDF', 'Compiling PDF document stream...');
      const res = await reportApi.downloadPdf(selectedReport._id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CipherSense-Report-${selectedReport.reportNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('success', 'PDF Downloaded', 'Assessment report downloaded successfully.');
    } catch {
      showToast('error', 'Download Error', 'Could not download PDF from server.');
    }
  };

  const handleExportJson = async () => {
    if (!selectedReport) return;
    try {
      const jsonStr = JSON.stringify(selectedReport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CipherSense-Report-${selectedReport.reportNumber}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('success', 'JSON Exported', 'JSON data schema exported.');
    } catch {
      showToast('error', 'Export Error', 'Failed to export JSON report.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState message="Loading Cryptographic Assessment Reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Module 5: Security Assessment Report Generation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compile executive audit summaries, technical entropy findings, vulnerability telemetry, and PDF dossiers.
          </p>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          Create New Security Assessment Report
        </h3>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Target Analysis Audit</label>
            <select
              value={selectedAnalysisId}
              onChange={(e) => setSelectedAnalysisId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
            >
              <option value="">Latest Cryptanalysis Telemetry</option>
              {analyses.map((an) => (
                <option key={an._id} value={an._id}>
                  {an.sampleName} ({an.algorithm} - {an.securityScore}/100)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Assessor Name</label>
            <input
              type="text"
              value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={generating}
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-lg text-xs font-mono transition-all shadow-cyan-glow flex items-center justify-center gap-1.5 disabled:opacity-50 h-[38px]"
            >
              <FileText className="w-4 h-4" />
              <span>{generating ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main Report View / Layout */}
      {selectedReport && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0B1120] border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Viewing Report:</span>
              <span className="text-xs font-bold font-mono text-cyan-400">{selectedReport.reportNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-purple-400" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Styled Document Sheet Preview */}
          <div className="cyber-card rounded-2xl p-8 border border-slate-800 space-y-6 shadow-2xl bg-[#090E1A]">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-slate-800 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  CIPHERSENSE CYBERSECURITY DOSSIER
                </span>
                <h3 className="text-2xl font-bold font-mono text-slate-100">{selectedReport.reportTitle}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Report ID: {selectedReport.reportNumber} | Date: {new Date(selectedReport.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right font-mono">
                <RiskBadge level={selectedReport.reportData?.summary?.riskLevel || 'Low'} size="lg" />
                <p className="text-xs text-slate-400 mt-2">
                  Security Rating:{' '}
                  <span className="text-emerald-400 font-bold text-base">
                    {selectedReport.reportData?.summary?.overallScore || 88} / 100
                  </span>
                </p>
              </div>
            </div>

            {/* 1. Client & Target Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                1. Assessment Scope & Target System
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Lead Assessor:</span>
                  <p className="font-semibold text-slate-200">{selectedReport.reportData?.clientInfo?.assessorName}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Target Architecture:</span>
                  <p className="font-semibold text-slate-200">{selectedReport.reportData?.clientInfo?.targetSystem}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Security Mandate:</span>
                  <p className="font-semibold text-cyan-400">NIST SP 800-57 & FIPS 140-3</p>
                </div>
              </div>
            </div>

            {/* 2. Technical Cryptanalysis Findings */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                2. Technical Cryptanalysis Findings
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Algorithm:</span>
                  <p className="font-bold text-slate-100">{selectedReport.reportData?.technicalDetails?.algorithm}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Key Strength:</span>
                  <p className="font-bold text-cyan-400">{selectedReport.reportData?.technicalDetails?.keySize}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Shannon Entropy:</span>
                  <p className="font-bold text-emerald-400">{selectedReport.reportData?.technicalDetails?.entropy} bits/byte</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Predictability:</span>
                  <p className="font-bold text-slate-200">{selectedReport.reportData?.technicalDetails?.predictabilityScore}%</p>
                </div>
              </div>
            </div>

            {/* 3. Vulnerability Findings */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                3. Identified Cryptographic Weaknesses & CWE Telemetry
              </h4>
              {selectedReport.reportData?.vulnerabilities?.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold font-mono text-slate-100">{v.title}</h5>
                    <RiskBadge level={v.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300">{v.description}</p>
                  <p className="text-xs text-emerald-400 font-mono">Remediation: {v.remediation}</p>
                </div>
              ))}
            </div>

            {/* 4. Action Plan */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                4. Strategic Hardening Action Plan
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedReport.reportData?.actionPlan?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
