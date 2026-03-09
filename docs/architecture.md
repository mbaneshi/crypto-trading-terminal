# Architecture

- **Backend:** API server (Node/TypeScript) for market data, orders, and optional auth.
- **Frontend / clients:** Trading UI (web or mobile); wallet connect for signing.
- **Data flow:** Client calls API for quotes and order submission; real-time prices via WebSocket or polling; wallet signs transactions where required.

See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) and [DEPLOYMENT.md](DEPLOYMENT.md) for structure and run instructions.
