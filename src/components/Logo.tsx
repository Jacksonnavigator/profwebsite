export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span aria-hidden="true" className="h-10 w-1 shrink-0 rounded-full bg-solar" />
      <span className="leading-tight">
        <span className={`block font-display text-base font-semibold tracking-[0.02em] ${dark ? "text-ink" : "text-white"}`}>THOMAS T. KIVEVELE</span>
        <span className={`mt-1 block text-xs font-medium ${dark ? "text-slate-600" : "text-white/70"}`}>Professor | Innovator | Research Leader</span>
      </span>
    </span>
  );
}
