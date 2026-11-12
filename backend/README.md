# Tendrixa Backend

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

## Buffer TODOs

Search the codebase for `TODO(BUFFER)` — primarily under:

- `app/integrations/buffer/oauth.py`
- `app/integrations/buffer/client.py`
- `app/integrations/buffer/service.py`
