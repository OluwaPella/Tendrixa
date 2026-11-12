import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import type { ContentItem, ContentStatus } from '../types';

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  approved: 'bg-emerald-50 text-emerald-800',
  scheduled: 'bg-blue-50 text-blue-800',
  published: 'bg-violet-50 text-violet-800',
  failed: 'bg-red-50 text-red-800',
};

export default function Library() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.content.list(
          filter === 'all' ? undefined : { status: filter },
        );
        if (!cancelled) setItems(res.items);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Content Library</h1>
          <p className="text-gray-500 mt-1">Drafts, approved posts, scheduled and published.</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center rounded-xl bg-[#14532D] text-white text-sm font-semibold px-4 py-2.5 hover:bg-[#0f3d22]"
        >
          New content
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'draft', 'approved', 'scheduled', 'published'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ${
              filter === s
                ? 'bg-[#14532D] text-white'
                : 'bg-white border border-[var(--color-border)] text-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-border)]">
          <FileText className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500 mb-4">No content yet.</p>
          <Link to="/create" className="text-[#14532D] font-medium hover:underline">
            Create your first draft →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-[var(--color-border)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase text-gray-400">{c.platform}</span>
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 capitalize ${STATUS_STYLES[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--color-charcoal)] line-clamp-1">
                  {c.title || c.source_trend_title || 'Untitled'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created {new Date(c.created_at).toLocaleString()}
                  {c.scheduled_at && ` · Scheduled ${new Date(c.scheduled_at).toLocaleString()}`}
                </p>
              </div>
              <Link
                to={`/create`}
                className="text-sm text-[#14532D] font-medium inline-flex items-center gap-1 hover:underline"
              >
                Open <ExternalLink size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
