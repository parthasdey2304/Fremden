# FREDMEN — Development Plan

**Version:** 1.0  
**Last Updated:** December 2025  
**Status:** Pre-MVP Planning

---

## 0. Executive Summary

**FREDMEN** is a mobile-first social discovery platform that shows public and semi-public groups pinned on a map. Each pin represents an active social context (e.g., "Board games @ Cafe", "Open Mic — tonight", "College freshers meetup"), not individual profiles. Users discover, join, chat, and physically meet in safe, moderated groups.

**Initial Launch Focus:** 4 Indian Tier-1/Tier-2 cities (Bangalore, Mumbai, Delhi, Pune) and university hubs.

**Core Innovation:** Discover social contexts (not individuals) on a map to reduce creepiness, increase safety, and enable spontaneous local meetups.

---

## 1. Goals & Success Metrics (First 12 Months)

### Primary Goals
- Achieve product-market fit in 2–3 Indian cities
- Reach **50k MAU** across cities within 6 months
- Maintain **30% D7 retention** for active users who join ≥1 group
- Keep safety incident rate below **5 reports per 1,000 users** within first year

### Key Performance Indicators (KPIs)
- **Engagement:** MAU, DAU, sessions per user, time per session
- **Group Activity:** Groups created per week, join rate per pinned group
- **Conversion:** OTP verified → active user conversion rate
- **Safety:** Report rate, resolution time, trust score distribution
- **Retention:** D1, D7, D30 cohort retention

---

## 2. Market & Competitor Analysis

### Adjacent Competitors
| Platform | Strength | Gap/Opportunity |
|----------|----------|-----------------|
| **Meetup** | Structured events, organized communities | Formal, low spontaneity, poor local discovery |
| **Eventbrite/Townscript** | Ticketed events | Transaction-focused, not casual |
| **SimplyLocal/Nyburs** | Neighborhood-oriented | Broadcast-only, no real-time interaction |
| **Instagram/Snap Maps** | Friend location sharing | Private only, not for strangers |

### Our Opportunity
Hybrid of local discovery + low-friction ephemeral groups with **safety-first design** tuned for Indian urban and college markets.

---

## 3. Target Users & Personas

### Persona A: College Newcomer (18–22)
- **Needs:** Casual ways to make friends, low friction, safe spaces
- **Pain Points:** Hard to meet people outside of classes, existing platforms feel unsafe
- **Use Case:** "Find study groups, weekend hangouts, interest-based meetups"

### Persona B: Early Professional (22–30)
- **Needs:** Interest-based meetups after work, time-efficient socializing
- **Pain Points:** Limited social circles post-college, work-life balance
- **Use Case:** "Weekend hiking groups, board game nights, language exchange"

### Persona C: Community Organizer (25–35)
- **Needs:** Tools to run recurring local meetups (book club, language exchange)
- **Pain Points:** Existing platforms are expensive or too formal
- **Use Case:** "Host regular meetups, build community, moderate safely"

**Priority Segments:** Start with students + young professionals in Tier-1 cities, then expand.

---

## 4. Core Value Propositions

1. **Discover Social Contexts (Not Individuals)** — Reduces creepiness and profile-browsing behavior
2. **Low-Friction Joining** — Join public groups with one tap, no approval needed
3. **Safety by Design** — Verified phone numbers, active moderation, panic exit features
4. **Local-First** — City and neighborhood-focused discovery with intelligent radius filtering

---

## 5. Product Features (Prioritized Roadmap)

### Must-Have (MVP — Months 0-3)
- ✅ Phone OTP authentication + basic profile (name, age range, interests)
- ✅ Map view with custom pins (clusters & heatmap)
- ✅ Create group (title, intent, time window, radius, capacity)
- ✅ Join/leave group + live participant count
- ✅ Real-time group chat (WebSockets)
- ✅ Safety tools: report, block, leave silently, panic mode (temporary invisibility)
- ✅ Filters: distance, time (now/upcoming), interest tags
- ✅ Onboarding flow with safety education
- ✅ Basic profile (view own + others)

