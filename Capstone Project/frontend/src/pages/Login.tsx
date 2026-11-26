import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('warning', 'Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('success', 'Authenticated', 'Welcome to CipherSense SOC Dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(
        'error',
        'Authentication Failed',
        err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('analyst@ciphersense.io');
    setPassword('CyberSec2026!');
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4 md:p-8 text-slate-100">
      <div className="w-full max-w-[920px] min-h-[560px] grid lg:grid-cols-[1fr_420px] rounded-[28px] overflow-hidden border border-white/[0.07] bg-[#0d1714] shadow-[0_30px_90px_rgba(0,0,0,.28)]">
        <div className="hidden lg:flex relative flex-col justify-between p-10 border-r border-white/[0.07] overflow-hidden">
          <div className="absolute -left-24 bottom-[-120px] w-80 h-80 rounded-full border border-[#a8ff78]/10" />
          <div className="absolute left-16 bottom-[-60px] w-52 h-52 rounded-full border border-[#56dca5]/10" />
          <Link to="/" className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#a8ff78] text-[#08110f] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-bold tracking-[0.16em]">CIPHERSENSE</span>
          </Link>
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#a8ff78]">Secure workspace</p>
            <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-[1.08] tracking-[-0.035em]">
              Your cryptographic
              <br />
              assessment hub.
            </h2>
            <p className="mt-5 max-w-sm text-[13px] leading-6 text-[#91a39b]">
              Analyze, benchmark and report on cryptographic security from one focused workspace.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-[11px] text-[#688078]">
            <span className="status-pulse w-2 h-2 rounded-full bg-[#a8ff78]" />
            SOC engine available
          </div>
        </div>

        <div className="p-6 sm:p-9 lg:p-10 flex flex-col justify-center">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#a8ff78] text-[#08110f] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-[0.16em]">CIPHERSENSE</span>
          </div>
          <div className="mb-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#688078]">Analyst access</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-[12px] text-[#91a39b]">Sign in to continue to the security workspace.</p>
          </div>

          {/* Login Form Card */}
          <div className="cyber-card rounded-[20px] p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Analyst email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#688078] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@ciphersense.io"
                    required
                    className="w-full ui-input pl-10 pr-4 py-2.5 text-[12px] text-slate-100 placeholder:text-[#688078]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">Password</label>
                  <span className="text-[10px] text-[#91a39b]">Forgot password?</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#688078] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full ui-input pl-10 pr-4 py-2.5 text-[12px] text-slate-100 placeholder:text-[#688078]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#a8ff78] hover:bg-[#bbff9b] text-[#08110f] font-bold rounded-xl text-[12px] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#08110f] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/[0.07]">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full h-10 bg-white/[0.025] hover:bg-white/[0.055] text-[#baff94] border border-white/[0.07] rounded-xl text-[11px] font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use demo credentials</span>
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-[#688078]">
            No analyst account?{' '}
            <Link to="/register" className="text-[#baff94] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
