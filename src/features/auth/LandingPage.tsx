import { Link } from 'react-router-dom';
import pugLogo from '../../assets/pug-logo.jpeg';

// ─── Paleta extraída del logo ──────────────────────────────────────────────
// #6B4FA0 — púrpura profundo (capa, anillo exterior)
// #9B6DC5 — lavanda media (escudo, corazones)
// #F5EFD6 — crema cálida (fondo interior)
// #D4B896 — beige dorado (piel del pug)
// #3D2314 — marrón oscuro (nariz, orejas)

const FEATURES = [
  {
    icon: 'pi-shield',
    title: 'Protección en tiempo real',
    desc: 'Analizamos cada mensaje sospechoso antes de que sea demasiado tarde.',
    iconBg: '#6B4FA0',
  },
  {
    icon: 'pi-bell',
    title: 'Alertas al instante',
    desc: 'Notificaciones inmediatas cuando detectamos contenido de riesgo para los tuyos.',
    iconBg: '#9B6DC5',
  },
  {
    icon: 'pi-users',
    title: 'Para toda la familia',
    desc: 'Protege a adultos mayores, menores y cualquier persona vulnerable.',
    iconBg: '#6B4FA0',
  },
];

const HOW_IT_WORKS = [
  { n: '1', icon: 'pi-user-plus', title: 'Crea tu cuenta', desc: 'Regístrate en minutos. Sin tarjeta de crédito.' },
  { n: '2', icon: 'pi-send', title: 'Conecta a tu familia', desc: 'Agrega a quien quieres proteger con nuestro bot de Telegram.' },
  { n: '3', icon: 'pi-check-circle', title: 'Recibe alertas', desc: 'PugGuardian analiza mensajes 24/7 y te avisa al instante.' },
];

