import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "emailjs-com";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Replace these with your real values from https://www.emailjs.com
const EMAILJS_SERVICE_ID  = "service_t9wyhci";
const EMAILJS_TEMPLATE_ID = "template_fb4tzs8";
const EMAILJS_PUBLIC_KEY  = "09iZyP_yUrwHYvgmS";

// Optional: paste your Zapier / Make webhook URL here to also log to Google Sheets
// Leave as empty string "" to skip.
const GOOGLE_SHEETS_WEBHOOK = "";

// ─── Load canvas-confetti from CDN ────────────────────────────────────────────
function useConfetti() {
  const confettiRef = useRef(null);
  useEffect(() => {
    if (window.confetti) { confettiRef.current = window.confetti; return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    script.onload = () => { confettiRef.current = window.confetti; };
    document.head.appendChild(script);
  }, []);

  const fire = useCallback((originX, originY) => {
    const fn = confettiRef.current;
    if (!fn) return;
    const colors = ["#002395", "#ED2939", "#ffffff", "#c9a84c"];
    fn({ particleCount: 80, spread: 70, origin: { x: originX, y: originY }, colors, startVelocity: 45, ticks: 120, zIndex: 9999 });
    fn({ particleCount: 30, angle: 60,  spread: 55, startVelocity: 60, origin: { x: 0, y: 0.6 }, colors });
    fn({ particleCount: 30, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.6 }, colors });
  }, []);

  return fire;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function MailIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function PlusIcon({ className, style }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

// ─── Shared field helpers ──────────────────────────────────────────────────────
const baseInput = {
  border: "1.5px solid #e5e7eb",
  borderRadius: 9,
  padding: "11px 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13.5,
  color: "#1a1a2e",
  outline: "none",
  background: "#fff",
  width: "100%",
  transition: "border-color .2s, box-shadow .2s",
};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ fontSize: 11.5, fontWeight: 600, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".5px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function FInput({ name, value, onChange, type = "text", placeholder, required }) {
  return (
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      style={baseInput}
      onFocus={(e) => { e.target.style.borderColor = "#002395"; e.target.style.boxShadow = "0 0 0 3px rgba(0,35,149,0.08)"; }}
      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    />
  );
}

function FSelect({ name, value, onChange, required, children }) {
  const chevron = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/></svg>`);
  return (
    <select
      name={name} value={value} onChange={onChange} required={required}
      style={{ ...baseInput, appearance: "none", backgroundImage: `url("data:image/svg+xml,${chevron}")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "15px", paddingRight: 36, cursor: "pointer" }}
      onFocus={(e) => { e.target.style.borderColor = "#002395"; e.target.style.boxShadow = "0 0 0 3px rgba(0,35,149,0.08)"; }}
      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
    >
      {children}
    </select>
  );
}

