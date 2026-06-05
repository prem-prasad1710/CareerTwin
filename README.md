# CareerTwin AI

**Predict your future career before it happens.**

CareerTwin creates a living AI model of your professional life — continuously learning, predicting outcomes, identifying skill gaps, simulating decisions, and acting as your AI career coach.

## Architecture

```
careertwin-ai/
├── apps/
│   ├── web/          # Next.js 15 frontend (Vercel)
│   └── api/          # NestJS backend (AWS ECS)
├── packages/
│   ├── database/     # Prisma + PostgreSQL + pgvector
│   └── shared/       # Shared TypeScript types
└── docker-compose.yml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, React Query, Framer Motion, Recharts |
| Backend | NestJS, TypeScript, BullMQ |
| Database | PostgreSQL + pgvector |
| Cache/Queue | Redis + BullMQ |
| Auth | Clerk |
| AI | OpenAI, Claude, Gemini (abstraction layer) |
| Storage | AWS S3 |
| Analytics | PostHog |
| Deploy | Vercel (web) + AWS ECS (api) |

## Features

### Prediction Engines (15)
1. **Career DNA** — 10-dimension radar profile
2. **Career Score** — Dynamic 0-100 score with peer benchmarking
3. **Market Value** — Salary estimation and forecasting
4. **Skill Gap** — Target role comparison with learning roadmaps
5. **Career Simulator** — Decision outcome prediction (flagship)
6. **Timeline Predictor** — Future career roadmap with confidence scores
7. **Interview Predictor** — Company-specific success probability
8. **Career Memory** — Searchable career history with vector search
9. **AI Career Coach** — 7 specialized AI agents
10. **Job Match Engine** — Opportunity matching with scores
11. **Learning ROI** — Skill investment return analysis
12. **GitHub Intelligence** — Engineering depth scoring
13. **LinkedIn Intelligence** — Personal brand analysis
14. **Risk Detector** — Burnout, stagnation, layoff alerts
15. **Health Dashboard** — Executive career wellness metrics

### AI Agents
- Career Coach
- Interview Coach
- Salary Negotiator
- Job Hunter
- Resume Optimizer
- Learning Mentor
- Career Strategist

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### 1. Start Infrastructure

```bash
docker compose up -d
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Setup Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Start Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

### Demo Mode

The frontend works out of the box with rich demo data. No backend required to explore the UI. Connect the API for live predictions.

## API Endpoints

| Endpoint | Description |
|----------|------------|
| `GET /api/v1/dashboard/:userId` | Complete dashboard overview |
| `GET /api/v1/career-dna/:userId` | Career DNA radar data |
| `GET /api/v1/career-score/:userId` | Career score breakdown |
| `GET /api/v1/market-value/:userId` | Salary estimation |
| `GET /api/v1/skill-gap/:userId` | Skill gap analysis |
| `POST /api/v1/simulator/:userId` | Run career simulation |
| `GET /api/v1/timeline/:userId` | Career timeline predictions |
| `GET /api/v1/interview/:userId/predictions` | Interview success odds |
| `POST /api/v1/coach/:userId/chat` | AI coach conversation |
| `GET /api/v1/job-match/:userId` | Job opportunity matches |
| `GET /api/v1/learning-roi/:userId` | Learning ROI rankings |
| `GET /api/v1/risk/:userId` | Career risk analysis |
| `GET /api/v1/health/:userId` | Career health metrics |

## Database Schema

25+ entities including Users, Profiles, Skills, Projects, WorkExperience, CareerPredictions, CareerSimulations, CareerMemories (with pgvector embeddings), MarketData, AIRecommendations, and more.

## Deployment

### Frontend (Vercel)
```bash
cd apps/web && vercel deploy
```

### Backend (AWS ECS)
```bash
cd apps/api && docker build -t careertwin-api .
# Push to ECR and deploy via ECS
```

## License

Proprietary — CareerTwin AI © 2026
