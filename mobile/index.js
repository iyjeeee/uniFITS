// index.js — App entry point
// ─────────────────────────────────────────────────────────────────────────────
// MUST be the 'main' entry in package.json (not App.jsx directly).
// registerRootComponent() from 'expo' loads Expo.fx polyfills FIRST —
// this patches the WHATWG URL object so url.protocol is writable,
// fixing: "TypeError: Cannot assign to property 'protocol' which has only a getter"
// which occurs in expo-constants getManifestBaseUrl() on RN 0.76+.
// ─────────────────────────────────────────────────────────────────────────────
import { registerRootComponent } from 'expo' // expo: bootstraps polyfills + registers app

import App from './App'

// registerRootComponent: renders App correctly in both Expo Go and native builds
registerRootComponent(App)
