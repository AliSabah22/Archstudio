# ARCHITECTURE.md — ArchStudio Operations Portal

---

## 11. PROJECT IDENTIFICATION

| Field | Value |
|---|---|
| **Project Name** | ArchStudio Operations Portal |
| **Codename** | `archstudio-portal` |
| **Client** | Pamir Dogan — Architecture Firm Principal (Toronto, ON) |
| **Primary Contact / Team** | Internal Development Team |
| **Repository URL** | Private — not yet published |
| **Last Updated** | April 8, 2026 |
| **Stage** | MVP Demo → Pre-Production |
| **Related System** | Wraptors Staff Portal (automotive vertical — same architectural philosophy) |

---

## 1. PROJECT STRUCTURE

### Current MVP (Single-File React Demo)

```
archstudio-portal/
├── README.md
├── ARCHITECTURE.md                        ← this file
│
├── docs/
│   └── ArchStudio-Portal-Deep-Breakdown.docx   # Full system spec (20 sections, 464 blocks)
│
├── src/
│   └── portal/
│       └── pamir-archstudio-portal.jsx    # Complete MVP — 741 lines, single-file React app
│                                          # Contains: all data models, 7 UI components,
│                                          # 8 view modules, sidebar navigation, design system
│
└── assets/
    └── fonts/                             # Google Fonts loaded at runtime
        ├── DM Serif Display               # Display / headings
        ├── DM Sans                        # Body text
        └── JetBrains Mono                 # Numeric / code values
```

### Target Production Structure

```
archstudio-portal/
├── README.md
├── ARCHITECTURE.md
├── docker-compose.yml
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Lint, test, build
│       ├── deploy-staging.yml
│       └── deploy-production.yml
│
├── docs/
│   ├── ArchStudio-Portal-Deep-Breakdown.docx
│   ├── data-models.md
│   ├── api-contracts.md
│   └── runbook.md
│
├── packages/
│   ├── web/                               # Staff Portal — React SPA
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── public/
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── router.tsx
│   │       ├── design-system/
│   │       │   ├── tokens.ts              # COLORS, fonts, spacing constants
│   │       │   ├── components/
│   │       │   │   ├── Badge.tsx
│   │       │   │   ├── StatusBadge.tsx
│   │       │   │   ├── ProgressBar.tsx
│   │       │   │   ├── StatCard.tsx
│   │       │   │   ├── Avatar.tsx
│   │       │   │   ├── AvatarStack.tsx
│   │       │   │   └── SidebarItem.tsx
│   │       │   └── layouts/
│   │       │       ├── AppShell.tsx        # Sidebar + main content area
│   │       │       └── PageHeader.tsx
│   │       ├── features/
│   │       │   ├── dashboard/
│   │       │   │   ├── DashboardView.tsx
│   │       │   │   ├── MetricCards.tsx
│   │       │   │   ├── ActiveProjectsWidget.tsx
│   │       │   │   ├── AlertsWidget.tsx
│   │       │   │   ├── DeadlinesWidget.tsx
│   │       │   │   └── TeamCapacityWidget.tsx
│   │       │   ├── projects/
│   │       │   │   ├── ProjectsView.tsx
│   │       │   │   ├── ProjectCard.tsx
│   │       │   │   ├── PhasePipeline.tsx
│   │       │   │   ├── ProjectDetail.tsx
│   │       │   │   └── ProjectFilters.tsx
│   │       │   ├── pipeline/
│   │       │   │   ├── PipelineView.tsx
│   │       │   │   ├── PipelineKanban.tsx
│   │       │   │   ├── OpportunityCard.tsx
│   │       │   │   └── PipelineMetrics.tsx
│   │       │   ├── team/
│   │       │   │   ├── TeamView.tsx
│   │       │   │   ├── TeamMemberRow.tsx
│   │       │   │   └── UtilizationBar.tsx
│   │       │   ├── invoices/
│   │       │   │   ├── InvoicesView.tsx
│   │       │   │   ├── InvoiceTable.tsx
│   │       │   │   ├── InvoiceDetail.tsx
│   │       │   │   └── InvoiceGenerator.tsx
│   │       │   ├── estimates/
│   │       │   │   ├── EstimatesView.tsx
│   │       │   │   ├── EstimateCard.tsx
│   │       │   │   └── EstimateBuilder.tsx
│   │       │   ├── calendar/
│   │       │   │   ├── CalendarView.tsx
│   │       │   │   ├── WeekGrid.tsx
│   │       │   │   └── EventCard.tsx
│   │       │   └── marketing/
│   │       │       ├── MarketingView.tsx
│   │       │       ├── ChannelCard.tsx
│   │       │       └── MarketingMetrics.tsx
│   │       ├── hooks/
│   │       │   ├── useProjects.ts
│   │       │   ├── usePipeline.ts
│   │       │   ├── useTeam.ts
│   │       │   ├── useInvoices.ts
│   │       │   └── useAuth.ts
│   │       ├── services/
│   │       │   ├── api.ts                 # Axios/fetch wrapper
│   │       │   └── realtime.ts            # WebSocket subscription manager
│   │       ├── stores/
│   │       │   └── appStore.ts            # Zustand global state
│   │       └── types/
│   │           ├── project.ts
│   │           ├── client.ts
│   │           ├── pipeline.ts
│   │           ├── invoice.ts
│   │           ├── estimate.ts
│   │           ├── team.ts
│   │           └── common.ts
│   │
│   ├── api/                               # Backend — Node.js / Express or Fastify
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── router.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rbac.ts               # Role-based access control
│   │   │   │   ├── validate.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── auth.routes.ts
│   │   │   │   ├── projects/
│   │   │   │   │   ├── project.controller.ts
│   │   │   │   │   ├── project.service.ts
│   │   │   │   │   ├── project.model.ts
│   │   │   │   │   └── project.routes.ts
│   │   │   │   ├── clients/
│   │   │   │   ├── pipeline/
│   │   │   │   ├── invoices/
│   │   │   │   ├── estimates/
│   │   │   │   ├── team/
│   │   │   │   ├── calendar/
│   │   │   │   ├── marketing/
│   │   │   │   ├── time-entries/
│   │   │   │   └── notifications/
│   │   │   ├── lib/
│   │   │   │   ├── db.ts                  # Prisma / Drizzle client
│   │   │   │   ├── redis.ts
│   │   │   │   └── mailer.ts
│   │   │   └── jobs/
│   │   │       ├── invoiceReminder.ts
│   │   │       ├── utilizationSnapshot.ts
│   │   │       └── pipelineStaleCheck.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── tests/
│   │
│   └── client-app/                        # Future — Customer-Facing App (React Native or Next.js)
│       └── (placeholder)
│
└── infra/
    ├── terraform/                         # IaC for cloud resources
    └── k8s/                               # Kubernetes manifests (if applicable)
```

