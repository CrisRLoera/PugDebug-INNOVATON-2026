import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type LoginForm = {
  identifier: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

function isEmailOrPhone(value: string) {
  const trimmed = value.trim();
  return EMAIL_REGEX.test(trimmed) || PHONE_REGEX.test(normalizePhone(trimmed));
}

function Login() {
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function setField(field: keyof LoginForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(values: LoginForm): LoginErrors {
    const nextErrors: LoginErrors = {};

    if (!values.identifier.trim()) {
      nextErrors.identifier = "El correo o teléfono es obligatorio.";
    } else if (!isEmailOrPhone(values.identifier)) {
      nextErrors.identifier = "Ingresa un correo o teléfono válido.";
    }

    if (!values.password) {
      nextErrors.password = "La contraseña es obligatoria.";
    }

    return nextErrors;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitted(true);

    if (Object.keys(nextErrors).length === 0) {
      // UI-only implementation for now.
      console.info("Login payload ready", {
        ...form,
        identifier: form.identifier.trim(),
      });
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Bienvenido de nuevo</p>
        <h1 id="login-title">Iniciar sesión</h1>
        <p className="intro">
          Usa tu correo o teléfono junto con tu contraseña.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field-row">
            <label htmlFor="login-identifier">Correo o teléfono</label>
            <InputText
              id="login-identifier"
              value={form.identifier}
              onChange={(event) => setField("identifier", event.target.value)}
              placeholder="nombre@correo.com o 555 123 4567"
              aria-invalid={Boolean(errors.identifier)}
            />
            {errors.identifier && (
              <small className="field-error">{errors.identifier}</small>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="login-password">Contraseña</label>
            <InputText
              id="login-password"
              type="password"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Tu contraseña"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <small className="field-error">{errors.password}</small>
            )}
          </div>

          <Button type="submit" label="Iniciar sesión" icon="pi pi-sign-in" />
        </form>

        <div className="auth-links">
          <Link to="/signup">¿No tienes cuenta? Regístrate</Link>
          <Link to="/">Volver al inicio</Link>
        </div>

        {submitted && isValid && (
          <p className="field-success">
            El formulario de inicio de sesión es válido y está listo para enviarse.
          </p>
        )}
      </section>
    </div>
  );
}

export default Login;
