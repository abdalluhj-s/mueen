# 🕌 منصة وتطبيق مُعين (Mueen Platform) — Master Project Context & AI Guide

> **Important for any AI Assistant / LLM**:  
> This file is the single source of truth for the **Mueen (مُعين)** project. Read this thoroughly before making any modifications, planning new features, or debugging. It contains all architectural decisions, database schemas, deployment pipelines, design guidelines, and business logic.

---

## 📌 1. Project Vision & Identity

* **Name**: مُعين (Mueen) — *"شريك الالتزام بالطاعات"* / *"Your Daily Spiritual Habit & Accountability Partner"*.
* **Core Philosophy**: Building and maintaining daily Islamic spiritual habits (Prayers, Sunnah Rawatib, Quran, Adhkar, and voluntary Fasting) through friendly, daily accountability without burnout or guilt.
* **Key Pillars**:
  1. **Daily Chronological Worship Flow**: Structured from Fajr to Night.
  2. **Accountability Partner System (شريك المسير)**: Connect with a friend/spouse to view each other's completion percentage and streak, sending prayers and encouragement.
  3. **Smart Seasonal Visibility**: Voluntary worship (Friday tasks, Monday/Thursday fasting, White Days, Ashura, Dhul-Hijjah) ONLY appears on the days they are relevant.
  4. **Bilingual Experience (Arabic & English)**: Complete system-wide translation with dynamic RTL/LTR layout switching.
  5. **External Push Notifications & Sound**: Real lockscreen push alerts for prayers, adhkar, Witr, and daily Hadith reflection.
  6. **Calendar & Makeup Log (السجل والاستدراك)**: Easy review of consistency and ability to make up past days.
  7. **Cross-Platform PWA**: Progressive Web App installable on iOS and Android with full native look and feel.

---

## 🌐 2. Hosting, Domains & Environments

* **Primary Production Hosting**: **Cloudflare Workers** (via `@opennextjs/cloudflare`)
  * **Live Platform URL**: `https://mueen.ah4549658.workers.dev`
  * **Cloudflare Account ID**: `0af9e0d47afd9e7b9ef61b16db2beac4`
  * **Worker Name**: `mueen`
  * **Subdomain**: `ah4549658`
* **Version Control (Git)**:
  * **Repository**: `https://github.com/abdalluhj-s/mueen.git`
  * **Default Branch**: `main`
* **Backend & Database**: **Supabase**
  * **Supabase Project URL**: `https://opezychzfccccnbitwgr.supabase.co`
  * **Auth**: Google OAuth + Email Passwordless / Magic Link

> ⚠️ **Critical Deployment Rule**:  
> Always use `https://mueen.ah4549658.workers.dev` as the canonical platform domain. Do not hardcode Netlify or temporary URLs. All share and invite links must dynamically resolve via `window.location.origin` with fallback to `https://mueen.ah4549658.workers.dev`.

---

## 💻 3. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `14.2.35` / `14.2.x` | Full-stack React framework with SSR and Server Actions |
| **Language** | TypeScript | `^5.7.3` | Strict type checking across the entire project |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility-first CSS with custom themes and dark mode |
| **Icons** | Lucide React | `^1.16.0` | Clean, modern iconography |
| **Edge Adapter** | OpenNext Cloudflare | `^1.20.6` | Next.js compilation adapter for Cloudflare Workers |
| **Deployment CLI**| Wrangler | `^4.136.1` | Cloudflare Workers CLI |
| **Database** | PostgreSQL (Supabase) | Latest | Profiles, daily habits log, partner relationships, messages |
| **Client Auth** | `@supabase/ssr` & `@supabase/supabase-js` | Latest | Cookie-based session management and browser client |

---

## 📂 4. Project Directory Structure

