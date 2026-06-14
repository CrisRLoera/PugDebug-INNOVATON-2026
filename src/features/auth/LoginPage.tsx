import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import pugLogo from "../../assets/pug-logo.jpeg";

type Form = { identifier: string; password: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function isEmailOrPhone(value: string) {
  const t = value.trim();
  return EMAIL_REGEX.test(t) || PHONE_REGEX.test(t.replace(/[\s()-]/g, ""));
}

function validate(form: Form): Errors {
  const e: Errors = {};
  if (!form.identifier.trim()) e.identifier = "El correo o teléfono es obligatorio.";
  else if (!isEmailOrPhone(form.identifier)) e.identifier = "Ingresa un correo o teléfono válido.";
  if (!form.password) e.password = "La contraseña es obligatoria.";
  return e;
}

const BRAND_FEATURES = [
  { icon: "pi-shield", text: "Detección de mensajes peligrosos" },
  { icon: "pi-bell", text: "Alertas en tiempo real para tu familia" },
  { icon: "pi-lock", text: "Acceso seguro y cifrado end-to-end" },
];

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  const [form, setForm] = useState<Form>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function set(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { user } = await login({ identifier: form.identifier.trim(), password: form.password });
      signIn(user);
      navigate(user.role === "admin" ? "/admin" : from === "/login" ? "/dashboard" : from, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ─── LEFT BRAND PANEL ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-5/12 min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3D2314 0%, #6B4FA0 50%, #9B6DC5 100%)' }}
      >
        {/* Grid crema */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,239,214,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,214,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* Blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(212,184,150,0.2)' }} />
        {/* Right border */}
        <div className="absolute top-0 right-0 w-px h-full" style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,239,214,0.5), transparent)' }} />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(245,239,214,0.5)' }} />
              <img src={pugLogo} alt="PugGuardian" className="relative w-9 h-9 rounded-full object-cover" style={{ border: '2px solid rgba(245,239,214,0.7)' }} />
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{ color: '#F5EFD6' }}>PugGuardian</span>
          </Link>

          {/* Center */}
          <div className="my-auto space-y-8">
            {/* Big logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-3xl scale-[2.5]" style={{ background: 'rgba(212,184,150,0.5)' }} />
                <div className="absolute inset-0 rounded-full blur-xl scale-[1.8]" style={{ background: 'rgba(245,239,214,0.25)' }} />
                <div className="absolute inset-0 rounded-full scale-[1.35]" style={{ border: '1px solid rgba(245,239,214,0.45)' }} />
                <div className="absolute inset-0 rounded-full scale-[1.65]" style={{ border: '1px solid rgba(245,239,214,0.2)' }} />
                <img
                  src={pugLogo}
                  alt="PugGuardian"
                  className="relative w-44 h-44 rounded-full object-cover"
                  style={{ border: '3px solid rgba(245,239,214,0.7)', boxShadow: '0 0 60px rgba(212,184,150,0.6), 0 0 120px rgba(155,109,197,0.3)' }}
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(245,239,214,0.6)' }}>Bienvenido de nuevo</p>
              <h2 className="text-3xl font-black leading-tight mb-3" style={{ color: '#F5EFD6' }}>
                Tu guardián digital
                <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #F5EFD6, #D4B896)' }}>
                  te espera
                </span>
              </h2>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(245,239,214,0.7)' }}>
                Protege a tu familia de fraudes con inteligencia artificial en tiempo real.
              </p>
            </div>

            <ul className="space-y-3 max-w-xs mx-auto">
              {BRAND_FEATURES.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,239,214,0.15)', border: '1px solid rgba(245,239,214,0.3)' }}>
                    <i className={`pi ${item.icon} text-sm`} style={{ color: '#F5EFD6' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(245,239,214,0.8)' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(245,239,214,0.12)', border: '1px solid rgba(245,239,214,0.25)' }}>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <i key={i} className="pi pi-star-fill text-yellow-400 text-xs" />
              ))}
            </div>
            <p className="text-sm italic leading-relaxed mb-4" style={{ color: 'rgba(245,239,214,0.85)' }}>
              "PugGuardian me avisa al instante cuando mi mamá recibe algo sospechoso. Me da una tranquilidad enorme."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6', border: '1px solid rgba(245,239,214,0.3)' }}>
                MG
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#F5EFD6' }}>María G.</p>
                <p className="text-xs" style={{ color: 'rgba(245,239,214,0.5)' }}>Usuaria activa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12" style={{ background: '#F5EFD6' }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden flex-col items-center gap-3 mb-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl scale-[1.8]" style={{ background: 'rgba(107,79,160,0.4)' }} />
              <img
                src={pugLogo}
                alt="PugGuardian"
                className="relative w-24 h-24 rounded-full object-cover"
                style={{ border: '3px solid rgba(107,79,160,0.5)', boxShadow: '0 0 30px rgba(107,79,160,0.3)' }}
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: '#3D2314' }}>PugGuardian</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#3D2314' }}>Iniciar sesión</h1>
            <p className="text-sm mt-1.5" style={{ color: '#7a6050' }}>Ingresa con tu correo o teléfono y contraseña.</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 mb-6 text-sm" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#b91c1c' }}>
              <i className="pi pi-exclamation-circle mt-0.5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold mb-1.5" style={{ color: '#3D2314' }}>
                Correo o teléfono
              </label>
              <input
                id="identifier"
                type="text"
                value={form.identifier}
                onChange={(e) => set("identifier", e.target.value)}
                placeholder="nombre@correo.com"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: '#fff',
                  border: errors.identifier ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(107,79,160,0.25)',
                  color: '#3D2314',
                }}
                onFocus={e => { e.target.style.border = '1px solid #6B4FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,160,0.15)'; }}
                onBlur={e => { e.target.style.border = errors.identifier ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(107,79,160,0.25)'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.identifier && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.identifier}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5" style={{ color: '#3D2314' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#fff',
                    border: errors.password ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(107,79,160,0.25)',
                    color: '#3D2314',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid #6B4FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(107,79,160,0.15)'; }}
                  onBlur={e => { e.target.style.border = errors.password ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(107,79,160,0.25)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1"
                  style={{ color: '#9B6DC5' }}
                  tabIndex={-1}
                >
                  <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} text-sm`} />
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1"><i className="pi pi-exclamation-circle text-xs" />{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #6B4FA0, #9B6DC5)', color: '#F5EFD6', boxShadow: loading ? 'none' : '0 6px 25px rgba(107,79,160,0.45)' }}
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verificando...</>
              ) : (
                <><i className="pi pi-sign-in" />Iniciar sesión</>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm" style={{ color: '#7a6050' }}>
              ¿No tienes cuenta?{" "}
              <Link to="/signup" className="font-bold transition-colors hover:underline" style={{ color: '#6B4FA0' }}>
                Regístrate gratis
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm transition-colors" style={{ color: '#9B6DC5' }}>
              <i className="pi pi-arrow-left text-xs" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
