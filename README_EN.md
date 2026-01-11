# Rinda Video Ask

> Korea's First AI-Powered Conversational Video Widget Solution

[한국어](./README.md) | English

## Overview

Rinda Video Ask is a B2B SaaS solution that embeds personalized video messages on websites, automatically playing them based on visitor behavior, collecting video/voice/text responses, and providing real-time AI translation and lead intelligence.

### Key Value Propositions
- **Personalized Video Communication**: Deliver customized video messages to website visitors
- **AI-Powered Support**: 24/7 AI-powered customer inquiry handling
- **Smart Meeting Scheduling**: Easy meeting booking with calendar integration
- **Lead Intelligence**: Automatic AI-powered lead analysis and scoring

---

## Tech Stack

| Area | Technology |
|------|------------|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Studio App** | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| **Widget SDK** | Vanilla TypeScript, Vite (< 50kb) |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **Authentication** | Supabase Auth (Google, Kakao OAuth) |
| **AI Pipeline** | OpenAI Whisper, Claude, Rinda.ai Translation |
| **Storage** | Supabase Storage |
| **Internationalization** | next-intl (Korean/English) |

---

## Project Structure

```
rinda-video-ask/
├── apps/
│   ├── studio/              # Next.js dashboard app
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   │   └── widget/  # Unified widget components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── lib/         # Utilities & configuration
│   │   └── messages/        # i18n translation files
│   └── widget/              # Embeddable widget SDK
├── packages/
│   ├── database/            # Supabase types & client
│   ├── ui/                  # Shared UI components
│   └── ai-engine/           # AI processing utilities
├── supabase/
│   ├── migrations/          # Database schema
│   └── functions/           # Edge Functions
└── ...
```

---

## Feature Status

### ✅ Currently Working Features (Demo Mode)

#### Unified Widget
- **Video Mode**: Welcome video playback with play/pause controls
- **Chat Mode**: AI-powered chat (keyword-based demo responses)
- **Calendar Mode**: Date/time selection → Contact form → Booking completion flow

#### Studio Dashboard
- Responsive layout (mobile/desktop)
- Multi-language support (Korean/English)
- Main landing page
- Demo experience page (`/demo`)
- Signup/Login pages
- Dashboard layout
- Settings page structure

#### Demo Mode Support
- App runs without Supabase connection
- All UI features testable with mock data
- Widget chat/calendar functionality simulation

---

### 🔧 Features Requiring Further Development (Mock Status)

#### High Priority
| Feature | Current Status | Required Work |
|---------|---------------|---------------|
| **Supabase Integration** | Mock client | Connect real Supabase project, run migrations |
| **User Authentication** | UI only | Supabase Auth integration, OAuth setup (Google, Kakao) |
| **Claude AI Integration** | Demo responses only | Set `ANTHROPIC_API_KEY`, enable real AI responses |
| **Video Recording** | Teleprompter UI only | MediaRecorder API integration, Supabase Storage upload |

#### Medium Priority
| Feature | Current Status | Required Work |
|---------|---------------|---------------|
| **Google Calendar Integration** | Placeholder | OAuth setup, freebusy query, event creation |
| **Lead Management** | UI only | leads table CRUD, email notifications |
| **Knowledge Base** | UI only | knowledge_base table, document embedding (pgvector) |
| **Analytics Dashboard** | Chart UI only | analytics table, aggregation queries |

#### Low Priority
| Feature | Current Status | Required Work |
|---------|---------------|---------------|
| **Widget SDK Deployment** | Development version | CDN deployment, versioning |
| **Speech Transcription** | Not implemented | OpenAI Whisper API integration |
| **Multi-language Translation** | Not implemented | Rinda.ai or Claude translation pipeline |
| **BANT Scoring** | Not implemented | AI analysis prompt development |

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- (Optional) Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/FINGU-GRINDA/rinda-video-ask.git
cd rinda-video-ask

# Install dependencies
pnpm install

# Start development server (demo mode)
pnpm dev
```

### Environment Variables (For Production)

Create `.env.local` file:

```env
# Supabase (Required for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth (Optional)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Services (Optional)
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key

# Google Calendar (Optional)
GOOGLE_CALENDAR_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=
```

> **Note**: The app runs in demo mode without environment variables.

---

## Scripts

```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm studio       # Start studio app only
pnpm widget       # Build widget SDK
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

---

## Architecture

### Widget Mode System

```
UnifiedWidget
├── video (default) - Welcome video playback
├── chat           - AI-powered real-time chat
└── calendar       - Meeting booking calendar
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/widget/chat` | POST | AI chat response |
| `/api/widget/calendar/availability` | GET | Get available time slots |
| `/api/widget/calendar/book` | POST | Create meeting booking |

### Data Flow

```
Visitor → Widget → API → Supabase
                      ↓
              Edge Function → AI Pipeline
                      ↓
              Lead → Dashboard
```

---

## License

MIT

---

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

---

Built with ❤️ by the Rinda Team
