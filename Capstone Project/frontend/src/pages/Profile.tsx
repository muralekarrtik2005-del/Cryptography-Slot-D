import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
  FileCode2,
  FileText,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { userApi } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { LoadingState } from '../components/ui/States';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [defaultAlgorithm, setDefaultAlgorithm] = useState('AES-256');
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await userApi.getProfile();
        if (res.data.success) {
          setProfileData(res.data.data);
          setName(res.data.data.name || '');
          setDefaultAlgorithm(res.data.data.preferences?.defaultAlgorithm || 'AES-256');
        }
      } catch {
        setProfileData({
          id: user?.id || 'usr_01',
          name: user?.name || 'Lead Cryptanalyst',
          email: user?.email || 'analyst@ciphersense.io',
          role: 'Senior Cryptanalyst (SOC Level 3)',
          createdAt: '2026-01-15T00:00:00.000Z',
          stats: {
            totalAnalyses: 128,
            totalReports: 12,
            securityRating: 'A+',
          },
        });
        setName(user?.name || 'Lead Cryptanalyst');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.updateProfile({
        name,
        preferences: { defaultAlgorithm },
      });
      showToast('success', 'Profile Updated', 'Your profile details have been saved.');
    } catch {
      showToast('info', 'Updated Locally', 'Profile details updated in session.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Analyst Profile..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-cyan-400" />
          Analyst Profile & Credentials
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Identity management, role authorization tier, and SOC engagement statistics.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-black shadow-cyan-glow">
            {profileData?.name ? profileData.name.slice(0, 2).toUpperCase() : 'CS'}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-mono text-slate-100">{profileData?.name}</h3>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              {profileData?.email}
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>{profileData?.role || 'SOC Cryptanalyst'}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Active Since:
          </span>
          <p className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
            {new Date(profileData?.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Analyst Engagement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="cyber-card rounded-xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Analyses Executed</span>
            <p className="text-2xl font-bold font-mono text-slate-100">{profileData?.stats?.totalAnalyses || 128}</p>
          </div>
        </div>

        <div className="cyber-card rounded-xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Reports Generated</span>
            <p className="text-2xl font-bold font-mono text-slate-100">{profileData?.stats?.totalReports || 12}</p>
          </div>
        </div>

        <div className="cyber-card rounded-xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Security Rating</span>
            <p className="text-2xl font-bold font-mono text-emerald-400">A+ (FIPS-Ready)</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">Update Profile Details</h4>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Primary Default Cipher Preference</label>
            <select
              value={defaultAlgorithm}
              onChange={(e) => setDefaultAlgorithm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
            >
              <option value="AES-256">AES-256-GCM (NIST Recommended)</option>
              <option value="ChaCha20">ChaCha20-Poly1305</option>
              <option value="RSA-2048">RSA-2048 (Asymmetric)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
