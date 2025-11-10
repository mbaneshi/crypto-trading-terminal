# Deployment Guide - Memecoin Trading Mobile App

## Quick Start

### Prerequisites
- Node.js >= 20
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

\`\`\`bash
cd mobile/MemecoinTradingApp
npm install
cd ios && pod install && cd ..
\`\`\`

### Run Development

\`\`\`bash
# iOS
npm run ios

# Android  
npm run android

# Start Metro bundler separately
npm start
\`\`\`

### Run Tests

\`\`\`bash
# All tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
\`\`\`

## Build for Production

### iOS Release Build

\`\`\`bash
cd ios
xcodebuild -workspace MemecoinTradingApp.xcworkspace \
  -scheme MemecoinTradingApp \
  -configuration Release \
  -archivePath build/MemecoinTradingApp.xcarchive \
  archive
\`\`\`

### Android Release Build

\`\`\`bash
cd android
./gradlew assembleRelease
# APK output: android/app/build/outputs/apk/release/app-release.apk
\`\`\`

## Environment Configuration

Create \`.env\` file:

\`\`\`env
API_URL=https://api.yourbackend.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
JUPITER_API_URL=https://quote-api.jup.ag/v6
\`\`\`

## App Store Submission

### iOS
1. Update version in Xcode
2. Create archive in Xcode
3. Upload to App Store Connect
4. Submit for review

### Android
1. Update version in \`android/app/build.gradle\`
2. Generate signed APK/Bundle
3. Upload to Google Play Console
4. Submit for review

## Troubleshooting

### iOS Build Issues
\`\`\`bash
cd ios
pod deintegrate
pod install
\`\`\`

### Android Build Issues
\`\`\`bash
cd android
./gradlew clean
./gradlew assembleDebug
\`\`\`

### Metro Bundler Issues
\`\`\`bash
npm start -- --reset-cache
\`\`\`

## Production Checklist

- [ ] Update API endpoints to production
- [ ] Configure wallet adapters (Phantom, MetaMask)
- [ ] Set up Firebase for push notifications
- [ ] Configure analytics
- [ ] Test on physical devices
- [ ] Performance testing
- [ ] Security audit
- [ ] App Store screenshots
- [ ] Privacy policy & terms
- [ ] Submit for review
