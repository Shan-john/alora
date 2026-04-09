# 🚀 Deploying Alora Frontend to Vercel

This guide covers deploying the **Alora Frontend** (Vite + React + TailwindCSS) to [Vercel](https://vercel.com).

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- Your project pushed to a **GitHub**, **GitLab**, or **Bitbucket** repository
- Your backend already deployed (e.g., `https://alora-production.up.railway.app`)

---

## Step 1 — Add `vercel.json`

Create a `vercel.json` file in the **root of this frontend project** (`alora-frontend/`).
This file is already created for you alongside this guide.

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

> **Why `rewrites`?** — Alora uses React Router with `BrowserRouter` (client-side routing).
> Without this rule, refreshing any page other than `/` would return a 404.

---

## Step 2 — Push to GitHub

Make sure your code is committed and pushed:

```bash
cd alora-frontend
git add .
git commit -m "Add Vercel deployment config"
git push origin main
```

---

## Step 3 — Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **alora** repo from the list
4. Vercel will auto-detect it as a **Vite** project

### Configure the following settings:

| Setting              | Value                  |
|----------------------|------------------------|
| **Framework Preset** | Vite                   |
| **Root Directory**   | `alora-frontend`       |
| **Build Command**    | `npm run build`        |
| **Output Directory** | `dist`                 |

> ⚠️ **Root Directory is critical!** If your repo has both backend and frontend folders,
> you MUST set the root directory to `alora-frontend`, otherwise the build will fail.

---

## Step 4 — Set Environment Variables

In the Vercel project dashboard, go to **Settings → Environment Variables** and add:

| Variable Name                       | Value                                        |
|-------------------------------------|----------------------------------------------|
| `VITE_API_URL`                      | `https://alora-production.up.railway.app`    |
| `VITE_FIREBASE_API_KEY`             | *(your Firebase API key)*                   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | *(your Firebase auth domain)*               |
| `VITE_FIREBASE_PROJECT_ID`         | *(your Firebase project ID)*                |
| `VITE_FIREBASE_STORAGE_BUCKET`     | *(your Firebase storage bucket)*            |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| *(your Firebase messaging sender ID)*       |
| `VITE_FIREBASE_APP_ID`             | *(your Firebase app ID)*                    |

> 💡 All `VITE_` prefixed variables are embedded at **build time**, not runtime.
> If you change them, you need to **redeploy**.

---

## Step 5 — Deploy!

Click **"Deploy"** — Vercel will:

1. Install dependencies (`npm install`)
2. Run the build (`npm run build`)
3. Serve the `dist/` folder on a `.vercel.app` domain

Your site will be live at: `https://your-project-name.vercel.app`

---

## Custom Domain (Optional)

1. Go to **Settings → Domains** in your Vercel project
2. Add your custom domain (e.g., `alorabytrio.com`)
3. Update the DNS records as instructed by Vercel
4. Vercel automatically provisions a free SSL certificate

---

## Auto-Deployments

Once connected, every push to your `main` branch will **automatically trigger a new deployment**. Pull requests will get **preview deployments** with unique URLs.

---

## Troubleshooting

| Problem                          | Solution                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| **404 on page refresh**          | Ensure `vercel.json` has the `rewrites` rule                             |
| **API calls failing**            | Check that `VITE_API_URL` env var is set correctly                       |
| **Build fails**                  | Make sure **Root Directory** is set to `alora-frontend`                  |
| **Blank page**                   | Check browser console; likely a missing env var                          |
| **Firebase errors**              | Ensure all `VITE_FIREBASE_*` variables are set in Vercel dashboard       |
| **Old version showing**          | Clear Vercel cache: **Deployments → ⋮ → Redeploy (clear cache)**        |

---

## Useful Vercel CLI Commands (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from terminal (preview)
vercel

# Deploy to production
vercel --prod
```
