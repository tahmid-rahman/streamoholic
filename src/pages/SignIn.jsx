import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "./AuthLayout";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/profile";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Enter both an email and a password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: "demo@streamoholic.tv", password: "demo1234" });

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Pick up where you left off."
      footer={
        <>
          New to Streamoholic?{" "}
          <Link to="/signup" className="text-paper underline underline-offset-4 decoration-white/30 hover:decoration-paper">
            Create an account
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
          <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-widest text-smoke mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block font-mono text-[11px] uppercase tracking-widest text-smoke">
              Password
            </label>
            <button type="button" className="font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-paper">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-sm bg-panel2 border border-white/10 px-3.5 py-2.5 pr-10 text-sm text-paper placeholder:text-smoke/60 focus:border-cyan/60 outline-none transition-colors"
              placeholder="••••••••"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson text-paper font-mono text-sm uppercase tracking-wide px-5 py-3 rounded-sm shadow-tally hover:bg-crimson/85 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={fillDemo}
          className="w-full font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-paper transition-colors"
        >
          Use demo credentials
        </button>
      </form>
    </AuthLayout>
  );
}
