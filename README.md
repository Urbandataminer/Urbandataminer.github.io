<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend (FastAPI) + Facet Navigation (Year/Country)

This project includes a Python backend in `web/backend/` that:
- serves datasets to the React UI (`/init`, `/datasets`)
- provides semantic search via FAISS (`/search`)
- computes **stable navigation facets** at startup:
  - **`country`**: `Global` / `Multi` / `Unknown` or a best-effort country name
  - **`year_bucket`**: `2010s` / `2020s` / `Unknown` (derived from `Time_Coverage`)

### Run backend

1. Install deps (recommend venv):
   - `pip install -r backend/requirements.txt`
2. Start the API:
   - `cd backend && python main.py`

### Facet derivation rules (high level)

- **Year**: parse `Time_Coverage` for explicit year ranges (`YYYY-YYYY`, `YYYY to YYYY`), otherwise take min/max year found in the string; bucket by decade using `year_start` (e.g. `2012 -> 2010s`). If nothing found → `Unknown`.
- **Country**: detect `global/worldwide` → `Global`; detect lists/group indicators (commas/and/G20/EU/...) → `Multi`; otherwise match common country aliases; if no safe match → `Unknown`.

Implementation lives in `backend/facets.py`.
