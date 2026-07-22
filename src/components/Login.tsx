import React, { useState } from "react";
import { Compass, User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
  theme?: "light" | "dark";
}

export default function Login({ onLoginSuccess, theme = "light" }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("chamoli_geoportal_auth", "true");
        onLoginSuccess();
      } else {
        setError(data.error || "Invalid username or password. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      setError("Unable to connect to authentication service. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isLight = theme === "light";

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-[9000] flex items-center justify-center p-4 bg-slate-950/20 select-none font-sans transition-all duration-300">
      {/* Translucent Glass Card without backdrop blur */}
      <div className={`w-full max-w-md border shadow-2xl rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-200 transform animate-in fade-in zoom-in-95 ${
        isLight
          ? "bg-white/85 border-white/90 text-slate-800"
          : "bg-slate-900/85 border-slate-700/80 text-slate-100"
      }`}>
        
        {/* Top Circular Icon */}
        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-5 shadow-xs ${
          isLight
            ? "bg-indigo-100/90 border-indigo-200/80 text-indigo-600"
            : "bg-indigo-950/80 border-indigo-700/60 text-indigo-400"
        }`}>
          <Compass className="w-8 h-8 stroke-[1.75] animate-spin-slow" />
        </div>

        {/* Title & Subtitle */}
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
          isLight ? "text-slate-800" : "text-white"
        }`}>
          Chamoli Geoportal
        </h1>
        <p className={`text-xs sm:text-sm font-medium leading-relaxed mt-2 max-w-xs ${
          isLight ? "text-slate-600" : "text-slate-300"
        }`}>
          Authorized Access Only. Please sign in to explore interactive district maps &amp; planners.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-7 text-left space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}>
              Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition shadow-inner font-medium ${
                  isLight
                    ? "bg-white/80 focus:bg-white border-slate-300/80 text-slate-800 placeholder-slate-400 focus:border-indigo-500"
                    : "bg-slate-800/80 focus:bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-400"
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}>
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none transition shadow-inner font-medium ${
                  isLight
                    ? "bg-white/80 focus:bg-white border-slate-300/80 text-slate-800 placeholder-slate-400 focus:border-indigo-500"
                    : "bg-slate-800/80 focus:bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            <span>{isSubmitting ? "Authenticating..." : "Explore Geoportal"}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        {/* Divider */}
        <div className={`w-full h-px my-6 ${isLight ? "bg-slate-300/60" : "bg-slate-700/60"}`} />

        {/* Footer */}
        <div className={`text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-center ${
          isLight ? "text-slate-400/90" : "text-slate-500"
        }`}>
          CHAMOLI &bull; GEOPORTAL
        </div>
      </div>
    </div>
  );
}
