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
// Day 21: we'll wire the form to the backend API via fetch.
// Today: the form is fully functional UI — submission goes to
// a placeholder that simulates a successful response.
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
// Mail        → email contact info
// MapPin      → location info
// Clock       → availability info
// Send        → submit button icon
// CheckCircle → success state icon
// AlertCircle → error state icon
// Loader2     → spinning loader during submission

import { SiGithub, SiX } from "react-icons/si";
// Social icons — brand icons from Simple Icons

import { personalInfo, socialLinks } from "@/data";
import { cn } from "@/lib/utils";

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
    // .min(1) → catches empty string before .email() runs
    // Without this, an empty field would show "Invalid email" not "Required"
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

// Infer the TypeScript type from the schema
type ContactFormData = z.infer<typeof contactSchema>;
// Equivalent to manually writing:
// type ContactFormData = { name: string; email: string; subject: string; message: string }
// But derived automatically — stays in sync with schema changes.

// ============================================================
// SUBMISSION STATE TYPE
// ============================================================

type SubmitStatus = "idle" | "loading" | "success" | "error";
// Union type — the form can only be in one of these four states.
// "idle"    → not yet submitted
// "loading" → fetch in progress (spinner shown)
// "success" → server returned 200 (success message shown)
// "error"   → something went wrong (error message shown)

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
    // href: null → not clickable (can't link to a location directly)
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Open to new projects",
    href: null,
  },
];

// Social icons map — same pattern as iconMap in Services
const socialIconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Github: SiGithub,

  Twitter: SiX,
  // SiX → the "X" (formerly Twitter) icon from Simple Icons
  Email: Mail,
  // Email uses Lucide Mail (not a brand icon)
};

// ============================================================
// FORM FIELD COMPONENT
// ============================================================
// Reusable wrapper for each form field — label, input, error message.

interface FormFieldProps {
  label: string;
  error?: string;
  // error?: string → optional. Only present when validation fails.
  required?: boolean;
  children: React.ReactNode;
  // children → the actual <input> or <textarea> element.
  // We wrap it with the label and error message here.
  // React.ReactNode → any valid JSX (elements, strings, arrays, null)
}

