import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import type { TrendDetail as TrendDetailType } from '../types';

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-[var(--color-charcoal)]">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#14532D] to-[#10B981] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function TrendDetail() {
  const { id } = useParams<{ id: string }>();
  const [trend, setTrend] = useState<TrendDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.trends.get(id);
        if (!cancelled) setTrend(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load trend');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-64 bg-white rounded-2xl border animate-pulse" />
      </div>
    );
  }

  if (error || !trend) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500 mb-4">{error || 'Trend not found'}</p>
        <Link to="/discover" className="text-[#14532D] font-medium hover:underline">
          ← Back to Discover
        </Link>
      </div>
    );
  }

  const analysis = trend.analysis;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-charcoal)]"
      >
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">
            {trend.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <TrendingUp size={12} /> ↑ {trend.growth_pct}% this week
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--color-charcoal)] tracking-tight mb-4">
          {trend.title}
        </h1>
        {trend.description && (
          <p className="text-gray-600 leading-relaxed mb-6">{trend.description}</p>
        )}
        {trend.why_it_matters && (
          <div className="rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] p-4 mb-6">
            <div className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-1">
              Why it matters
            </div>
            <p className="text-sm text-gray-700">{trend.why_it_matters}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-4 mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Tendrixa indicators
            </h2>
            <p className="text-xs text-gray-400 -mt-2">
              Internal scores to help prioritise — not scientifically validated measurements.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <ScoreBar label="Trend Score" value={analysis.trend_score} />
              <ScoreBar label="Momentum" value={analysis.momentum} />
              <ScoreBar label="Audience Fit" value={analysis.audience_fit} />
              <ScoreBar label="Content Potential" value={analysis.content_potential} />
            </div>
            {analysis.content_opportunities?.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-[var(--color-charcoal)] mb-2">
                  Content opportunities
                </div>
                <ul className="space-y-1.5">
                  {analysis.content_opportunities.map((op, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {op}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {trend.related_topics?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {trend.related_topics.map((rt) => (
              <span
                key={rt}
                className="text-xs rounded-full border border-[var(--color-border)] px-3 py-1 text-gray-600"
              >
                {rt}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/create?trendId=${trend.id}&title=${encodeURIComponent(trend.title)}`}
          className="inline-flex items-center gap-2 bg-[#14532D] text-white font-semibold rounded-xl px-5 py-3 hover:bg-[#0f3d22] transition shadow-sm"
        >
          <Sparkles size={18} />
          Create Content →
        </Link>
      </div>
    </div>
  );
}
