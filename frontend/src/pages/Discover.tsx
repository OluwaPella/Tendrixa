import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Bookmark, Filter } from 'lucide-react';
import { api } from '../lib/api';
import type { Trend } from '../types';

const CATEGORIES = [
  'All',
  'Technology',
  'AI',
  'Business',
  'Finance',
  'Creator Economy',
  'Lifestyle',
  'Sports',
  'Entertainment',
  'Science',
];

export default function Discover() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('momentum');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await api.trends.list({
          category: category === 'All' ? undefined : category,
          search: search || undefined,
          sort,
        });
        if (!cancelled) setTrends(res.items);
      } catch {
        if (!cancelled) setTrends([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, search, sort]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Discover</h1>
        <p className="text-gray-500 mt-1">Browse emerging topics and find your next content angle.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trends..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm"
        >
          <option value="momentum">Sort: Momentum</option>
          <option value="growth">Sort: Growth</option>
          <option value="opportunity">Sort: Opportunity</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              category === c
                ? 'bg-[#14532D] text-white'
                : 'bg-white border border-[var(--color-border)] text-gray-600 hover:border-emerald-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white border animate-pulse" />
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-border)]">
          <Filter className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No trends match your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((t) => (
            <Link
              key={t.id}
              to={`/trends/${t.id}`}
              className="bg-white rounded-2xl border border-[var(--color-border)] p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">
                  {t.category}
                </span>
                {t.is_saved && <Bookmark size={16} className="text-[#14532D] fill-current" />}
              </div>
              <h3 className="font-semibold text-[var(--color-charcoal)] line-clamp-2 mb-2 flex-1">
                {t.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {t.why_it_matters || t.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <TrendingUp size={14} />↑ {t.growth_pct}%
                </span>
                <span className="text-gray-400">Opp. {t.opportunity_score}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