---

## 2. HIGH-LEVEL SYSTEM DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS                                      │
│                                                                         │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐   │
│   │  Principal    │   │  Architects  │   │  Clients (Future App)    │   │
│   │  (Pamir)     │   │  & Staff     │   │                          │   │
│   └──────┬───────┘   └──────┬───────┘   └────────────┬─────────────┘   │
│          │                  │                         │                  │
└──────────┼──────────────────┼─────────────────────────┼──────────────────┘
           │                  │                         │
           ▼                  ▼                         ▼
┌──────────────────────────────────────┐  ┌─────────────────────────────┐
│         STAFF PORTAL (SPA)           │  │    CLIENT APP (Future)      │
│                                      │  │                             │
│  React + TypeScript + Tailwind       │  │  React Native / Next.js     │
│                                      │  │  Project progress view      │
│  Modules:                            │  │  Invoice view & payment     │
│  ├── Dashboard (aggregation layer)   │  │  Document sharing           │
│  ├── Projects (AIA phase tracking)   │  │  Approval workflows         │
│  ├── Pipeline (kanban CRM)           │  │  Push notifications         │
│  ├── Team (utilization tracking)     │  │                             │
│  ├── Invoices (lifecycle mgmt)       │  └──────────────┬──────────────┘
│  ├── Estimates (fee proposals)       │                  │
│  ├── Calendar (scheduling)           │                  │
│  └── Marketing (channel analytics)   │                  │
│                                      │                  │
└──────────────────┬───────────────────┘                  │
                   │                                      │
                   ▼                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY / BACKEND                          │
│                                                                         │
│   Node.js + TypeScript + Fastify (or Express)                           │
│                                                                         │
│   ├── REST API (JSON)          ├── WebSocket Server (real-time)         │
│   ├── Auth Middleware (JWT)     ├── RBAC Middleware (role-gated)         │
│   ├── Validation (Zod)         ├── Background Jobs (BullMQ + Redis)     │
│   └── Rate Limiting            └── Event Bus (internal pub/sub)         │
│                                                                         │
└─────┬───────────┬───────────┬──────────────┬───────────┬────────────────┘
      │           │           │              │           │
      ▼           ▼           ▼              ▼           ▼
┌──────────┐ ┌────────┐ ┌─────────┐ ┌────────────┐ ┌──────────────────┐
│PostgreSQL│ │ Redis  │ │   S3    │ │  BullMQ    │ │ External APIs    │
│          │ │        │ │         │ │  (Queues)  │ │                  │
│ Primary  │ │ Cache  │ │ Media / │ │ Invoice    │ │ QuickBooks       │
│ Database │ │ + Pub/ │ │ Docs /  │ │ reminders  │ │ Google Calendar  │
│          │ │ Sub    │ │ Exports │ │ Utilization│ │ Stripe           │
│          │ │        │ │         │ │ snapshots  │ │ SendGrid         │
│          │ │        │ │         │ │ Pipeline   │ │ Meta Lead Ads    │
│          │ │        │ │         │ │ stale check│ │                  │
└──────────┘ └────────┘ └─────────┘ └────────────┘ └──────────────────┘
```

---

## 3. CORE COMPONENTS

### 3.1 Staff Portal — Frontend SPA

| Attribute | Detail |
|---|---|
| **Purpose** | Primary operational interface for the architecture firm. All staff interact with the business through this application. |
| **Technology** | React 18+ with TypeScript, Vite bundler, Tailwind CSS for utility styling, Zustand for state management, React Router for navigation |
| **Current State** | Single-file JSX MVP (`pamir-archstudio-portal.jsx`, 741 lines) with inline styles, static data, and 8 complete view modules |
| **Design System** | Dark theme. Colors: `#0A0A0B` (bg), `#C8A97E` (accent gold), semantic colors for status. Fonts: DM Serif Display (headings), DM Sans (body), JetBrains Mono (numbers). Border radius: 14px for cards, 10px for buttons, 6px for badges. |
| **Deployment** | Vercel or Cloudflare Pages (static SPA). Served via CDN. |

**Contained UI Components (Current MVP):**

| Component | Purpose | Props |
|---|---|---|
| `Badge` | Colored label pill | `children`, `color`, `bg` |
| `StatusBadge` | Invoice status indicator (overdue/sent/paid/draft) | `status` |
| `ProgressBar` | Horizontal fill bar for percentages | `value`, `height`, `color` |
| `StatCard` | Metric card with label, value, trend | `label`, `value`, `sub`, `icon`, `trend` |
| `Avatar` | Circular initials badge | `initials`, `size` |
| `AvatarStack` | Overlapping avatar group | `members`, `size` |
| `SidebarItem` | Navigation button with icon and optional badge | `icon`, `label`, `active`, `onClick`, `badge` |

**Contained View Modules (Current MVP):**

| View | Function | Lines | Key Widgets |
|---|---|---|---|
| `ArchStudioPortal` | Root — sidebar nav + content router | 157–237 | Sidebar, nav state, font loader |
| `DashboardView` | Command center — aggregates all modules | 240–350 | 4× StatCard, ActiveProjects list, AlertsPanel, DeadlinesWidget, TeamCapacityWidget |
| `ProjectsView` | Project portfolio with phase pipeline | 352–415 | PhasePipeline bar, ProjectCard grid, priority filter |
| `PipelineView` | Sales kanban with weighted values | 417–470 | 4× stage columns, OpportunityCards, pipeline metrics |
| `TeamView` | Staff utilization and workload | 472–520 | TeamMemberRow per person with utilization bars |
| `InvoicesView` | Invoice table with financial summary | 522–575 | StatCards for outstanding/collected/overdue, InvoiceTable |
| `EstimatesView` | Fee proposals by project | 577–610 | EstimateCard per proposal |
| `CalendarView` | Weekly schedule grid | 612–670 | 5-day grid, EventCards with color-coded type |
| `MarketingView` | Channel performance analytics | 672–741 | ChannelCards for Instagram/Website/Referrals/Ads, aggregate metrics |

