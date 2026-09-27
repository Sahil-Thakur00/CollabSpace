import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME_JWT_TOKEN } from '@/constants';

export const metadata = {
  title: 'CollabSpace — Real-time Collaborative Workspace',
  description: 'Collaborate with your team in real time. Create boards, drop sticky notes, and chat live — all in one space.',
};

export default async function LandingPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(COOKIE_NAME_JWT_TOKEN);
  if (jwt) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white">

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-extrabold text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="gradient-text">CollabSpace</span>
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/auth/signup" className="px-5 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="hero-gradient min-h-screen flex items-center justify-center px-6 text-center pt-20">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Real-time collaboration
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up animate-delay-100"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your team's<br />
            <span className="gradient-text">shared workspace</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
            Drop sticky notes, drag ideas around, and talk to teammates live —
            all in a beautifully simple canvas. Built for focus, not friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Link href="/auth/signup" className="px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 hover:scale-105 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              Start for free →
            </Link>
            <Link href="/auth/signup/guest" className="px-8 py-4 rounded-2xl text-base font-medium transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}>
              Try as guest
            </Link>
          </div>

          {/* Mock board preview */}
          <div className="mt-20 relative animate-float">
            <div className="rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-3xl"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                <span className="ml-3 text-xs text-gray-500">collabspace.app/boards/team-sprint</span>
              </div>
              <div className="p-6 sketchbook-bg relative" style={{ minHeight: '260px', backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                {/* Sticky notes */}
                <div className="absolute top-8 left-12 w-36 p-3 rounded-xl shadow-lg rotate-[-2deg] hover-lift" style={{ background: '#fef08a', color: '#374151' }}>
                  <p className="text-xs font-medium">🚀 Ship v2 by Friday</p>
                </div>
                <div className="absolute top-14 left-48 w-36 p-3 rounded-xl shadow-lg rotate-[1.5deg] hover-lift" style={{ background: '#bbf7d0', color: '#374151' }}>
                  <p className="text-xs font-medium">✅ API integration done</p>
                </div>
                <div className="absolute top-6 right-24 w-36 p-3 rounded-xl shadow-lg rotate-[-1deg] hover-lift" style={{ background: '#e9d5ff', color: '#374151' }}>
                  <p className="text-xs font-medium">💡 Add dark mode</p>
                </div>
                <div className="absolute bottom-10 left-24 w-36 p-3 rounded-xl shadow-lg rotate-[2deg] hover-lift" style={{ background: '#fed7aa', color: '#374151' }}>
                  <p className="text-xs font-medium">📝 Write docs</p>
                </div>
                <div className="absolute bottom-6 right-16 w-36 p-3 rounded-xl shadow-lg rotate-[-1.5deg] hover-lift" style={{ background: '#bae6fd', color: '#374151' }}>
                  <p className="text-xs font-medium">🎨 Update UI</p>
                </div>
                {/* Live user avatars */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold" style={{ background: '#6366f1' }}>A</div>
                    <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold" style={{ background: '#8b5cf6' }}>B</div>
                    <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold" style={{ background: '#06b6d4' }}>C</div>
                  </div>
                  <span className="text-xs text-gray-500">3 online</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 80px rgba(99,102,241,0.2)' }}></div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0d0d1a' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#818cf8' }}>Why CollabSpace</p>
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Everything your team needs,<br />
            <span className="gradient-text">nothing you don't</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Real-time sync', desc: 'Every note, every drag — synced to all teammates instantly via Socket.io. Zero lag.' },
              { icon: '🎯', title: 'Drag & drop canvas', desc: 'Place sticky notes anywhere. Drag them around. The board is your team\'s shared brain.' },
              { icon: '🎙️', title: 'Built-in voice chat', desc: 'No external tools. WebRTC peer-to-peer voice built right into every board.' },
              { icon: '🔗', title: 'Share in one click', desc: 'One 8-character code invites anyone to your board. No accounts required for guests.' },
              { icon: '🖼️', title: 'Export as PNG', desc: 'Capture your entire board as a clean PNG with one click. Great for standups.' },
              { icon: '🔒', title: 'Secure by default', desc: 'JWT auth, bcrypt passwords, and per-board access control keep your work private.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl hover-lift" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack strip ───────────────────────── */}
      <section className="py-12 px-6" style={{ background: 'rgba(99,102,241,0.05)', borderTop: '1px solid rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-400">
            {['Next.js 15', 'Express.js', 'MongoDB Atlas', 'Socket.io', 'WebRTC', 'TypeScript', 'Mongoose', 'JWT'].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to collaborate?
          </h2>
          <p className="text-gray-400 mb-10">
            Free to use. No credit card required.
          </p>
          <Link href="/auth/signup" className="inline-block px-10 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 40px rgba(99,102,241,0.3)' }}>
            Create your first board →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="py-8 text-center text-sm text-gray-600" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="gradient-text font-bold">CollabSpace</span> &nbsp;·&nbsp; Built with the MERN stack &nbsp;·&nbsp; &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
