# uniFITS Member App

React Native / Expo app for the uniFITS organization member portal.

## Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- Expo Go app on your phone (iOS App Store / Google Play)

## Setup

```bash
# 1. Install dependencies (REQUIRED after any package.json change)
npm install

# 2. Start the development server on your local network
npm run lan
```

Then scan the QR code with Expo Go on your phone.

## Project Structure

```
mobile/
├── assets/               # App icons & splash screen (icon.png, splash.png, etc.)
├── src/
│   ├── api/
│   │   └── mockData.js   # All mock data + formatters (swap with real API calls)
│   ├── components/
│   │   └── ui.jsx        # Shared UI primitives (Avatar, Card, Buttons, Icons…)
│   ├── constants/
│   │   └── theme.js      # Design tokens: Colors, Typography, Spacing, Radius, Shadow
│   ├── context/
│   │   └── AuthContext.js # Auth state (login / logout / updateUser)
│   ├── navigation/
│   │   └── AppNavigator.jsx # Root navigation tree (Auth stack + Tab navigator)
│   └── screens/
│       ├── LoginScreen.jsx
│       ├── HomeScreen.jsx
│       ├── ProjectsScreen.jsx
│       ├── ProjectDetailScreen.jsx
│       ├── EventsScreen.jsx
│       ├── EventDetailScreen.jsx
│       ├── AnnouncementsScreen.jsx
│       ├── AnnouncementDetailScreen.jsx
│       ├── ProfileScreen.jsx
│       ├── EditProfileScreen.jsx
│       ├── MyTransactionsScreen.jsx
│       ├── MyReportScreen.jsx
│       └── MyAttendanceScreen.jsx
├── App.jsx               # Root: font loading + providers
├── app.json              # Expo config
├── babel.config.js       # Babel config (uses babel-preset-expo)
└── package.json
```

## Demo Logins (mock only)

| Email                 | Password    |
|-----------------------|-------------|
| ana@example.com       | any         |
| juan@example.com      | any         |
| pedro@example.com     | any         |
| carlos@example.com    | any         |

## Design System

All design tokens live in `src/constants/theme.js`:
- `Colors` — brand palette matching the website CSS variables
- `Typography` — DM Sans + DM Serif Display font families
- `Spacing`, `Radius`, `Shadow` — consistent layout tokens
- `StatusColors` — status badge color map

All shared components live in `src/components/ui.jsx` and are imported by name.

## Common Issues

### `Cannot find module 'babel-preset-expo'`
Run `npm install` — this package is now listed in `devDependencies`.

### `Unable to resolve asset "./assets/icon.png"`
The `assets/` folder now contains placeholder PNGs. Replace them with real artwork.

### Network / LAN issues
Edit `.env` and set `REACT_NATIVE_PACKAGER_HOSTNAME` to your machine's local IP address,
then run `npm run lan`.
