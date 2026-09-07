import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2, } from "lucide-react";
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
const socialIconMap = {
    Github: SiGithub,
    Twitter: SiX,
    Email: Mail,
};
function FormField({ label, error, required = false, children }) {
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("label", { className: "text-sm font-medium text-text-secondary", children: [label, required && (_jsx("span", { className: "text-brand ml-1", children: "*" }))] }), children, _jsx(AnimatePresence, { mode: "wait", children: error && (_jsxs(motion.p, { className: "flex items-center gap-1.5 text-xs text-error", initial: { opacity: 0, y: -4, height: 0 }, animate: { opacity: 1, y: 0, height: "auto" }, exit: { opacity: 0, y: -4, height: 0 }, transition: { duration: 0.2, ease: "easeOut" }, children: [_jsx(AlertCircle, { size: 12 }), error] }, error)) })] }));
}
// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Contact() {
    const [submitStatus, setSubmitStatus] = useState("idle");
    const [submitMessage, setSubmitMessage] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, } = useForm({
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
    const onSubmit = async (data) => {
        // Reset any previous status before each new attempt
        setSubmitStatus("loading");
        setSubmitMessage("");
        try {
            // submitContactForm sends POST /api/contact with the form data.
            // It throws if the response is not ok (4xx, 5xx, or network error).
            // If it resolves without throwing, the submission succeeded.
            await submitContactForm(data);
            setSubmitStatus("success");
            setSubmitMessage(`Thanks ${data.name}! Your message has been sent. I'll get back to you within 24 hours.`);
            reset();
            // reset() clears all form fields back to defaultValues after success
        }
        catch (error) {
            // submitContactForm throws an Error with the server's message.
            // error is typed as "unknown" in catch — check instanceof before reading .message
            setSubmitStatus("error");
            if (error instanceof Error) {
                // Use the server's error message if available
                setSubmitMessage(error.message);
            }
            else {
                setSubmitMessage("Something went wrong. Please try again or email me directly.");
            }
        }
    };
    // --------------------------------------------------------
    // Input class builder
    // --------------------------------------------------------
    const inputClasses = (hasError) => cn("w-full px-4 py-3 rounded-xl bg-bg-surface border text-text-primary text-sm", "placeholder:text-text-muted", "focus:outline-none focus:ring-2 focus:ring-offset-0", "transition-all duration-200", hasError
        ? "border-error focus:ring-error/30"
        : "border-bg-border focus:border-brand focus:ring-brand/20");
    return (_jsx("section", { id: "contact", className: "section-padding border-t border-bg-border", children: _jsxs("div", { className: "container-custom", children: [_jsxs(motion.div, { className: "text-center mb-16", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsx("span", { className: "text-brand text-sm font-semibold uppercase tracking-widest mb-3 block", children: "Contact" }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-text-primary mb-4", children: "Let's build something" }), _jsx("p", { className: "text-text-secondary max-w-xl mx-auto", children: "Have a project in mind? I'd love to hear about it. Fill in the form and I'll get back to you within 24 hours." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20", children: [_jsxs(motion.div, { className: "flex flex-col gap-8", initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6, ease: "easeOut" }, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-text-primary font-display mb-3", children: "Get in touch" }), _jsx("p", { className: "text-text-secondary text-sm leading-relaxed", children: "I'm currently available for freelance projects and full-time opportunities. Whether you have a question or just want to say hello \u2014 my inbox is always open." })] }), _jsx("div", { className: "flex flex-col gap-3", children: contactInfo.map((item, index) => {
                                        const Icon = item.icon;
                                        const content = (_jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl bg-bg-surface border border-bg-border hover:border-brand/40 transition-colors duration-200", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0", children: _jsx(Icon, { size: 16, className: "text-brand" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-muted text-xs mb-0.5", children: item.label }), _jsx("p", { className: "text-text-primary text-sm font-medium", children: item.value })] })] }));
                                        return (_jsx(motion.div, { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: index * 0.1, duration: 0.5 }, children: item.href ? (_jsx("a", { href: item.href, children: content })) : (content) }, item.label));
                                    }) }), _jsxs("div", { children: [_jsx("p", { className: "text-text-muted text-xs uppercase tracking-wider mb-4", children: "Find me online" }), _jsx("div", { className: "flex gap-3", children: socialLinks.map((social) => {
                                                const Icon = socialIconMap[social.label];
                                                if (!Icon)
                                                    return null;
                                                return (_jsx(motion.a, { href: social.href, target: social.href.startsWith("mailto") ? undefined : "_blank", rel: social.href.startsWith("mailto")
                                                        ? undefined
                                                        : "noopener noreferrer", className: "w-10 h-10 rounded-xl bg-bg-surface border border-bg-border flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/50 transition-all duration-200", whileHover: { scale: 1.1, y: -2 }, whileTap: { scale: 0.95 }, "aria-label": social.label, children: _jsx(Icon, { size: 16 }) }, social.label));
                                            }) })] }), personalInfo.available && (_jsxs("div", { className: "flex items-start gap-3 p-4 rounded-xl bg-success/5 border border-success/20", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0 animate-pulse" }), _jsxs("div", { children: [_jsx("p", { className: "text-success text-sm font-medium", children: "Currently available" }), _jsx("p", { className: "text-text-muted text-xs mt-0.5", children: "Open to freelance projects and full-time roles" })] })] }))] }), _jsx(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 }, children: _jsxs("div", { className: "p-8 rounded-2xl bg-bg-surface border border-bg-border relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" }), _jsxs(AnimatePresence, { mode: "wait", children: [submitStatus === "success" && (_jsxs(motion.div, { className: "flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/30 mb-6", initial: { opacity: 0, y: -10, height: 0 }, animate: { opacity: 1, y: 0, height: "auto" }, exit: { opacity: 0, y: -10, height: 0 }, transition: { duration: 0.3 }, children: [_jsx(CheckCircle, { size: 18, className: "text-success flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-success font-medium text-sm", children: "Message sent!" }), _jsx("p", { className: "text-success/80 text-xs mt-0.5", children: submitMessage })] })] }, "success")), submitStatus === "error" && (_jsxs(motion.div, { className: "flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/30 mb-6", initial: { opacity: 0, y: -10, height: 0 }, animate: { opacity: 1, y: 0, height: "auto" }, exit: { opacity: 0, y: -10, height: 0 }, transition: { duration: 0.3 }, children: [_jsx(AlertCircle, { size: 18, className: "text-error flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-error font-medium text-sm", children: "Failed to send" }), _jsx("p", { className: "text-error/80 text-xs mt-0.5", children: submitMessage })] })] }, "error"))] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", noValidate: true, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [_jsx(FormField, { label: "Full Name", error: errors.name?.message, required: true, children: _jsx("input", { ...register("name"), type: "text", placeholder: "Tope Omoniyi", className: inputClasses(!!errors.name) }) }), _jsx(FormField, { label: "Email Address", error: errors.email?.message, required: true, children: _jsx("input", { ...register("email"), type: "email", placeholder: "tope@example.com", className: inputClasses(!!errors.email) }) })] }), _jsx(FormField, { label: "Subject", error: errors.subject?.message, required: true, children: _jsx("input", { ...register("subject"), type: "text", placeholder: "Project inquiry \u2014 React + Node.js application", className: inputClasses(!!errors.subject) }) }), _jsx(FormField, { label: "Message", error: errors.message?.message, required: true, children: _jsxs("div", { className: "relative", children: [_jsx("textarea", { ...register("message"), rows: 6, placeholder: "Tell me about your project \u2014 what you're building, your timeline, and what kind of help you're looking for...", className: cn(inputClasses(!!errors.message), "resize-none") }), _jsxs("div", { className: "absolute bottom-3 right-3 text-xs text-text-muted tabular-nums", children: [_jsx("span", { className: cn(messageValue?.length > 1800 && "text-error", messageValue?.length > 1600 &&
                                                                        messageValue?.length <= 1800 &&
                                                                        "text-gold"), children: messageValue?.length || 0 }), " / 2000"] })] }) }), _jsx(motion.button, { type: "submit", disabled: isSubmitting || submitStatus === "success", className: cn("btn-primary w-full justify-center mt-2", (isSubmitting || submitStatus === "success") &&
                                                    "opacity-70 cursor-not-allowed"), whileHover: isSubmitting || submitStatus === "success"
                                                    ? {}
                                                    : { scale: 1.01 }, whileTap: isSubmitting || submitStatus === "success"
                                                    ? {}
                                                    : { scale: 0.99 }, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), "Sending..."] })) : submitStatus === "success" ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 16 }), "Message Sent!"] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { size: 16 }), "Send Message"] })) })] })] }) })] })] }) }));
}
