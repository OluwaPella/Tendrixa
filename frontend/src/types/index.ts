export type Platform = 'linkedin' | 'x' | 'facebook' | 'instagram';
export type ContentType =
  | 'short_post'
  | 'long_form'
  | 'thread'
  | 'educational'
  | 'opinion'
  | 'announcement'
  | 'story';
export type ContentStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'failed';

export interface Trend {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  momentum: number;
  growth_pct: number;
  opportunity_score: number;
  why_it_matters?: string | null;
  related_topics: string[];
  sources: { name: string; url?: string | null }[];
  image_url?: string | null;
  is_featured: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrendAnalysis {
  id: string;
  trend_id: string;
  trend_score: number;
  momentum: number;
  audience_fit: number;
  content_potential: number;
  summary?: string | null;
  audience_insights?: string | null;
  content_opportunities: string[];
  created_at: string;
}

export interface TrendDetail extends Trend {
  analysis?: TrendAnalysis | null;
}

export interface ContentItem {
  id: string;
  user_id?: string | null;
  trend_id?: string | null;
  title?: string | null;
  body: string;
  platform: Platform;
  content_type: ContentType;
  status: ContentStatus;
  source_trend_title?: string | null;
  created_at: string;
  updated_at: string;
  scheduled_at?: string | null;
  published_at?: string | null;
}

export interface BufferConnectResponse {
  authorization_url: string;
  configured: boolean;
  message?: string | null;
}

export interface BufferChannelsResponse {
  channels: { id: string; service: string; name: string; avatar?: string }[];
  configured: boolean;
  connected: boolean;
  message?: string | null;
}
