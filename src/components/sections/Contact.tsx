// src/components/sections/Contact.tsx
// ============================================================
// CONTACT SECTION
// ============================================================
// A fully functional contact form with:
//   - React Hook Form for state management
//   - Zod for validation
//   - Real-time error messages
//   - Character counter for message field
//   - Loading / success / error states
//   - Left column: info cards + social links
//   - Right column: the form
//
// Day 21: wired to backend API via fetch using submitContactForm
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";
import { personalInfo, socialLinks } from "@/data";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/lib/api";

// ============================================================
// ZOD SCHEMA
// ============================================================

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters"),

  message: z
    .string()
    .min(20, "Message must be at least 20 characters — tell me more!")
    .max(2000, "Message cannot exceed 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ============================================================
// SUBMISSION STATE TYPE
// ============================================================

type SubmitStatus = "idle" | "loading" | "success" | "error";

// ============================================================
// CONTACT INFO DATA
// ============================================================

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: personalInfo.location,
    href: null,
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Open to new projects",
    href: null,
  },
];

const socialIconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Github: SiGithub,
  Twitter: SiX,
  Email: Mail,
};

// ============================================================
// FORM FIELD COMPONENT
// ============================================================

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required = false, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">
        {label}
        {required && (
          <span className="text-brand ml-1">*</span>
        )}
      </label>

      {children}

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            className="flex items-center gap-1.5 text-xs text-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Contact() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageValue = watch("message");

  // --------------------------------------------------------
  // Submit handler — Day 21: real fetch call
  // --------------------------------------------------------
  const onSubmit = async (data: ContactFormData) => {
    // Reset any previous status before each new attempt
    setSubmitStatus("loading");
    setSubmitMessage("");

    try {
      // submitContactForm sends POST /api/contact with the form data.
      // It throws if the response is not ok (4xx, 5xx, or network error).
      // If it resolves without throwing, the submission succeeded.
      await submitContactForm(data);

      setSubmitStatus("success");
      setSubmitMessage(
        `Thanks ${data.name}! Your message has been sent. I'll get back to you within 24 hours.`
      );
      reset();
      // reset() clears all form fields back to defaultValues after success

    } catch (error) {
      // submitContactForm throws an Error with the server's message.
      // error is typed as "unknown" in catch — check instanceof before reading .message
      setSubmitStatus("error");

      if (error instanceof Error) {
        // Use the server's error message if available
        setSubmitMessage(error.message);
      } else {
        setSubmitMessage(
          "Something went wrong. Please try again or email me directly."
        );
      }
    }
  };

  // --------------------------------------------------------
  // Input class builder
  // --------------------------------------------------------
  const inputClasses = (hasError: boolean) =>
    cn(
      "w-full px-4 py-3 rounded-xl bg-bg-surface border text-text-primary text-sm",
      "placeholder:text-text-muted",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "transition-all duration-200",
      hasError
        ? "border-error focus:ring-error/30"
        : "border-bg-border focus:border-brand focus:ring-brand/20",
    );

  return (
    <section id="contact" className="section-padding border-t border-bg-border">
      <div className="container-custom">
        {/* -----------------------------------------------
            SECTION HEADER
        ----------------------------------------------- */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-brand text-sm font-semibold uppercase tracking-widest mb-3 block">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Let's build something
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Have a project in mind? I'd love to hear about it. Fill in the form
            and I'll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* -----------------------------------------------
            TWO COLUMN LAYOUT
        ----------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">

          {/* ============================================
              LEFT COLUMN — Contact Info + Socials
          ============================================ */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Intro text */}
            <div>
              <h3 className="text-xl font-bold text-text-primary font-display mb-3">
                Get in touch
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                I'm currently available for freelance projects and full-time
                opportunities. Whether you have a question or just want to say
                hello — my inbox is always open.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="flex flex-col gap-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-surface border border-bg-border hover:border-brand/40 transition-colors duration-200">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-text-muted text-xs mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-text-primary text-sm font-medium">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {item.href ? (
                      <a href={item.href}>{content}</a>
                    ) : (
                      content
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Social links */}
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-4">
                Find me online
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.label];
                  if (!Icon) return null;

                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={
                        social.href.startsWith("mailto") ? undefined : "_blank"
                      }
                      rel={
                        social.href.startsWith("mailto")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="w-10 h-10 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/50 transition-all duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability notice */}
            {personalInfo.available && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-success text-sm font-medium">
                    Currently available
                  </p>
                  <p className="text-text-muted text-xs mt-0.5">
                    Open to freelance projects and full-time roles
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* ============================================
              RIGHT COLUMN — The Form
          ============================================ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="p-8 rounded-2xl bg-bg-surface border border-bg-border relative overflow-hidden">
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

              {/* Success / Error feedback banner */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    key="success"
                    className="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/30 mb-6"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-success font-medium text-sm">
                        Message sent!
                      </p>
                      <p className="text-success/80 text-xs mt-0.5">
                        {submitMessage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    key="error"
                    className="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/30 mb-6"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-error font-medium text-sm">
                        Failed to send
                      </p>
                      <p className="text-error/80 text-xs mt-0.5">
                        {submitMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* THE FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Full Name"
                    error={errors.name?.message}
                    required
                  >
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Tope Omoniyi"
                      className={inputClasses(!!errors.name)}
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    error={errors.email?.message}
                    required
                  >
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="tope@example.com"
                      className={inputClasses(!!errors.email)}
                    />
                  </FormField>
                </div>

                {/* Subject */}
                <FormField
                  label="Subject"
                  error={errors.subject?.message}
                  required
                >
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Project inquiry — React + Node.js application"
                    className={inputClasses(!!errors.subject)}
                  />
                </FormField>

                {/* Message */}
                <FormField
                  label="Message"
                  error={errors.message?.message}
                  required
                >
                  <div className="relative">
                    <textarea
                      {...register("message")}
                      rows={6}
                      placeholder="Tell me about your project — what you're building, your timeline, and what kind of help you're looking for..."
                      className={cn(
                        inputClasses(!!errors.message),
                        "resize-none",
                      )}
                    />

                    {/* Character counter */}
                    <div className="absolute bottom-3 right-3 text-xs text-text-muted tabular-nums">
                      <span
                        className={cn(
                          messageValue?.length > 1800 && "text-error",
                          messageValue?.length > 1600 &&
                            messageValue?.length <= 1800 &&
                            "text-gold",
                        )}
                      >
                        {messageValue?.length || 0}
                      </span>
                      {" / 2000"}
                    </div>
                  </div>
                </FormField>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  className={cn(
                    "btn-primary w-full justify-center mt-2",
                    (isSubmitting || submitStatus === "success") &&
                      "opacity-70 cursor-not-allowed",
                  )}
                  whileHover={
                    isSubmitting || submitStatus === "success"
                      ? {}
                      : { scale: 1.01 }
                  }
                  whileTap={
                    isSubmitting || submitStatus === "success"
                      ? {}
                      : { scale: 0.99 }
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : submitStatus === "success" ? (
                    <>
                      <CheckCircle size={16} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}