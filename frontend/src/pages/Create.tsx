import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Copy, RefreshCw, Check, Save, Send } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../lib/toast';
import type { ContentItem, Platform, ContentType } from '../types';

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];

const TYPES: { value: ContentType; label: string }[] = [
  { value: 'short_post', label: 'Short post' },
  { value: 'long_form', label: 'Long-form' },
  { value: 'thread', label: 'Thread' },
  { value: 'educational', label: 'Educational' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'story', label: 'Story' },
];

export default function Create() {
  const [params] = useSearchParams();
  const { toast } = useToast();
  const trendId = params.get('trendId') || undefined;
  const trendTitle = params.get('title') || '';

  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [contentType, setContentType] = useState<ContentType>('short_post');
  const [instructions, setInstructions] = useState('');
  const [body, setBody] = useState('');
  const [content, setContent] = useState<ContentItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [bufferMsg, setBufferMsg] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const result = await api.content.generate({
        trend_id: trendId,
        trend_title: trendTitle || 'Emerging trend',
        platform,
        content_type: contentType,
        additional_instructions: instructions || undefined,
      });
      setContent(result);
      setBody(result.body);
      toast('Draft generated', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const approve = async () => {
    if (!content) return;
    try {
      const updated = await api.content.update(content.id, { status: 'approved', body });
      setContent(updated);
      toast('Content approved', 'success');
      setShowPublish(true);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Update failed', 'error');
    }
  };

  const connectBuffer = async () => {
    try {
      const res = await api.buffer.connect();
      if (!res.configured) {
        setBufferMsg(
          res.message ||
            "Buffer isn't connected yet. Connect your Buffer account to publish this content. Set BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET after creating your Buffer developer application.",
        );
        return;
      }
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      }
    } catch (e) {
      setBufferMsg(e instanceof Error ? e.message : 'Could not start Buffer connection');
    }
  };

  const publish = async () => {
    if (!content) return;
    setPublishing(true);
    try {
      const res = await api.publishing.publish({
        content_id: content.id,
        publish_now: true,
      });
      if (res.success) {
        toast('Sent to Buffer', 'success');
      } else {
        setBufferMsg(res.message);
        toast(res.message, 'error');
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Publish failed', 'error');
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    // Auto-generate when arriving from a trend with title
    if (trendTitle && !content) {
      // leave manual for control
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Content Studio</h1>
        <p className="text-gray-500 mt-1">
          {trendTitle ? (
            <>
              Creating from trend: <span className="font-medium text-[var(--color-charcoal)]">{trendTitle}</span>
            </>
          ) : (
            'Generate platform-aware drafts, then review and approve before publishing.'
          )}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Extra instructions (optional)
          </label>
          <input
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Focus on practical tips for small teams"
            className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm"
          />
        </div>

        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-2 bg-[#14532D] text-white font-semibold rounded-xl px-5 py-2.5 hover:bg-[#0f3d22] disabled:opacity-60 transition"
        >
          {generating ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles size={16} /> Generate draft
            </>
          )}
        </button>
      </div>

      {content && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-charcoal)]">Draft</h2>
            <span className="text-xs font-medium rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 capitalize">
              {content.status}
            </span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-[var(--color-border)] p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(body);
                toast('Copied', 'success');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Copy size={14} /> Copy
            </button>
            <button
              onClick={generate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
            <button
              onClick={async () => {
                if (!content) return;
                await api.content.update(content.id, { body });
                toast('Saved', 'success');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-gray-50"
            >
              <Save size={14} /> Save
            </button>
            <button
              onClick={approve}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700"
            >
              <Check size={14} /> Approve
            </button>
          </div>
        </div>
      )}

      {showPublish && content && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-[var(--color-charcoal)]">Publish to Buffer</h2>
          <p className="text-sm text-gray-600">
            Buffer isn't connected yet. Connect your Buffer account to publish this content.
          </p>
          {bufferMsg && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4">
              {bufferMsg}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={connectBuffer}
              className="inline-flex items-center gap-2 bg-[#14532D] text-white font-semibold rounded-xl px-4 py-2.5 hover:bg-[#0f3d22]"
            >
              Connect Buffer
            </button>
            <button
              onClick={publish}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              <Send size={14} />
              {publishing ? 'Sending…' : 'Try publish (will show config status)'}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Once you add real Buffer credentials, this flow will complete OAuth and send posts without UI changes.
          </p>
        </div>
      )}
    </div>
  );
}