### 3.2 Backend API

| Attribute | Detail |
|---|---|
| **Purpose** | Single source of truth for all business data. Serves both the staff portal and future client app. Handles authentication, business logic, data persistence, background jobs, and external integrations. |
| **Technology** | Node.js 20+ with TypeScript, Fastify (preferred for performance) or Express, Prisma ORM for database, Zod for request validation, BullMQ for job queues, Socket.io for real-time |
| **Current State** | Not yet built — MVP uses static data embedded in the frontend JSX |
| **API Style** | RESTful JSON. Versioned (`/api/v1/`). Resource-oriented endpoints. |
| **Deployment** | Railway, Render, or AWS ECS. Containerized with Docker. |

### 3.3 Client App (Future)

| Attribute | Detail |
|---|---|
| **Purpose** | Customer-facing interface showing project progress, documents, invoices, and approvals. Reflects client-safe data from the shared backend. |
| **Technology** | React Native (mobile) or Next.js (web portal) — TBD based on client needs |
| **Current State** | Not started. Conceptual design documented in the Deep Breakdown doc. |
| **Key Rule** | Only displays data explicitly marked `customer_visible: true` in the backend. Internal notes, budget data, utilization metrics, and team discussions never surface. |

---

## 4. DATA STORES

### 4.1 PostgreSQL — Primary Database

**Purpose:** Single source of truth for all business entities and their relationships.

**Key Schemas:**

