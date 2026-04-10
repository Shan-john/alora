# Alora Deployment Configuration

## Backend Service (Node.js + Express + PostgreSQL)

| Setting            | Value           |
| ------------------ | --------------- |
| **Root Directory** | `alora-backend` |
| **Build Command**  | `npm install`   |
| **Start Command**  | `npm start`     |

### Environment Variables

| Key                        | Value                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | `postgresql://postgres.cgxhsindypijzputtgpr:Shanjohn%4091884 57331@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET`               | `alora-secret-key-2024`                                                                                                    |
| `ALLOW_LOCAL_ADMIN_BYPASS` | `true`                                                                                                                     |
| `FRONTEND_URL`             | `*`                                                                                                                        |
| `PORT`                     | `5000`                                                                                                                     |

---

## Frontend Service (React + Vite)

| Setting               | Value                          |
| --------------------- | ------------------------------ |
| **Root Directory**    | `alora-frontend`               |
| **Build Command**     | `npm install && npm run build` |
| **Publish Directory** | `dist`                         |

### Environment Variables

| Key            | Value                         |
| -------------- | ----------------------------- |
| `VITE_API_URL` | `<your-backend-deployed-url>` |