### Should-Have (Post-MVP — Months 3-6)
- 🔲 Request-based groups with host approval
- 🔲 Organizer tools: schedule recurring groups, manage attendees
- 🔲 Reputation signals (verified organizer badge, account age)
- 🔲 Push notifications for local matches, group invites, reminders
- 🔲 Admin moderation dashboard (web)
- 🔲 Simple analytics for organizers (attendee counts, join rates)
- 🔲 Direct messages (DM) between users

### Nice-to-Have (Phase 2 — Months 6-12)
- 🔲 End-to-end encryption for DMs
- 🔲 Event ticketing & paid groups
- 🔲 Creator monetization (boosts, subscriptions)
- 🔲 Social feed of group highlights
- 🔲 Localized languages (Hindi, Telugu, Tamil, Kannada, Marathi)
- 🔲 Integration with local business venues (cafes, co-working spaces)

---

## 6. Safety, Trust & Moderation

### Account-Level Controls
- **Phone number + OTP mandatory** — Prevents throwaway accounts
- **Optional lightweight KYC for organizers** — ID selfie + soft verification for high-capacity events
- **Age gating:** 18+ requirement for physical meetups

### Group-Level Controls
- **Organizer verification** — Voluntary badge for trusted hosts
- **Safety label system:** "Open", "Moderated", "Invite-only"
- **Mandatory group rules** — Templated copy when creating groups

### Runtime Safety Features
| Feature | Description |
|---------|-------------|
| **Panic Leave** | Immediately severs presence, mutes notifications, removes from group |
| **Location Masking** | Hide exact location; show general area only |
| **Auto-Moderation** | Checks for repeated reporters, keyword filters, rate limiting |
| **Silent Reporting** | Report without alerting the reported user |
| **Human Moderation** | Triage queue for escalated reports (24-48 hour SLA) |

### Trust Scoring & Transparency
- **Non-numeric badges** — "Verified organizer", "Trusted member" (avoid exposing raw scores)
- **History indicators** — Account age, past reports (visible to moderators only)
- **Transparent policies** — Clear TOS and community guidelines

---

## 7. Architecture & Tech Stack

### Frontend
- **Framework:** React Native + Expo (fast iteration, cross-platform)
- **Maps:** Mapbox GL (custom pins, styling flexibility)
- **State Management:** React Query + Context API / Zustand
- **Styling:** NativeWind (Tailwind for RN) + design tokens
- **Navigation:** React Navigation (bottom tabs + stack navigators)

### Backend
- **Runtime:** Node.js (NestJS or Express)
- **Database:** PostgreSQL (managed on Supabase / AWS RDS)
- **Cache/Session:** Redis (presence, short-lived tokens)
- **Real-time:** Socket.IO or Pusher for WebSockets
- **Media Storage:** S3-compatible (user avatars, group images)

### Infrastructure & DevOps
- **Containerization:** Docker
- **Orchestration:** Kubernetes (GKE/EKS) or serverless (Cloud Run, Vercel)
- **CI/CD:** GitHub Actions + EAS (Expo Application Services)
- **Observability:** Sentry (errors), Prometheus + Grafana (metrics)

### Third-Party Services
- **OTP/SMS:** MSG91 (India-focused) or Twilio
- **Maps:** Mapbox (preferred for design control)
- **Auth (optional):** Firebase Auth for social logins
- **Analytics:** PostHog / Segment / Firebase Analytics

---

## 8. Data Model (ERD Plain Text)

### Core Tables

