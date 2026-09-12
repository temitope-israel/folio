// Login.tsx

// The admin login page only accessible at /admin/login
// If already logged in, redirects to /admin/dashboard

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// useNavigate = programmatically navigate to a different route in code
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import {loginAdmin, saveToken, isAuthenticated} from "@/lib/api";
import { useEffect } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to dashboard
  // useEffect(() => {
  //     if (isAuthenticated()) {
  //         navigate("/admin/dashboard");
  //         // Already have a valid token - skip to login page
  //     }
  // }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await loginAdmin({ username, password });

      if (response.token) {
        saveToken(response.token);
        // Store the JWT in localStorage for future requests

        navigate("/admin/dashboard");
        // Redirect to the dashboard after successful login
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login Failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      // "finally" runs whether the try succeeded or catch ran
      // Always reset loading state - whether login worked or not
    }
  };
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Card */}
        <div className="bg-bg-surface border border-bg-border rounded-2xl p-8 relative overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-brand" />
            </div>

            <h1 className="text-2xl font-bold text-text-primary font-display">
              Admin Access
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Sign in to your dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm mb-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                {/* absolute positioning centers the icon vertically inside the input */}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // onChange fires on every keystroke
                  // e.target.value = current input value = update state
                  placeholder="admin"
                  className="w-full pl-10 border pr-4 py-3 rounded-xl bg-bg-base border-bg-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  // pl-10 → left padding makes room for the icon
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password field  */}

            <div className="flex flex-col gap-1 5">
              <label className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  // Toggle between showing and hiding the password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border rounded-xl bg-bg-base border-bg-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  // type="button" prevents this from submitting the form when clicked
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors duration-200"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !username || !password}
              // Disable if loading or fields are empty
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={isLoading ? {} : { scale: 1.01 }}
              whileTap={isLoading ? {} : { scale: 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Back Link */}
          <p className="text-center text-text-muted text-xs mt-6">
            <a
              href="/"
              className="hover:text-brand transition-colors duration-200"
            >
              ← Back to portfolio
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
