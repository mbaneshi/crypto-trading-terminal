# Quick Start Guide - Crypto Memecoin Trading App

Get up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- For iOS: Xcode 14+, CocoaPods
- For Android: Android Studio, JDK 11+

## Installation

### 1. Install Dependencies (3 minutes)

```bash
# Clone/Navigate to project
cd /Users/nerd/freelancer/09-crypto-memecoin-trading-app

# Install mobile app dependencies
cd mobile/MemecoinTradingApp
npm install

# Install iOS pods (Mac only)
cd ios && pod install && cd ../..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment (2 minutes)

```bash
# Mobile app
cd mobile/MemecoinTradingApp
cp .env.example .env

# Edit .env with your values (optional for testing)
nano .env

# Backend
cd ../../backend
cp .env.example .env
nano .env
```

**Minimum required in .env for testing:**
```bash
# Mobile (.env)
API_BASE_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3000

# Backend (.env)
NODE_ENV=development
PORT=3000
```

### 3. Start Development (2 minutes)

```bash
# Terminal 1: Start backend
cd backend
npm run dev
# ✅ Server running on http://localhost:3000

# Terminal 2: Start Metro bundler
cd mobile/MemecoinTradingApp
npm start
# ✅ Metro bundler started

# Terminal 3: Run iOS
npm run ios
# OR: Run Android
npm run android
```

## Test Core Features (3 minutes)

### Test 1: Solana Wallet

```typescript
import solanaWalletService from './services/blockchain/solana/wallet';

// Generate wallet
const { publicKey, mnemonic } = await solanaWalletService.generateWallet();
console.log('Public Key:', publicKey);
console.log('Mnemonic:', mnemonic);

// Get balance
const balance = await solanaWalletService.getBalance(publicKey);
console.log('Balance:', balance, 'SOL');
```

### Test 2: Jupiter Swap Quote

```typescript
import jupiterService from './services/blockchain/solana/jupiter';

const quote = await jupiterService.getQuote(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  1000000000, // 1 SOL in lamports
  100 // 1% slippage in bps
);

console.log('Quote:', quote);
```

### Test 3: Real-Time Prices

```typescript
import websocketService from './services/api/websocket';

websocketService.connect();
websocketService.subscribeToToken('SOL');

websocketService.on('priceUpdate', (data) => {
  console.log('SOL Price:', data.price);
  console.log('24h Change:', data.change24h);
});
```

### Test 4: TradingView Chart

```typescript
import CandlestickChart from './components/charts/CandlestickChart';

// Sample OHLCV data
const sampleData = [
  { time: 1640000000, open: 100, high: 110, low: 95, close: 105, volume: 1000 },
  { time: 1640003600, open: 105, high: 115, low: 100, close: 110, volume: 1200 },
  // ... more data
];

<CandlestickChart
  data={sampleData}
  timeframe="1h"
  height={400}
/>
```

## Verify Installation

### Check Backend

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"...","uptime":...}
```

### Check Mobile App

1. Open app on simulator/device
2. Look for Metro bundler connection
3. App should launch without errors

## Common Issues & Solutions

### Issue: Metro bundler won't start

```bash
cd mobile/MemecoinTradingApp
npx react-native start --reset-cache
```

### Issue: iOS build fails

```bash
cd mobile/MemecoinTradingApp/ios
rm -rf Pods
rm -rf build
pod install
cd ..
npx react-native run-ios
```

### Issue: Android build fails

```bash
cd mobile/MemecoinTradingApp/android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue: Backend won't start

```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

## Next Steps

### For Development

1. **Add Screen Components**
   - Create HomeScreen.tsx
   - Create TradeScreen.tsx
   - Create PortfolioScreen.tsx
   - Use services already implemented

2. **Set Up Navigation**
   ```typescript
   import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

   const Tab = createBottomTabNavigator();

   <Tab.Navigator>
     <Tab.Screen name="Home" component={HomeScreen} />
     <Tab.Screen name="Trade" component={TradeScreen} />
     <Tab.Screen name="Portfolio" component={PortfolioScreen} />
   </Tab.Navigator>
   ```

3. **Add State Management**
   - Configure Redux store
   - Create wallet slice
   - Create portfolio slice
   - Connect to components

### For Production

1. **Configure RPC Endpoints**
   - Get Infura/Alchemy API keys
   - Update .env with production URLs
   - Set up rate limiting

2. **Set Up Firebase**
   - Create Firebase project
   - Enable Cloud Messaging
   - Download google-services.json
   - Configure push notifications

3. **Deploy Backend**
   - Choose hosting (AWS, Heroku, DigitalOcean)
   - Set up MongoDB
   - Configure environment variables
   - Deploy with PM2

4. **Deploy Mobile Apps**
   - Follow docs/DEPLOYMENT.md
   - iOS: TestFlight → App Store
   - Android: Internal Testing → Production

## Useful Commands

```bash
# Mobile App
npm run ios              # Run on iOS
npm run android          # Run on Android
npm start               # Start Metro bundler
npm run lint            # Lint code
npm test                # Run tests

# Backend
npm run dev             # Development with auto-reload
npm run build           # Build TypeScript
npm start               # Start production server
```

## Resources

- 📖 Full Documentation: `/docs/`
- 🚀 Deployment Guide: `/docs/DEPLOYMENT.md`
- 📋 Project Summary: `/docs/PROJECT_SUMMARY.md`
- ✅ Implementation Status: `/IMPLEMENTATION_COMPLETE.md`

## Support

For issues or questions:
- Check troubleshooting section in DEPLOYMENT.md
- Review service implementation in /src/services/
- Consult external API docs (Jupiter, Uniswap, Solana)

---

**You're ready to build!** All core services are implemented. Just add UI screens and you're good to go! 🚀