function FormField({
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* gap-1.5 → 6px between label, input, and error message */}

      <label className="text-sm font-medium text-text-secondary">
        {label}
        {required && (
          <span className="text-brand ml-1">*</span>
          // Red asterisk for required fields — universal convention
        )}
      </label>

      {children}
      {/* The <input> or <textarea> is rendered here */}

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            // key={error} → if the error message changes (e.g. "too short"
            // → "too long"), AnimatePresence sees a new key and re-animates.
            className="flex items-center gap-1.5 text-xs text-error"
            /*
              text-error → #EF4444 red
              text-xs    → 12px — smaller than the label
            */
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            // height: 0 → "auto" → 0 creates a smooth expand/collapse.
            // The error message smoothly pushes the form down when it appears
            // and collapses when it's resolved.
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
  // submitMessage → the message shown to the user after submission.
  // Either a success message or an error description.

  // --------------------------------------------------------
  // React Hook Form setup
  // --------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    // Wire the Zod schema as the validation logic.
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    // defaultValues → initial values for all fields.
    // Always set these to empty strings for text fields.
    // Without defaultValues, fields start as undefined — can cause
    // React warnings about uncontrolled → controlled input switching.
  });

  // Watch the message field for the character counter
  const messageValue = watch("message");
  // watch("message") → subscribes to the message field's current value.
  // Re-renders this component when message changes — only for the counter.
  // messageValue.length → used to show "47 / 2000" below the textarea.

  // --------------------------------------------------------
  // Submit handler
  // --------------------------------------------------------
  const onSubmit = async (data: ContactFormData) => {
    // onSubmit is called by handleSubmit ONLY if Zod validation passes.
    // data → the validated form values, fully typed as ContactFormData.

    setSubmitStatus("loading");

    try {
      // -------------------------------------------------------
      // PLACEHOLDER SUBMISSION — Day 21 replaces this with
      // a real fetch() call to the Express backend.
      // For now, we simulate a 1.5 second API call.
      // -------------------------------------------------------
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // new Promise((resolve) => setTimeout(resolve, 1500))
      // Creates a Promise that resolves after 1500ms.
      // await pauses execution here for 1.5 seconds — simulating network latency.
      // This lets us test the loading state without a real server.

      // Simulate success
      setSubmitStatus("success");
      setSubmitMessage(
        `Thanks ${data.name}! Your message has been sent. I'll get back to you within 24 hours.`,
      );
      reset();
      // reset() → clears all form fields after successful submission.
    } catch (error) {
      // If the fetch throws (network error, server error):
      setSubmitStatus("error");
      setSubmitMessage(
        "Something went wrong. Please try again or email me directly.",
      );
    }
  };

  // --------------------------------------------------------
  // Input class builder
  // --------------------------------------------------------
  const inputClasses = (hasError: boolean) =>
    cn(
      // Base classes for all inputs
      "w-full px-4 py-3 rounded-xl bg-bg-surface border text-text-primary text-sm",
      "placeholder:text-text-muted",
      // placeholder: → Tailwind's way to style ::placeholder pseudo-element
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      // focus:outline-none → remove the default browser focus outline
      // focus:ring-2       → replace with our own ring (2px)
      // focus:ring-offset-0 → ring sits flush with the element (no gap)
      "transition-all duration-200",
      hasError
        ? "border-error focus:ring-error/30"
        : // Error state: red border + red focus ring
          "border-bg-border focus:border-brand focus:ring-brand/20",
      // Normal state: dark border → blue border + blue ring on focus
    );
  // inputClasses is a function (not a constant) because it needs the
  // hasError argument to determine which border/ring classes to apply.
  // Called as: className={inputClasses(!!errors.name)}
  // !!errors.name → double negation converts to boolean:
  //   errors.name = undefined → !!undefined = false (no error)
  //   errors.name = { message: "..." } → !!object = true (has error)

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
          {/*
            grid-cols-[1fr_1.6fr] → custom column ratio:
            Left column gets 1fr, right column gets 1.6fr.
            The form is wider because it has more content.
            Square brackets → arbitrary Tailwind value.
          */}

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
                      // Wrap in <a> only if there's an href (email link)
                      content
                      // Otherwise render as a plain div
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
                  // Look up the icon component for this social link.
                  // social.label → "Github", "Linkedin", "Twitter", "Email"

                  if (!Icon) return null;
                  // Guard: if no matching icon found, render nothing.
                  // Prevents crashes from unknown social labels.

                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={
                        social.href.startsWith("mailto") ? undefined : "_blank"
                      }
                      // Don't open mailto links in a new tab —
                      // they open the email client in the same window.
                      // .startsWith("mailto") → true for the email link
                      rel={
                        social.href.startsWith("mailto")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="w-10 h-10 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/50 transition-all duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                      // aria-label → accessibility label for screen readers.
                      // Icon-only buttons MUST have aria-label so screen reader
                      // users know what the button does.
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
                {/*
                  bg-success/5    → green at 5% opacity — very subtle tint
                  border-success/20 → green border at 20% opacity
                */}
                <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0 animate-pulse" />
                {/* animate-pulse → Tailwind's built-in fade pulse animation */}
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
              {/*
                h-px → 1px tall
                from-transparent via-brand/50 to-transparent →
                gradient that fades in from the left, peaks at brand blue
                in the middle, then fades out to the right.
                Creates a subtle glowing top border on the form card.
              */}

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
                    <CheckCircle
                      size={18}
                      className="text-success flex-shrink-0 mt-0.5"
                    />
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
                    <AlertCircle
                      size={18}
                      className="text-error flex-shrink-0 mt-0.5"
                    />
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
                // handleSubmit(onSubmit) → RHF validates first.
                // If valid: calls onSubmit(data).
                // If invalid: populates errors, does NOT call onSubmit.
                className="flex flex-col gap-5"
                noValidate
                // noValidate → disables the browser's built-in HTML5 validation.
                // We use Zod for validation instead — browser validation
                // would show native popups that conflict with our custom UI.
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Full Name"
                    error={errors.name?.message}
                    // errors.name?.message → optional chaining.
                    // If errors.name is undefined (no error), .message is not accessed.
                    // If errors.name exists, .message gets the error string.
                    required
                  >
                    <input
                      {...register("name")}
                      // {...register("name")} → spread operator.
                      // register("name") returns { name, ref, onChange, onBlur }
                      // Spreading gives all four to the input at once.
                      type="text"
                      placeholder="Tope Omoniyi"
                      className={inputClasses(!!errors.name)}
                      // !!errors.name → coerce to boolean
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
                      // rows={6} → textarea is 6 lines tall by default
                      placeholder="Tell me about your project — what you're building, your timeline, and what kind of help you're looking for..."
                      className={cn(
                        inputClasses(!!errors.message),
                        "resize-none",
                        // resize-none → prevent the user from manually resizing
                        // the textarea. Our design has a fixed height (rows=6).
                      )}
                    />

                    {/* Character counter */}
                    <div className="absolute bottom-3 right-3 text-xs text-text-muted tabular-nums">
                      {/*
                        absolute bottom-3 right-3 → positioned inside the textarea
                        tabular-nums → fixed-width digits (counter doesn't jump)
                      */}
                      <span
                        className={cn(
                          messageValue?.length > 1800 && "text-error",
                          // Turn red when approaching the 2000 char limit
                          messageValue?.length > 1600 &&
                            messageValue?.length <= 1800 &&
                            "text-gold",
                          // Turn amber as a warning before the red zone
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
                  // disabled when: form is submitting OR already succeeded
                  // (no point resubmitting after a success)
                  className={cn(
                    "btn-primary w-full justify-center mt-2",
                    // w-full → button takes full width of the form
                    // justify-center → center icon + text inside
                    (isSubmitting || submitStatus === "success") &&
                      "opacity-70 cursor-not-allowed",
                    // Visually indicate the disabled state:
                    // opacity-70 → slightly dimmed
                    // cursor-not-allowed → shows the ⊘ cursor on hover
                  )}
                  whileHover={
                    isSubmitting || submitStatus === "success"
                      ? {}
                      : // No hover animation when disabled
                        { scale: 1.01 }
                    // Very subtle scale on hover
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
                      {/*
                        animate-spin → Tailwind's built-in continuous
                        360° rotation animation. Perfect for loaders.
                      */}
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
                  {/*
                    Three states for the button content:
                    1. isSubmitting → spinner + "Sending..."
                    2. success      → checkmark + "Message Sent!"
                    3. default      → send icon + "Send Message"
                  */}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