const TESTIMONIALS = [
  { quote: '"PugGuardian me avisa al instante cuando mi mamá recibe algo sospechoso. Me da una tranquilidad enorme."', name: 'María G.', role: 'Usuaria activa', initials: 'MG' },
  { quote: '"Fácil de configurar y funciona de verdad. Bloqueé un intento de fraude la primera semana."', name: 'Carlos R.', role: 'Usuario verificado', initials: 'CR' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen antialiased" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(107,79,160,0.92)', borderBottom: '1px solid rgba(245,239,214,0.2)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(245,239,214,0.5)' }} />
              <img src={pugLogo} alt="PugGuardian" className="relative w-9 h-9 rounded-full object-cover" style={{ border: '2px solid rgba(245,239,214,0.7)' }} />
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#F5EFD6' }}>PugGuardian</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/15" style={{ color: '#F5EFD6' }}>
              Iniciar sesión
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px"
              style={{ background: '#F5EFD6', color: '#6B4FA0', boxShadow: '0 4px 16px rgba(61,35,20,0.3)' }}
            >
              Regístrate gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ background: 'linear-gradient(160deg, #3D2314 0%, #6B4FA0 40%, #9B6DC5 100%)' }}
      >
        {/* Grid pattern en crema */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,239,214,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,214,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />
        {/* Glow orbs con colores del logo */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(155,109,197,0.35)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(212,184,150,0.2)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-10"
            style={{ background: 'rgba(245,239,214,0.15)', border: '1px solid rgba(245,239,214,0.4)', color: '#F5EFD6' }}
          >
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Protección digital de nueva generación
          </div>

          {/* LOGO GRANDE */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              {/* Glow crema/dorada */}
              <div className="absolute inset-0 rounded-full blur-3xl scale-[2.5]" style={{ background: 'rgba(212,184,150,0.45)' }} />
              <div className="absolute inset-0 rounded-full blur-xl scale-[1.8]" style={{ background: 'rgba(245,239,214,0.3)' }} />
              {/* Rings */}
              <div className="absolute inset-0 rounded-full scale-[1.3]" style={{ border: '1px solid rgba(245,239,214,0.4)' }} />
              <div className="absolute inset-0 rounded-full scale-[1.6]" style={{ border: '1px solid rgba(245,239,214,0.2)' }} />
              <div className="absolute inset-0 rounded-full scale-[2.0]" style={{ border: '1px solid rgba(245,239,214,0.1)' }} />
              <img
                src={pugLogo}
                alt="PugGuardian"
                className="relative w-52 h-52 rounded-full object-cover"
                style={{ border: '3px solid rgba(245,239,214,0.7)', boxShadow: '0 0 60px rgba(212,184,150,0.6), 0 0 120px rgba(155,109,197,0.4)' }}
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight" style={{ color: '#F5EFD6' }}>
            Protege a tu familia
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #F5EFD6 0%, #D4B896 50%, #F5EFD6 100%)' }}>
              en tiempo real
            </span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'rgba(245,239,214,0.8)' }}>
            PugGuardian detecta mensajes peligrosos con inteligencia artificial y te alerta al instante.
            Cuida a los tuyos, sin importar dónde estés.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5"
              style={{ background: '#F5EFD6', color: '#6B4FA0', boxShadow: '0 8px 30px rgba(61,35,20,0.4)' }}
            >
              <i className="pi pi-user-plus" />
              Empieza gratis ahora
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2.5 font-semibold px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(245,239,214,0.12)', border: '1px solid rgba(245,239,214,0.4)', color: '#F5EFD6' }}
            >
              <i className="pi pi-sign-in" />
              Ya tengo cuenta
            </Link>
          </div>

          <p className="mt-10 text-sm" style={{ color: 'rgba(245,239,214,0.5)' }}>
            <span className="font-semibold" style={{ color: 'rgba(245,239,214,0.85)' }}>+10,000 familias</span> ya confían en PugGuardian
          </p>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────── */}
      <section style={{ background: '#6B4FA0', borderTop: '1px solid rgba(245,239,214,0.2)', borderBottom: '1px solid rgba(245,239,214,0.2)' }}>
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-6">
          {[
            { val: '10K+', label: 'Familias protegidas' },
            { val: '99.9%', label: 'Precisión de detección' },
            { val: '24/7', label: 'Monitoreo continuo' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black" style={{ color: '#F5EFD6' }}>{s.val}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(245,239,214,0.65)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: '#F5EFD6' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(107,79,160,0.12)', border: '1px solid rgba(107,79,160,0.3)', color: '#6B4FA0' }}
            >
              ¿Por qué PugGuardian?
            </span>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: '#3D2314' }}>
              Todo lo que necesitas
              <br />
              <span style={{ color: '#6B4FA0' }}>para cuidar a los tuyos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{ background: '#fff', border: '1px solid rgba(107,79,160,0.15)', boxShadow: '0 4px 20px rgba(61,35,20,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,79,160,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(61,35,20,0.08)')}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md"
                  style={{ background: f.iconBg }}
                >
                  <i className={`pi ${f.icon} text-white text-xl`} />
                </div>
                <h3 className="text-base font-bold mb-3" style={{ color: '#3D2314' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7a6050' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: '#EDE5C8' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(107,79,160,0.18) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span
              className="inline-block font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(107,79,160,0.12)', border: '1px solid rgba(107,79,160,0.3)', color: '#6B4FA0' }}
            >
              Simple y rápido
            </span>
            <h2 className="text-4xl sm:text-5xl font-black" style={{ color: '#3D2314' }}>Empieza en 3 pasos</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div
              className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(107,79,160,0.4), transparent)' }}
            />
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="relative inline-flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-2xl blur-xl scale-125" style={{ background: 'rgba(107,79,160,0.3)' }} />
                    <div
                      className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', boxShadow: '0 8px 30px rgba(107,79,160,0.45)' }}
                    >
                      <i className={`pi ${s.icon} text-white text-2xl`} />
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 text-xs font-black rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: '#D4B896', color: '#3D2314' }}
                    >
                      {s.n}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#3D2314' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed max-w-44" style={{ color: '#7a6050' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#F5EFD6' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(107,79,160,0.12)', border: '1px solid rgba(107,79,160,0.3)', color: '#6B4FA0' }}
            >
              Testimonios
            </span>
            <h2 className="text-4xl font-black" style={{ color: '#3D2314' }}>Familias que ya confían en nosotros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-8 transition-all hover:-translate-y-1"
                style={{ background: '#fff', border: '1px solid rgba(107,79,160,0.15)', boxShadow: '0 4px 20px rgba(61,35,20,0.08)' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className="pi pi-star-fill text-yellow-500 text-sm" />
                  ))}
                </div>
                <p className="text-base italic leading-relaxed mb-6" style={{ color: '#5a4a3a' }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6' }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#3D2314' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#9B6DC5' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3D2314 0%, #6B4FA0 50%, #9B6DC5 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,239,214,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,214,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl scale-[2.2]" style={{ background: 'rgba(212,184,150,0.5)' }} />
              <div className="absolute inset-0 rounded-full scale-[1.4]" style={{ border: '1px solid rgba(245,239,214,0.4)' }} />
              <img
                src={pugLogo}
                alt="PugGuardian"
                className="relative w-28 h-28 rounded-full object-cover"
                style={{ border: '3px solid rgba(245,239,214,0.7)', boxShadow: '0 0 50px rgba(212,184,150,0.6)' }}
              />
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: '#F5EFD6' }}>
            ¿Listo para proteger
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #F5EFD6, #D4B896)' }}>
              a tu familia?
            </span>
          </h2>
          <p className="mb-10 text-lg leading-relaxed" style={{ color: 'rgba(245,239,214,0.75)' }}>
            Únete a miles de familias que ya confían en PugGuardian.
            <br />
            Gratis, sin tarjeta de crédito requerida.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2.5 font-bold px-10 py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5"
            style={{ background: '#F5EFD6', color: '#6B4FA0', boxShadow: '0 8px 40px rgba(61,35,20,0.4)' }}
          >
            <i className="pi pi-user-plus" style={{ color: '#6B4FA0' }} />
            Crear cuenta gratis
          </Link>
          <p className="mt-6 text-sm" style={{ color: 'rgba(245,239,214,0.5)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'rgba(245,239,214,0.85)' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-10 px-6 text-center" style={{ background: '#3D2314', borderTop: '1px solid rgba(107,79,160,0.4)' }}>
        <Link to="/" className="inline-flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity">
          <img src={pugLogo} alt="PugGuardian" className="w-6 h-6 rounded-full object-cover" />
          <span className="font-bold text-sm" style={{ color: '#F5EFD6' }}>PugGuardian</span>
        </Link>
        <p className="text-xs" style={{ color: 'rgba(245,239,214,0.4)' }}>© 2026 PugGuardian · Protección digital para tu familia</p>
      </footer>
    </div>
  );
}
