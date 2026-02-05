# TLDTerminal - Domain Investing Terminal

## Overview

TLDTerminal is a SaaS dashboard web application designed for domain investors to discover high-quality dropping domains. The application provides a daily drop feed showing domains that are expiring or dropping soon, a watchlist for tracking interesting domains, and an AI-powered domain builder for generating domain name ideas.

The project follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## Recent Changes

- **Pro Features & Upgrade System** (Feb 2026): Added $79/mo Pro tier with upgrade modal, feature gating, and contextual upgrade prompts
- **Replit Auth Integration**: Implemented OIDC-based authentication with session management
- **Domain Card Enhancements**: Added reason tags (Strong Buy, Trending, Solid Pick) and investor interest badges
- **Feature Locks**: Pro-only features (Saved Searches, AI Builder, Portfolio) show lock overlays for free users
- **Watchlist Limits**: Free users limited to 10 watchlist items with upgrade trigger

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: TailwindCSS with shadcn/ui component library
- **Build Tool**: Vite with hot module replacement
- **Authentication**: Replit Auth via OIDC integration

The frontend is organized under `client/src/` with:
- `pages/` - Route-level components (daily-drop-feed, watchlist, builder, portfolio, landing)
- `components/` - Reusable UI components including domain cards, filters, modals, and Pro locks
- `components/ui/` - shadcn/ui primitives (buttons, cards, dialogs, etc.)
- `contexts/` - React contexts for user state and plan management
- `hooks/` - Custom React hooks for auth, mobile detection, and toast notifications
- `lib/` - Utilities including the query client

### Pro Feature System
- **Plan Tiers**: visitor (logged out), starter (free logged in), pro ($79/mo)
- **Feature Gating**: ProFeatureLock component wraps Pro-only content with blur overlay
- **Upgrade Modal**: Displays pricing, feature comparison, and Stripe-ready CTA
- **Contextual Triggers**: Upgrade prompts at friction points (watchlist limit, locked features)

### Domain Scoring & Tags
- **Reason Tags Algorithm**:
  - Score >= 90: "Strong Buy"
  - Trending && Score >= 80: "Trending"
  - Score >= 85: "Solid Pick"
- **Investor Interest**: Calculated from domain score + trending status (Pro-only visibility)

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **HTTP Server**: Node.js native HTTP server
- **API Pattern**: RESTful JSON APIs under `/api/` prefix
- **Authentication**: Replit Auth with session-based auth
- **AI Integration**: OpenAI via Replit AI Integrations for domain generation

The backend is organized under `server/` with:
- `routes.ts` - API endpoint definitions
- `storage.ts` - Data access layer with PostgreSQL via Drizzle ORM
- `ai.ts` - OpenAI integration for domain generation and score explanations
- `replit_integrations/auth/` - Replit Auth OIDC integration

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation via drizzle-zod
- **Migrations**: Managed via drizzle-kit (`npm run db:push`)

Current data models include:
- Users (authenticated via Replit Auth)
- Sessions (auth session storage)
- Domains (with score, status, TLD, renewal info)
- Watchlist items (user-tracked domains)
- Saved searches (search configurations with alerts)
- Portfolio items (owned domain tracking)

### Shared Code
The `shared/` directory contains TypeScript types and schemas used by both frontend and backend, ensuring type safety across the stack.

### Build System
- **Development**: `tsx` for TypeScript execution with Vite dev server
- **Production Build**: Custom script using esbuild for server bundling and Vite for client bundling
- **Output**: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage for Express

### Authentication
- **Replit Auth**: OIDC-based authentication via Replit AI Integrations
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### AI Integration
- **OpenAI**: Domain generation and score explanations via gpt-4o model
- **Replit AI Integrations**: Managed API key handling

### UI Component Library
- **shadcn/ui**: Pre-built accessible React components using Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, dropdowns, tooltips, etc.
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool and dev server
- **Replit plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `class-variance-authority` + `clsx` + `tailwind-merge`: CSS class utilities
- `zod`: Runtime type validation
- `date-fns`: Date formatting utilities
- `openai`: OpenAI API client