```
┌─────────────────────────────────────────────────────────┐
│                      CORE ENTITIES                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  users                                                   │
│  ├── id              UUID PK                             │
│  ├── email           VARCHAR UNIQUE NOT NULL              │
│  ├── password_hash   VARCHAR NOT NULL                     │
│  ├── name            VARCHAR NOT NULL                     │
│  ├── role            ENUM(principal, senior_architect,    │
│  │                   project_architect, designer,         │
│  │                   junior_architect, intern, admin)     │
│  ├── initials        VARCHAR(3)                           │
│  ├── hourly_rate     DECIMAL(10,2)                        │
│  ├── billing_rate    DECIMAL(10,2)                        │
│  ├── target_util     INTEGER (default 80)                 │
│  ├── is_active       BOOLEAN                              │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  clients                                                  │
│  ├── id              UUID PK                             │
│  ├── name            VARCHAR NOT NULL                     │
│  ├── company         VARCHAR                              │
│  ├── email           VARCHAR                              │
│  ├── phone           VARCHAR                              │
│  ├── address         TEXT                                 │
│  ├── notes           TEXT                                 │
│  ├── source          VARCHAR (referral, website, etc.)    │
│  ├── total_revenue   DECIMAL (computed)                   │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  projects                                                 │
│  ├── id              UUID PK                             │
│  ├── name            VARCHAR NOT NULL                     │
│  ├── client_id       UUID FK → clients                   │
│  ├── type            ENUM(residential, commercial,        │
│  │                   hospitality, mixed_use,              │
│  │                   institutional, interior)             │
│  ├── phase           ENUM(pre_design, schematic_design,   │
│  │                   design_development,                  │
│  │                   construction_docs, permit_review,    │
│  │                   bidding, construction_admin)         │
│  ├── status          ENUM(active, on_hold, completed,     │
│  │                   archived)                            │
│  ├── priority        ENUM(high, medium, low)              │
│  ├── progress        INTEGER (0-100)                      │
│  ├── contract_value  DECIMAL(12,2)                        │
│  ├── fee_structure   ENUM(fixed, pct_construction,        │
│  │                   hourly_cap, hourly, milestone)       │
│  ├── construction_budget DECIMAL(12,2)                    │
│  ├── start_date      DATE                                 │
│  ├── due_date        DATE                                 │
│  ├── completed_date  DATE                                 │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  project_members (junction)                               │
│  ├── project_id      UUID FK → projects                  │
│  ├── user_id         UUID FK → users                     │
│  └── role_on_project VARCHAR (lead, architect, designer)  │
│                                                          │
│  pipeline_opportunities                                   │
│  ├── id              UUID PK                             │
│  ├── name            VARCHAR NOT NULL                     │
│  ├── contact_name    VARCHAR                              │
│  ├── contact_email   VARCHAR                              │
│  ├── contact_phone   VARCHAR                              │
│  ├── source          ENUM(referral, website, instagram,   │
│  │                   linkedin, rfp, cold_outreach,        │
│  │                   networking, walk_in)                 │
│  ├── stage           ENUM(initial_contact, consultation,  │
│  │                   proposal_sent, shortlisted,          │
│  │                   won, lost)                           │
│  ├── estimated_value DECIMAL(12,2)                        │
│  ├── probability     INTEGER (0-100)                      │
│  ├── weighted_value  DECIMAL (computed)                   │
│  ├── loss_reason     VARCHAR                              │
│  ├── next_action     TEXT                                 │
│  ├── next_action_date DATE                                │
│  ├── notes           TEXT                                 │
│  ├── converted_project_id UUID FK → projects (nullable)  │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  invoices                                                 │
│  ├── id              UUID PK                             │
│  ├── invoice_number  VARCHAR UNIQUE (INV-YYYY-NNN)        │
│  ├── project_id      UUID FK → projects                  │
│  ├── client_id       UUID FK → clients                   │
│  ├── amount          DECIMAL(12,2) NOT NULL               │
│  ├── status          ENUM(draft, sent, paid, overdue,     │
│  │                   disputed, void)                      │
│  ├── issued_date     DATE                                 │
│  ├── due_date        DATE                                 │
│  ├── paid_date       DATE                                 │
│  ├── payment_terms   VARCHAR (net_15, net_30, net_45)     │
│  ├── notes           TEXT                                 │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  invoice_line_items                                       │
│  ├── id              UUID PK                             │
│  ├── invoice_id      UUID FK → invoices                  │
│  ├── description     VARCHAR                              │
│  ├── quantity        DECIMAL                              │
│  ├── unit_price      DECIMAL(10,2)                        │
│  ├── amount          DECIMAL(10,2) (computed)             │
│  └── type            ENUM(phase_fee, hourly, expense,     │
│                      consultant_passthrough)              │
│                                                          │
│  estimates                                                │
│  ├── id              UUID PK                             │
│  ├── project_id      UUID FK → projects (nullable)       │
│  ├── opportunity_id  UUID FK → pipeline (nullable)        │
│  ├── phase           VARCHAR                              │
│  ├── fee_structure   ENUM (same as projects)              │
│  ├── estimated_fee   DECIMAL(12,2)                        │
│  ├── construction_cost_est DECIMAL(12,2)                  │
│  ├── assumptions     TEXT                                 │
│  ├── exclusions      TEXT                                 │
│  ├── status          ENUM(draft, sent, accepted, rejected)│
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  estimate_hour_breakdown                                  │
│  ├── id              UUID PK                             │
│  ├── estimate_id     UUID FK → estimates                 │
│  ├── phase           ENUM (AIA phase)                     │
│  ├── role            ENUM (user role)                     │
│  ├── estimated_hours DECIMAL                              │
│  └── hourly_rate     DECIMAL(10,2)                        │
│                                                          │
│  time_entries                                             │
│  ├── id              UUID PK                             │
│  ├── user_id         UUID FK → users                     │
│  ├── project_id      UUID FK → projects                  │
│  ├── phase           ENUM (AIA phase)                     │
│  ├── hours           DECIMAL(5,2) NOT NULL                │
│  ├── description     TEXT                                 │
│  ├── is_billable     BOOLEAN (default true)               │
│  ├── date            DATE NOT NULL                        │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  calendar_events                                          │
│  ├── id              UUID PK                             │
│  ├── title           VARCHAR NOT NULL                     │
│  ├── project_id      UUID FK → projects (nullable)       │
│  ├── user_id         UUID FK → users (organizer)         │
│  ├── start_time      TIMESTAMPTZ                          │
│  ├── end_time        TIMESTAMPTZ                          │
│  ├── type            ENUM(meeting, site_visit, deadline,  │
│  │                   standup, permit, consultation)       │
│  ├── external_id     VARCHAR (Google Calendar sync)       │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── updated_at      TIMESTAMPTZ                          │
│                                                          │
│  marketing_leads                                          │
│  ├── id              UUID PK                             │
│  ├── channel         ENUM(instagram, website, referral,   │
│  │                   google_ads, linkedin, other)         │
│  ├── opportunity_id  UUID FK → pipeline (nullable)        │
│  ├── cost            DECIMAL(8,2) (ad spend attribution)  │
│  ├── captured_at     TIMESTAMPTZ                          │
│  └── converted       BOOLEAN                              │
│                                                          │
│  notifications                                            │
│  ├── id              UUID PK                             │
│  ├── user_id         UUID FK → users                     │
│  ├── type            VARCHAR                              │
│  ├── title           VARCHAR                              │
│  ├── body            TEXT                                 │
│  ├── link            VARCHAR                              │
│  ├── read            BOOLEAN (default false)              │
│  ├── created_at      TIMESTAMPTZ                          │
│  └── read_at         TIMESTAMPTZ                          │
│                                                          │
│  audit_log                                                │
│  ├── id              UUID PK                             │
│  ├── user_id         UUID FK → users                     │
│  ├── entity_type     VARCHAR                              │
│  ├── entity_id       UUID                                 │
│  ├── action          ENUM(create, update, delete)         │
│  ├── changes         JSONB                                │
│  └── created_at      TIMESTAMPTZ                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Redis

| Purpose | Detail |
|---|---|
| Session cache | JWT token blacklist, session metadata |
| Real-time pub/sub | Dashboard widget live updates via Socket.io adapter |
| Rate limiting | API request rate limiting per user/IP |
| Job queue backend | BullMQ uses Redis as its message broker |
| Computed metric cache | Utilization percentages, pipeline weighted values (TTL 5 min) |

### 4.3 S3-Compatible Object Storage

| Purpose | Detail |
|---|---|
| Document storage | Drawing sets, specifications, contracts, uploaded PDFs |
| Media storage | Project photos, progress images, renderings |
| Invoice PDFs | Generated PDF invoices for download and email |
| Export storage | CSV/XLSX report exports |

---

## 5. EXTERNAL INTEGRATIONS

| Service | Purpose | Integration Method | Priority |
|---|---|---|---|
| **QuickBooks Online** | Accounting sync — invoices, payments, chart of accounts | REST API via Intuit SDK. Bidirectional sync. Invoice created in portal → pushed to QBO. Payment recorded in QBO → pulled to portal. | Phase 3 |
| **Google Calendar** | Calendar sync — events bidirectional | Google Calendar API v3 + OAuth2. Portal events → GCal. GCal events → portal. Webhook for real-time sync. | Phase 3 |
| **Stripe** | Client invoice payments via the client app | Stripe Checkout / Payment Links embedded in invoice emails and client app. Webhook for payment confirmation → invoice status update. | Phase 3 |
| **SendGrid** | Transactional email — invoice delivery, reminders, notifications | SendGrid API v3. Templates for: invoice sent, payment reminder, overdue notice, project update, quote confirmation. | Phase 2 |
| **Meta Lead Ads** | Automatic lead ingestion from Facebook/Instagram ads | Meta Marketing API webhook. New lead → auto-create pipeline opportunity with source=instagram or source=meta_ad. | Phase 3 |
| **Xero** | Alternative accounting integration | Xero API. Same pattern as QuickBooks. Client chooses one. | Phase 3 |
| **Cloudinary or S3** | Media/document CDN and transformation | Upload API for project photos and documents. Image resizing for thumbnails. | Phase 2 |

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### Cloud Provider: AWS (primary) or Vercel + Railway (simpler alternative)

**Option A — Simple (recommended for MVP → early production):**

| Layer | Service | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from Git. Edge CDN. Preview deploys per PR. |
| Backend | Railway | Managed Node.js hosting. Auto-scaling. Built-in Postgres and Redis add-ons. |
| Database | Railway Postgres | Managed PostgreSQL 16. Daily automated backups. |
| Redis | Railway Redis | Managed Redis for cache + BullMQ. |
| Object Storage | Cloudflare R2 or AWS S3 | S3-compatible. Low cost for documents and media. |
| Domain / DNS | Cloudflare | DNS, SSL, DDoS protection. |

**Option B — Scaled (when firm grows or multi-tenant):**

| Layer | Service | Notes |
|---|---|---|
| Frontend | Vercel or CloudFront + S3 | Same CDN approach, just AWS-native. |
| Backend | AWS ECS Fargate | Containerized. Auto-scaling. No server management. |
| Database | AWS RDS PostgreSQL | Multi-AZ for HA. Automated backups + point-in-time recovery. |
| Redis | AWS ElastiCache | Managed Redis cluster. |
| Object Storage | AWS S3 | Standard. Lifecycle policies for archival. |
| Monitoring | Datadog or AWS CloudWatch | APM, logs, metrics, alerting. |

### CI/CD Pipeline

```
Developer pushes to main
        │
        ▼
