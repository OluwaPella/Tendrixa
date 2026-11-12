import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, TrendingUp, Target, Bookmark, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { Trend } from '../types';

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center">
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-[var(--color-charcoal)]">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [featured, setFeatured] = useState<Trend | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.trends.list({ sort: 'momentum' });
        if (cancelled) return;
        setTrends(res.items.slice(0, 3));
        setFeatured(res.items.find((t) => t.is_featured) || res.items[0] || null);
      } catch {
        // keep empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--color-charcoal)] tracking-tight">
          {greeting}
        </h1>
        <p className="text-gray-500 mt-1">Discover what's gaining attention.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Trending topics" value={trends.length || '—'} sub="This week" />
        <StatCard icon={Flame} label="Momentum" value="High" sub="Across AI & Tech" />
        <StatCard icon={Target} label="Opportunity" value="Strong" sub="3 high-fit trends" />
        <StatCard icon={FileText} label="Draft content" value="—" sub="Ready to review" />
      </div>

      {/* Featured */}
      {featured && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f3d22] via-[#14532D] to-[#0a2918] text-white p-6 lg:p-8 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 rounded-full px-3 py-1 mb-3">
                <Flame size={14} className="text-[var(--color-accent)]" />
                Trending Now
              </div>
              <h2 className="text-xl lg:text-2xl font-semibold leading-snug mb-2">
                {featured.title}
              </h2>
              <p className="text-emerald-100/90 text-sm mb-4 max-w-xl">
                Up {featured.growth_pct}% this week · {featured.category}
              </p>
              <Link
                to={`/trends/${featured.id}`}
                className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-charcoal)] font-semibold text-sm rounded-xl px-4 py-2.5 hover:brightness-105 transition"
              >
                Explore Trend <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hidden lg:flex w-40 h-40 rounded-2xl bg-white/10 backdrop-blur items-center justify-center">
              <Sparkles size={48} className="text-[var(--color-accent)] opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Top trends */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-charcoal)]">Top Trends</h3>
          <Link to="/discover" className="text-sm font-medium text-[#14532D] hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {trends.map((t) => (
              <Link
                key={t.id}
                to={`/trends/${t.id}`}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition group"
              >
                <div className="text-xs font-medium text-emerald-700 bg-emerald-50 inline-block rounded-full px-2.5 py-0.5 mb-3">
                  #{t.category}
                </div>
                <h4 className="font-semibold text-[var(--color-charcoal)] group-hover:text-[#14532D] line-clamp-2 mb-2">
                  {t.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <TrendingUp size={14} />↑ {t.growth_pct}%
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
