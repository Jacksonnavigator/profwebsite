export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center">
      <span className="leading-tight">
        <span className={`block text-xs font-medium ${dark ? "text-slate-600" : "text-white/65"}`}>Sustainable Energy Engineering</span>
      </span>
    </span>
  );
}
