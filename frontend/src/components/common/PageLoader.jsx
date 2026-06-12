export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
