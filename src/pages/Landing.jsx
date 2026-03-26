import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDF6F0] font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 py-3 bg-[#FDF6F0]/90 backdrop-blur-md border-b border-red-100">
  <Link to="/" className="flex items-center gap-2">
    <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
      </svg>
    </div>
    <div>
      <div className="font-bold text-gray-900 text-sm leading-tight">BloodConnect</div>
      <div className="text-[10px] text-gray-400 leading-tight hidden sm:block">Save lives, donate blood</div>
    </div>
  </Link>

  {/* Desktop links */}
  <div className="hidden lg:flex items-center gap-2">
    <Link to="/login" className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">
      Login
    </Link>
    <Link to="/register/donor" className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-600 transition-all">
      Register as Donor
    </Link>
    <Link to="/register/hospital" className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all">
      Register as Hospital
    </Link>
  </div>

  {/* Mobile links */}
  <div className="flex lg:hidden items-center gap-2">
    <Link to="/login" className="text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:text-red-600 transition-all">
      Login
    </Link>
    <Link to="/register/donor" className="text-xs font-medium text-white px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition-all">
      Register
    </Link>
  </div>
</nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Real-time donor matching
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-black text-gray-900 leading-none mb-6">
          Every drop<br/>
          <span className="text-red-600">saves a life.</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
          BloodConnect connects hospitals with nearby blood donors in real time —
          automatically matching blood types and notifying donors within seconds.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <Link to="/register/donor"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
            </svg>
            Become a Donor
          </Link>
          <Link to="/register/hospital"
            className="flex items-center gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 rounded-xl transition-all">
            Register as Hospital
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-12 flex-wrap justify-center pt-8 border-t border-red-100">
          {[
            { num: '5 km', label: 'Default radius' },
            { num: '56-day', label: 'Safety window' },
            { num: '8', label: 'Blood types' },
            { num: 'Real-time', label: 'Notifications' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-red-600">{s.num}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-red-500 mb-3">How it works</div>
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">From request to donor<br/>in seconds</h2>
          <p className="text-gray-400 mb-14 max-w-md">A seamless pipeline that bridges the gap between hospitals and life-saving donors nearby.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Hospital raises request',
                desc: 'Selects blood type, urgency level, units needed, and search radius up to 20 km.',
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Smart matching begins',
                desc: 'Haversine formula calculates distance. Blood type compatibility is checked automatically.',
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Donors get notified',
                desc: 'Eligible donors receive instant email with hospital name, distance, urgency and a response link.',
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Donor responds',
                desc: 'Donor logs in, reviews request details, and taps Accept or Decline. Hospital sees it instantly.',
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
              },
            ].map(card => (
              <div key={card.step} className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="absolute top-4 right-4 font-display text-6xl font-black text-red-50 leading-none select-none">
                  {card.step}
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO ARE YOU */}
      <section className="py-24 px-4 bg-[#FDF6F0]">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-red-500 mb-3">Get started</div>
          <h2 className="font-display text-4xl font-bold text-gray-900 mb-12">Who are you?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor */}
            <div className="bg-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5"></div>
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5"></div>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
                </svg>
              </div>
              <h3 className="font-display text-3xl font-bold mb-3">I'm a Donor</h3>
              <p className="text-red-100 text-sm leading-relaxed mb-6">
                Register once, get notified when hospitals nearby urgently need your blood type. Accept or decline right from your dashboard.
              </p>
              <ul className="space-y-2 mb-8">
                {['Instant email alerts when your blood is needed', 'See exact distance to requesting hospital', 'Toggle your availability anytime', '56-day safety rule auto-enforced'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-red-100">
                    <span className="text-white font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/register/donor"
                className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-all text-sm">
                Register as Donor →
              </Link>
            </div>

            {/* Hospital */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5"></div>
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5"></div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 className="font-display text-3xl font-bold mb-3">I'm a Hospital</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Raise blood requests in seconds and automatically reach compatible donors within your radius — no calls, no searching.
              </p>
              <ul className="space-y-2 mb-8">
                {['Raise requests with urgency levels', 'Auto-match by blood type & proximity', 'See real-time donor responses', 'Cancel or manage active requests'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-white font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to="/register/hospital"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-sm">
                Register as Hospital →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21C12 21 4 14.5 4 9.5C4 7.01 5.79 4 8.5 4C10.09 4 11.28 4.93 12 6.09C12.72 4.93 13.91 4 15.5 4C18.21 4 20 7.01 20 9.5C20 14.5 12 21 12 21Z"/>
                  </svg>
                </div>
                <span className="font-bold text-lg">BloodConnect</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Connecting hospitals with life-saving donors across India, one blood type at a time.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <h4 className="font-semibold text-sm mb-4">Donors</h4>
                <div className="flex flex-col gap-2">
                  <Link to="/register/donor" className="text-gray-400 text-sm hover:text-red-400 transition-colors">Register</Link>
                  <Link to="/login" className="text-gray-400 text-sm hover:text-red-400 transition-colors">Login</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-4">Hospitals</h4>
                <div className="flex flex-col gap-2">
                  <Link to="/register/hospital" className="text-gray-400 text-sm hover:text-red-400 transition-colors">Register</Link>
                  <Link to="/login" className="text-gray-400 text-sm hover:text-red-400 transition-colors">Login</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <p className="text-gray-500 text-xs">© 2026 BloodConnect · Built by Prashant Maurya · Spring Boot + React + PostgreSQL</p>
            <div className="flex gap-3">
              <Link to="/login" className="text-xs text-gray-400 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-all">Login</Link>
              <Link to="/register/donor" className="text-xs text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all">Register</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}