import { Link } from 'react-router-dom';
import { Calendar, Link2 } from 'lucide-react';

export default function Schedule() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Schedule</h1>
        <p className="text-gray-500 mt-1">
          Choose channel, time, and send approved content to Buffer.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-sm">
        <Calendar className="mx-auto text-emerald-500 mb-4" size={40} />
        <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
          Publishing via Buffer
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          Buffer isn't connected yet. Connect your Buffer account to publish or schedule content
          from Tendrixa. The UI is ready — only the developer credentials and API implementation
          are pending.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/settings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] text-white font-semibold px-5 py-2.5 hover:bg-[#0f3d22]"
          >
            <Link2 size={16} /> Connect Buffer
          </Link>
          <Link
            to="/library"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Go to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
