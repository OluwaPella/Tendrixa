const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || body.message || JSON.stringify(body);
    } catch {
      // ignore
    }
    throw new Error(typeof detail === 'string' ? detail : 'Request failed');
  }
  return res.json();
}

export const api = {
  health: () => request<{ status: string; buffer_configured: boolean }>('/health'),

  trends: {
    list: (params?: { category?: string; search?: string; sort?: string; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      if (params?.sort) q.set('sort', params.sort);
      if (params?.page) q.set('page', String(params.page));
      const qs = q.toString();
      return request<{ items: import('../types').Trend[]; total: number }>(`/trends${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<import('../types').TrendDetail>(`/trends/${id}`),
    analyse: (id: string) =>
      request<import('../types').TrendAnalysis>(`/trends/${id}/analyse`, { method: 'POST' }),
  },

  content: {
    list: (params?: { status?: string }) => {
      const q = params?.status ? `?status=${params.status}` : '';
      return request<{ items: import('../types').ContentItem[]; total: number }>(`/content${q}`);
    },
    get: (id: string) => request<import('../types').ContentItem>(`/content/${id}`),
    generate: (body: {
      trend_id?: string;
      trend_title?: string;
      trend_context?: string;
      platform: string;
      content_type: string;
      additional_instructions?: string;
    }) =>
      request<import('../types').ContentItem>('/content/generate', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Partial<import('../types').ContentItem>) =>
      request<import('../types').ContentItem>(`/content/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },

  buffer: {
    connect: () => request<import('../types').BufferConnectResponse>('/buffer/connect'),
    channels: () => request<import('../types').BufferChannelsResponse>('/buffer/channels'),
  },

  publishing: {
    publish: (body: { content_id: string; channel_ids?: string[]; publish_now?: boolean }) =>
      request<{ success: boolean; message: string; buffer_configured: boolean }>(
        '/publishing/publish',
        { method: 'POST', body: JSON.stringify(body) },
      ),
    schedule: (body: {
      content_id: string;
      channel_ids?: string[];
      scheduled_at: string;
    }) =>
      request<{ success: boolean; message: string; buffer_configured: boolean }>(
        '/publishing/schedule',
        { method: 'POST', body: JSON.stringify(body) },
      ),
  },
};
