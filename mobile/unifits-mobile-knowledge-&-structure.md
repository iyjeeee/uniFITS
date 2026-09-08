# uniFITS Mobile — Project Knowledge & File Structure
> Stack: React Native · Expo SDK 54 · Expo Router v6 · TypeScript
> Path in monorepo: `unifits/mobile/`

> **Changelog (most recent audit pass):** Fixed a critical bug where `app/(tabs)/index.tsx` (Home) had been accidentally overwritten with a duplicate of `announcements/index.tsx` — dashboard was rebuilt from scratch (KPI grid, recent announcements, recent transactions). Removed legacy `ScreenHeader` (migrated `forgot-password.tsx` to `AppHeader`). Added missing `theme.ts` color tokens and removed all hardcoded hex values from `Button`/`Badge`/`Avatar`/`_layout`/`login`. Added accessibility labels/roles across `Button`, `Card`, `AppHeader`, shared cards, login, and profile screens. Added `SegmentedControl` (animated) and `Skeleton` (`SkeletonBlock`/`SkeletonCard`/`SkeletonList`) components; Home/Announcements/Activities/Finances now show persisted headers + skeleton bodies instead of full-screen spinners. `EmptyState`/`ErrorState` now use tinted Ionicons circles instead of raw emoji.
>
> **Changelog (follow-up pass):** Fixed white strip below the Android tab bar — synced the system navigation bar color via `expo-navigation-bar` in `app/_layout.tsx` + `navigationBarColor` fallback in `app.json` (**run `npx expo install expo-navigation-bar`**). Redesigned `SectionHeader` with a left accent bar + bottom divider + built-in `actionLabel`/`onAction` ("View All") so sections like Pinned/Recent Announcements/Recent Transactions read as distinct blocks instead of plain floating text; Home screen's manual "View All" markup was consolidated into this component.
>
> **Changelog (interactivity pass):** Added `expo-navigation-bar` to `package.json` (was missing — SDK 54-pinned `~5.0.10`). Added `components/ui/PressableScale.tsx` — shared scale-down + shadow-elevation tap feedback, now used by `Card`, `StatCard`, `AnnouncementCard`, `ProjectCard`, `EventCard`, `TransactionRow` instead of each duplicating `TouchableOpacity`/`Animated` logic. `StatCard` gained `onPress` (KPI tiles on Home now deep-link to Finances/Announcements), a subtle color-tinted background (not just the icon chip), and a chevron affordance when tappable. Home header now uses `getGreeting()` (new helper in `formatters.ts`) for a time-of-day greeting instead of a static "Hi". `AnnouncementCard` preview text switched to `Colors.textMuted` (was `textSecondary`) and title switched to bold, for stronger title/body contrast. Tab bar icons now show an accent-colored pill behind the active tab instead of relying on icon color alone. `ProjectCard`/`EventCard`/`TransactionRow` gained a `Shadow.sm` baseline (previously had none) so the press-elevation bump has something to bump from.
>
> **Changelog (KPI grid + Section panel pass):** `StatCard` now has `minHeight: 108` so all 4 Home KPI tiles are guaranteed the same size regardless of value/label text length. Home's KPI grid gap was inconsistent (horizontal `sm`, vertical inherited the outer `lg` section gap) — wrapped both rows in a `kpiGrid` container with a single consistent `sm` gap. Added `components/ui/Section.tsx` — a white bordered/shadowed panel (title header + padded content) that gives list sections their own visual block instead of a header floating on the screen background. Home's "Recent Announcements"/"Recent Transactions" and Announcements' "Pinned"/"All Announcements" now use `Section` instead of a bare `SectionHeader` + `View`. Announcements screen converted from `FlatList` to `ScrollView` (matches Finances' pattern) so both sections can each sit in their own panel — dataset is small, no virtualization loss.
>
> **Changelog (2026 bento/modern-UI refresh, approved direction):** Bumped the whole `Radius` scale softer/larger (`sm 6→8, md 10→14, lg 16→18`, new `xl: 22`) — cascades automatically to every card, button, badge, and input via the shared tokens. Added `Colors.subCard` (`#F7F9FC`) for flat nested rows. Added `components/ui/HeroStatCard.tsx` — large solid-accent-color card with a decorative offset circle (no gradient lib needed) for a single primary KPI + inline sub-stats; Home's Fund Balance is now a `HeroStatCard` instead of competing equally with the other 3 tiles in a uniform grid. `StatCard` redesigned to match — plain white rounded card, icon chip carries the color instead of a left border stripe, `Radius.lg`. `AnnouncementCard`/`ProjectCard`/`EventCard`/`TransactionRow` gained a `variant?: 'elevated' | 'flat'` prop — `'flat'` (subCard bg, no border/shadow, tighter margin) is used when nested inside a `Section` panel (Home + Announcements); `'elevated'` (unchanged bordered/shadowed look) stays the default for standalone use (Activities, Finances). `Section` panel bumped to `Radius.xl`. **Not yet extended:** Activities/Finances/Profile screens weren't restructured into `Section` panels — they don't have the same "multiple named sections shown together" shape (single active list via `SegmentedControl` tabs), so they only inherited the automatic token-level changes (softer radii, existing `PressableScale`/`Shadow.sm`). Ask if you want the same panel treatment forced there too.
>
> **Changelog (motion + haptics pass, chosen over a gradient/color-only refresh):** Added `expo-haptics` to `package.json` (SDK 54-pinned `~15.0.8` — **run `npx expo install` or `npm install`**). New `utils/haptics.ts` wraps it (`hapticTap`/`hapticSelect`/`hapticSuccess`/`hapticError`, platform-guarded so web doesn't throw). `PressableScale` now fires `hapticTap()` on every press (covers `Card`, `StatCard`, `HeroStatCard`, all 4 shared cards). `Button` fires `hapticTap()` too (separate wiring — it uses `TouchableOpacity`, not `PressableScale`). `SegmentedControl` fires `hapticSelect()` only on an actual tab change. Tab bar fires `hapticSelect()` on every tab press via `Tabs`' `screenListeners.tabPress` (centralized — no per-screen wiring needed). Login fires `hapticError()` on validation/auth failure and `hapticSuccess()` right before navigating in. New `components/ui/FadeInUp.tsx` — fade + slide-up entrance animation on mount, takes a `delay` prop for staggering; no `reanimated` dependency, uses the existing `Animated` API. Home's hero card/KPI row/2 sections now cascade in with staggered delays (0/80/160/240ms). Announcements' Pinned/All Announcements sections stagger similarly. Activities' and Finances' active-tab content is wrapped in `FadeInUp` **keyed by the active tab**, so switching segments re-triggers a fresh fade-in each time, not just on first screen load.
>
> **Changelog (edge-to-edge nav bar fix):** The `expo-navigation-bar` fix from the "follow-up pass" was throwing `WARN: setBackgroundColorAsync is not supported with edge-to-edge enabled` — SDK 54 enables edge-to-edge on Android by default, and in that mode the system nav bar is transparent, so setting its background color is a no-op the module now warns about instead of silently ignoring. Removed the `setBackgroundColorAsync` call from `app/_layout.tsx` entirely; kept `setButtonStyleAsync('light')` wrapped in `try/catch` for forward-safety. Also removed the now-dead `android.navigationBarColor` key from `app.json` (ignored under edge-to-edge). The original white-strip issue this was meant to fix doesn't need either of these under edge-to-edge — the tab bar's own dark background (sized with `insets.bottom` in `app/(tabs)/_layout.tsx`) shows through the transparent system bar correctly on its own.

---

## SECTION 1 — PROJECT KNOWLEDGE

### 1.1 Project Overview

| Property | Value |
|---|---|
| App Name | uniFITS |
| Purpose | Member-facing mobile companion to the uniFITS web admin dashboard |
| Scope | Read-only for members — no admin CRUD, no audit logs, no manage/add/edit/delete |
| Currency | Philippine Peso (₱ / PHP), locale `en-PH` |
| Initial Target | Android (Expo Go / physical device or emulator) |
| Monorepo | `unifits/website/`, `unifits/mobile/`, `unifits/supabase/`, `unifits/backend/` |

---

### 1.2 Tech Stack

| Layer | Package |
|---|---|
| Framework | React Native + Expo SDK `~54.0.0` |
| Language | TypeScript (strict) |
| Routing | Expo Router v6 (file-based) |
| Server State | TanStack Query v5 (`useQuery`, `useMutation`) |
| Global State | Zustand v5 |
| Backend | Supabase JS v2 (same DB as website) |
| Auth Storage | `expo-secure-store` |
| Fonts | `@expo-google-fonts/dm-sans` + `@expo-google-fonts/dm-serif-display` |
| Icons | `@expo/vector-icons` → `Ionicons` |
| Styling | React Native `StyleSheet` only — no external UI library |

---

### 1.3 Critical Architecture Rules

#### Routing
- Expo Router v6 file-based routing only — file path = screen route
- Auth guard via `<Redirect>` inside each group `_layout.tsx` — never `router.replace()` in `useEffect`
- `app/index.tsx` is the entry point — uses `<Redirect>` based on auth state
- `(auth)/_layout.tsx` — redirects to `/(tabs)` if already authenticated
- `(tabs)/_layout.tsx` — redirects to `/(auth)/login` if not authenticated

#### Styling
- ALL colors → `Colors.*` from `constants/theme.ts` — never hardcode hex
- ALL spacing → `Spacing.*` from `constants/theme.ts` — never hardcode px
- ALL radius → `Radius.*` from `constants/theme.ts`
- ALL shadows → `Shadow.*` from `constants/theme.ts`
- No external UI libraries, no CSS, no className, no Tailwind

#### Fonts
- Body: `DMSans_400Regular`, `DMSans_500Medium`, `DMSans_600SemiBold`, `DMSans_700Bold`
- Display/Headings: `DMSerifDisplay_400Regular`
- Loaded in `app/_layout.tsx` via `useFonts()` — app renders without blocking
- Always reference via `Typography.*` tokens — never raw strings

#### State
- Auth + current user → Zustand `store/authStore.ts`
- Server data → TanStack Query (`useQuery`) in screens
- Local UI state → `useState`

#### Data / API
- Never call Supabase directly in screens — always go through `services/`
- Dev: mock data from `api/mockData.ts`
- Prod swap: replace service function bodies with real Supabase/API calls

---

### 1.4 Design Token Reference (`constants/theme.ts`)

#### Colors
```
primary:       #1E2128   — tab bar, dark headers, brand surfaces
accent:        #4B5EAA   — buttons, active states, links, focus rings
accentLight:   rgba(75,94,170,0.08)

success:       #2E7D52   — active, completed, paid, present, approved
successLight:  rgba(46,125,82,0.08)
danger:        #C0392B   — inactive, cancelled, rejected, unpaid, absent
dangerLight:   rgba(192,57,43,0.08)
warning:       #D4860A   — upcoming, pending, late, partial
warningLight:  rgba(212,134,10,0.08)
info:          #2471A3   — ongoing, informational
infoLight:     rgba(36,113,163,0.08)

white:         #FFFFFF   — cards, inputs, modals
bgApp:         #EEF2F8   — main screen background
neutralLight:  #F2F5FB   — section backgrounds, list pressed state
neutral:       #5A6474   — secondary button / neutral badge bg
neutralBorder: #4A5264   — secondary button / neutral badge border, pressed bg
accentPressed:  #3A4D99  — Button primary pressed bg
successBorder:  #256642  — Badge success border / Button success pressed bg
dangerBorder:   #A93226  — Badge danger border / Button danger pressed bg
warningBorder:  #B7770D  — Badge warning border
infoBorder:     #1A5C87  — Badge info border
border:        #E5E9EF
borderCard:    #C8D3E8   — card outer border
borderInner:   #D8DFF0   — dividers, row separators
tableHeadBg:   #3D52A0   — also reused as Badge accent variant border
textPrimary:   #1E2128
textSecondary: #4B5563
textMuted:     #9CA3AF
textOnDark:    #F9FAFB
overlay:       rgba(15,18,30,0.55)
```

#### Spacing
`xs:4  sm:8  md:16  lg:24  xl:32  xxl:48`

#### Font Sizes
`xs:11  sm:12  base:14  md:15  lg:16  xl:18  xxl:22  xxxl:28`

#### Radius
`sm:6  md:10  lg:16  full:999`

#### Layout Constants
```
TAB_BAR_HEIGHT:    60
HEADER_HEIGHT:     56
CARD_PADDING:      16
SCREEN_PADDING_H:  16
SCREEN_PADDING_V:  20
BORDER_WIDTH:      1.5
STATUS_BAR_WIDTH:  4    — left accent strip on list items
```

#### Avatar Colors (deterministic by name charCode)
`#4B5EAA #2E7D52 #C0392B #D4860A #2471A3 #7D3C98 #117A65`

---

### 1.5 Navigation Structure

```
app/index.tsx                    → Entry: <Redirect> to login or tabs
app/(auth)/
  _layout.tsx                    → Stack; redirects to tabs if authenticated
  login.tsx                      → Login screen
  forgot-password.tsx            → Forgot password screen

app/(tabs)/
  _layout.tsx                    → Bottom tab navigator (5 tabs); redirects to login if not authenticated
  index.tsx                      → Home / Dashboard
  announcements/
    _layout.tsx                  → Stack
    index.tsx                    → Announcements feed
    [id].tsx                     → Announcement detail
  activities/
    _layout.tsx                  → Stack
    index.tsx                    → Projects + Events (segmented)
    projects/[id].tsx            → Project detail
    events/[id].tsx              → Event detail
  finances/
    _layout.tsx                  → Stack
    index.tsx                    → Fund overview + My Transactions (segmented)
    [id].tsx                     → Transaction detail
  profile/
    _layout.tsx                  → Stack
    index.tsx                    → Profile screen
    edit.tsx                     → Edit profile
```

#### Tab Bar
| Tab | Icon | Screen |
|---|---|---|
| Home | `home` / `home-outline` | `(tabs)/index` |
| News | `megaphone` / `megaphone-outline` | `(tabs)/announcements` |
| Activities | `calendar` / `calendar-outline` | `(tabs)/activities` |
| Finances | `wallet` / `wallet-outline` | `(tabs)/finances` |
| Profile | `person-circle` / `person-circle-outline` | `(tabs)/profile` |

---

### 1.6 Auth Flow

**Dev (mock):**
- Any `MOCK_USERS` email + any non-empty password → login success
- e.g. `juan@example.com` / anything

**Session lifecycle:**
1. App launch → `restoreSession()` in `_layout.tsx` reads token from `expo-secure-store`
2. `app/index.tsx` `<Redirect>` sends to `/(tabs)` or `/(auth)/login`
3. Login → `authService.login()` → `authStore.login(user, token)` → stores to secure store
4. Logout → `authStore.logout()` → clears secure store → `(tabs)/_layout.tsx` detects `isAuthenticated=false` → `<Redirect href="/(auth)/login" />`

**Prod swap points:**
- `services/auth.service.ts` → `supabase.auth.signInWithPassword()`
- `store/authStore.ts` → `supabase.auth.getSession()` on restore

---

### 1.7 Data Shapes (`types/index.ts`)

All fields match website `MOCK_*` shapes exactly for backend compatibility.

| Type | Key Fields |
|---|---|
| `User` | `id, employee_number, first_name, last_name, full_name, gender, email, contact_number, role, department, occupation, joined, status, address_city, address_province, photo_url` |
| `Announcement` | `id, title, content, is_pinned, created_by, created_at` |
| `Project` | `id, title, project_type, description, start_date, end_date, location, status, target_funding, current_funding` |
| `Event` | `id, title, description, event_date, event_time, location, status, target_funding, current_funding` |
| `Fund` | `id, name, description, fund_type, is_required, status, balance, currency, payment_frequency, annual_fee` |
| `Transaction` | `id, user_id, user_name, entry_type, category, fund, amount, payment_method, reference_number, transaction_date, status, description` |
| `Attendance` | `id, user_id, user_name, activity_type, activity, attendance_date, status, remarks, recorded_by` |
| `StatusType` | `active \| inactive \| completed \| ongoing \| upcoming \| cancelled \| pending \| approved \| rejected \| paid \| unpaid \| partial \| present \| absent \| late \| excused \| failed` |

---

### 1.8 Mock Data (`api/mockData.ts`)

| Export | Count | Notes |
|---|---|---|
| `MOCK_USERS` | 6 | EMP-0001 to EMP-0006; EMP-0006 is inactive |
| `MOCK_ANNOUNCEMENTS` | 4 | 2 pinned, 2 regular |
| `MOCK_PROJECTS` | 5 | mix of upcoming/ongoing/completed |
| `MOCK_EVENTS` | 4 | mix of upcoming/completed |
| `MOCK_FUNDS` | 5 | Membership, Project, Event, Emergency, Building |
| `MOCK_TRANSACTIONS` | 7 | contributions + income; some linked to users |
| `MOCK_ATTENDANCES` | 5 | event + project attendance records |

---

### 1.9 UI Component Library (`components/ui/`)

All components use `StyleSheet.create()`. Import via barrel: `import { Badge, Card } from '@/components/ui'`

| Component | Purpose |
|---|---|
| `AppHeader` | **Primary page header** — dark `Colors.primary` bg, title, subtitle, back button, right slot, bottom slot. Used on ALL screens (including auth screens like forgot-password — `ScreenHeader` was removed as dead/legacy code) |
| `Badge` | Colored pill label — variants: `accent \| success \| danger \| warning \| info \| neutral`. Colors sourced from `theme.ts` tokens only (no hardcoded hex) |
| `StatusBadge` | Auto-maps status string → Badge variant |
| `Avatar` | Circular avatar — photo or deterministic initials with color |
| `Card` | White surface with border + shadow — base content block. Tappable variant uses `PressableScale` for scale+elevation tap feedback |
| `PressableScale` | Shared tap-feedback wrapper (scale-down + shadow elevation bump) — used by `Card`, `StatCard`, and all 4 shared cards instead of each duplicating `Animated` logic |
| `Button` | Variants: `primary \| secondary \| ghost \| danger \| success`; sizes: `sm \| md \| lg`; loading state. Default `accessibilityRole="button"` + `accessibilityLabel={title}` |
| `Input` | Labeled TextInput with error/hint states |
| `SegmentedControl` | Two-way tab toggle with animated sliding highlight (`Animated` API). Used in `AppHeader`'s `bottomSlot` on Activities & Finances. Replaced the duplicated inline segmented-tab markup that used to live in each screen |
| `SectionHeader` | Section title with left accent bar, count pill, bottom divider, optional `actionLabel`/`onAction` ("View All" link). Used inside `Section` |
| `Section` | White bordered/shadowed panel wrapping a `SectionHeader` + content — gives list sections (Pinned, Recent Announcements, Recent Transactions, All Announcements) their own visual block with padding, instead of floating on the screen background |
| `EmptyState` | Centered placeholder — Ionicons icon inside a tinted `accentLight` circle (was a raw emoji string) + title + subtitle + optional action. `icon` prop now takes an Ionicons name (e.g. `"folder-open-outline"`), defaults to `"file-tray-outline"` |
| `ErrorState` | Error placeholder with retry button — tinted `dangerLight` icon circle (was emoji) |
| `LoadingSpinner` | Centered `ActivityIndicator` — `fullScreen` prop. Still used on single-item detail screens; card-list screens now use `SkeletonList` instead |
| `SkeletonBlock` / `SkeletonCard` / `SkeletonList` | Pulsing gray placeholder blocks/cards shown while list data loads, in place of a full-screen spinner. Screen header renders immediately; only the body area shows skeletons. Used on Home, Announcements, Activities, Finances |
| `ProgressBar` | Horizontal fill bar — `progress` prop is 0–1 |
| `Divider` | Thin `Colors.borderInner` horizontal line |
| `InfoRow` | Label + value row pair — used in detail screens |
| `StatCard` | KPI tile with left color border, icon, value, label. Optional `onPress` — adds `PressableScale` tap feedback, chevron affordance, and a subtle color-tinted card background (not just the icon chip). Used on Home dashboard KPI grid, all 4 tiles tappable (deep-link to Finances/Announcements) |
| `HeroStatCard` | Large solid-accent-color KPI card with decorative offset circle + optional inline sub-stats row. Used for the single most important KPI (Home's Fund Balance) so it gets visual priority instead of matching 3 other tiles equally |
| `FundingProgress` | `ProgressBar` + ₱ amount labels + percent |

---

### 1.10 Shared Screen Components (`components/shared/`)

| Component | Purpose |
|---|---|
| `AnnouncementCard` | Compact tappable card — left border, bold title, muted 2-line preview, author/time, chevron. `PressableScale` tap feedback |
| `ProjectCard` | Tappable card — status badge, type badge, location, date range, `FundingProgress`. `PressableScale` tap feedback, `Shadow.sm` baseline |
| `EventCard` | Tappable card — status badge, date/time (12hr), location, `FundingProgress`. `PressableScale` tap feedback, `Shadow.sm` baseline |
| `TransactionRow` | List row — entry type, fund name, amount (₱), date, status badge, left color border. `PressableScale` tap feedback, `Shadow.sm` baseline |
| `FundCard` | Fund overview card — name, type badge, balance, status, description |
| `MemberStatRow` | Icon + label + value row — used in profile stats |

---

### 1.11 Utilities (`utils/`)

#### `formatters.ts` — mirrors `website/src/utils/formatters.js`
| Function | Output |
|---|---|
| `formatCurrency(amount, compact?)` | `₱ 12,345.00` or `₱ 12.3K` |
| `formatDate(date, style?)` | `short \| medium \| long` (en-PH) |
| `formatNumber(num)` | `12,345` |
| `formatPercent(value, raw?)` | `87.5%` |
| `truncate(str, max?)` | clips with `…` (default 40 chars) |
| `getInitials(name)` | `'Juan Dela Cruz'` → `'JD'` |
| `fmt12(time)` | `'14:30'` → `'2:30 PM'` |
| `relativeTime(dateStr)` | `'2m ago'`, `'3h ago'`, `'2d ago'` |
| `fundingPercent(current, target)` | `0–100` number |

#### `statusColors.ts` — mirrors `website/src/constants/tableColors.js`
| Function | Returns |
|---|---|
| `statusBorderColor(status)` | hex for left border strip |
| `statusBgColor(status)` | rgba for pressed/selected bg |
| `statusBadgeVariant(status)` | `BadgeVariant` string |

---

### 1.12 Hooks (`hooks/`)

| Hook | Purpose |
|---|---|
| `useCurrentUser()` | Returns `User \| null` from Zustand — never throws |
| `useRefreshOnFocus(refetch)` | Calls React Query `refetch` when screen gains focus |
| `useBottomPadding()` | Returns `insets.bottom + TAB_BAR_HEIGHT + SCREEN_PADDING_V` for ScrollView/FlatList |

---

### 1.13 Services Layer (`services/`)

All return typed Promises. Replace mock returns with real Supabase calls for production.

| File | Functions |
|---|---|
| `supabase.ts` | Exports `supabase` client — uses `EXPO_PUBLIC_*` env vars |
| `auth.service.ts` | `login(email, password)`, `logout()`, `getSession()` |
| `members.service.ts` | `getMyProfile(userId)`, `updateProfile(userId, data)`, `getMembers()` |
| `announcements.service.ts` | `getAnnouncements()`, `getAnnouncementById(id)` |
| `projects.service.ts` | `getProjects()`, `getProjectById(id)` |
| `events.service.ts` | `getEvents()`, `getEventById(id)` |
| `transactions.service.ts` | `getMyTransactions(userId)`, `getAllTransactions()`, `getTransactionById(id)` |
| `funds.service.ts` | `getFunds()`, `getFundById(id)` |
| `reports.service.ts` | `getFundSummary()`, `getFinancialOverview()` |

---

### 1.14 Backend Swap Points

When connecting real Supabase:
1. `.env` → set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. `services/auth.service.ts` → `supabase.auth.signInWithPassword()`
3. `store/authStore.ts` → `supabase.auth.getSession()` in `restoreSession()`
4. Each `services/*.service.ts` → replace `MOCK_*` arrays with `supabase.from('table').select()`

---

### 1.15 Running the Project

```bash
# Navigate to mobile folder
cd unifits/mobile

# Install (first time or after package.json changes)
npm install

# Start with cache clear
npx expo start --clear

# If on physical phone with network issues
npx expo start --clear --tunnel

# Open on emulator (must be running first)
# Press 'a' in terminal after Metro starts
```

---

### 1.16 Naming Conventions (Expo Router)

| Pattern | Meaning |
|---|---|
| `_layout.tsx` | Navigator wrapper — not a screen, defines nav structure for siblings |
| `[id].tsx` | Dynamic route — captures any value as `id` param via `useLocalSearchParams()` |
| `(auth)/` | Route group — organises screens without affecting the URL path |
| `(tabs)/` | Route group — contains tab screens |

---

## SECTION 2 — FULL FILE TREE

```
unifits/mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── announcements/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   └── [id].tsx
│       ├── activities/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── projects/
│       │   │   └── [id].tsx
│       │   └── events/
│       │       └── [id].tsx
│       ├── finances/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   └── [id].tsx
│       └── profile/
│           ├── _layout.tsx
│           ├── index.tsx
│           └── edit.tsx
├── components/
│   ├── ui/
│   │   ├── index.ts
│   │   ├── AppHeader.tsx
│   │   ├── Badge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Card.tsx
│   │   ├── PressableScale.tsx
│   │   ├── FadeInUp.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Section.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Divider.tsx
│   │   ├── InfoRow.tsx
│   │   ├── StatCard.tsx
│   │   └── FundingProgress.tsx
│   └── shared/
│       ├── AnnouncementCard.tsx
│       ├── ProjectCard.tsx
│       ├── EventCard.tsx
│       ├── TransactionRow.tsx
│       ├── FundCard.tsx
│       └── MemberStatRow.tsx
├── constants/
│   ├── theme.ts
│   └── config.ts
├── hooks/
│   ├── useCurrentUser.ts
│   ├── useRefreshOnFocus.ts
│   └── useBottomPadding.ts
├── services/
│   ├── supabase.ts
│   ├── auth.service.ts
│   ├── members.service.ts
│   ├── announcements.service.ts
│   ├── projects.service.ts
│   ├── events.service.ts
│   ├── transactions.service.ts
│   ├── funds.service.ts
│   └── reports.service.ts
├── store/
│   └── authStore.ts
├── api/
│   └── mockData.ts
├── types/
│   └── index.ts
├── utils/
│   ├── haptics.ts
│   ├── formatters.ts
│   └── statusColors.ts
├── assets/
│   └── images/
├── .env
├── .env.example
├── .gitignore
├── .npmrc
├── app.json
├── babel.config.js
├── eas.json
├── package.json
└── tsconfig.json
```

---

## SECTION 3 — FILE REFERENCE

### Build & Config

| File | Description |
|---|---|
| `app.json` | Expo config — app name `uniFITS`, slug, scheme `unifits`, splash bg `#1E2128`, `newArchEnabled: true`, bundle IDs, plugins. No `android.navigationBarColor` — removed, it's ignored under SDK 54's default edge-to-edge Android mode (see `expo-navigation-bar` note in `_layout.tsx`). Include when changing app identity or build config. |
| `package.json` | All deps pinned to SDK 54. `main: "expo-router/entry"`. `.npmrc` sets `legacy-peer-deps=true` permanently. Includes `expo-navigation-bar` (added for Android nav bar theming — run `npx expo install` if not yet installed). Include when adding packages. |
| `tsconfig.json` | Strict TypeScript + `@` path alias mapped to project root. Include when adding path aliases. |
| `babel.config.js` | `babel-preset-expo` + `module-resolver` for `@/` imports. Include when adding Babel plugins. |
| `.npmrc` | `legacy-peer-deps=true` — fixes react-dom peer conflicts on `npm install`. Never remove. |
| `eas.json` | EAS Build profiles (development/preview/production). Include only for CI/build config changes. |
| `.env` / `.env.example` | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`. Never commit `.env`. |

---

### Design System & Constants

| File | Description |
|---|---|
| `constants/theme.ts` | **Single source of truth** for all design tokens — Colors, Typography, FontSize, Spacing, Radius, Shadow, Layout constants, AVATAR_COLORS. Include in EVERY prompt involving styling. |
| `constants/config.ts` | App-level constants — `APP_NAME`, `CURRENCY_SYMBOL`, `LOCALE`, `ORG_NAME`. Include when changing app name or locale. |
| `utils/statusColors.ts` | Maps status strings → border color, bg tint, badge variant. Mirrors `website/src/constants/tableColors.js`. Include when editing list rows or status-colored elements. |
| `utils/haptics.ts` | Thin `expo-haptics` wrapper — `hapticTap()`, `hapticSelect()`, `hapticSuccess()`, `hapticError()`. Platform-guarded (no-ops on web). Include whenever adding a new interactive element that should give tactile feedback. |
| `utils/formatters.ts` | All formatting functions — currency, dates, numbers, initials, 12hr time, relative time, `getGreeting()` (time-of-day greeting for Home header). Mirrors `website/src/utils/formatters.js`. Include whenever displaying formatted data. |

---

### Types

| File | Description |
|---|---|
| `types/index.ts` | All TypeScript interfaces — `User`, `Announcement`, `Project`, `Event`, `Fund`, `Transaction`, `Attendance`, `StatusType`, `BadgeVariant`, `FundSummary`, `FinancialOverview`. Include in every prompt involving data or typed props. |

---

### Navigation & Routing

| File | Description |
|---|---|
| `app/_layout.tsx` | Root layout — loads fonts via `useFonts()`, calls `restoreSession()`, wraps app in `QueryClientProvider` + `SafeAreaProvider`. On Android, sets nav bar button style to `'light'` via `expo-navigation-bar` (wrapped in `try/catch`) — does NOT set background color, since that's a no-op under SDK 54's default edge-to-edge mode and just throws a warning; the tab bar's own dark background (sized with `insets.bottom`) shows through the transparent system bar on its own. No auth logic here. Include when changing providers, font loading, or nav bar theming. |
| `app/index.tsx` | Entry point — `<Redirect>` to `/(tabs)` or `/(auth)/login` based on `isAuthenticated`. Include when changing initial redirect logic. |
| `app/(auth)/_layout.tsx` | Auth stack — `<Redirect href="/(tabs)">` if already authenticated. Include when changing auth screen flow. |
| `app/(tabs)/_layout.tsx` | Tab navigator — `<Redirect href="/(auth)/login">` if not authenticated. Defines 5 tabs with Ionicons; active tab shows an accent-colored pill behind the icon (`TabIcon` local component), not just a color change. `screenListeners.tabPress` fires `hapticSelect()` on every tab switch. Include when adding/removing tabs or changing tab bar style. |

---

### Screens

| File | Description |
|---|---|
| `app/(auth)/login.tsx` | Login — `TextInput` fields (not `Input` component) inside single `inputRow` border. `KeyboardAvoidingView` wraps entire screen. `useRef` for password focus. Fires `hapticError()` on validation/auth failure, `hapticSuccess()` on successful login. Include when editing login UI or auth flow. |
| `app/(auth)/forgot-password.tsx` | Forgot password — `AppHeader` (`showBack`), email field + mock submit. Include when editing forgot password flow. |
| `app/(tabs)/index.tsx` | Home dashboard (2026 bento layout) — `AppHeader` greeting (`getGreeting()`), `HeroStatCard` for Fund Balance (primary KPI, with inline sub-stats), 2 secondary `StatCard` tiles (My Contributions, Announcements) below, "Recent Announcements" + "Recent Transactions" each in a `Section` panel with `variant="flat"` cards inside. Uses `reportsService.getFundSummary`, `announcementsService.getAnnouncements`, `transactionsService.getMyTransactions`. `SkeletonList` while loading. Include when editing dashboard layout or KPIs. **Note:** this file was previously found duplicated with `announcements/index.tsx` content (accidental overwrite in an earlier export) and was rebuilt from scratch — verify against this description if anything looks off. |
| `app/(tabs)/announcements/index.tsx` | Announcements feed — `AppHeader`, "Pinned" + "All Announcements" each in their own `Section` panel, `AnnouncementCard variant="flat"` inside. Uses `ScrollView` (not `FlatList`) so each section can be its own bordered/padded panel. Include when editing announcements list. |
| `app/(tabs)/announcements/[id].tsx` | Announcement detail — `AppHeader` with `showBack`, full content, meta footer. Include when editing announcement detail. |
| `app/(tabs)/activities/index.tsx` | Activities — `AppHeader` with `SegmentedControl` (animated) in `bottomSlot`, Projects/Events toggle, respective card lists. Header persists during load; body shows `SkeletonList`. Include when editing activities layout. |
| `app/(tabs)/activities/projects/[id].tsx` | Project detail — `AppHeader` with `showBack`, header card, funding card, info card. Include when editing project detail. |
| `app/(tabs)/activities/events/[id].tsx` | Event detail — `AppHeader` with `showBack`, header card, funding card, info card with 12hr time. Include when editing event detail. |
| `app/(tabs)/finances/index.tsx` | Finances — `AppHeader` showing compact total balance (`formatCurrency(total, true)`) as title, `SegmentedControl` Funds/Transactions, `FundCard` + `TransactionRow` lists. Body shows `SkeletonList` while loading. Include when editing finances screen. |
| `app/(tabs)/finances/[id].tsx` | Transaction detail — `AppHeader` with `showBack`, amount hero card, info card. Include when editing transaction detail. |
| `app/(tabs)/profile/index.tsx` | Profile — `AppHeader` with edit button in `rightSlot`, avatar row, stat strip, personal info card, logout button. Include when editing profile screen. |
| `app/(tabs)/profile/edit.tsx` | Edit profile — `AppHeader` with `showBack`, read-only fields grayed, editable fields with validation. Include when editing profile edit form. |

---

### UI Components

| File | Description |
|---|---|
| `components/ui/index.ts` | Barrel export for all UI components. Update when adding new UI components. |
| `components/ui/AppHeader.tsx` | **Primary unified page header** — dark `Colors.primary` bg, `title`, `subtitle`, `showBack`, `rightSlot`, `bottomSlot`. Used on all tab, detail, AND auth screens (forgot-password migrated from legacy `ScreenHeader`, which was removed). Include when editing any screen header. |
| `components/ui/Badge.tsx` | Colored pill — `variant` prop. Colors from `theme.ts` tokens only. Include for any label/tag display. |
| `components/ui/StatusBadge.tsx` | Auto-maps status string → Badge. Include for any status display. |
| `components/ui/Avatar.tsx` | Circular avatar — photo or initials with deterministic color. Include on profile or member displays. |
| `components/ui/Card.tsx` | White surface with border + shadow. Base content block. Tappable variant uses `PressableScale`. |
| `components/ui/PressableScale.tsx` | Shared tap feedback — `Animated` scale-down on press + `Shadow.md` bump + `hapticTap()`. Wraps `onPress`-able card content; used by `Card`, `StatCard`, `AnnouncementCard`, `ProjectCard`, `EventCard`, `TransactionRow` instead of each duplicating the same logic. |
| `components/ui/FadeInUp.tsx` | Fade + slide-up entrance animation on mount, `delay` prop for staggering. Wraps screen-level blocks (hero card, KPI row, `Section` panels, tab content) so pages cascade in instead of appearing instantly. Uses the existing `Animated` API — no `reanimated` dependency. |
| `components/ui/Button.tsx` | Touchable button — 5 variants, 3 sizes, loading state. Default `accessibilityRole="button"` + `accessibilityLabel={title}` + `accessibilityState`. Fires `hapticTap()` on press (separate from `PressableScale` — uses `TouchableOpacity`). |
| `components/ui/Input.tsx` | Labeled `TextInput` with error/hint. Note: login screen uses raw `TextInput` inside custom `inputRow` — do NOT use `Input` there (causes double border). |
| `components/ui/SegmentedControl.tsx` | Two-way tab toggle, animated sliding highlight via `Animated` API, fires `hapticSelect()` only on an actual selection change. Props: `options: {key,label}[]`, `activeKey`, `onChange`. Used in `AppHeader`'s `bottomSlot` on Activities & Finances — do not reintroduce inline segmented markup in screens, use this instead. |
| `components/ui/SectionHeader.tsx` | Section title — left accent bar + bottom divider for visual separation, optional count pill, optional `actionLabel`/`onAction` (built-in "View All" link, replaces manually duplicating this pattern per screen). Used inside `Section`. |
| `components/ui/Section.tsx` | Section panel — white bg, border, `Radius.lg`, `Shadow.sm`, padding, wraps a `SectionHeader` + `children`. Use for any named list section (Pinned, Recent X, All X) instead of a bare header floating on the screen bg. |
| `components/ui/EmptyState.tsx` | Empty list placeholder — tinted `accentLight` icon circle (Ionicons `icon` prop, e.g. `"folder-open-outline"`, default `"file-tray-outline"`) + title + subtitle + action. |
| `components/ui/LoadingSpinner.tsx` | Centered `ActivityIndicator`. `fullScreen` prop. Used on single-item detail screens only — card-list screens use `SkeletonList`. |
| `components/ui/Skeleton.tsx` | `SkeletonBlock` (pulsing rect, freeform), `SkeletonCard` (title+2 lines), `SkeletonList` (stack of `SkeletonCard`). Drop-in replacement for `LoadingSpinner fullScreen` on card-list screens so the header can render immediately. |
| `components/ui/ErrorState.tsx` | Error placeholder + retry button — tinted `dangerLight` icon circle (Ionicons, not emoji). |
| `components/ui/ProgressBar.tsx` | Horizontal fill bar — `progress` is 0–1. |
| `components/ui/Divider.tsx` | Thin `Colors.borderInner` line. |
| `components/ui/InfoRow.tsx` | Label + value pair row — used in detail screens. |
| `components/ui/StatCard.tsx` | KPI tile — plain white card, `Radius.lg`, colored icon chip (no left border stripe). `minHeight: 108` so all tiles in a grid match regardless of value/label text length. Optional `onPress` adds `PressableScale` feedback + chevron next to the label. |
| `components/ui/HeroStatCard.tsx` | Large solid-accent-color card, `Radius.xl`, decorative offset circle, optional `subStats` row. Use for one primary KPI that should stand out from a secondary `StatCard` grid. |
| `components/ui/FundingProgress.tsx` | Progress bar + ₱ labels + percent. Used in project/event cards and detail screens. |

---

### Shared Components

| File | Description |
|---|---|
| `components/shared/AnnouncementCard.tsx` | Compact card — left `Colors.info` border (accent if pinned), bold title, muted 2-line preview, author/time footer, chevron. `variant?: 'elevated' \| 'flat'` (default elevated). `PressableScale` tap feedback. Matches `ProjectCard`/`EventCard` style. |
| `components/shared/ProjectCard.tsx` | Card — status + type badges, location, dates, `FundingProgress`, left status border. `variant?: 'elevated' \| 'flat'` (default elevated). `PressableScale` tap feedback. |
| `components/shared/EventCard.tsx` | Card — status badge, 12hr time, location, `FundingProgress`, left status border. `variant?: 'elevated' \| 'flat'` (default elevated). `PressableScale` tap feedback. |
| `components/shared/TransactionRow.tsx` | Row — entry type label, fund name, amount, date, status badge, left status border. `variant?: 'elevated' \| 'flat'` (default elevated). `PressableScale` tap feedback. |
| `components/shared/FundCard.tsx` | Card — name, type badge, balance, status, description. Left `Colors.accent` border. |
| `components/shared/MemberStatRow.tsx` | Icon + label + value row for profile stats. |

---

### Auth & State

| File | Description |
|---|---|
| `store/authStore.ts` | Zustand store — `isAuthenticated`, `currentUser (User\|null)`, `token`. Actions: `login()`, `logout()`, `setCurrentUser()`, `restoreSession()`. Persists to `expo-secure-store`. Include in any auth or user session prompt. |
| `hooks/useCurrentUser.ts` | Returns `currentUser` from authStore as `User \| null` — never throws. Include when any screen needs the logged-in user. |

---

### Data & Mock

| File | Description |
|---|---|
| `api/mockData.ts` | All mock arrays: `MOCK_USERS(6)`, `MOCK_ANNOUNCEMENTS(4)`, `MOCK_PROJECTS(5)`, `MOCK_EVENTS(4)`, `MOCK_FUNDS(5)`, `MOCK_TRANSACTIONS(7)`, `MOCK_ATTENDANCES(5)`. Matches website shapes. Include when services need mock data reference. |

---

### Services

| File | Description |
|---|---|
| `services/supabase.ts` | Supabase client — reads `EXPO_PUBLIC_*` env vars. Import `{ supabase }` in service files. Include when connecting real backend. |
| `services/auth.service.ts` | `login()`, `logout()`, `getSession()`. Dev: matches MOCK_USERS. Include when editing login/logout logic. |
| `services/members.service.ts` | `getMyProfile()`, `updateProfile()`, `getMembers()`. Include when editing profile data. |
| `services/announcements.service.ts` | `getAnnouncements()`, `getAnnouncementById()`. Include when editing announcements data. |
| `services/projects.service.ts` | `getProjects()`, `getProjectById()`. Include when editing projects data. |
| `services/events.service.ts` | `getEvents()`, `getEventById()`. Include when editing events data. |
| `services/transactions.service.ts` | `getMyTransactions(userId)`, `getAllTransactions()`, `getTransactionById()`. Include when editing transactions data. |
| `services/funds.service.ts` | `getFunds()`, `getFundById()`. Include when editing fund data. |
| `services/reports.service.ts` | `getFundSummary()`, `getFinancialOverview()`. Computed from mock data. Include when editing dashboard KPIs. |

---

### Hooks

| File | Description |
|---|---|
| `hooks/useCurrentUser.ts` | Returns `User \| null` from authStore. Use in every screen that needs the logged-in user. |
| `hooks/useRefreshOnFocus.ts` | Calls React Query `refetch` when screen gains focus via `useIsFocused`. Use on all tab screens. |
| `hooks/useBottomPadding.ts` | Returns `insets.bottom + TAB_BAR_HEIGHT + SCREEN_PADDING_V`. Use as `paddingBottom` in `FlatList`/`ScrollView` on tab screens. |

---

### Never Include in Prompts

| Path | Reason |
|---|---|
| `node_modules/` | Third-party packages |
| `.expo/` | Auto-generated build cache |
| `ios/` / `android/` | Native build output |
| `package-lock.json` | Auto-generated lock file |
| `assets/fonts/` | Empty — fonts loaded via npm packages |
| `eas.json` | Only for CI/build config changes |
| `.DS_Store` / `*.log` | System/log files |

---

### Website Reference (for design alignment only — do not share code)

| File | Use for |
|---|---|
| `website/src/index.css` | Color token source of truth |
| `website/src/constants/tableColors.js` | Status color mapping reference |
| `website/src/utils/formatters.js` | Formatter function reference |
| `website/src/api/mockData.js` | Data shape reference |
