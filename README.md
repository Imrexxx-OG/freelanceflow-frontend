# FreelanceFlow 💼

A full-stack invoice management SaaS built for freelancers to manage clients, create invoices, track payments, and download professional PDFs, all in one place.

🔗 **Live Demo:** (https://freelanceflow-frontend.vercel.app/)  
🔗 **Backend API:** (freelanceflow-backend-production.up.railway.app)

---

## Features

- **Authentication** — Secure register/login with JWT tokens
- **Client Management** — Add, edit, delete and search clients
- **Invoice Creation** — Create invoices with multiple line items and auto-calculated totals
- **Payment Tracking** — Record payments and auto-update invoice status (pending → paid)
- **PDF Generation** — Download professional PDF invoices with one click
- **Analytics Dashboard** — View total earnings, pending amounts, and recent invoices
- **Multi-Currency Support** — USD, EUR, GBP, NGN
- **Responsive Design** — Works on desktop and mobile

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| jsPDF + jspdf-autotable | PDF generation |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL | Database |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway | Backend + PostgreSQL hosting |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (local) or a Railway account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Imrexxx-OG/freelanceflow-backend.git
git clone https://github.com/Imrexxx-OG/freelanceflow-frontend.git
```

### 2. Set Up the Backend

```bash
cd freelanceflow-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/freelanceflow"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Set Up the Frontend

```bash
cd freelanceflow-frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | Get all clients |
| POST | `/api/clients` | Create a client |
| PUT | `/api/clients/:id` | Update a client |
| DELETE | `/api/clients/:id` | Delete a client |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| GET | `/api/invoices/:id` | Get single invoice |
| POST | `/api/invoices` | Create an invoice |
| PUT | `/api/invoices/:id` | Update an invoice |
| POST | `/api/invoices/:id/payments` | Record a payment |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Get dashboard stats |

---

## Project Structure

```
freelanceflow-backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── clients.js          # Client CRUD routes
│   ├── invoices.js         # Invoice routes + payments
│   └── analytics.js        # Dashboard analytics
├── utils/
│   └── validation.js       # Input validation helpers
└── server.js               # Express app entry point

freelanceflow-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SkeletonLoader.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   ├── Invoices.jsx
│   │   ├── CreateInvoice.jsx
│   │   └── InvoiceDetail.jsx
│   └── utils/
│       ├── api.js           # Axios instance with auth interceptor
│       └── pdfGenerator.js  # jsPDF invoice generator
└── vercel.json              # Vercel SPA routing config
```

---

## Key Implementation Details

### JWT Authentication
All protected routes require a Bearer token in the `Authorization` header. The frontend automatically attaches the token to every request via an Axios interceptor.

### Data Isolation
Every database query filters by `userId`, ensuring users can only access their own clients and invoices.

### Auto Invoice Status
When a payment is recorded, the backend automatically calculates if the invoice is fully paid and updates the status from `pending` to `paid`.

### PDF Generation
Uses `jsPDF` with `jspdf-autotable` in ESM mode. Generates a styled PDF with invoice details, line items, payment history and a footer.

---

## Deployment

### Backend (Railway)
1. Push to GitHub
2. Connect repo to Railway
3. Add PostgreSQL plugin
4. Set environment variables: `JWT_SECRET`, `NODE_ENV=production`
5. Set start command: `npx prisma migrate deploy && node server.js`

### Frontend (Vercel)
1. Push to GitHub
2. Import repo to Vercel
3. Set environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app/api`
4. Deploy

---

## Author

**Imran Damare**  
Full-Stack Developer  
[GitHub](https://github.com/Imrexxx-OG) · [LinkedIn](https://www.linkedin.com/in/imran-damare-3b5356247/)

---

## License

MIT License — feel free to use this project as a reference or template.