```text
mueen/
├── app/
│   ├── layout.tsx              # Root HTML layout with zero-flicker theme & language init
│   ├── page.tsx                # Main Dashboard: daily habit list, streak, partner card
│   ├── settings/
│   │   └── page.tsx            # Settings Hub: 8 collapsible accordions
│   ├── progress/
│   │   └── page.tsx            # Calendar & History: monthly grid and day makeup modal
│   ├── quran/
│   │   └── page.tsx            # Quran Reader: complete Mushaf with auto-bookmarking
│   ├── adhkar/
│   │   └── page.tsx            # Fortress of the Muslim: Morning, Evening, Sleep, and Sebha
│   ├── join/
│   │   └── page.tsx            # Landing page for partner invite links (/join?code=...)
│   ├── login/
│   │   └── page.tsx            # Authentication page (Google OAuth + Supabase)
│   ├── auth/
│   │   └── callback/route.ts   # OAuth code exchange route handler
│   ├── actions/
│   │   ├── habits.ts           # Server Actions: toggle habit, streak calculation, partner progress
│   │   └── partner.ts          # Server Actions: generate invite code, accept code, send messages
│   └── manifest.webmanifest    # PWA configuration (app name, icons, theme colors)
│
├── components/
│   ├── Header.tsx              # Clean top header: Font scale, Calendar, Dark mode, Language
│   ├── ShareAppModal.tsx       # Standalone share modal with WhatsApp, Telegram, X, device share
│   ├── NotificationSettingsCard.tsx # Push alerts manager + audio chime preview
│   ├── DailyProgressCard.tsx   # Progress bar, percentage, and motivational daily Hadith
│   ├── HabitList.tsx           # Filterable habit list with time slots and categories
│   ├── HabitRow.tsx            # Individual habit row with checkbox and delete/edit
│   ├── PartnerCard.tsx         # Partner status card showing companion's daily streak
│   ├── PartnerInviteModal.tsx  # Modal to copy invite code or enter partner's code
│   ├── AddHabitModal.tsx       # Custom habit creation modal
│   ├── ProfileEditModal.tsx    # Modal to update user display name and avatar
│   └── InstallAppModal.tsx     # Step-by-step PWA install instructions for Android and iOS
│
├── lib/
│   ├── shareContent.ts         # Master bilingual share descriptions & dynamic link builder
│   ├── translations.ts         # Complete AR/EN dictionary, language getter/setter, URL param detector
│   ├── islamicCalendar.ts      # Hijri calculations, Friday checks, and fasting date validators
│   ├── timeSettings.ts         # Country timezones, prayer calculations, color palettes
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       └── server.ts           # Server-side Supabase client with Next.js cookies
│
├── public/
│   ├── logo.jpg                # Official Mueen logo emblem
│   ├── icons/                  # PWA icons (192x192, 512x512)
│   └── sounds/                 # Notification chime audio file
│
├── open-next.config.ts         # OpenNext configuration for Cloudflare
├── wrangler.jsonc              # Cloudflare Workers deployment config
├── tailwind.config.ts          # Tailwind theme extensions & animations
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies and npm scripts
└── PROJECT_CONTEXT.md          # THIS FILE (Master AI & Project Reference)
```

---

## 🎨 5. UI/UX Rules & User Preferences (Strictly Enforced)

### 1. Minimal Top Header (`components/Header.tsx`)
* **Must stay clean and uncluttered**.
* Only contains:
  1. **Logo & App Title**: Links to `/`. Shows `مُعين` in Arabic or `Mueen` in English with tag badge.
  2. **Font Scale Cycler (`A₁`, `A₂`, `A₃`)**: Single button cycling through Small (`sm`), Standard (`md`), Large (`lg`).
  3. **Calendar Icon**: Direct link to `/progress`.
  4. **Dark Mode Toggle (`Sun` / `Moon`)**: Switches between Dark & Light themes.
  5. **Language Switcher (`EN` / `عربي`)**: Instant one-click toggle.
* ❌ **DO NOT place the Share button or unnecessary action clutter in the top Header**.

### 2. Share Application Hub (`app/settings/page.tsx` & `components/ShareAppModal.tsx`)
* Located **exclusively in the Settings page (`/settings`)** inside a dedicated **collapsible accordion (مطوي افتراضياً)**.
* Features:
  * **Language Switcher**: `[ 🇸🇦 الوصف العربي ]` and `[ 🇬🇧 English Version ]`.
  * **Direct Links**:
    * Arabic: `https://mueen.ah4549658.workers.dev/?lang=ar`
    * English: `https://mueen.ah4549658.workers.dev/?lang=en`
  * **Live Formatted Preview Box**: Renders the complete, emoji-rich explanation of Mueen.
  * **Direct Sharing Channels**:
    * WhatsApp (`api.whatsapp.com/send?text=...`)
    * Telegram (`t.me/share/url...`)
    * X / Twitter (`twitter.com/intent/tweet...`)
  * **Copy Actions**: "نسخ الرسالة كاملة مع الرابط 📋" and "نسخ الرابط فقط 🔗".
  * **Native Device Share**: Triggers `navigator.share` on supported devices.

### 3. All Settings Sections Start Collapsed
* In `app/settings/page.tsx`, every section (Language, Colors, Font, Country/Time, Notifications, Share, PWA, Account) **defaults to `false` (collapsed)** for a clean, non-overwhelming user experience.

---

## ⏰ 6. Habit System & Smart Seasonal Logic

### Versioned Default Habits (`HABITS_VERSION = 'v5'`)
Stored in `localStorage` under `mueen_habits`. Updating `HABITS_VERSION` refreshes user data while preserving custom items.

```typescript
// Chronological structure:
// 1. Fajr: Fard prayer + Sunnah Rawatib (2 before) + Morning Adhkar
// 2. Dhuhr: Sunnah (4 before) + Fard prayer + Sunnah (2 after)
// 3. Asr: Fard prayer + Evening Adhkar & Fortress
// 4. Maghrib: Fard prayer + Sunnah (2 after)
// 5. Isha: Fard prayer + Sunnah (2 after) + Witr & Qiyam Al-Layl
// 6. Quran: Daily portion (links to /quran)
// 7. Night: Sleep Adhkar & Surah Al-Mulk
```

