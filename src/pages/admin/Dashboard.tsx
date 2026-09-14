import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Mail,
  Eye,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  fetchMessages,
  fetchAnalytics,
  removeToken,
  type Message,
  type AnalyticsData,
} from "@/lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  // selectedMessage → the message currently open in the detail view

  // ── Fetch data on mount ───────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both in parallel — faster than sequential awaits
        const [messagesData, analyticsData] = await Promise.all([
          fetchMessages(),
          fetchAnalytics(),
        ]);

        setMessages(messagesData);
        setAnalytics(analyticsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          // If token expired or invalid, redirect to login
          if (
            err.message.includes("Invalid") ||
            err.message.includes("token")
          ) {
            removeToken();
            navigate("/admin/login");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // ── Logout ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    removeToken();
    // Clear the JWT from localStorage
    navigate("/admin/login");
    // Redirect to login page
  };

  // ── Format date ───────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    // toLocaleDateString formats: "8 Jan 2026, 10:30"
  };

  // ── Loading state ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-brand animate-spin" />
          <p className="text-text-muted text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button onClick={handleLogout} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="border-b border-bg-border bg-bg-surface sticky top-0 z-10">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-white font-bold text-xs font-display">
                TI
              </span>
            </div>
            <div>
              <p className="text-text-primary font-semibold text-sm">
                Admin Dashboard
              </p>
              <p className="text-text-muted text-xs">
                Temitope Omoniyi's Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              View Portfolio
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-bg-border text-text-muted hover:text-error hover:border-error/50 text-sm transition-all duration-200"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* ── Stats Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Visits",
              value: analytics?.visits.total ?? 0,
              icon: Eye,
              color: "text-brand",
              bg: "bg-brand/10",
            },
            {
              label: "Last 7 Days",
              value: analytics?.visits.lastSevenDays ?? 0,
              icon: TrendingUp,
              color: "text-gold",
              bg: "bg-gold/10",
            },
            {
              label: "Total Messages",
              value: analytics?.messages.total ?? 0,
              icon: Mail,
              color: "text-success",
              bg: "bg-success/10",
            },
            {
              label: "This Month",
              value: messages.filter((m) => {
                const date = new Date(m.createdAt);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
                // Filter messages created this calendar month
              }).length,
              icon: Calendar,
              color: "text-brand",
              bg: "bg-brand/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="p-5 rounded-xl bg-bg-surface border border-bg-border"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-text-muted text-xs uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <Icon size={14} className={stat.color} />
                  </div>
                </div>
                <p className={`text-3xl font-bold font-display ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Messages ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <motion.div
            className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-5 border-b border-bg-border flex items-center justify-between">
              <h2 className="text-text-primary font-semibold text-sm">
                Messages ({messages.length})
              </h2>
            </div>

            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail size={32} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-muted text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-bg-border max-h-[500px] overflow-y-auto">
                {/* divide-y → adds a border between each child */}
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full text-left p-4 hover:bg-bg-border/30 transition-colors duration-200 ${
                      selectedMessage?.id === message.id
                        ? "bg-bg-border/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-text-primary text-sm font-medium truncate">
                        {message.name}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {message.emailSent ? (
                          <CheckCircle size={12} className="text-success" />
                        ) : (
                          <XCircle size={12} className="text-error" />
                        )}
                        {/* CheckCircle = email was sent, XCircle = email failed */}
                      </div>
                    </div>
                    <p className="text-text-muted text-xs truncate mb-1">
                      {message.subject}
                    </p>
                    <p className="text-text-muted text-xs">
                      {formatDate(message.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Message detail */}
          <motion.div
            className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-5 border-b border-bg-border">
              <h2 className="text-text-primary font-semibold text-sm">
                Message Detail
              </h2>
            </div>

            {!selectedMessage ? (
              <div className="p-8 text-center">
                <Mail size={32} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-muted text-sm">
                  Select a message to read it
                </p>
              </div>
            ) : (
              <div className="p-5 flex flex-col gap-4">
                {/* Sender info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-text-primary font-semibold">
                      {selectedMessage.name}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedMessage.emailSent
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {selectedMessage.emailSent
                        ? "Email sent"
                        : "Email failed"}
                    </span>
                  </div>

                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-brand text-sm hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="text-text-muted text-xs">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>

                {/* Subject */}
                <div className="p-3 rounded-lg bg-bg-base border border-bg-border">
                  <p className="text-text-muted text-xs mb-1">Subject</p>
                  <p className="text-text-primary text-sm font-medium">
                    {selectedMessage.subject}
                  </p>
                </div>

                {/* Message body */}
                <div className="p-3 rounded-lg bg-bg-base border border-bg-border flex-1">
                  <p className="text-text-muted text-xs mb-2">Message</p>
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                    {/* whitespace-pre-wrap → preserves line breaks the sender typed */}
                  </p>
                </div>

                {/* Reply button */}

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn-primary justify-center"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
