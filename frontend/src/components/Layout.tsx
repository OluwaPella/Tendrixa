import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Library,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/create', label: 'Create', icon: Sparkles },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14532D] to-[#10B981] flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 16 L12 6 L20 16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 16 L12 11 L16 16" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        </svg>
      </div>
      <span className="font-semibold text-lg tracking-tight text-[var(--color-charcoal)]">
        Tendrixa
      </span>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full flex bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[var(--color-border)] transform transition-transform duration-200 lg:translate-x-0 lg:static ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-5 border-b border-[var(--color-border)]">
            <Logo />
          </div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#14532D] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-charcoal)]'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="rounded-xl bg-gradient-to-br from-[#14532D] to-[#0f3d22] p-4 text-white">
              <div className="text-xs font-medium text-emerald-200 mb-1">Upgrade to Pro</div>
              <div className="text-sm font-semibold mb-3">Unlock more features</div>
              <button className="w-full text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-charcoal)] rounded-lg py-2 hover:brightness-105 transition">
                Go Pro →
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search trends, topics..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10B981] to-[#14532D] flex items-center justify-center text-white text-sm font-semibold">
              P
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