```
Users
├─ id (uuid, PK)
├─ phone (string, unique)
├─ display_name (string)
├─ age_range (enum: 18-22, 23-25, 26-30, 31+)
├─ city (string)
├─ interests (array[string])
├─ avatar_url (string, nullable)
├─ trust_flags (jsonb)
├─ created_at (timestamp)
└─ last_seen (timestamp)

Groups
├─ id (uuid, PK)
├─ title (string)
├─ description (text)
├─ lat (float)
├─ lng (float)
├─ radius_m (integer)
├─ group_type (enum: public, request, invite_only)
├─ start_time (timestamp)
├─ end_time (timestamp, nullable)
├─ capacity (integer, nullable)
├─ created_by (uuid, FK → Users)
├─ tags (array[string])
└─ created_at (timestamp)

GroupMembers
├─ id (uuid, PK)
├─ group_id (uuid, FK → Groups)
├─ user_id (uuid, FK → Users)
├─ role (enum: member, organizer)
├─ joined_at (timestamp)
└─ left_at (timestamp, nullable)

Messages
├─ id (uuid, PK)
├─ group_id (uuid, FK → Groups)
├─ sender_id (uuid, FK → Users)
├─ body (text)
├─ media_url (string, nullable)
└─ created_at (timestamp)

Reports
├─ id (uuid, PK)
├─ reported_by (uuid, FK → Users)
├─ target_type (enum: user, group, message)
├─ target_id (uuid)
├─ reason (enum: harassment, spam, safety, other)
├─ description (text)
├─ status (enum: pending, reviewed, resolved)
├─ created_at (timestamp)
└─ resolved_at (timestamp, nullable)
```

---

## 9. API Surface (Core Endpoints)

### Authentication
```
POST /auth/otp          — Send OTP to phone
POST /auth/verify       — Verify OTP and create/login user
POST /auth/refresh      — Refresh access token
```

### Groups
```
GET  /groups            — Fetch nearby groups (lat, lng, radius, tags, time)
POST /groups            — Create new group
GET  /groups/:id        — Get group details
POST /groups/:id/join   — Join group
POST /groups/:id/leave  — Leave group
DELETE /groups/:id      — Delete group (organizer only)
```

### Chat
```
GET  /groups/:id/messages  — Fetch paginated messages
POST /groups/:id/messages  — Send message
WebSocket /ws/groups/:id   — Real-time chat connection
```

### User & Profile
```
GET  /users/me          — Get own profile
PATCH /users/me         — Update profile
GET  /users/:id         — Get public profile (limited)
```

### Safety & Moderation
```
POST /reports           — Submit report
GET  /reports/my        — Get user's report history
POST /blocks            — Block user
GET  /admin/reports     — Admin: fetch pending reports
PATCH /admin/reports/:id — Admin: resolve report
```

---

## 10. UX Flows (Step-by-Step)

### Onboarding Flow (Fast Conversion)
1. **Splash Screen** — Brand illustration (2 seconds)
2. **Welcome Slides** (3 screens) — Value props + safety emphasis
3. **Phone OTP** — Enter phone → receive OTP → verify (one screen)
4. **Minimal Profile** — Name, age range, 3–5 interests, optional photo
5. **Location Permission** — Explain value: "Show groups near you"
6. **Tutorial Overlay** — Quick walkthrough on map (filter, create, join, safe-exit)
7. **Launch to Map** — User lands on main screen

### Creating a Group (3 Steps)
1. **Intent & Title** — Short title + one-line description
2. **Location & Radius** — Pin on map or use current location + radius slider (100m–2km)
3. **Details** — Time (Now / Specific), Type (Public / Request / Invite), Capacity, Rules template
4. **Confirmation** — Review and publish

### Discovery & Join Flow
1. **Map View** — Pins show nearby groups
2. **Tap Pin** — Bottom sheet opens with group summary (title, time, members, distance)
3. **Action:**
   - **Public group** → "Join now" (instant)
   - **Request group** → "Request to join" (pending approval)
   - **Invite-only** → "Invite required"
4. **Group Chat** — Auto-opens after joining

### Safety: Panic Leave Flow
1. User feels unsafe in group chat or detail page
2. Taps **"Leave & Hide"** button (red, prominent)
3. Immediate confirmation overlay: "You've left safely. The organizer won't be notified."
4. User removed from group, notifications muted, organizer sees "Member left" (generic)

---

## 11. Analytics & Instrumentation

### Key Events to Track
- `onboarding_completed`
- `group_viewed`, `group_joined`, `group_created`
- `message_sent`, `chat_opened`
- `report_submitted`, `user_blocked`
- `panic_leave_used`

