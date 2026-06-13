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
      nextErrors.identifier = "Email or phone is required.";
    } else if (!isEmailOrPhone(values.identifier)) {
      nextErrors.identifier = "Enter a valid email or phone number.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
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
        <p className="eyebrow">Welcome back</p>
        <h1 id="login-title">Log in</h1>
        <p className="intro">
          Use your email or phone number and your password.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field-row">
            <label htmlFor="login-identifier">Email or phone</label>
            <InputText
              id="login-identifier"
              value={form.identifier}
              onChange={(event) => setField("identifier", event.target.value)}
              placeholder="jane@company.com or +1 555 123 4567"
              aria-invalid={Boolean(errors.identifier)}
            />
            {errors.identifier && (
              <small className="field-error">{errors.identifier}</small>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="login-password">Password</label>
            <InputText
              id="login-password"
              type="password"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Your password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <small className="field-error">{errors.password}</small>
            )}
          </div>

          <Button type="submit" label="Log in" icon="pi pi-sign-in" />
        </form>

        <div className="auth-links">
          <Link to="/signup">Need an account? Sign up</Link>
          <Link to="/">Back to home</Link>
        </div>

        {submitted && isValid && (
          <p className="field-success">
            Login form is valid and ready to submit.
          </p>
        )}
      </section>
    </div>
  );
}

export default Login;
