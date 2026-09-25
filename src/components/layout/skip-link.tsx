export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="fixed inset-s-4 top-4 z-[60] -translate-y-[200%] bg-charcoal px-5 py-3 text-white focus:translate-y-0 focus-visible:outline-gold"
    >
      {label}
    </a>
  );
}