GitHub Actions CI
├── Lint (ESLint + Prettier)
├── Type check (tsc --noEmit)
├── Unit tests (Vitest)
├── Integration tests (against test DB)
├── Build frontend (vite build)
├── Build backend (tsc)
        │
        ▼
Deploy to Staging (auto)
├── Run E2E tests (Playwright)
├── Smoke tests against staging API
        │
        ▼ (manual approval)
Deploy to Production
├── Database migrations (Prisma migrate deploy)
├── Backend container rollout
├── Frontend deploy (Vercel auto)
├── Post-deploy health check
```

---

## 7. SECURITY CONSIDERATIONS

### Authentication

| Aspect | Implementation |
|---|---|
| Method | JWT (JSON Web Tokens) with refresh token rotation |
| Password storage | bcrypt with cost factor 12 |
| Session management | Access token (15 min TTL) + Refresh token (7 day TTL, stored in HttpOnly cookie) |
| MFA | TOTP-based (Google Authenticator) — optional for MVP, recommended for production |
| Client app auth | Same JWT system, separate token scope |

### Authorization — Role-Based Access Control (RBAC)

| Role | Dashboard | Projects | Pipeline | Team | Invoices | Estimates | Settings |
|---|---|---|---|---|---|---|---|
| **Principal** | Full | Full | Full | Full | Full | Full | Full |
| **Senior Architect** | Read | Read/Write (assigned) | Read | Read (self + team) | Read | Read/Write | None |
| **Project Architect** | Read | Read/Write (assigned) | Read | Read (self) | Read | Read | None |
| **Designer / Junior** | Limited | Read/Write (assigned) | None | Read (self) | None | None | None |

### Data Encryption

| Layer | Method |
|---|---|
| In transit | TLS 1.3 enforced on all connections (API, database, Redis, S3) |
| At rest | AES-256 encryption on PostgreSQL (RDS/Railway native). S3 server-side encryption (SSE-S3). |
| Sensitive fields | Client phone/email encrypted at application level with AES-256-GCM. Decrypted only when displayed. |

### Security Tools & Practices

- Helmet.js for HTTP security headers
- CORS whitelist restricted to portal and client app domains
- Rate limiting: 100 req/min per authenticated user, 20 req/min for unauthenticated
- SQL injection prevention via Prisma parameterized queries (never raw SQL)
- XSS prevention via React's default escaping + CSP headers
- Dependency scanning via `npm audit` and Snyk in CI
- Audit log for all write operations (who changed what, when)

---

## 8. DEVELOPMENT & TESTING

### Local Setup

```bash
# Prerequisites: Node.js 20+, Docker, pnpm

# 1. Clone and install
git clone <repo-url> && cd archstudio-portal
pnpm install

# 2. Start local infrastructure
docker compose up -d    # PostgreSQL + Redis

# 3. Set up environment
cp .env.example .env    # Edit with local values

# 4. Run database migrations
cd packages/api && pnpm prisma migrate dev

# 5. Seed demo data
pnpm seed                # Loads Pamir's demo dataset

