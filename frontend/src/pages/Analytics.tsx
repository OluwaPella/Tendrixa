import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Insights on trends you tracked and content performance (coming online with real data).
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 text-center">
        <BarChart3 className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 text-sm">
          Analytics will light up once content is published through Buffer and engagement data is available.
        </p>
      </div>
    </div>
  );
}
