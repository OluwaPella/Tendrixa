# Tendrixa

**Discover · Create · Grow**

Tendrixa is an AI-powered trend intelligence and content publishing platform.

It helps creators and businesses:

1. Discover emerging trends  
2. Understand why a trend matters  
3. Score relevance / opportunity  
4. Generate platform-aware content  
5. Review and approve drafts  
6. Send approved content to **Buffer** for publishing or scheduling  

Tendrixa is **not** a Buffer replacement. It is the intelligence and content-creation layer that feeds into Buffer.

---

## Problem

Creators and teams waste time guessing what to post. Trends move fast; turning signal into on-brand content for multiple platforms is slow. Tendrixa closes that gap: discover → analyse → generate → review → publish via Buffer.

## Features

- **Trend discovery** with search, filters, categories and momentum signals  
- **Trend detail & internal opportunity scoring**  
- **AI Content Studio** (platform + content-type aware drafts)  
- **Content library** (draft / approved / scheduled / published)  
- **Buffer integration architecture** (OAuth + publish/schedule placeholders ready for real credentials)  
- Polished SaaS UI aligned with the Tendrixa green identity  

## Tech stack

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Lucide |
| Backend  | Python, FastAPI, SQLModel, Alembic, HTTPX, Pydantic |
| Data     | SQLite (local) / PostgreSQL (production)   |
| Publish  | Buffer (OAuth + API — placeholders until developer app is configured) |

## Architecture (high level)

```
Trend Sources → Trend Discovery → Trend Analysis → Opportunity Scoring
        → AI Content Engine → Human Approval → Buffer OAuth → Buffer API
        → Scheduled / Published
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for more detail.

## Project structure

```
tendrixa/
├── frontend/          # Vite + React app
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── api/
│   │   ├── integrations/buffer/   # OAuth + client + service (TODOs marked)
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ...
│   ├── requirements.txt
│   └── .env.example
├── ARCHITECTURE.md
└── README.md
```

## Local setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- (Optional) PostgreSQL

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # edit as needed
uvicorn app.main:app --reload --port 8000
```

Health: `GET http://localhost:8000/api/v1/health`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173  

The Vite dev server proxies `/api` to the backend.

### Environment variables

See `backend/.env.example`. Important keys:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite or Postgres connection string |
| `SECRET_KEY` | App secret |
| `AI_API_KEY` | Optional; template generator used when empty |
| `BUFFER_CLIENT_ID` | From Buffer developer app |
| `BUFFER_CLIENT_SECRET` | From Buffer developer app |
| `BUFFER_REDIRECT_URI` | Must match Buffer app settings (default local callback) |
| `BUFFER_API_BASE_URL` | Official API base (confirm against current Buffer docs) |

**Never commit a real `.env` file.**

## Buffer configuration

1. Create a Buffer developer application.  
2. Set the redirect URI to match `BUFFER_REDIRECT_URI`.  
3. Put `BUFFER_CLIENT_ID` and `BUFFER_CLIENT_SECRET` in `.env`.  
4. Replace the `TODO(BUFFER)` sections in:

   - `backend/app/integrations/buffer/oauth.py`  
   - `backend/app/integrations/buffer/client.py`  
   - `backend/app/integrations/buffer/service.py`  
   - `backend/app/config.py` (confirm base URL if needed)

Until those are filled, the UI will clearly say that Buffer is not connected and will not fake a successful connection or publish.

## Development data

Trend data is served by `MockTrendProvider` (`backend/app/services/trend_provider.py`).  
Swap to `RealTrendProvider` when a real trend source is available. The rest of the app depends on the `TrendProvider` interface.

## Scripts

| Command | Where | What |
|---------|--------|------|
| `npm run dev` | frontend | Dev server |
| `npm run build` | frontend | Production build |
| `uvicorn app.main:app --reload` | backend | API server |

## Safety / GitHub

This repository is prepared for you to copy into your existing GitHub repo.  
No commits, pushes, or remote configuration are performed by the scaffolding process.

## License

Proprietary / competition submission — Buffer Commit 2026.
