# Alora by Trio — Backend API

Node.js + Express REST API with Firebase Admin SDK for the Alora by Trio e-commerce platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Fill in your Firebase and Gmail credentials
   ```

3. **Firebase Setup:**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password + Google)
   - Create a Firestore database
   - Enable Storage
   - Generate a service account key: Project Settings → Service Accounts → Generate New Private Key
   - Copy `project_id`, `private_key`, and `client_email` into `.env`

4. **Gmail SMTP Setup:**
   - Enable 2-Factor Authentication on your Gmail
   - Generate an App Password: Google Account → Security → App Passwords
   - Add the app password to `GMAIL_APP_PASSWORD` in `.env`

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Public
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | List products with filters |
| GET | /api/products/:id | Single product |
| GET | /api/categories | List categories |
| GET | /api/reviews/:productId | Product reviews |
| GET | /api/settings | Store settings |
| GET | /api/orders/track/:orderId | Track order |
| POST | /api/orders/preview | Create pending order |
| POST | /api/customers/register | Register customer |
| POST | /api/newsletter/subscribe | Subscribe to newsletter |
| POST | /api/enquiries | Submit contact form |

### Admin (requires Bearer token)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/admin/dashboard | Dashboard KPIs |
| GET/POST/PATCH/DELETE | /api/admin/products | Product CRUD |
| GET/PATCH | /api/admin/orders | Order management |
| GET | /api/admin/customers | Customer list |
| GET/PATCH/POST | /api/admin/reviews | Review management |
| GET/PATCH | /api/admin/settings | Store settings |
| GET/POST/PATCH/DELETE | /api/admin/categories | Category CRUD |
| POST | /api/admin/upload | Image upload |
| GET/POST/DELETE | /api/admin/admins | Admin user management |

## Deployment (Render.com)

1. Push code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repo
4. Set environment: Node, Build Command: `npm install`, Start Command: `npm start`
5. Add all environment variables from `.env`
6. Deploy!
