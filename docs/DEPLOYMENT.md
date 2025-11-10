# Deployment Guide

Complete guide for deploying the Crypto Memecoin Trading App to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [iOS Deployment (TestFlight & App Store)](#ios-deployment)
3. [Android Deployment (Google Play)](#android-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [CI/CD Setup](#cicd-setup)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

### iOS Development
- macOS with Xcode 14+ installed
- Apple Developer Account ($99/year)
- Valid provisioning profiles and certificates
- CocoaPods installed

### Android Development
- Android Studio installed
- JDK 11 or higher
- Google Play Console account ($25 one-time fee)
- Signing keystore generated

### Backend Hosting
- Node.js hosting service (e.g., AWS, DigitalOcean, Heroku)
- MongoDB database (Atlas or self-hosted)
- Redis instance (optional, for caching)
- Domain name and SSL certificate

---

## iOS Deployment

### Step 1: Configure Project

1. **Update Bundle Identifier**
```bash
cd ios
open MemecoinTradingApp.xcworkspace
```

In Xcode:
- Select project in Navigator
- Go to "Signing & Capabilities"
- Update Bundle Identifier: `com.yourcompany.memecoinapp`
- Select your Team

2. **Update Version Numbers**

Edit `ios/MemecoinTradingApp/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

3. **Configure Environment**

Create `ios/.env.production`:
```
API_BASE_URL=https://api.memecoinapp.com
WEBSOCKET_URL=wss://ws.memecoinapp.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
```

### Step 2: Build for Release

1. **Install Dependencies**
```bash
cd ios
pod install
cd ..
```

2. **Archive in Xcode**
- Product > Scheme > Edit Scheme
- Set Build Configuration to "Release"
- Product > Archive
- Wait for archive to complete

### Step 3: Upload to App Store Connect

1. **Window > Organizer** (after archive completes)
2. Select your archive
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Upload

### Step 4: TestFlight Setup

1. **Log into App Store Connect**
- Go to https://appstoreconnect.apple.com
- Navigate to "My Apps" > Your App > TestFlight

2. **Add Internal Testers**
- Up to 100 internal testers (no review required)
- Add emails in TestFlight tab

3. **Add External Testers**
- Up to 10,000 external testers
- Requires Beta App Review (24-48 hours)
- Provide test information and demo account

4. **Distribute Build**
- Select build version
- Enable testing
- Testers receive email invitation

### Step 5: App Store Submission

1. **Prepare Assets**
- App Icon: 1024x1024px PNG
- Screenshots for all device sizes:
  - iPhone 6.7": 1290x2796px
  - iPhone 6.5": 1242x2688px
  - iPhone 5.5": 1242x2208px
  - iPad Pro 12.9": 2048x2732px

2. **App Information**
- Name (max 30 characters)
- Subtitle (max 30 characters)
- Description (max 4000 characters)
- Keywords (max 100 characters)
- Privacy Policy URL
- Support URL
- Marketing URL (optional)

3. **Pricing & Availability**
- Select countries
- Set price (usually free)
- Release date

4. **Submit for Review**
- App Review Information
- Demo account credentials
- Review notes
- Submit

**Review Time:** Usually 24-48 hours

---

## Android Deployment

### Step 1: Generate Signing Key

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore memecoin-upload-key.keystore \
  -alias memecoin-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Move keystore to android/app
mv memecoin-upload-key.keystore android/app/
```

**IMPORTANT:** Store keystore and passwords securely!

### Step 2: Configure Gradle

Create `android/gradle.properties`:
```properties
MEMECOIN_UPLOAD_STORE_FILE=memecoin-upload-key.keystore
MEMECOIN_UPLOAD_KEY_ALIAS=memecoin-key-alias
MEMECOIN_UPLOAD_STORE_PASSWORD=your_store_password
MEMECOIN_UPLOAD_KEY_PASSWORD=your_key_password
```

Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MEMECOIN_UPLOAD_STORE_FILE')) {
                storeFile file(MEMECOIN_UPLOAD_STORE_FILE)
                storePassword MEMECOIN_UPLOAD_STORE_PASSWORD
                keyAlias MEMECOIN_UPLOAD_KEY_ALIAS
                keyPassword MEMECOIN_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Update Version

Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.memecoinapp"
    versionCode 1
    versionName "1.0.0"
}
```

### Step 4: Build Release Bundle

```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 5: Google Play Console Setup

1. **Create App**
- Go to https://play.google.com/console
- Create new app
- Fill in app details

2. **Store Listing**
- App name
- Short description (80 chars)
- Full description (4000 chars)
- Screenshots (at least 2)
  - Phone: 16:9 or 9:16 ratio
  - Tablet: 16:9 or 9:16 ratio
- Feature graphic: 1024x500px
- App icon: 512x512px
- App category
- Contact details

3. **Content Rating**
- Complete questionnaire
- Receive rating

4. **Pricing & Distribution**
- Free or paid
- Available countries
- Content guidelines

### Step 6: Internal Testing

1. **Create Internal Testing Release**
- Release > Testing > Internal testing
- Upload AAB file
- Add testers (email or Google Group)
- Save and review

2. **Testers Join**
- Share opt-in link with testers
- Testers download from Play Store

### Step 7: Production Release

1. **Open Testing / Closed Testing (Optional)**
- Open: Anyone can join
- Closed: Invite only

2. **Production Release**
- Create production release
- Upload AAB
- Release notes
- Submit for review

**Review Time:** Usually 1-3 days

---

## Backend Deployment

### Option 1: AWS EC2

1. **Launch EC2 Instance**
```bash
# Ubuntu 22.04 LTS
# t3.small or larger
```

2. **Install Dependencies**
```bash
# SSH into instance
ssh ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
# See MongoDB installation guide for Ubuntu

# Install Redis (optional)
sudo apt install redis-server
```

3. **Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Set up environment
cp .env.example .env
nano .env  # Edit with production values

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start dist/server.js --name memecoin-api

# Save PM2 configuration
pm2 save
pm2 startup
```

4. **Configure Nginx**
```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/memecoin-api
```

```nginx
server {
    listen 80;
    server_name api.memecoinapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/memecoin-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.memecoinapp.com
```

### Option 2: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create memecoin-api

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Add Redis addon (optional)
heroku addons:create heroku-redis:hobby-dev
```

3. **Configure Environment**
```bash
heroku config:set NODE_ENV=production
heroku config:set API_BASE_URL=https://memecoin-api.herokuapp.com
# Add other environment variables
```

4. **Deploy**
```bash
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. **Create App**
- Go to DigitalOcean dashboard
- Create new App
- Connect GitHub repository

2. **Configure Build**
- Build Command: `npm run build`
- Run Command: `npm start`
- Environment Variables: Add all required vars

3. **Deploy**
- Click "Create Resources"
- App deploys automatically

---

## Environment Configuration

### Mobile App (.env files)

**Development (.env.development):**
```bash
API_BASE_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3000
SOLANA_RPC_URL=https://api.devnet.solana.com
ETHEREUM_RPC_URL=https://goerli.infura.io/v3/YOUR_KEY
ENABLE_LOGGING=true
```

**Production (.env.production):**
```bash
API_BASE_URL=https://api.memecoinapp.com
WEBSOCKET_URL=wss://ws.memecoinapp.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
WALLETCONNECT_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_firebase_key
ENABLE_LOGGING=false
```

### Backend (.env)

```bash
# Server
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://memecoinapp.com

# Database
MONGODB_URI=mongodb://user:pass@host:27017/memecoin
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

# Blockchain RPC
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Firebase Admin (for push notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# External APIs
COINGECKO_API_KEY=your_key
JUPITER_API_URL=https://quote-api.jup.ag/v6
```

---

## CI/CD Setup

### GitHub Actions - iOS

Create `.github/workflows/ios.yml`:
```yaml
name: iOS Build

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd mobile/MemecoinTradingApp
          npm install
          cd ios && pod install

      - name: Build iOS
        run: |
          cd mobile/MemecoinTradingApp/ios
          xcodebuild -workspace MemecoinTradingApp.xcworkspace \
            -scheme MemecoinTradingApp \
            -configuration Release \
            -archivePath build/MemecoinTradingApp.xcarchive \
            archive
```

### GitHub Actions - Android

Create `.github/workflows/android.yml`:
```yaml
name: Android Build

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup JDK
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd mobile/MemecoinTradingApp
          npm install

      - name: Build Android
        run: |
          cd mobile/MemecoinTradingApp/android
          ./gradlew bundleRelease
```

---

## Post-Deployment

### Monitoring

1. **Crash Reporting**
- Set up Sentry or Firebase Crashlytics
- Monitor crash rates
- Fix critical issues quickly

2. **Analytics**
```typescript
// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

analytics().logEvent('trade_executed', {
  token_pair: 'SOL/USDC',
  amount: 100,
});
```

3. **Performance Monitoring**
- App launch time
- API response times
- Chart rendering performance
- Memory usage

### App Store Optimization (ASO)

1. **iOS App Store**
- Optimize keywords
- A/B test screenshots
- Respond to reviews
- Regular updates

2. **Google Play**
- Optimize description
- Add feature graphics
- Respond to reviews
- Maintain rating

### Version Updates

1. **Update Version Numbers**
```bash
# iOS: Increment CFBundleVersion
# Android: Increment versionCode
```

2. **Release Notes**
```
Version 1.1.0
- Added support for Base and Arbitrum chains
- Improved chart performance
- Fixed price alert notifications
- Updated UI for better usability
- Bug fixes and improvements
```

3. **Submit Update**
- Follow same process as initial submission
- Usually faster review for updates

---

## Rollback Procedures

### iOS
1. App Store Connect > My Apps
2. Select previous version
3. Resubmit for review

### Android
1. Play Console > Production
2. Create new release with previous APK/AAB
3. Deactivate problematic version

### Backend
```bash
# PM2 rollback
pm2 list
pm2 delete memecoin-api
pm2 start previous-version/dist/server.js --name memecoin-api
```

---

## Troubleshooting

### iOS Build Errors
```bash
# Clean build folder
rm -rf ios/build
rm -rf ios/Pods
cd ios && pod install

# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### Android Build Errors
```bash
cd android
./gradlew clean
cd .. && npx react-native run-android
```

### Backend Issues
```bash
# Check logs
pm2 logs memecoin-api

# Restart service
pm2 restart memecoin-api

# Monitor resources
pm2 monit
```

---

## Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CORS configured properly
- [ ] Authentication tokens expire
- [ ] Private keys never logged
- [ ] Secure storage used for sensitive data

---

## Support & Maintenance

### Regular Tasks
- Monitor crash reports (daily)
- Review user feedback (weekly)
- Update dependencies (monthly)
- Security audits (quarterly)
- Performance optimization (ongoing)

### Emergency Contacts
- iOS App Store: https://developer.apple.com/contact/
- Google Play Support: https://support.google.com/googleplay
- Firebase Support: https://firebase.google.com/support

---

For questions or issues, contact: support@memecoinapp.com