### Dashboards
- **Retention Cohorts:** D1, D7, D30 retention by cohort
- **Group Activity:** Groups created per week, avg members per group, active groups
- **Safety Metrics:** Reports per 1k users, resolution time, block rate
- **Engagement:** Sessions per DAU, avg session time, messages per user

**Tools:** PostgreSQL + BigQuery for analytics; Metabase or Grafana for dashboards.

---

## 12. Monetization Roadmap

### Phase 1: Growth (Months 0-6)
- **Free for all** — Focus on product-market fit, no paywalls

### Phase 2: Creator Monetization (Months 6-12)
- **Boosts:** Organizers pay to feature group pins (promoted placement)
- **Creator Subscriptions:** Paid group access for premium communities
- **Local Business Partnerships:** Cafes/venues sponsor meetups in exchange for promotion

### Phase 3: Platform Revenue (Year 2+)
- **Ticketed Events:** Take 5-10% commission on paid events
- **Premium Memberships:** Ad-free, advanced filters, priority support

---

## 13. Legal & Compliance (India-Specific)

### Data Privacy
- **Avoid Aadhaar collection** — Optional consent for government IDs only for organizer verification
- **Encryption at rest** — All PII encrypted in database
- **Data retention policy** — Delete inactive accounts after 2 years, retain minimal logs

### Terms & Policies
- **Clear TOS** — Address meetup liability, user responsibilities, content moderation
- **Community Guidelines** — Safety rules, prohibited behavior, consequences
- **Takedown Mechanism** — Comply with legal requests (IT Act, consumer protection)

### Liability Protection
- **Disclaimer:** Platform is a facilitator; users responsible for in-person safety
- **Insurance:** Consider liability insurance for large-scale events

---

## 14. Roadmap & Milestones

### Q1 (Months 0-3): MVP Launch
- ✅ Core features: map, create/join, chat, OTP auth, safety tools
- ✅ Launch pilot in 2 cities (Bangalore + 1 university)
- ✅ Campus ambassador program (10–15 early adopters)
- **Target:** 5k MAU, 25% D7 retention

### Q2 (Months 3-6): Growth & Iteration
- 🔲 Moderation dashboard (web)
- 🔲 Organizer tools + verified badges
- 🔲 Push notifications
- 🔲 Expand to 4 cities (Mumbai, Delhi, Pune)
- 🔲 Referral program
- **Target:** 20k MAU, 30% D7 retention

### Q3-Q4 (Months 6-12): Scale & Monetization
- 🔲 Paid features (boosts, subscriptions)
- 🔲 Localization (Hindi + 2 regional languages)
- 🔲 Scale to 10 cities
- 🔲 Local business partnerships
- **Target:** 50k MAU, <5 reports per 1k users

---

## 15. Team & Hiring (Initial Composition)

### Core Team (Months 0-3)
- **Founders:** Product + Engineering (2)
- **Full-Stack Engineer** — Node + React Native (1)
- **Mobile Engineer** — React Native + Native modules (1)
- **Backend Engineer** — Real-time systems, WebSockets (1)
- **UI/UX Designer** — Mobile-first, illustrations (1)

### Growth Phase (Months 3-6)
- **Growth Lead** — Campus outreach, community building (1)
- **Community Manager / Moderator** — Part-time → full-time (1)
- **Legal & Ops Contractor** — Compliance, TOS, safety policies (1)

---

## 16. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Safety incidents** | High — user harm, brand damage | Strict moderation, quick takedown, liability clause, insurance |
| **Slow adoption** | High — failure to reach PMF | Campus pilots, ambassador programs, referral incentives |
| **Regulatory risks** | Medium — legal takedown | Minimal PII, legal counsel, proactive compliance |
| **Competition** | Medium — copycats | Move fast, build community trust, strong safety brand |
| **Technical scalability** | Medium — crashes at scale | Load testing, managed infra, auto-scaling |

---

## 17. Budget Estimate (First 6 Months — Indie MVP)

