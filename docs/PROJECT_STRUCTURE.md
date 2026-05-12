# FREDMEN Project Structure

```
fredmen/
├── apps/
│   ├── mobile/              # React Native + Expo mobile app
│   │   ├── src/
│   │   │   ├── screens/     # App screens
│   │   │   ├── components/  # Reusable components
│   │   │   ├── navigation/  # Navigation setup
│   │   │   ├── services/    # API and Socket.IO clients
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── store/       # Zustand state management
│   │   │   └── utils/       # Utilities
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── App.tsx          # App entry point
│   │   ├── app.json         # Expo config
│   │   └── package.json
│   │
│   └── backend/             # Node.js + Express API server
│       ├── src/
│       │   ├── routes/      # API route handlers
│       │   ├── controllers/ # Business logic
│       │   ├── services/    # External service integrations
│       │   ├── middleware/  # Express middleware
│       │   ├── database/    # DB schema and queries
│       │   │   └── schema.sql
│       │   ├── websocket/   # Socket.IO handlers
│       │   └── server.ts    # Server entry point
│       └── package.json
│   │
│   └── ide/                 # VS Code-like IDE (code-server + Gemini agent)
│       ├── extensions/      # Bundled VS Code extensions (Gemini agent)
│       ├── entrypoint.sh    # Code-server startup script
│       └── package.json
│
├── packages/
│   └── shared/              # Shared TypeScript types
│       ├── src/
│       │   ├── types.ts     # Common interfaces
│       │   └── index.ts
│       └── package.json
│
├── docs/                    # Additional documentation
│   └── development-plan.md  # Main development plan
│
├── docker-compose.yml       # Local development services
├── .env.example             # Environment variable template
├── package.json             # Root package.json (monorepo)
├── tsconfig.json            # TypeScript configuration
├── .prettierrc              # Prettier configuration
├── .eslintrc.json           # ESLint configuration
├── .gitignore
├── README.md
└── LICENSE
```

## Quick Start

### Prerequisites
- Node.js 18+
- Yarn
- Docker & Docker Compose (for local DB/Redis)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repo-url>
   cd fredmen
   yarn install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start local services (Postgres + Redis):**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Initialize database:**
   ```bash
   # Run the schema.sql file
   psql -U fredmen_user -d fredmen_db -f apps/backend/src/database/schema.sql
   ```

5. **Start development servers:**
   ```bash
   # Terminal 1: Backend
   yarn backend

   # Terminal 2: Mobile
   yarn mobile
   ```

## Next Steps

- [ ] Implement authentication routes (OTP/JWT)
- [ ] Build map screen with Mapbox integration
- [ ] Create group CRUD endpoints
- [ ] Set up WebSocket chat handlers
- [ ] Design UI components and screens
