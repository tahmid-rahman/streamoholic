import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "./AuthLayout";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const plan = params.get("plan") || "Free";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Fill in your name, email, and a password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await signUp({ name: form.name, email: form.email, password: form.password });
      navigate("/profile", { replace: true, state: { justJoined: true, plan } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={`Joining on the ${plan} plan`}
      title="Create your account"
      subtitle="Free for your first week. Cancel anytime after."
      footer={
        <>
          Already watching?{" "}
          <Link to="/signin" className="text-paper underline underline-offset-4 decoration-white/30 hover:decoration-paper">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="flex items-start gap-2 rounded-sm border border-crimson/40 bg-crimson/10 px-3 py-2.5 text-sm text-paper">
            <AlertCircle size={16} className="text-crimson shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
            placeholder="Jordan Rivera"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 pr-10 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-paper"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirm}
            onChange={update("confirm")}
            className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
            placeholder="Repeat your password"
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-smoke pt-1">
          <input type="checkbox" defaultChecked className="mt-0.5 accent-crimson" />
          Email me my weekly live guide and premiere alerts.
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson text-paper font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm shadow-tally hover:bg-crimson/85 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? "Creating account…" : (
            <>
              <Check size={15} /> Create account
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
