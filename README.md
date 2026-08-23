<div align="center">

# POS System (Point of Sales)

**A modern, full-stack Point of Sale & Inventory Management platform built for retail businesses.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)
[![Live Demo](https://img.shields.io/badge/demo-coming_soon-orange?style=flat-square)](#)

[Report Bug](../../issues) · [Request Feature](../../issues) · [API Docs](http://localhost:3001/api-docs)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [PWA Installation](#-pwa-installation)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🧾 Overview

**Tally POS** is a complete, production-ready Point of Sale and Inventory Management system built for retail businesses of any size. It combines a fast, installable Progressive Web App frontend with a robust NestJS/PostgreSQL backend to handle everything from ringing up a sale to tracking supplier orders and generating profit/loss reports.

Unlike many POS demos, Tally is a **fully working system** — every feature listed below is implemented and functional, not a roadmap item. It's built to run on a laptop behind a counter, a tablet at a checkout stand, or a desktop in a back office, with offline support so a spotty connection doesn't stop a sale.

---

## ✨ Features

### 🔐 Authentication & Access Control
- JWT-based authentication with secure, hashed passwords (bcrypt)
- Role-based access control — **Admin**, **Manager**, **Cashier**, **Viewer**
- Session handling via Passport strategies

### 📦 Product & Inventory Management
- Full CRUD for products, with categories, SKUs, and barcodes
- Real-time stock level tracking
- Low-stock alerts and purchase order workflows

### 💳 Sales Processing
- Fast checkout flow with support for multiple payment methods
- Digital receipt generation

### 👥 Customer Management
- Customer profiles with full purchase history
- Loyalty points tracking

### 🚚 Supplier Management
- Supplier database with order tracking

### 🧑‍💼 Employee Management
- Employee profiles, role assignment, and activity logs

### 📊 Reporting & Analytics
- Sales, inventory, and expense reports
- Profit/loss breakdowns

### 💸 Expense Tracking
- Log business expenses with attached receipts

### 🌍 Multi-Currency Support
- Live exchange rate conversion across currencies

### 🔔 Real-Time Notifications
- In-app alerts for low stock, new orders, and system events

### 📱 Progressive Web App
- Installable on desktop and mobile
- Offline-ready via service worker caching

### 📐 Responsive Design
- Optimized layouts for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16.2.10** (App Router) | React framework, routing, SSR |
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Lucide Icons** | Icon set |

### Backend

| Technology | Purpose |
|---|---|
| **NestJS 10** | Modular backend framework |
| **TypeORM** | Database ORM |
| **PostgreSQL 16** | Relational database |
| **Passport + JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Swagger/OpenAPI** | API documentation |

### Infrastructure & Tooling

| Technology | Purpose |
|---|---|
| **Docker** | Containerized deployment |
| **Sentry** | Error tracking |
| **Jest** | Testing framework |
| **PWA (Service Worker)** | Offline support & installability |

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A["🌐 Client (Browser / Mobile)"] --> B["⚛️ Next.js Frontend<br/>PWA · Tailwind CSS · Framer Motion"]
    B -->|"REST API (JWT Auth)"| C["🐦 NestJS Backend"]

    subgraph C["🐦 NestJS Backend"]
        C1[Auth Module]
        C2[Products Module]
        C3[Sales Module]
        C4[Inventory Module]
        C5[Customers Module]
        C6[Suppliers Module]
        C7[Employees Module]
        C8[Reports Module]
    end

    C --> D[("🐘 PostgreSQL 16<br/>Database: pos")]
    C -.->|Errors| E["🐛 Sentry"]
    C -.->|Docs| F["📘 Swagger / OpenAPI"]
```

**Request flow:** the browser (or installed PWA) talks to the Next.js frontend, which calls the NestJS REST API over HTTPS with a JWT bearer token. NestJS modules handle business logic and persist data through TypeORM into PostgreSQL. Errors are captured by Sentry, and all endpoints are self-documented via Swagger.

---

##  Prerequisites

Make sure you have the following installed before setup:

- **[Node.js](https://nodejs.org/)** v18 or higher
- **npm** v9 or higher (bundled with Node.js)
- **[PostgreSQL](https://www.postgresql.org/download/)** v16 or higher
- **[Git](https://git-scm.com/)**

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/eddy-hash/POS.git
cd POS
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE pos;"
```

---

## 🔧 Configuration

Create a `.env` file in **both** the `backend/` and `frontend/` directories.

### Backend — `backend/.env`

```env
# App
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=pos

# Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> ⚠️ **Never commit `.env` files.** Make sure both are listed in `.gitignore`.

---

## 🚀 Running the App

### Start the backend (NestJS)

```bash
cd backend
npm run start:dev
```

Backend runs at **http://localhost:3001**

### Start the frontend (Next.js)

```bash
cd frontend
npm run dev
```

Frontend runs at **http://localhost:3000**

### Default Admin Login

Use these credentials to log in for the first time:

| Field | Value |
|---|---|
| **Email** | `admin@com` |
| **Password** | `admin123` |
| **Role** | Admin |

> 🔒 **Security note:** These are development seed credentials. Change the admin password immediately in any staging or production environment.

---

## 📘 API Documentation

The full REST API is documented with Swagger/OpenAPI and available at:

```
http://localhost:3001/api-docs
```

### Example endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate a user, returns JWT |
| `POST` | `/auth/register` | Register a new user |
| `GET` | `/products` | List all products |
| `POST` | `/products` | Create a new product |
| `GET` | `/sales` | List sales transactions |
| `POST` | `/sales` | Record a new sale |

### Example: logging in

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@com",
    "password": "admin123"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@com",
    "role": "admin"
  }
}
```

Use the returned `access_token` as a Bearer token on subsequent requests:

```bash
curl http://localhost:3001/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🗄️ Database Schema

Tally POS uses a PostgreSQL database (`pos`) with **14+ relational tables**, including:

| Table | Purpose |
|---|---|
| `users` | Employee/user accounts and login credentials |
| `roles` | Role definitions (Admin, Manager, Cashier, Viewer) |
| `products` | Product catalog |
| `categories` | Product categories |
| `sales` | Sales transactions |
| `sale_items` | Line items per sale |
| `customers` | Customer profiles and loyalty data |
| `suppliers` | Supplier records |
| `purchase_orders` | Stock replenishment orders |
| `inventory` | Stock levels per product |
| `expenses` | Business expense records |
| `employees` | Employee profile & activity data |
| `notifications` | System/user notifications |
| `currencies` | Supported currencies & exchange rates |

> Full schema and relationships are defined via TypeORM entities in `backend/src/**/*.entity.ts`.

---

## 📁 Project Structure

```
tally-pos/
├── backend/
│   ├── src/
│   │   ├── auth/            # Authentication & JWT strategy
│   │   ├── users/           # User management
│   │   ├── products/        # Product CRUD
│   │   ├── sales/           # Sales processing
│   │   ├── inventory/       # Stock tracking
│   │   ├── customers/       # Customer management
│   │   ├── suppliers/       # Supplier management
│   │   ├── employees/       # Employee management
│   │   ├── reports/         # Analytics & reporting
│   │   ├── expenses/        # Expense tracking
│   │   ├── notifications/   # Real-time alerts
│   │   ├── common/          # Guards, decorators, pipes
│   │   └── main.ts
│   ├── test/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── auth/
│   │   └── layout.tsx
│   ├── components/          # Reusable UI components
│   ├── context/              # Theme, Currency, Auth contexts
│   ├── lib/                 # Utilities, API clients
│   ├── public/               # Static assets, PWA manifest
│   ├── .env.local
│   └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md
```

---


## 📦 Deployment

### Production build

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
npm run start
```

### Docker

A `docker-compose.yml` is provided to spin up the frontend, backend, and PostgreSQL together.

```bash
docker-compose up --build -d
```

This starts:
- `frontend` → port `3000`
- `backend` → port `3001`
- `postgres` → port `5432`

To stop all services:

```bash
docker-compose down
```

> 💡 For production, update all secrets (`JWT_SECRET`, DB credentials, admin password) and set `NODE_ENV=production`.

---

## 📲 PWA Installation

Tally POS can be installed as a standalone app on desktop and mobile devices.

1. Open **http://localhost:3000** (or your deployed URL) in Chrome, Edge, or another PWA-capable browser.
2. Look for the **Install** icon in the address bar (desktop) or the **"Add to Home Screen"** prompt (mobile).
3. Click/tap **Install**.
4. Tally POS now launches as a standalone app, with offline support powered by the service worker.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m "Add: your feature description"
   ```
4. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

Please make sure tests pass (`npm run test`) and follow the existing code style before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Tally POS is built on the shoulders of great open-source tools:

- [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Passport.js](https://www.passportjs.org/)
- [Swagger/OpenAPI](https://swagger.io/)
- [Sentry](https://sentry.io/)

---

<div align="center">

**Built for retail businesses that need a system that just works.**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