# 6. Start development servers
pnpm dev                 # Starts both frontend (port 5173) and API (port 3000)
```

### Testing Frameworks

| Layer | Framework | Coverage Target |
|---|---|---|
| **Unit (Frontend)** | Vitest + React Testing Library | Components render correctly with given props. State transitions work. Computed values (weighted pipeline, utilization %) calculate correctly. |
| **Unit (Backend)** | Vitest | Service layer business logic. Fee calculations. Phase transition validation. Invoice generation logic. Budget overage detection. |
| **Integration (API)** | Vitest + Supertest | Full request/response cycle against test database. Auth flows. RBAC enforcement. CRUD operations per module. |
| **E2E** | Playwright | Critical user journeys: login → dashboard → view project → create invoice → mark paid. Pipeline: create opportunity → move through stages → convert to project. |

### Code Quality Tools

| Tool | Purpose |
|---|---|
| ESLint | Linting with `@typescript-eslint` rules |
| Prettier | Code formatting (enforced in CI) |
| TypeScript | Strict mode enabled. No `any` types allowed. |
| Husky + lint-staged | Pre-commit hooks: lint + format changed files |
| Commitlint | Conventional commits enforced |

---

## 9. FUTURE CONSIDERATIONS

### Known Technical Debt

| Item | Description | Impact | Priority |
|---|---|---|---|
| Static demo data | MVP uses hardcoded arrays in the JSX file. No backend exists. | Cannot persist changes, no multi-user support. | Immediate — Phase 1 production build replaces this. |
| Single-file architecture | All 741 lines of the portal live in one `.jsx` file. | Unmaintainable at scale. | Immediate — decompose into feature modules per target structure. |
| Inline styles | All styling is inline React `style` objects. | No hover states, no media queries, no theme switching. | High — migrate to Tailwind utility classes. |
| No TypeScript | MVP written in plain JSX. | No type safety, no autocomplete, higher bug risk. | High — full TypeScript migration with strict mode. |
| No responsive design | Fixed sidebar layout assumes desktop. | Unusable on tablet/mobile. | Medium — add responsive breakpoints. |
| No error boundaries | No error handling in the React tree. | A single component crash takes down the whole app. | Medium — add React Error Boundaries per feature. |

### Planned Migrations

| Migration | From | To | Timeline |
|---|---|---|---|
| Data layer | Static arrays in JSX | PostgreSQL via Prisma ORM | Phase 1 (pre-production) |
| Styling | Inline `style` objects | Tailwind CSS utility classes | Phase 1 |
| Language | JavaScript JSX | TypeScript TSX (strict) | Phase 1 |
| State management | `useState` per component | Zustand global store + React Query for server state | Phase 1 |
| Bundler | Claude artifact renderer | Vite with HMR | Phase 1 |
| Auth | None (no login) | JWT with RBAC middleware | Phase 1 |
| Hosting | Claude.ai artifact | Vercel (frontend) + Railway (backend) | Phase 1 |

### Major Roadmap Features

| Feature | Description | Phase |
|---|---|---|
| Time Tracking | Staff log hours against projects/phases. Feeds utilization, budgets, and invoicing. | Phase 2 |
| Document Management | Drawing sets, specs, contracts organized by project. Version control. | Phase 2 |
| Notifications Engine | In-app + email notifications for overdue invoices, budget warnings, pipeline stale, schedule conflicts. | Phase 2 |
| Client-Facing App | Customer portal with project progress, document sharing, invoice viewing, approval workflows. | Phase 3 |
| Consultant Coordination | Track sub-consultant contracts, deliverables, billing pass-throughs. | Phase 3 |
| RFI / Submittal Tracking | Construction admin phase document management. | Phase 3 |
| QuickBooks / Xero Sync | Bidirectional accounting integration. | Phase 3 |
| Google Calendar Sync | Bidirectional calendar event sync. | Phase 3 |
| AI Risk Detection | Auto-flag projects trending over budget, team burnout risk, pipeline gaps. | Phase 4 |
| AI Estimation | Fee estimation suggestions based on historical project data. | Phase 4 |
| AI Scheduling | Resource allocation optimization based on skills, availability, utilization targets. | Phase 4 |
| Advanced Analytics | Project profitability, estimation accuracy, client LTV, win/loss analysis, firm benchmarking. | Phase 4 |

---

## 10. GLOSSARY

| Term | Definition |
|---|---|
| **AIA** | American Institute of Architects — the professional body that defines standard phases, contracts, and practices for architecture in North America |
| **SD** | Schematic Design — first design phase. Conceptual layouts and spatial relationships. ~15% of total fee. |
| **DD** | Design Development — second design phase. Detailed design with material specs, MEP integration. ~20% of total fee. |
| **CD** | Construction Documents — third phase. Complete drawing set for permits and construction. ~40% of total fee. Largest single phase by effort. |
| **CA** | Construction Administration — final phase. Site observation, RFI responses, submittals review during construction. ~20% of total fee. |
| **RFI** | Request for Information — formal question from a contractor to the architect during construction, requiring a documented response. |
| **Submittal** | Material or product sample submitted by a contractor for architect review and approval before installation. |
| **Utilization Rate** | Percentage of available hours spent on billable project work. Formula: `billable_hours / available_hours × 100`. Target: 75–85%. |
| **Realization Rate** | Percentage of billable hours that actually convert into collected revenue. Formula: `collected_revenue / (billable_hours × billing_rate) × 100`. |
| **Weighted Pipeline** | Sum of `opportunity_value × probability_percentage` for all active pipeline opportunities. Realistic revenue forecast. |
| **Scope Creep** | Gradual expansion of project deliverables beyond original agreement without corresponding fee adjustment. Biggest revenue leak in A&E industry. |
| **Change Order** | Formal document modifying the original project scope, with associated cost and schedule impact, requiring client approval. |
| **Fee Structure** | The billing method for a project. Types: Fixed Fee, Percentage of Construction Cost, Hourly with Cap, Hourly Uncapped, Milestone-Based. |
| **Phase-Based Billing** | Invoicing tied to completion of AIA design phases rather than calendar intervals. |
| **BIM** | Building Information Modeling — 3D model-based design process used by 68% of AEC professionals as of 2025. |
| **Principal** | The firm owner / lead architect who has ultimate oversight, approval authority, and client relationship ownership. |
| **RBAC** | Role-Based Access Control — authorization model where permissions are assigned to roles, and users are assigned roles. |
| **MVP** | Minimum Viable Product — the smallest functional version that demonstrates core value. In this context: the demo portal shown to Pamir. |
| **SPA** | Single Page Application — a web app that loads once and navigates without full page reloads. The portal is an SPA. |

---

## 12. FUNCTIONALITIES

### 12.1 Dashboard — Aggregation Layer

**How it works:** The dashboard does not store its own data. Every widget is a computed read from other modules.

| Widget | Data Source | Computation Method | Refresh |
|---|---|---|---|
| Active Projects count | `projects` table | `SELECT COUNT(*) FROM projects WHERE status = 'active'` | Real-time via WebSocket on project status change |
| Pipeline Value | `pipeline_opportunities` table | `SELECT SUM(estimated_value) FROM pipeline_opportunities WHERE stage NOT IN ('won', 'lost')` | Real-time via WebSocket on opportunity update |
| Quarterly Revenue | `invoices` table | `SELECT SUM(amount) FROM invoices WHERE status = 'paid' AND paid_date >= quarter_start` | Cached in Redis (5 min TTL). Invalidated on invoice payment. |
| Team Utilization | `time_entries` + `users` tables | For each user: `SUM(hours WHERE is_billable AND date IN current_month) / (working_days × 8) × 100`. Firm-wide: average of individual rates. | Cached in Redis (5 min TTL). Recalculated by background job every 5 min. |
| Overdue Invoice Alert | `invoices` table | `SELECT * FROM invoices WHERE status = 'sent' AND due_date < NOW() ORDER BY due_date ASC LIMIT 3` | Real-time. Triggered by daily cron that checks and flips `sent` → `overdue`. |
| Upcoming Deadlines | `projects` table | `SELECT name, due_date, phase FROM projects WHERE status = 'active' AND due_date >= NOW() ORDER BY due_date ASC LIMIT 5` | On page load + WebSocket on project update. |
| Team Capacity | `users` + computed utilization | Top 3-5 team members with current utilization. Color logic: `<75% = green`, `75-90% = orange`, `>90% = red`. | Same as Team Utilization (cached, 5 min). |

**API Endpoint:** `GET /api/v1/dashboard`

**Response shape:**
```json
{
  "metrics": {
    "active_projects": 6,
    "pipeline_value": 2795000,
    "quarterly_revenue": 405250,
    "team_utilization": 79
  },
  "alerts": [
    { "type": "overdue_invoice", "invoice_id": "...", "amount": 42750, "days_overdue": 6, "client": "Mehta Family" }
  ],
  "deadlines": [ ... ],
  "team_capacity": [ ... ],
  "active_projects_preview": [ ... ]
}
```

---

### 12.2 Projects — AIA Phase-Based Tracking

**How it works:** Projects are the central entity. All other modules reference projects.

**Create Project:**
- **Endpoint:** `POST /api/v1/projects`
- **Method:** `ProjectService.create(data)`
  1. Validate input via Zod schema (name, client_id, type, fee_structure required)
  2. Create project record in `projects` table with `status = 'active'`, `phase = 'pre_design'`, `progress = 0`
  3. Create `project_members` junction records for assigned team
  4. If created from pipeline conversion: link `pipeline_opportunities.converted_project_id`
  5. Emit `project.created` event → triggers notification to principal
  6. Return created project with populated client and team relations

**Update Phase:**
- **Endpoint:** `PATCH /api/v1/projects/:id/phase`
- **Method:** `ProjectService.updatePhase(id, newPhase)`
  1. Validate phase transition is forward-only (pre_design → schematic_design → ... → construction_admin). No skipping. No backward moves without principal approval.
  2. Update `projects.phase` and adjust `progress` based on phase mapping: `pre_design=5, schematic_design=20, design_development=40, construction_docs=65, permit_review=80, bidding=85, construction_admin=92`
  3. Log phase change in `audit_log`
  4. Emit `project.phase_changed` event → triggers client app notification if customer_visible
  5. Check if phase change triggers a billing milestone → if so, generate draft invoice

**Budget Tracking:**
- **Method:** `ProjectService.getBudgetStatus(projectId)`
  1. Pull `estimate_hour_breakdown` for this project's estimate
  2. Pull `SUM(hours) FROM time_entries WHERE project_id = :id GROUP BY phase, role`
  3. Compare actual vs estimated per phase per role
  4. Return burn percentage per phase: `actual_hours / estimated_hours × 100`
  5. Apply warning thresholds: `>=80% = warning`, `>=100% = alert`, `>=120% = escalation`

**Filter & List:**
- **Endpoint:** `GET /api/v1/projects?status=active&priority=high&phase=construction_docs&team_member=user_id`
- **Method:** `ProjectService.list(filters)`
  1. Build Prisma `where` clause from query params
  2. Include relations: `client`, `project_members.user`
  3. Sort by `priority DESC, due_date ASC` (default)
  4. Return paginated results with phase pipeline counts

---

### 12.3 Pipeline — Sales CRM with Kanban

**How it works:** Tracks opportunities from first contact to signed contract or loss.

**Create Opportunity:**
- **Endpoint:** `POST /api/v1/pipeline`
- **Method:** `PipelineService.create(data)`
  1. Validate via Zod (name, source required; contact_name, estimated_value recommended)
  2. Create record with `stage = 'initial_contact'`, auto-calculate `weighted_value = estimated_value × (probability / 100)`
  3. If source is `meta_ad` or `instagram`, attempt to link to `marketing_leads` record
  4. Emit `pipeline.new_lead` event → notification to principal + receptionist

**Move Stage:**
- **Endpoint:** `PATCH /api/v1/pipeline/:id/stage`
- **Method:** `PipelineService.moveStage(id, newStage)`
  1. Validate stage transition (forward movement; backward requires note)
  2. Update stage and recalculate probability defaults: `initial_contact=20, consultation=40, proposal_sent=50, shortlisted=65`
  3. If `stage = 'won'`: trigger conversion flow (see below)
  4. If `stage = 'lost'`: require `loss_reason`, log for win/loss analysis
  5. Log in `audit_log`

**Convert to Project:**
- **Method:** `PipelineService.convertToProject(opportunityId)`
  1. Create or find `client` record from opportunity contact info
  2. Create `project` record pre-populated with: name from opportunity, client_id, estimated value as contract_value, source for attribution
  3. Link `pipeline_opportunities.converted_project_id = new_project.id`
  4. If an estimate exists for this opportunity, link it to the new project as the budget baseline
  5. Emit `pipeline.converted` event

**Kanban View:**
- **Endpoint:** `GET /api/v1/pipeline/kanban`
- Returns opportunities grouped by stage, with per-stage counts and totals, plus firm-wide weighted pipeline value

---

### 12.4 Team — Utilization Intelligence

**How it works:** Computes real-time utilization from time entries. Does not require manual input of utilization values.

**Calculate Utilization:**
- **Method:** `TeamService.calculateUtilization(userId, period)`
  1. Get `available_hours` for period: `working_days_in_period × 8` (adjusted for holidays/PTO if tracked)
  2. Query `SUM(hours) FROM time_entries WHERE user_id = :id AND is_billable = true AND date BETWEEN :start AND :end`
  3. `utilization = billable_hours / available_hours × 100`
  4. Apply color classification: `<70% = underutilized (red)`, `70-75% = low (orange)`, `75-85% = healthy (green)`, `85-90% = elevated (orange)`, `>90% = critical (red)`
  5. Cache result in Redis with 5 min TTL, keyed by `util:{userId}:{period}`

**Team Overview:**
- **Endpoint:** `GET /api/v1/team/overview`
- Returns all active users with: current month utilization, billable hours, active project count, utilization color classification, and firm-wide average

**Burnout Detection (Background Job):**
- **Job:** `utilizationSnapshot` runs daily at 8 AM
  1. Calculate trailing 2-week utilization for each active user
  2. If any user >90% for 2+ consecutive weeks → emit `team.burnout_risk` notification to principal
  3. If any user <60% for 2+ weeks → emit `team.underutilized` notification
  4. Store snapshot in `utilization_snapshots` table for trend analysis

---

### 12.5 Invoices — Phase-Based Billing Engine

**How it works:** Invoices are generated from project data (time entries, phase milestones, expenses) and tracked through a lifecycle.

**Generate Invoice from Time Entries (Hourly Projects):**
- **Method:** `InvoiceService.generateFromTime(projectId, dateRange)`
  1. Pull `time_entries WHERE project_id AND is_billable AND date BETWEEN :start AND :end`
  2. Group by user → calculate `hours × user.billing_rate` per user
  3. Create `invoice` record with auto-generated `invoice_number` (format: `INV-{YYYY}-{NNN}`)
  4. Create `invoice_line_items` per user with type `hourly`
  5. Set `status = 'draft'` for human review before sending
  6. Return draft invoice for review

**Generate Invoice from Phase Milestone (Fixed Fee Projects):**
- **Method:** `InvoiceService.generateFromMilestone(projectId, phase, completionPercentage)`
  1. Pull project's `contract_value` and fee allocation per phase (SD 15%, DD 20%, CD 40%, CA 20%)
  2. Calculate: `phase_fee = contract_value × phase_percentage × completion_percentage`
  3. Create invoice with single line item of type `phase_fee`
  4. Set `status = 'draft'`

**Invoice Lifecycle Management:**
- `draft` → `sent`: **Method:** `InvoiceService.send(invoiceId)` — generates PDF, emails to client via SendGrid, sets `issued_date = now()`, calculates `due_date` from `payment_terms`
- `sent` → `paid`: **Method:** `InvoiceService.markPaid(invoiceId, paidDate)` — sets `paid_date`, updates project revenue totals, invalidates dashboard cache
- `sent` → `overdue`: **Background Job:** `invoiceReminder` runs daily at 9 AM — checks all `sent` invoices where `due_date < now()`, flips status to `overdue`, emits `invoice.overdue` alert to dashboard, optionally sends reminder email to client

**Overdue Escalation:**
- Day 1 overdue: Dashboard alert (yellow)
- Day 7 overdue: Email reminder to client + principal notification
- Day 14 overdue: Second reminder + escalation flag
- Day 30 overdue: Critical alert on dashboard (red)

---

### 12.6 Estimates — Fee Proposal and Budget Baseline

**How it works:** Estimates capture the fee proposal before work begins and become the budget baseline once a project starts.

**Create Estimate:**
- **Endpoint:** `POST /api/v1/estimates`
- **Method:** `EstimateService.create(data)`
  1. Validate: requires either `project_id` or `opportunity_id`, plus `fee_structure`, `estimated_fee`
  2. Create `estimate` record
  3. Create `estimate_hour_breakdown` records: hours by phase by role
  4. Record `assumptions` and `exclusions` as scope boundary documentation

**Budget Overage Detection:**
- **Method:** `EstimateService.checkOverage(projectId)` — called by `ProjectService.getBudgetStatus`
  1. Compare actual time entries against estimate hour breakdowns per phase
  2. Return overage data with graduated warnings:
     - `status: 'on_track'` — under 80% burn
     - `status: 'warning'` — 80-99% burn → yellow indicator
     - `status: 'over_budget'` — 100-119% burn → orange indicator, notification to project lead
     - `status: 'critical'` — 120%+ burn → red indicator, notification to principal, suggests change order

---

### 12.7 Calendar — Scheduling Coordination

**How it works:** Aggregates scheduled events from projects and external calendars into a unified view.

**Week View:**
- **Endpoint:** `GET /api/v1/calendar?start=2026-04-07&end=2026-04-11&user_id=optional`
- **Method:** `CalendarService.getWeek(start, end, userId)`
  1. Pull `calendar_events` in date range, optionally filtered by user
  2. Pull project milestones (due dates) that fall in range
  3. Pull synced Google Calendar events (if connected)
  4. Merge, sort by time, and return grouped by day

**Create Event:**
- **Endpoint:** `POST /api/v1/calendar`
- Links to project if project-related. Optionally syncs to Google Calendar via API.

---

### 12.8 Marketing — Channel Attribution Analytics

**How it works:** Tracks lead sources and connects them through the pipeline to revenue for ROI calculation.

**Channel Performance:**
- **Endpoint:** `GET /api/v1/marketing/channels?period=month`
- **Method:** `MarketingService.getChannelPerformance(period)`
  1. `marketing_leads` grouped by `channel`: count of leads per channel
  2. Join to `pipeline_opportunities`: count of leads that entered pipeline
  3. Join to `projects` via `converted_project_id`: count of leads that became projects
  4. Join to `invoices` (paid): sum of revenue attributable to each channel
  5. Calculate per channel: `leads`, `cost_per_lead` (total ad spend / leads), `conversion_rate` (projects / leads), `revenue`, `roi` (revenue / ad_spend)

**Aggregate Metrics:**
- Total leads (all channels combined)
- Blended cost per lead (total marketing spend / total leads)
- Overall lead-to-client conversion rate

---

### 12.9 Notifications — Event-Driven Alert System

**How it works:** Internal event bus emits events from all modules. Notification service listens and creates notifications based on rules.

**Event → Notification Mapping:**

| Event | Recipient | Notification |
|---|---|---|
| `pipeline.new_lead` | Principal | "New lead: {name} via {source}" |
| `invoice.overdue` | Principal | "Invoice {number} is {days} days overdue — ${amount}" |
| `project.phase_changed` | Assigned team | "{project} moved to {phase}" |
| `project.budget_warning` | Project lead + Principal | "{project} is at {percent}% of {phase} budget" |
| `team.burnout_risk` | Principal | "{name} has been above 90% utilization for 2 weeks" |
| `pipeline.stale` | Principal | "{opportunity} has been in {stage} for {days} days" |
| `estimate.accepted` | Assigned team | "Estimate for {project} was accepted" |
| `calendar.conflict` | Affected user | "Schedule conflict detected: {event1} and {event2}" |

**Delivery channels:** In-app notification bell (always), email (configurable per event type), push notification to client app (for customer-visible events only).

---

### 12.10 Authentication & Authorization

**Login Flow:**
1. User submits email + password to `POST /api/v1/auth/login`
2. `AuthService.login(email, password)`:
   - Find user by email
   - Compare password hash via bcrypt
   - Generate JWT access token (15 min TTL) containing `{ user_id, role, firm_id }`
   - Generate refresh token (7 day TTL), store hash in `refresh_tokens` table
   - Return access token in response body, refresh token in HttpOnly cookie
3. Frontend stores access token in memory (not localStorage), attaches to all API requests via `Authorization: Bearer` header

**Token Refresh:**
1. When access token expires, frontend calls `POST /api/v1/auth/refresh` with HttpOnly cookie
2. Backend validates refresh token, issues new access + refresh tokens (rotation)
3. Old refresh token is invalidated

**RBAC Enforcement:**
- Middleware `rbac(requiredRole)` checks `req.user.role` against required permission
- Resource-level access: project endpoints check `project_members` to verify user is assigned
- Principal role bypasses resource-level checks (can access all projects)

---

*This document is the living technical specification for the ArchStudio Operations Portal. It should be updated as the system evolves from MVP to production.*