// ─── Contact info row ──────────────────────────────────────────────────────────
function ContactInfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: "#eef1fc" }}>
        <Icon className="h-4 w-4" style={{ color: "#002395" }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "#00185a" }}>{label}</p>
        <p className="text-xs" style={{ color: "#6b7280" }}>{value}</p>
      </div>
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
export default function ContactSection() {
  const empty = { firstName: "", lastName: "", email: "", phone: "", studyLevel: "", fieldOfStudy: "", message: "" };
  const [form, setForm]       = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fireConfetti          = useConfetti();
  const btnRef                = useRef(null);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ── 1. Send email via EmailJS ──────────────────────────────────────────
      // The `form` object keys become {{variable}} placeholders in your
      // EmailJS template. Make sure your template uses:
      // {{firstName}}, {{lastName}}, {{email}}, {{phone}},
      // {{studyLevel}}, {{fieldOfStudy}}, {{message}}
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          ...form,
          // Convenience field so your template can show a full name easily
          fullName: `${form.firstName} ${form.lastName}`,
          // Timestamp for your records
          submittedAt: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris" }),
        },
        EMAILJS_PUBLIC_KEY
      );

      // ── 2. (Optional) Send to Google Sheets via Zapier / Make webhook ─────
      // Create a Zap/Scenario: Webhook → Google Sheets "Add Row".
      // Map the JSON fields below to the columns you want.
      if (GOOGLE_SHEETS_WEBHOOK) {
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName:    form.firstName,
            lastName:     form.lastName,
            email:        form.email,
            phone:        form.phone,
            studyLevel:   form.studyLevel,
            fieldOfStudy: form.fieldOfStudy,
            message:      form.message,
            submittedAt:  new Date().toISOString(),
            source:       "website-contact-form",
          }),
        });
      }

      // ── 3. Success ─────────────────────────────────────────────────────────
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        fireConfetti(
          (rect.left + rect.width  / 2) / window.innerWidth,
          (rect.top  + rect.height / 2) / window.innerHeight,
        );
      }
      setSubmitted(true);
      setForm(empty);
      setTimeout(() => setSubmitted(false), 4000);

    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MailIcon,   label: "Email",          value: "azconsultations@gmail.com" },
    { icon: PhoneIcon,  label: "Office (France)", value: "+33 1 83 96 57 23" },
    { icon: PhoneIcon,  label: "Mobile",          value: "+33 6 76 90 39 22" },
    { icon: MapPinIcon, label: "Address",         value: "77 Rue du Faubourg Saint-Martin, 75010 Paris, France" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
        select option { color: #1a1a2e; }
      `}</style>

      <section id="contact" className="py-20 px-6" style={{ background: "#fff" }}>

        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#eef1fc", color: "#002395", border: "1px solid rgba(0,35,149,0.15)" }}
          >
            Get in Touch
          </span>
          <h2
            className="font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.2, color: "#00185a" }}
          >
            Start Your French{" "}
            <em style={{ fontStyle: "italic", color: "#002395" }}>Study Journey</em> Today
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#6b7280", lineHeight: 1.75 }}>
            Fill out the form and our expert counselors will map out your personalised pathway to studying in France — within 24 hours.
          </p>
        </div>

        {/* ── Card ── */}
        <div className="max-w-5xl mx-auto relative">
          <PlusIcon className="absolute -top-3 -left-3 h-6 w-6 hidden sm:block"  style={{ color: "#002395" }} />
          <PlusIcon className="absolute -top-3 -right-3 h-6 w-6 hidden sm:block" style={{ color: "#002395" }} />
          <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 hidden sm:block"  style={{ color: "#002395" }} />
          <PlusIcon className="absolute -bottom-3 -right-3 h-6 w-6 hidden sm:block" style={{ color: "#002395" }} />

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 20px 60px rgba(0,24,90,0.09)" }}
          >
            {/* ── Left info panel ── */}
            <div
              className="lg:col-span-2 p-8 md:p-10 flex flex-col justify-between gap-8"
              style={{ background: "#faf8f4" }}
            >
              <div>
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,2.8vw,32px)", lineHeight: 1.2, color: "#00185a" }}
                >
                  Contact With Us
                </h3>
                <p className="text-sm mb-5 max-w-md" style={{ color: "#6b7280", lineHeight: 1.75 }}>
                  If you have any questions regarding our services or need help, please fill out the form. We do our best to respond within 1 business day.
                </p>
                <div>
                  {contactInfo.map((info, i) => <ContactInfoItem key={i} {...info} />)}
                </div>
              </div>

              <a
                href="https://api.whatsapp.com/send/?phone=33652722078"
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 self-start rounded-xl px-5 py-3 font-semibold text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "#25D366", color: "#fff", boxShadow: "0 6px 20px rgba(37,211,102,0.28)" }}
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp · +33 6 52 72 20 78
              </a>
            </div>

            {/* ── Right form panel ── */}
            <div
              className="p-6 flex items-start"
              style={{ background: "#fff", borderTop: "1.5px solid #e5e7eb", borderLeft: "1.5px solid #e5e7eb" }}
            >
              {submitted ? (
                <div className="w-full text-center py-10">
                  <div
                    className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ background: "#eef1fc", border: "2px solid #002395", color: "#002395" }}
                  >✓</div>
                  <p className="font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#00185a" }}>
                    Message Sent!
                  </p>
                  <p className="text-sm" style={{ color: "#6b7280" }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                  <p className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#00185a" }}>
                    Request a Free Consultation
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="First Name">
                      <FInput name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ahmad" required />
                    </Field>
                    <Field label="Last Name">
                      <FInput name="lastName" value={form.lastName} onChange={handleChange} placeholder="Syed" required />
                    </Field>
                  </div>

                  <Field label="Email Address">
                    <FInput type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                  </Field>

                  <Field label="WhatsApp / Phone">
                    <FInput type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+33 or your country code" />
                  </Field>

                  <Field label="Study Level">
                    <FSelect name="studyLevel" value={form.studyLevel} onChange={handleChange} required>
                      <option value="">Select Level</option>
                      <option>Bachelor's (Licence)</option>
                      <option>Master's</option>
                      <option>PhD / Doctorate</option>
                      <option>Grande École Prep</option>
                      <option>Language Course Only</option>
                    </FSelect>
                  </Field>

                  <Field label="Field of Study">
                    <FSelect name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} required>
                      <option value="">Select Field</option>
                      <option>Business & Management</option>
                      <option>Engineering & Tech</option>
                      <option>Medicine & Health</option>
                      <option>Law & Political Science</option>
                      <option>Arts & Humanities</option>
                      <option>Sciences & Research</option>
                      <option>Architecture & Design</option>
                    </FSelect>
                  </Field>

                  <Field label="Message (optional)">
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell us about your goals, questions, or current situation…"
                      rows={3}
                      style={{ ...baseInput, resize: "none" }}
                      onFocus={(e) => { e.target.style.borderColor = "#002395"; e.target.style.boxShadow = "0 0 0 3px rgba(0,35,149,0.08)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                    />
                  </Field>

                  {/* Error message */}
                  {error && (
                    <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca" }}>
                      {error}
                    </p>
                  )}

                  <button
                    ref={btnRef}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      background: loading ? "#6b7280" : "#002395",
                      color: "#fff",
                      boxShadow: loading ? "none" : "0 8px 24px rgba(0,35,149,0.22)",
                      marginTop: 2,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending…" : "Get My Free Consultation →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </section>
    </>
  );
}