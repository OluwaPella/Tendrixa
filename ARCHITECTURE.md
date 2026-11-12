# Tendrixa Architecture

## Product flow

```
Trend Sources
      ↓
Trend Discovery
      ↓
Trend Analysis
      ↓
Opportunity Scoring
      ↓
AI Content Engine
      ↓
Human Approval
      ↓
Buffer OAuth
      ↓
Buffer API
      ↓
Scheduled / Published
```

Tendrixa owns discovery, analysis, generation and approval.  
Buffer owns multi-channel scheduling and delivery.

## Backend layers

- **API** (`app/api/`) — thin route handlers, versioned under `/api/v1`
- **Services** (`app/services/`) — business logic (trend provider, content generator)
- **Integrations** (`app/integrations/buffer/`) — OAuth, HTTP client, publish helpers
- **Models / Schemas** — SQLModel tables + Pydantic request/response models
- **Config** — `pydantic-settings` from environment / `.env`

## Trend providers

```
TrendProvider (interface)
    ├── MockTrendProvider   # development / demo
    └── RealTrendProvider   # future external sources
```

Routes never import mock data directly.

## Buffer integration (prepared, not live)

```
backend/app/integrations/buffer/
├── client.py      # HTTP client — TODOs for real paths
├── oauth.py       # get_authorization_url, exchange_code_for_token, handle_oauth_callback
├── schemas.py     # request/response shapes
└── service.py     # get_channels, create_post, schedule_post
```

All real API paths and request bodies are marked:

```python
# TODO(BUFFER):
# Replace this placeholder with the official Buffer API endpoint
# after the Buffer developer application has been configured.
```

Config flags:

- `BUFFER_CLIENT_ID`
- `BUFFER_CLIENT_SECRET`
- `BUFFER_REDIRECT_URI`
- `BUFFER_API_BASE_URL`

`settings.is_buffer_configured` drives UI messaging and API behaviour.  
No successful connection or publish is simulated.

## Content lifecycle

```
generate → draft → edit → approve → (connect Buffer) → select channel → publish / schedule
```

Content is never auto-published.

## Frontend

- React + TypeScript + Vite + Tailwind v4
- App shell with sidebar navigation
- Pages: Dashboard, Discover, Trend Detail, Create (Studio), Library, Schedule, Analytics, Settings
- API client in `src/lib/api.ts` (proxied in dev)
- Toast notifications and clear empty / error / Buffer-pending states

## Database (SQLModel)

- User  
- Trend / TrendAnalysis  
- Content / ContentVariant  
- PublishingConnection / ScheduledPost  

Local default: SQLite via `aiosqlite`. Production: PostgreSQL.

## Extensibility

- Swap trend source by implementing `TrendProvider`
- Swap AI generator by extending `ContentGenerator` when `AI_API_KEY` is set
- Complete Buffer by filling TODOs and wiring token storage on the user connection model
