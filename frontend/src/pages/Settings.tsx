import { useEffect, useState } from 'react';
import { Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import type { BufferConnectResponse, BufferChannelsResponse } from '../types';

export default function Settings() {
  const [connect, setConnect] = useState<BufferConnectResponse | null>(null);
  const [channels, setChannels] = useState<BufferChannelsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, ch] = await Promise.all([api.buffer.connect(), api.buffer.channels()]);
        if (!cancelled) {
          setConnect(c);
          setChannels(ch);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConnect = () => {
    if (connect?.configured && connect.authorization_url) {
      window.location.href = connect.authorization_url;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Settings</h1>
        <p className="text-gray-500 mt-1">Integrations and account preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center shrink-0">
            <Link2 size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[var(--color-charcoal)]">Buffer</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Tendrixa sends approved content to Buffer for publishing and scheduling.
              Tendrixa is not a Buffer replacement — it is the intelligence layer that feeds into it.
            </p>

            {loading ? (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-48" />
            ) : (
              <>
                <div
                  className={`flex items-start gap-2 rounded-xl p-3 text-sm mb-4 ${
                    connect?.configured
                      ? 'bg-emerald-50 text-emerald-900'
                      : 'bg-amber-50 text-amber-900'
                  }`}
                >
                  {connect?.configured ? (
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  )}
                  <span>
                    {connect?.message ||
                      (connect?.configured
                        ? 'Buffer credentials are present. Complete OAuth to connect an account.'
                        : "Buffer isn't connected yet. Set BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET after creating your Buffer developer application.")}
                  </span>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={!connect?.configured}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#14532D] text-white font-semibold px-4 py-2.5 hover:bg-[#0f3d22] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect Buffer
                </button>

                {channels && !channels.connected && channels.message && (
                  <p className="text-xs text-gray-400 mt-3">{channels.message}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <h2 className="font-semibold text-[var(--color-charcoal)] mb-1">Environment notes</h2>
        <p className="text-sm text-gray-500">
          Real Buffer OAuth and API calls are intentionally stubbed with clear TODOs in the backend.
          See <code className="text-xs bg-gray-100 px-1 rounded">backend/app/integrations/buffer/</code> and
          the project README for the exact places to plug in credentials and official endpoints.
        </p>
      </div>
    </div>
  );
}
