# TLDTerminal - Domain Investing Terminal

## Overview

TLDTerminal is a SaaS dashboard web application designed for domain investors to discover high-quality dropping domains. The application provides a daily drop feed showing domains that are expiring or dropping soon, a watchlist for tracking interesting domains, and an AI-powered domain builder for generating domain name ideas.

The project follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: TailwindCSS with shadcn/ui component library
- **Build Tool**: Vite with hot module replacement

The frontend is organized under `client/src/` with:
- `pages/` - Route-level components (daily-drop-feed, watchlist, builder)
- `components/` - Reusable UI components including domain cards, filters, and modals
- `components/ui/` - shadcn/ui primitives (buttons, cards, dialogs, etc.)
- `hooks/` - Custom React hooks for mobile detection and toast notifications
- `lib/` - Utilities including the query client and mock data

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **HTTP Server**: Node.js native HTTP server
- **API Pattern**: RESTful JSON APIs under `/api/` prefix
- **Development**: Vite middleware integration for HMR during development
- **Production**: Static file serving from built assets

The backend is organized under `server/` with:
- `routes.ts` - API endpoint definitions
- `storage.ts` - Data access layer with in-memory mock storage
- `vite.ts` - Development server configuration
- `static.ts` - Production static file serving

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation via drizzle-zod
- **Migrations**: Managed via drizzle-kit (`npm run db:push`)

Current data models include:
- Users (authentication ready)
- Domains (mock data with score, status, TLD, renewal info)
- Watchlist items (user-tracked domains)
- Saved searches (search configurations with alerts)

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
- **connect-pg-simple**: Session storage for Express (configured but not fully implemented)

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
- `embla-carousel-react`: Carousel component