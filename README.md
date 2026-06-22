# Nandan LP Finder

AI-assisted platform for fund managers to discover Limited Partners (LPs), enrich investor profiles, score prospects, and generate personalized outreach.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **APIs**: Apollo, RocketReach (swappable provider architecture)
- **LLM**: Claude (primary), OpenAI (secondary)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL and API keys

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### Environment Variables

See `.env.example` for all required variables. Set `PROVIDER_MODE=mock` to use mock data without API keys.

## Project Structure

```
src/
  app/
    api/
      health/        # Health check endpoint
      organizations/ # CRUD for LP organizations
      contacts/      # CRUD for contacts
      search/        # Provider search aggregation
    layout.tsx
    page.tsx
  lib/
    providers/
      apollo/        # Apollo API integration
      rocketreach/   # RocketReach API integration
      mock/          # Mock provider for local dev
      index.ts       # Provider factory
      types.ts       # Provider interface
    audit.ts         # Audit logging
    db.ts            # Prisma client singleton
    scoring.ts       # LP qualification scoring engine
  types/
    index.ts         # Shared type definitions
prompts/             # Versioned LLM prompt templates
prisma/
  schema.prisma      # Database schema
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/organizations` - List organizations (filter by type, minScore)
- `POST /api/organizations` - Create organization
- `GET /api/contacts` - List contacts (filter by organizationId, minConfidence)
- `POST /api/contacts` - Create contact
- `DELETE /api/contacts?id=` - Delete contact record
- `POST /api/search` - Search across all providers

## License

MIT
