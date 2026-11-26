import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Eye,
  FileText,
  Filter,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { analysisApi } from '../api/endpoints';
import { AnalysisRecord } from '../types';
import { DataTable, Column } from '../components/ui/DataTable';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';
import { LoadingState, EmptyState } from '../components/ui/States';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const [items, setItems] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await analysisApi.getHistory({
        search: search || undefined,
        riskLevel: filterRisk !== 'All' ? filterRisk : undefined,
      });
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch {
      // Mock fallback
      setItems([
        {
          _id: '66a100000000000000000001',
          userId: 'usr_01',
          inputType: 'Ciphertext',
          sampleName: 'Banking_Payload_CBC.enc',
          inputSize: 24800,
          algorithm: 'AES-256-CBC',
          detectedCipherFamily: 'Block Cipher (Rijndael)',
          entropy: 7.94,
          securityScore: 92,
          riskLevel: 'Low',
          vulnerabilities: [],
          recommendations: [
            { title: 'Migrate to GCM', description: 'Enable GMAC integrity verification.', priority: 'Low' },
          ],
          status: 'Completed',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '66a100000000000000000002',
          userId: 'usr_01',
          inputType: 'File',
          sampleName: 'legacy_transaction_ecb.dat',
          inputSize: 8192,
          algorithm: 'DES-ECB (Legacy)',
          detectedCipherFamily: 'Electronic Codebook (ECB)',
          entropy: 6.12,
          securityScore: 35,
          riskLevel: 'Critical',
          vulnerabilities: [
            {
              title: 'ECB Pattern Leakage',
              severity: 'Critical',
              description: 'Identical plaintext blocks produce identical ciphertext blocks.',
              remediation: 'Migrate to AES-256-GCM.',
            },
          ],
          recommendations: [],
          status: 'Flagged',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterRisk]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await analysisApi.deleteById(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast('success', 'Record Deleted', 'Analysis audit record removed.');
      if (selectedRecord?._id === id) {
        setIsModalOpen(false);
      }
    } catch {
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast('info', 'Deleted Locally', 'Record removed from view.');
    }
  };

  const handleOpenDetail = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const columns: Column<AnalysisRecord>[] = [
    {
      header: 'Analysis ID',
      accessor: (row) => (
        <span className="font-mono text-cyan-400 text-xs">
          #{row._id ? row._id.slice(-6).toUpperCase() : 'REC-01'}
        </span>
      ),
    },
    {
      header: 'Sample / File',
      accessor: (row) => (
        <div>
          <p className="font-bold font-mono text-slate-100">{row.sampleName}</p>
          <span className="text-[10px] text-slate-400 font-mono">
            {row.inputType} ({row.inputSize} Bytes)
          </span>
        </div>
      ),
    },
    {
      header: 'Algorithm',
      accessor: (row) => <span className="font-mono text-slate-200 font-semibold">{row.algorithm}</span>,
    },
    {
      header: 'Security Score',
      accessor: (row) => (
        <span
          className={`font-bold font-mono text-xs ${
            row.securityScore >= 80 ? 'text-emerald-400' : row.securityScore >= 60 ? 'text-amber-400' : 'text-rose-400'
          }`}
        >
          {row.securityScore} / 100
        </span>
      ),
    },
    {
      header: 'Risk Level',
      accessor: (row) => <RiskBadge level={row.riskLevel} size="sm" />,
    },
    {
      header: 'Audit Date',
      accessor: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDetail(row)}
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Generate Assessment Report"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-cyan-400" />
            Cryptographic Audit History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete persistent log of previous cryptanalysis jobs, vulnerability assessments, and scoring records.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-mono flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
            placeholder="Search by sample name, algorithm, or input type (Press Enter)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Risk:
          </span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Audit Data Table */}
      {loading ? (
        <LoadingState message="Querying Persistent Audit Records..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No Audit Records Found"
          description="You haven't run any data analysis or cryptanalysis jobs matching your search criteria."
          actionText="Execute First Analysis"
          onAction={() => navigate('/data-analysis')}
        />
      ) : (
        <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(row) => row._id}
            onRowClick={handleOpenDetail}
          />
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Audit Record: ${selectedRecord.sampleName}`}
          subtitle={`ID: #${selectedRecord._id} | Executed: ${new Date(selectedRecord.createdAt).toLocaleString()}`}
          maxWidth="xl"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Security Score:</span>
              <span className="text-base font-bold text-cyan-400">{selectedRecord.securityScore} / 100</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Algorithm:</span>
                <p className="font-bold text-slate-200">{selectedRecord.algorithm}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">Shannon Entropy:</span>
                <p className="font-bold text-emerald-400">{selectedRecord.entropy} bits/byte</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-[11px] uppercase tracking-wider text-slate-400">Vulnerabilities Detected</h5>
              {selectedRecord.vulnerabilities?.length > 0 ? (
                selectedRecord.vulnerabilities.map((v, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">
                    <p className="font-bold">{v.title} [{v.severity}]</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{v.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-emerald-400">✓ Zero critical vulnerabilities logged.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/reports');
                }}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-lg text-xs"
              >
                Open Full Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
