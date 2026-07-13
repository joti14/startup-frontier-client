# Startup Frontier — Startup Team Builder Platform

A full-stack platform where startup founders publish ideas, build teams, and recruit collaborators. Developers, designers, marketers, and other professionals can explore opportunities and apply to join early-stage startups.

## Live Site

[startup-frontier.vercel.app](https://startup-frontier-client.vercel.app/)

## Repositories

- **Client:** [github.com/your-username/startup-frontier-client](https://github.com/joti14/startup-frontier-client)
- **Server:** [github.com/your-username/startup-frontier-server](https://github.com/joti14/startup-frontier-server)

---

## Tech Stack

### Client
- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Better Auth** — credential + Google OAuth
- **Framer Motion / Motion** — scroll animations
- **Recharts** — dashboard pie charts
- **Stripe.js** — premium checkout
- **React Hook Form** — form validation
- **Imgbb API** — image uploads
- **shadcn/ui** — component library

### Server
- **Node.js + Express.js**
- **MongoDB** (via native driver)
- **JWT** — HTTPOnly cookie authentication
- **Stripe** — payment webhook & session
- **dotenv**, **cors**, **cookie-parser**

---

## Features

### Public
- Browse startups with search + filter (industry, funding stage)
- Browse opportunities with search + filter (role, work type, industry)
- Server-side pagination on opportunities
- Startup detail page with open roles
- Opportunity detail page

### Authentication (Better Auth)
- Email + password login and registration
- Google OAuth login
- Role selection on signup: **Founder** or **Collaborator**
- Password rules: min 6 chars, uppercase, lowercase
- Profile image upload via imgbb
- JWT issued to HTTPOnly cookie after login (covers both credential and Google OAuth)

### Founder Dashboard
- Overview stats: Total Opportunities, Total Applications, Accepted Members
- Applications by Status pie chart (Recharts)
- Create / Update / Delete startup (logo upload via imgbb)
- Add / Manage / Delete opportunities
- Review incoming applications — Accept or Reject
- **Premium upgrade via Stripe** — free tier limited to 3 opportunities

### Collaborator Dashboard
- Browse all open opportunities (search + filter + pagination)
- Apply to opportunities (cover letter + portfolio link)
- Track all applications with status (Pending / Accepted / Rejected)
- Personal profile (name, photo, skills, bio)

### Admin Dashboard
- Overview: Total Users, Total Startups, Total Opportunities, Total Revenue
- Manage Users: view, block, unblock
- Manage Startups: approve, remove
- Transactions: all Stripe payments with amount, date, status

---

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home — hero, featured startups, featured opportunities, statistics, testimonials |
| `/startups` | Public | Browse all startups |
| `/startups/[id]` | Public | Startup detail + open roles |
| `/opportunities` | Public | Browse all opportunities |
| `/opportunities/[id]` | Public | Opportunity detail + apply |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up with role selection |
| `/dashboard/founder` | Founder | Overview |
| `/dashboard/founder/startup` | Founder | My Startup |
| `/dashboard/founder/add-opportunity` | Founder | Post new role |
| `/dashboard/founder/opportunities` | Founder | Manage opportunities |
| `/dashboard/founder/applications` | Founder | Review applications |
| `/dashboard/founder/upgrade` | Founder | Stripe premium upgrade |
| `/dashboard/collaborator` | Collaborator | Overview |
| `/dashboard/collaborator/opportunities` | Collaborator | Browse opportunities |
| `/dashboard/collaborator/applications` | Collaborator | My applications |
| `/dashboard/collaborator/profile` | Collaborator | Edit profile |
| `/dashboard/admin` | Admin | Platform overview |
| `/dashboard/admin/users` | Admin | Manage users |
| `/dashboard/admin/startups` | Admin | Manage startups |
| `/dashboard/admin/transactions` | Admin | View transactions |
| `/unauthorized` | Public | Access denied page |

---

## API Endpoints

Base URL: `https://startup-frontier-server.vercel.app`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/token` | Public | Issue JWT to HTTPOnly cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT cookie |

### Startups
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/startups` | Public | Get all startups (search, industry, fundingStage, limit) |
| `GET` | `/api/featured-startups` | Public | Get featured startups |
| `GET` | `/api/startups/:id` | Public | Get startup by ID |
| `GET` | `/api/founder/:email` | Public | Get founder's startup by email |
| `POST` | `/api/founder` | 🔒 JWT | Create startup |
| `PATCH` | `/api/founder/:id` | 🔒 JWT | Update startup |
| `DELETE` | `/api/founder/:id` | 🔒 JWT | Delete startup |

### Opportunities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/opportunities` | Public | Browse opportunities (search, workType, industry, page, limit) |
| `GET` | `/api/opportunities/detail/:id` | Public | Get opportunity by ID |
| `GET` | `/api/opportunities/:email` | 🔒 JWT | Get founder's opportunities by email |
| `POST` | `/api/opportunities` | 🔒 JWT | Create opportunity (premium limit enforced) |
| `PATCH` | `/api/opportunities/:id` | 🔒 JWT | Update opportunity |
| `DELETE` | `/api/opportunities/:id` | 🔒 JWT | Delete opportunity |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/applications` | 🔒 JWT | Submit application |
| `GET` | `/api/applications/founder/:email` | 🔒 JWT | Get applications for a founder's opportunities |
| `GET` | `/api/applications/applicant/:email` | 🔒 JWT | Get applications by applicant |
| `PATCH` | `/api/applications/:id` | 🔒 JWT | Update application status (accept/reject) |

### Users & Payments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/profile/:email` | 🔒 JWT | Get user profile |
| `PATCH` | `/api/users/profile/:email` | 🔒 JWT | Update user profile (name, image, skills, bio) |
| `PATCH` | `/api/users/upgrade-premium/:email` | 🔒 JWT | Mark user as premium + save payment record |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | 🔒 JWT + Admin | Platform overview stats |
| `GET` | `/api/admin/users` | 🔒 JWT + Admin | Get all users |
| `PATCH` | `/api/admin/users/block/:id` | 🔒 JWT + Admin | Block user |
| `PATCH` | `/api/admin/users/unblock/:id` | 🔒 JWT + Admin | Unblock user |
| `GET` | `/api/admin/startups` | 🔒 JWT + Admin | Get all startups |
| `PATCH` | `/api/admin/startups/approve/:id` | 🔒 JWT + Admin | Approve startup |
| `DELETE` | `/api/admin/startups/:id` | 🔒 JWT + Admin | Remove startup |
| `GET` | `/api/admin/transactions` | 🔒 JWT + Admin | Get all transactions |

---

## Environment Variables

### Client (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Server (`.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## Database Collections

| Collection | Key Fields |
|---|---|
| `user` | name, email, image, role, isBlocked, isPremium |
| `startups` | startupName, logoUrl, industry, description, fundingStage, founderEmail, status, approved |
| `featured-startups` | Same as startups (seeded showcase data) |
| `opportunities` | roleTitle, requiredSkills, workType, commitmentLevel, deadline, founderEmail, startupName |
| `applications` | opportunityId, applicantEmail, founderEmail, coverLetter, resumeLink, status, createdAt |
| `payments` | userEmail, amount, transactionId, paymentStatus, paymentType, paidAt |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Google OAuth credentials
- Imgbb API key

### Client
```bash
git clone https://github.com/joti14/startup-frontier-client
cd startup-frontier-client
npm install
# create .env.local with variables above
npm run dev
```

### Server
```bash
git clone https://github.com/joti14/startup-frontier-server
cd startup-frontier-server
npm install
# create .env with variables above
node index.js
```