| Category | Estimated Cost (INR) |
|----------|----------------------|
| **Development Team** (3 engineers, 6 months) | ₹18,00,000 – ₹30,00,000 |
| **Designer** (UI/UX + illustrations) | ₹1,50,000 – ₹3,00,000 |
| **Infrastructure** (Servers, DB, S3, Twilio) | ₹15,000 – ₹60,000/month |
| **Marketing & Campus Pilots** | ₹1,50,000 – ₹4,00,000 |
| **Legal & Ops** | ₹50,000 – ₹1,50,000 |
| **Miscellaneous** (Tools, subscriptions) | ₹50,000 |
| **Total (6 months)** | **₹22,00,000 – ₹40,00,000** |

*Note: Adjust based on team location, hiring model (full-time vs. contract), and feature scope.*

---

## 18. Success Metrics (Target Benchmarks)

### Month 1 (Post-Pilot)
- **Users:** 2k registered, 1k MAU
- **Groups:** 50 active groups
- **Retention:** D7 ≥ 20%

### Month 3 (MVP Complete)
- **Users:** 5k MAU
- **Groups:** 200 active groups
- **Retention:** D7 ≥ 25%, D30 ≥ 15%
- **Safety:** <10 reports per week

### Month 6 (Growth Phase)
- **Users:** 20k MAU
- **Groups:** 1,000 active groups
- **Retention:** D7 ≥ 30%, D30 ≥ 20%
- **Safety:** <5 reports per 1,000 users
- **Engagement:** ≥2 sessions per DAU

### Month 12 (Scale)
- **Users:** 50k MAU
- **Groups:** 5,000+ active groups
- **Revenue:** Early monetization from boosts/paid groups
- **Retention:** D7 ≥ 35%, D30 ≥ 25%

---

## 19. Deliverables Checklist (MVP)

### Product
- ✅ Map view with custom pins & clusters
- ✅ Create & join group flows
- ✅ Real-time group chat (WebSockets)
- ✅ Phone OTP auth + basic profiles
- ✅ Safety tools (report, block, panic leave)
- ✅ Filters (distance, time, interests)
- ✅ Onboarding flow + tutorial

### Technical
- ✅ API (REST + WebSocket endpoints)
- ✅ Database schema & migrations
- ✅ Admin moderation panel (web)
- ✅ CI/CD pipeline (GitHub Actions + EAS)
- ✅ Error tracking (Sentry) + analytics

### Design
- ✅ High-fidelity screens (20+ screens)
- ✅ Component library + design tokens
- ✅ App icon + splash screen assets
- ✅ Illustrations (onboarding, empty states)
- ✅ Developer handoff (Figma + exported assets)

### Legal & Ops
- ✅ Terms of Service
- ✅ Privacy Policy
- ✅ Community Guidelines
- ✅ Moderation playbook

---

## 20. Launch Playbook (High-Signal Growth)

### Pre-Launch (Weeks -4 to 0)
1. **Campus Ambassadors** — Recruit 20-30 students across 5 universities
2. **Invite-Only Beta** — 500 early access users via referral codes
3. **Safety-First PR** — Partner with local NGOs, emphasize moderation
4. **Landing Page** — Simple site with waitlist + explainer video

### Launch Week
1. **Soft Launch** — 2 cities (Bangalore + 1 university)
2. **Campus Events** — Host "FREDMEN Night" at cafes/co-working spaces
3. **Social Media Blitz** — Instagram, Twitter threads, campus WhatsApp groups
4. **Press Outreach** — TechCrunch, YourStory, local media

### Post-Launch (Weeks 1-4)
1. **Daily Monitoring** — Watch crash reports, user feedback, safety incidents
2. **Rapid Iteration** — Fix bugs, improve onboarding, tune map UX
3. **User Interviews** — 20-30 users for qualitative feedback
4. **Referral Program** — Reward users for inviting friends

---

## 21. Next Steps (Immediate Actions)

### Week 1-2: Foundation
- [ ] Finalize tech stack decisions
- [ ] Set up GitHub repo + project structure
- [ ] Design system kickoff with UI/UX designer
- [ ] Database schema v1 + migrations
- [ ] API contract (OpenAPI spec)

