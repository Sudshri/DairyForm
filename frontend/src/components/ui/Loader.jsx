import { MilkDrop } from './MilkWave';
import logo from '@/assets/logo.png';

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: '#F0F9FF' }}>
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-sky-100 border-t-[#17C0F2] animate-spin absolute" />
        <img src={logo} alt="EverFresh" className="w-16 h-16 object-contain" />
      </div>
      <p className="text-sm font-semibold tracking-wide" style={{ color: '#17C0F2' }}>EverFresh Dairy</p>
    </div>
  );
}
