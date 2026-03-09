# Crypto Trading Terminal

Crypto trading interface: multi-asset support, real-time data and charts, wallet connect. Backend API and frontend for learners and engineers building trading UIs and integrations.

## Concepts

- **Trading pair:** Base/quote token; price and volume.
- **Order execution:** Market (instant) or limit; slippage and price impact.
- **Wallet connect:** Sign-in and sign transactions; no private keys on server.
- **Real-time data:** WebSocket or polling for prices and portfolio.

## Quick start

```bash
git clone https://github.com/mbaneshi/crypto-trading-terminal.git
cd crypto-trading-terminal
```

See [QUICK_START.md](QUICK_START.md) and [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) for backend and frontend run steps.

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/architecture.md](docs/architecture.md) | Components and data flow |
| [docs/domain-concepts.md](docs/domain-concepts.md) | Trading and wallet concepts |
| [docs/tutorial-01-setup.md](docs/tutorial-01-setup.md) | Run backend and UI |
| [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) | Project overview |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment |

## Tech stack

- Backend: Node/TypeScript
- Frontend/API: per repo structure (see QUICK_START)

## License

MIT. Original scope: [docs/ORIGINAL_SCOPE.md](docs/ORIGINAL_SCOPE.md).
