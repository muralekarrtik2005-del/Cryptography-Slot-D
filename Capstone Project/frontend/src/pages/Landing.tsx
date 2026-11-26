import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit, Binary, Lock, FileText, Activity, ArrowRight, Cpu, Check, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const features = [
    ['AI recommendations', 'Choose the right cipher suite from sensitivity, threat model and throughput needs.', BrainCircuit],
    ['Cryptanalysis', 'Measure entropy, coincidence, character distribution and block-pattern leakage.', Binary],
    ['Threat detection', 'Find weak ciphers, key sizes and ECB risks mapped to CWE remediation.', ShieldCheck],
    ['Cipher operations', 'Encrypt or decrypt with AES, ChaCha20, 3DES and RSA benchmarked in real time.', Lock],
    ['Security scoring', 'Turn cryptographic evidence into a clear 0–100 resilience score.', Activity],
    ['Audit reports', 'Create polished PDF dossiers and structured JSON assessment exports.', FileText],
  ] as const;
  const workflow = ['Ingest payload', 'Normalize data', 'Recommend cipher', 'Inspect risk', 'Export report'];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-[#a8ff78] selection:text-[#08110f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#08110f]/90 backdrop-blur-xl">
        <div className="max-w-[1180px] h-20 mx-auto px-5 md:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#a8ff78] text-[#08110f] flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
            <div><p className="text-[14px] font-bold tracking-[0.16em]">CIPHERSENSE</p><p className="text-[9px] text-[#688078] tracking-[0.18em] uppercase">Security intelligence</p></div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3.5 py-2 text-[12px] font-semibold text-[#b2c1bb] hover:text-white">Sign in</Link>
            <Link to="/register" className="h-10 px-4 flex items-center gap-2 rounded-xl bg-[#a8ff78] text-[#08110f] text-[12px] font-bold hover:bg-[#bbff9b]">Get started <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28 px-5 md:px-8 cyber-grid">
          <div className="absolute top-24 right-[8%] w-72 h-72 rounded-full bg-[#56dca5]/[0.07] blur-[80px]" />
          <div className="max-w-[1180px] mx-auto grid lg:grid-cols-[1.18fr_.82fr] gap-10 items-center">
            <div className="relative z-10">
              <div className="motion-rise inline-flex items-center gap-2 h-8 px-3 rounded-full border border-[#a8ff78]/15 bg-[#a8ff78]/[0.06] text-[#baff94] text-[10px] font-mono uppercase tracking-[0.12em]"><span className="status-pulse w-1.5 h-1.5 rounded-full bg-[#a8ff78]" />AI-powered cryptographic workspace</div>
              <h1 className="motion-enter mt-7 text-[42px] sm:text-[64px] lg:text-[72px] leading-[0.94] font-semibold tracking-[-0.055em] text-white">Understand every<br/><span className="cyber-gradient-text">cipher decision.</span></h1>
              <p className="motion-rise motion-rise-2 mt-7 max-w-xl text-[15px] md:text-[17px] leading-7 text-[#99aaa3]">Assess cryptographic strength, uncover vulnerabilities and choose secure algorithms from one calm, unified security workspace.</p>
              <div className="motion-rise motion-rise-3 mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="glow-button h-12 px-5 flex items-center gap-2 rounded-[14px] bg-[#a8ff78] text-[#08110f] text-[13px] font-bold hover:bg-[#bbff9b]"><Cpu className="w-4 h-4" />Start assessment</Link>
                <Link to="/dashboard" className="h-12 px-5 flex items-center gap-2 rounded-[14px] border border-white/[0.09] bg-white/[0.035] text-[13px] font-semibold hover:bg-white/[0.07] hover:border-[#a8ff78]/25 hover:-translate-y-0.5">Explore workspace <ArrowRight className="w-4 h-4 text-[#56dca5]" /></Link>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="absolute -inset-6 rounded-full border border-[#a8ff78]/[0.04] orbit-ring" />
              <div className="relative cyber-card-glow scan-line float-slow motion-enter-late rounded-[28px] p-5 md:p-6">
                <div className="flex items-center justify-between pb-5 border-b border-white/[0.07]">
                  <div><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#688078]">Security posture</p><p className="mt-1 text-[18px] font-semibold">Assessment ready</p></div>
                  <div className="w-12 h-12 rounded-full border border-[#a8ff78]/30 bg-[#a8ff78]/[0.08] flex items-center justify-center text-[#a8ff78]"><Zap className="w-5 h-5" /></div>
                </div>
                <div className="py-6 grid grid-cols-[132px_1fr] gap-5 items-center">
                  <div className="relative w-[132px] h-[132px] rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#a8ff78 0 87%, rgba(255,255,255,.07) 87% 100%)' }}>
                    <div className="w-[112px] h-[112px] rounded-full bg-[#0d1714] flex flex-col items-center justify-center"><span className="text-[34px] font-semibold tracking-tight">87</span><span className="text-[9px] font-mono text-[#688078] uppercase">Security</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px]"><span className="text-[#91a39b]">Entropy</span><b className="text-[#baff94]">92%</b></div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="progress-shimmer h-full w-[92%] rounded-full bg-[#a8ff78]" /></div>
                    <div className="flex justify-between text-[11px]"><span className="text-[#91a39b]">Key strength</span><b className="text-[#73b7ff]">Strong</b></div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="progress-shimmer h-full w-[88%] rounded-full bg-[#73b7ff]" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[9px] text-[#688078]">ANALYZED</p><p className="mt-1 text-[18px] font-semibold">128</p></div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[9px] text-[#688078]">RISKS</p><p className="mt-1 text-[18px] font-semibold text-[#f59e7a]">7</p></div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[9px] text-[#688078]">REPORTS</p><p className="mt-1 text-[18px] font-semibold">12</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-20 border-t border-white/[0.07]">
          <div className="max-w-[1180px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#a8ff78]">Core toolkit</p><h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">One workspace. Full clarity.</h2></div><p className="max-w-md text-[13px] leading-6 text-[#91a39b]">From raw ciphertext to an exportable security dossier, every stage is designed for fast expert review.</p></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map(([title, description, Icon]) => <article key={title} className="cyber-card group rounded-[20px] p-5 md:p-6"><div className="w-10 h-10 rounded-[13px] border border-[#a8ff78]/12 bg-[#a8ff78]/[0.07] text-[#a8ff78] flex items-center justify-center group-hover:scale-105"><Icon className="w-5 h-5" /></div><h3 className="mt-5 text-[15px] font-semibold">{title}</h3><p className="mt-2 text-[12px] leading-5 text-[#91a39b]">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="px-5 md:px-8 py-16 border-y border-white/[0.07] bg-white/[0.012]">
          <div className="max-w-[1180px] mx-auto"><p className="text-[10px] uppercase tracking-[0.18em] text-[#688078] mb-5">Assessment flow</p><div className="grid sm:grid-cols-5 gap-2">{workflow.map((step, index) => <div key={step} className="relative rounded-2xl border border-white/[0.07] bg-[#0d1714] px-4 py-5"><p className="text-[9px] font-mono text-[#688078]">0{index + 1}</p><p className="mt-4 text-[12px] font-semibold">{step}</p></div>)}</div></div>
        </section>
      </main>

      <footer className="max-w-[1180px] h-24 px-5 md:px-8 mx-auto flex items-center justify-between text-[11px] text-[#688078]"><p>© 2026 CipherSense</p><p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#56dca5]" />FIPS-ready assessment core</p></footer>
    </div>
  );
};
