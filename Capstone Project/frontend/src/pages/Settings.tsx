import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Bell,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { userApi } from '../api/endpoints';
import { useToast } from '../hooks/useToast';

export const Settings: React.FC = () => {
  // Notification toggles
  const [vulnAlerts, setVulnAlerts] = useState(true);
  const [entropyAlerts, setEntropyAlerts] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [zeroKeyRetention, setZeroKeyRetention] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const { showToast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('warning', 'Missing Fields', 'Please enter your current and new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', 'Mismatch', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      showToast('warning', 'Weak Password', 'New password must be at least 6 characters.');
      return;
    }

    setPwLoading(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      showToast('success', 'Password Changed', 'Your master password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.response?.data?.message || 'Password update failed.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSavePreferences = () => {
    showToast('success', 'Preferences Saved', 'SOC preferences and threat notification thresholds updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          SOC Security Settings & System Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure real-time cryptanalysis alert thresholds, key retention compliance, and credentials.
        </p>
      </div>

      {/* Security & Threat Telemetry Preferences */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Cryptographic Policy & Threat Detection
        </h3>

        <div className="space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="font-bold text-slate-200">Zero Key Retention Compliance</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically purge all symmetric keys and RSA private keys from server RAM post-execution.
              </p>
            </div>
            <input
              type="checkbox"
              checked={zeroKeyRetention}
              onChange={(e) => setZeroKeyRetention(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="font-bold text-slate-200">Automatic File Cryptanalysis</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Trigger Shannon entropy and block periodicity calculation instantly upon file upload.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoAnalysis}
              onChange={(e) => setAutoAnalysis(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="font-bold text-slate-200">Critical Vulnerability Alerts</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Notify when DES, 3DES, or ECB mode pattern leaks are detected in data samples.
              </p>
            </div>
            <input
              type="checkbox"
              checked={vulnAlerts}
              onChange={(e) => setVulnAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="font-bold text-slate-200">Sub-Optimal Entropy Warnings (&lt; 7.5 b/B)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Flag ciphertexts exhibiting low randomness or biased character distributions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={entropyAlerts}
              onChange={(e) => setEntropyAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-semibold transition-colors"
        >
          Save SOC Preferences
        </button>
      </div>

      {/* Change Password Form */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          Change Analyst Master Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs font-mono transition-all shadow-cyan-glow flex items-center gap-1.5 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{pwLoading ? 'Updating Password...' : 'Update Master Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