### Smart Conditional Visibility Rules:
1. **Friday Sunan Hub (سنن الجمعة)**:
   * **Rule**: Checked via `getIslamicDayStatus().isFriday`.
   * **Items**: Surah Al-Kahf, Abundant Salawat upon the Prophet ﷺ, Hour of Response Dua.
   * **Behavior**: **Hidden on Saturday through Thursday**. Automatically surfaces exclusively on **Friday**.
2. **Voluntary Fasting (صيام التطوع)**:
   * **Mondays & Thursdays**: Only visible when the current day is Monday or Thursday.
   * **White Days (الأيام البيض)**: Only visible on the 13th, 14th, and 15th of the Hijri month.
   * **Seasonal**: Ashura (10th Muharram), First 9 Days of Dhul-Hijjah, Six Days of Shawwal — appear only during their Islamic season.

---

## 🌍 7. Internationalization (i18n) Engine

* **File**: `lib/translations.ts`
* **Supported Languages**: Arabic (`'ar'`, default) and English (`'en'`).
* **Architecture**:
  * Central dictionary `DICTIONARY` keyed by `TranslationKey`.
  * Helper `t(key, lang)` returns translated string with fallback to Arabic.
  * `getSavedLanguage()` inspects `window.location.search` for `?lang=en` or `?lang=ar` first. If present, sets `localStorage` and HTML attributes immediately (zero-flicker).
  * Dispatches `mueen_language_changed` custom event on change.
  * Ready for adding Russian (`'ru'`) by adding keys to `DICTIONARY` and `SHARE_CONTENT`.

---

## 🗄️ 8. Supabase Database Schema

### `profiles` Table
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | References `auth.users.id` |
| `full_name` | `text` | User display name |
| `avatar_url` | `text` | Profile image URL |
| `invite_code`| `text` (Unique) | Short referral code (e.g. `MN-8A9C2E`) |
| `created_at` | `timestamptz` | Account creation timestamp |

### `partner_connections` Table
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Connection ID |
| `user_id` | `uuid` | Requester user ID |
| `partner_id` | `uuid` | Connected partner user ID |
| `status` | `text` | Connection state (`'active'`, `'pending'`) |
| `created_at` | `timestamptz` | Connected timestamp |

### `daily_habit_logs` Table
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Log entry ID |
| `user_id` | `uuid` | Owner user ID |
| `date` | `date` | Logged date (`YYYY-MM-DD`) |
| `completed_habits` | `jsonb` | Array of completed habit IDs |
| `total_habits` | `integer` | Total number of habits for that day |
| `streak_count` | `integer` | Consecutive active streak days |
| `updated_at` | `timestamptz` | Last updated timestamp |

### `partner_messages` Table
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Message ID |
| `sender_id` | `uuid` | Sender user ID |
| `receiver_id` | `uuid` | Receiver user ID |
| `message` | `text` | Encouragement text or prayer (Dua) |
| `created_at` | `timestamptz` | Sent timestamp |

---

## 🔔 9. External Push Notification Engine

* **File**: `components/NotificationSettingsCard.tsx`
* **Features**:
  * Uses browser `Notification.requestPermission()`.
  * External lockscreen notifications for:
    * Fajr & Sunrise Adhkar
    * Maghrib & Evening Adhkar
    * Night Prayer & Witr ( قيام الليل والوتر )
    * Friday Surah Al-Kahf & Salawat
    * Daily prophetic Hadith reflection
  * Includes local audio chime preview (`/sounds/notification.mp3`).

---

## 🚀 10. Development & Deployment Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build check (verifies all 12 pages & TypeScript)
npm run build
```

### Git Commit & Push
```bash
git add .
git commit -m "feat/fix: descriptive message"
git push origin main
```

### Cloudflare Workers Deployment
* Configured in `wrangler.jsonc` and `open-next.config.ts`.
* Command:
  ```bash
  npx @opennextjs/cloudflare build --dangerouslyUseUnsupportedNextVersion
  npx wrangler deploy
  ```
* **Windows Note**: OpenNext builds can encounter virtual memory limitations in Windows command shells when nested under Wrangler. To prevent this, run the OpenNext build first, then deploy.

---

## 💡 11. Quick Reference for Incoming AI Agents

1. **Do not create new pages without checking App Router structure**:
   Existing pages: `/`, `/settings`, `/progress`, `/quran`, `/adhkar`, `/join`, `/login`.
2. **Always test bilingual rendering**:
   Every new UI text MUST have corresponding entries in `lib/translations.ts` (`ar` and `en`).
3. **Do not disrupt the clean top header**:
   Keep header controls limited to font cycler, calendar, theme toggle, and language.
4. **Maintain Cloudflare as the canonical domain**:
   Use `https://mueen.ah4549658.workers.dev` as primary URL. Never use third-party domains in share links.
5. **Always respect Friday & Fasting conditions**:
   Never show Friday tasks on ordinary days or fasting tasks outside fasting days.
