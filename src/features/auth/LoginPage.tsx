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
  if (!form.identifier.trim())
    e.identifier = "El correo o teléfono es obligatorio.";
  else if (!isEmailOrPhone(form.identifier))
    e.identifier = "Ingresa un correo o teléfono válido.";
  if (!form.password) e.password = "La contraseña es obligatoria.";
  return e;
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  const [form, setForm] = useState<Form>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { user } = await login({
        identifier: form.identifier.trim(),
        password: form.password,
      });
      signIn(user);
      navigate(
        user.role === "admin"
          ? "/admin"
          : from === "/login"
            ? "/dashboard"
            : from,
        { replace: true },
      );
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFD6] via-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={pugLogo}
              alt="PugGuardian"
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PugGuardian</h1>
          <p className="text-slate-500 text-sm mt-1">
            Protección digital para tu familia
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Iniciar sesión
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Usa tu correo o teléfono y contraseña.
          </p>

          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <i className="pi pi-exclamation-circle mt-0.5 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Correo o teléfono
              </label>
              <input
                id="identifier"
                type="text"
                value={form.identifier}
                onChange={(e) => set("identifier", e.target.value)}
                placeholder="nombre@correo.com"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
                  ${
                    errors.identifier
                      ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
                      : "border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  }`}
              />
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.identifier}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Tu contraseña"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
                  ${
                    errors.password
                      ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
                      : "border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <i className="pi pi-sign-in" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/signup"
            className="text-purple-700 font-semibold hover:text-purple-800 transition-colors"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