### Week 3-4: MVP Core
- [ ] Implement auth (OTP + profile setup)
- [ ] Build map view + custom pins (Mapbox)
- [ ] Create & join group flows
- [ ] Real-time chat (Socket.IO setup)

### Week 5-8: Safety & Polish
- [ ] Safety tools (report, block, panic leave)
- [ ] Admin moderation dashboard
- [ ] Onboarding flow + tutorial
- [ ] Testing, bug fixes, performance tuning

### Week 9-12: Pilot Launch
- [ ] Campus ambassador recruitment
- [ ] Beta testing (100 users)
- [ ] Iterate based on feedback
- [ ] Soft launch in 2 cities

---

## 22. Complete Screen/Page Inventory (25+ Screens)

### Mobile App Screens

#### 1. Authentication & Onboarding (7 screens)
1. **Splash / Brand Screen** — App logo, tagline animation
2. **Onboarding Slide 1** — "Discover local groups near you"
3. **Onboarding Slide 2** — "Join spontaneous meetups"
4. **Onboarding Slide 3** — "Safe, moderated communities"
5. **Phone OTP Entry** — Input phone number, request OTP
6. **OTP Verification** — Enter 6-digit code
7. **Profile Setup** — Name, age range, interests, optional photo

#### 2. Core Discovery & Navigation (6 screens)
8. **Main Map Screen** — Primary view with group pins, filters, search
9. **Bottom Sheet — Group Preview** — Quick preview when tapping pin
10. **Group Detail Page** — Full details, join button, participant list
11. **Feed / List View** — Alternative to map, card-based group list
12. **Search & Filters** — Distance, time, interests, group type
13. **Notifications** — Group invites, chat mentions, system alerts

#### 3. Group Creation & Management (4 screens)
14. **Create Group — Step 1** — Title, description, intent
15. **Create Group — Step 2** — Location picker, radius slider
16. **Create Group — Step 3** — Time, capacity, privacy settings
17. **Organizer Dashboard (Mobile)** — Manage groups, view analytics

#### 4. Chat & Messaging (2 screens)
18. **Group Chat** — Real-time messages for joined groups
19. **Direct Messages (DM)** — 1:1 chat list + individual conversations

#### 5. Profile & Settings (5 screens)
20. **Profile (Own)** — View/edit profile, groups joined, settings
21. **Public Profile (Other Users)** — Limited view of other members
22. **Settings** — Notifications, privacy, account, language
23. **Safety & Help** — Report, block, panic mode, help center
24. **Legal (TOS, Privacy)** — Terms of Service, Privacy Policy

### Web Screens

#### 6. Public & Admin Web Pages (3+ screens)
25. **Landing / Marketing Page (Web)** — Homepage, waitlist signup
26. **Web Admin / Moderator Dashboard** — Review reports, ban users
27. **Organizer Web Dashboard (Optional)** — Advanced analytics, bulk actions

### Additional Screens (Nice-to-Have)
- **Empty States** — No groups nearby, no messages, etc.
- **Error Screens** — Network error, location denied, etc.
- **Tutorial Overlays** — First-time user guidance
- **Permissions Screens** — Location, notifications, camera access

**Total:** 27+ unique screens/pages

---

## 23. Contact & Ownership

**Project Owner:** [Your Name]  
**Technical Lead:** [Name]  
**Designer:** [Name]  
**Repository:** [GitHub URL]  
**Design Files:** [Figma/Stitch URL]  
**Project Management:** [Notion/Linear URL]

---

## Appendix

### A. User Flow Diagrams
[Link to flow diagrams or embed Mermaid diagrams]

### B. API Documentation
[Link to OpenAPI spec / Postman collection]

### C. Database ERD
[Link to visual ERD or dbdiagram.io link]

### D. Design System
[Link to Figma component library]

### E. Safety Playbook
[Link to detailed moderation guidelines]

---

**End of Development Plan**  
*Last updated: December 29, 2025*
