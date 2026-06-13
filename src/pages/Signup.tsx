import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type SignupForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function normalizePhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

function Signup() {
  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function setField(field: keyof SignupForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(values: SignupForm): SignupErrors {
    const nextErrors: SignupErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!PHONE_REGEX.test(normalizePhone(values.phone))) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
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
      console.info("Signup payload ready", {
        ...form,
        phone: normalizePhone(form.phone),
      });
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-card" aria-labelledby="signup-title">
        <p className="eyebrow">Create account</p>
        <h1 id="signup-title">Sign up</h1>
        <p className="intro">Use your details to set up your account.</p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="field-row">
            <label htmlFor="full-name">Full name</label>
            <InputText
              id="full-name"
              value={form.fullName}
              onChange={(event) => setField("fullName", event.target.value)}
              placeholder="Jane Doe"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && (
              <small className="field-error">{errors.fullName}</small>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="signup-email">Email</label>
            <InputText
              id="signup-email"
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="jane@company.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <small className="field-error">{errors.email}</small>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="signup-phone">Phone number</label>
            <InputText
              id="signup-phone"
              value={form.phone}
              onChange={(event) => setField("phone", event.target.value)}
              placeholder="+1 555 123 4567"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <small className="field-error">{errors.phone}</small>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="signup-password">Password</label>
            <InputText
              id="signup-password"
              type="password"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Minimum 8 characters"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <small className="field-error">{errors.password}</small>
            )}
          </div>

          <Button type="submit" label="Create account" icon="pi pi-user-plus" />
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account? Log in</Link>
          <Link to="/">Back to home</Link>
        </div>

        {submitted && isValid && (
          <p className="field-success">
            Signup form is valid and ready to submit.
          </p>
        )}
      </section>
    </div>
  );
}

export default Signup;
