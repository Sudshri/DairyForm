import { MilkDrop } from './MilkWave';

export function MilkLoader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative flex gap-2">
        {[0, 0.3, 0.6].map((delay) => (
          <div
            key={delay}
            className="w-3 h-3 rounded-full bg-blue-400 animate-bounce-soft"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-5 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="flex justify-between items-center">
          <div className="skeleton h-7 w-20 rounded-full" />
          <div className="skeleton h-10 w-10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-milk-soft gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🥛</div>
      </div>
      <p className="text-slate-400 font-accent">Loading DairyForm…</p>
    </div>
  );
}
