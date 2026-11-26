import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Filter,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { analysisApi, dashboardApi } from '../api/endpoints';
import { AnalysisRecord, DashboardData } from '../types';
import { SecurityScoreCard } from '../components/ui/SecurityScoreCard';
import { ChartCard } from '../components/ui/ChartCard';
import { DataTable, Column } from '../components/ui/DataTable';
import { RiskBadge } from '../components/ui/RiskBadge';
import { useNavigate } from 'react-router-dom';

export const SecurityDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashRes, histRes] = await Promise.all([
          dashboardApi.getStats(),
          analysisApi.getHistory({ limit: 15 }),
        ]);

        if (dashRes.data.success) setDashboardData(dashRes.data.data);
        if (histRes.data.success) setHistory(histRes.data.data);
      } catch {
        // Mock fallback
        setHistory([
          {
            _id: 'an_01',
            userId: 'usr_01',
            inputType: 'Ciphertext',
            sampleName: 'banking_auth_token.bin',
            inputSize: 1024,
            algorithm: 'AES-256-GCM',
            detectedCipherFamily: 'Modern Block Cipher',
            entropy: 7.96,
            securityScore: 95,
            riskLevel: 'Low',
            vulnerabilities: [],
            recommendations: [],
            status: 'Completed',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'an_02',
            userId: 'usr_01',
            inputType: 'File',
            sampleName: 'legacy_passwords.ecb',
            inputSize: 4096,
            algorithm: 'DES-ECB',
            detectedCipherFamily: 'Electronic Codebook',
            entropy: 5.40,
            securityScore: 35,
            riskLevel: 'Critical',
            vulnerabilities: [],
            recommendations: [],
            status: 'Flagged',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            _id: 'an_03',
            userId: 'usr_01',
            inputType: 'Ciphertext',
            sampleName: 'vpn_session_handshake.enc',
            inputSize: 512,
            algorithm: 'ChaCha20-Poly1305',
            detectedCipherFamily: 'Stream Cipher',
            entropy: 7.98,
            securityScore: 98,
            riskLevel: 'Low',
            vulnerabilities: [],
            recommendations: [],
            status: 'Completed',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const timelineData = [
    { date: 'Aug 18', critical: 2, high: 3, medium: 4 },
    { date: 'Aug 19', critical: 1, high: 4, medium: 3 },
    { date: 'Aug 20', critical: 0, high: 2, medium: 5 },
    { date: 'Aug 21', critical: 1, high: 1, medium: 2 },
    { date: 'Aug 22', critical: 0, high: 1, medium: 3 },
    { date: 'Aug 23', critical: 0, high: 0, medium: 2 },
    { date: 'Aug 24', critical: 0, high: 1, medium: 1 },
  ];

  const algorithmComparison = [
    { name: 'AES-256', security: 98, performance: 92, keyStrength: 99 },
    { name: 'ChaCha20', security: 96, performance: 97, keyStrength: 99 },
    { name: 'AES-128', security: 88, performance: 98, keyStrength: 85 },
    { name: 'RSA-2048', security: 90, performance: 45, keyStrength: 90 },
    { name: '3DES', security: 35, performance: 40, keyStrength: 42 },
  ];

  const filteredHistory = history.filter((item) => {
    if (selectedAlgo !== 'All' && !item.algorithm.toLowerCase().includes(selectedAlgo.toLowerCase())) return false;
    if (selectedRisk !== 'All' && item.riskLevel !== selectedRisk) return false;
    return true;
  });

  const columns: Column<AnalysisRecord>[] = [
    {
      header: 'Sample / Target',
      accessor: (row) => (
        <div>
          <p className="font-bold font-mono text-slate-100">{row.sampleName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.inputType} ({row.inputSize} B)</span>
        </div>
      ),
    },
    {
      header: 'Algorithm',
      accessor: (row) => <span className="font-mono text-cyan-400">{row.algorithm}</span>,
    },
    {
      header: 'Score',
      accessor: (row) => (
        <span className={`font-bold font-mono ${row.securityScore >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {row.securityScore} / 100
        </span>
      ),
    },
    {
      header: 'Risk Level',
      accessor: (row) => <RiskBadge level={row.riskLevel} size="sm" />,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {row.status || 'Completed'}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Security Dashboard & Threat Visualization
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Holistic threat telemetry, algorithm resilience metrics, and risk distribution analysis.
          </p>
        </div>
      </div>

      {/* Top Visual Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SecurityScoreCard
          score={dashboardData?.overallSecurityScore || 87}
          status={dashboardData?.status || 'Secure'}
          size="large"
        />

        {/* Risk Distribution Donut */}
        <ChartCard
          title="Risk Level Distribution"
          subtitle="Proportion of assessed assets by risk severity"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={
                  dashboardData?.charts.riskLevelDistribution || [
                    { level: 'Secure', count: 85, color: '#10B981' },
                    { level: 'Warning', count: 28, color: '#F59E0B' },
                    { level: 'High Risk', count: 10, color: '#F97316' },
                    { level: 'Critical', count: 5, color: '#EF4444' },
                  ]
                }
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="level"
              >
                {(dashboardData?.charts.riskLevelDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Comparison & Timeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-metric algorithm comparison */}
        <ChartCard
          title="Algorithm Attribute Comparison"
          subtitle="Security strength vs Execution throughput vs Key resilience (0 - 100)"
        >
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={algorithmComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="security" fill="#10B981" radius={[4, 4, 0, 0]} name="Security Rating" />
              <Bar dataKey="performance" fill="#00F0FF" radius={[4, 4, 0, 0]} name="Performance Score" />
              <Bar dataKey="keyStrength" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Key Strength" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vulnerability Timeline */}
        <ChartCard
          title="Vulnerability Discovery Timeline"
          subtitle="Weekly trend of identified CWE flaws and remediation progress"
        >
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} name="Critical" />
              <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} name="High Risk" />
              <Line type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2} name="Medium" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filterable Security History Table */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Recent Cryptographic Audit Records
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Filter and review previous analysis telemetry records.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
            >
              <option value="All">All Ciphers</option>
              <option value="AES">AES</option>
              <option value="ChaCha20">ChaCha20</option>
              <option value="DES">DES / 3DES</option>
              <option value="RSA">RSA</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredHistory}
          keyExtractor={(row) => row._id}
          onRowClick={(row) => navigate('/cryptanalysis')}
        />
      </div>
    </div>
  );
};
