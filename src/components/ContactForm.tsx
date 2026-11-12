import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { contact } from "../data/site";

const topics = ["Research partnership", "Consultancy", "Speaking invitation", "Graduate study", "Media", "Something else"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", org: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const composeDraft = () => {
    const subject = `${values.topic}: ${values.name.trim()}${values.org.trim() ? ` (${values.org.trim()})` : ""}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}${values.org.trim() ? `\n${values.org.trim()}` : ""}`;
    return { subject, body, text: `To: ${contact.emailPrimary}\nSubject: ${subject}\n\n${body}` };
  };

  const validate = (v = values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "Add your name so he knows who is writing.";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
    if (v.message.trim().length < 10) e.message = "Write a short message, at least a sentence.";
    return e;
  };

  const set = (k: keyof typeof values, val: string) => {
    const next = { ...values, [k]: val };
    setValues(next);
    if (errors[k as keyof Errors]) setErrors((prev) => ({ ...prev, [k]: validate(next)[k as keyof Errors] }));
  };

  const blur = (k: keyof Errors) => {
    if (values[k]) setErrors((prev) => ({ ...prev, [k]: validate()[k] }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: (document.getElementById("cf-website") as HTMLInputElement | null)?.value ?? "", name: values.name.trim(), email: values.email.trim(), org: values.org.trim(), message: values.message.trim() }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please use the email draft instead.");
      setStatus("Your message was accepted for delivery. Thank you for getting in touch.");
      setValues({ name: "", email: "", org: "", topic: topics[0], message: "" });
      setManualCopy(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Your message could not be sent.";
      setStatus(`${message} You can copy the email draft below and send it to ${contact.emailPrimary}.`);
      setManualCopy(true);
    } finally {
      setSubmitting(false);
    }
  };

  const copyDraft = async () => {
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    const draft = composeDraft().text;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(draft);
      setManualCopy(false);
      setStatus(`Draft copied. Paste it into an email to ${contact.emailPrimary} and send it.`);
    } catch {
      setManualCopy(true);
      setStatus("Clipboard access isn't available. Select the draft below, copy it, and email it directly.");
    }
  };

  const field = "mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100";
  const errField = "border-red-500 focus:border-red-500 focus:ring-red-100";

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-6 shadow-lift sm:p-8">
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Leave this field empty</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="text-sm font-semibold">Your name (required)</label>
          <input id="cf-name" required maxLength={120} autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} className={`${field} ${errors.name ? errField : "border-slate-200"}`} />
          {errors.name && <p id="cf-name-err" className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="text-sm font-semibold">Email (required)</label>
          <input id="cf-email" type="email" required maxLength={254} autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} className={`${field} ${errors.email ? errField : "border-slate-200"}`} />
          {errors.email && <p id="cf-email-err" className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="cf-org" className="text-sm font-semibold">Organisation <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="cf-org" maxLength={160} autoComplete="organization" value={values.org} onChange={(e) => set("org", e.target.value)} className={`${field} border-slate-200`} />
        </div>
        <div>
          <label htmlFor="cf-topic" className="text-sm font-semibold">Topic</label>
          <select id="cf-topic" value={values.topic} onChange={(e) => set("topic", e.target.value)} className={`${field} border-slate-200`}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="text-sm font-semibold">Message (required)</label>
          <textarea id="cf-message" required maxLength={10000} rows={5} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")}
            aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-err" : undefined} className={`${field} resize-y ${errors.message ? errField : "border-slate-200"}`} />
          {errors.message && <p id="cf-message-err" className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button type="submit" disabled={submitting} className="btn-teal disabled:cursor-wait disabled:opacity-60">
          <Send size={18} aria-hidden="true" /> {submitting ? "Sending…" : "Send message"}
        </button>
        <button type="button" onClick={copyDraft} className="btn-outline">Copy email draft</button>
        <p className="basis-full text-sm text-slate-500" aria-live="polite">
          {status || "Submit your message to the listed contact. If online delivery is unavailable, you can copy an email draft instead."}
        </p>
      </div>
      {manualCopy && (
        <div className="mt-4">
          <label htmlFor="cf-draft-fallback" className="text-sm font-semibold">Email draft to copy</label>
          <textarea id="cf-draft-fallback" readOnly rows={7} value={composeDraft().text} onFocus={(e) => e.currentTarget.select()} className={`${field} resize-y`} />
        </div>
      )}
    </form>
  );
}
