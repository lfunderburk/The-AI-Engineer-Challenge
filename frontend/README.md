# Front End — Local demo

This is a tiny static frontend that posts to the FastAPI backend at `/api/chat` and streams responses.

Files:
- `index.html` — simple UI
- `style.css` — styles
- `main.js` — streaming fetch client

Run locally:

1. Start the backend (assumes FastAPI app in `api/app.py`):

```bash
# from project root
uvicorn api.app:app --reload
```

2. Serve the frontend directory (one simple way):

```bash
# from project root
cd frontend && python -m http.server 5173
```

3. Open `http://localhost:5173` in the browser and enter an API key (for local testing) and messages.

Notes:
- The backend in `api/app.py` allows CORS from any origin, so serving statically from another port will work for local testing.
- For production, serve the built frontend from the same origin as the API or configure CORS & secure your API key handling.