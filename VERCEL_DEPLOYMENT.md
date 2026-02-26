# SmashQ Frontend — Vercel Deployment Guide

## Prerequisites

- A GitHub account with the SmashQ repository pushed
- The SmashQ API backend already deployed (e.g., on Railway) and its public URL available
- Node.js 18+ installed locally for testing builds

---

## Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Select **Continue with GitHub** to link your GitHub account
3. Authorize Vercel to access your GitHub repositories
4. Complete the onboarding prompts (team name is optional for hobby accounts)

---

## Step 2: Connect Your GitHub Repository

1. From the Vercel dashboard, click **Add New → Project**
2. You will see a list of your GitHub repositories — find **SmashQ** (or the repo containing `SmashQ-Web`)
3. Click **Import** next to the repository
4. If your repo is a monorepo with both `SmashQ-Api` and `SmashQ-Web`, set the **Root Directory** to `SmashQ-Web` in the project configuration screen

---

## Step 3: Configure Build Settings

Vercel auto-detects Next.js projects. Verify these settings on the configuration screen:

| Setting            | Value         |
| ------------------ | ------------- |
| **Framework**      | Next.js       |
| **Build Command**  | `next build`  |
| **Output Directory** | `.next`     |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x or 20.x |

These are also defined in the `vercel.json` file included in the project, so Vercel will pick them up automatically.

---

## Step 4: Set Environment Variables

Before deploying, add the required environment variables. On the Vercel project configuration screen (or later under **Settings → Environment Variables**):

| Variable                    | Value                                        | Environment        |
| --------------------------- | -------------------------------------------- | ------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | `https://your-backend.railway.app/api`       | Production, Preview |
| `NEXT_PUBLIC_APP_ENV`       | `production`                                 | Production          |
| `NEXT_PUBLIC_APP_ENV`       | `development`                                | Preview             |

**Replace `https://your-backend.railway.app/api` with your actual deployed backend URL.**

### How to add them:
1. On the project configuration screen, expand **Environment Variables**
2. Enter the variable name in the **Key** field
3. Enter the value in the **Value** field
4. Select which environments the variable applies to (Production, Preview, Development)
5. Click **Add**
6. Repeat for each variable

---

## Step 5: Deploy

1. Click **Deploy** on the project configuration screen
2. Vercel will clone the repo, install dependencies, run `next build`, and deploy
3. The build typically takes 30–60 seconds
4. Once complete, you will see a success screen with your deployment URL (e.g., `https://smashq-web.vercel.app`)

---

## Step 6: Verify the Deployment

1. Visit the deployment URL provided by Vercel
2. Test the login flow — ensure it connects to your backend API
3. Check the browser console (F12 → Console) for any API connection errors
4. Test core features: registration, lobby creation, matchmaking

---

## Step 7: Configure a Custom Domain (Optional)

1. Go to your project on Vercel → **Settings → Domains**
2. Enter your custom domain (e.g., `smashq.yourdomain.com`)
3. Click **Add**
4. Vercel will display DNS records you need to add at your domain registrar:
   - For apex domains (`yourdomain.com`): Add an **A** record pointing to `76.76.21.21`
   - For subdomains (`app.yourdomain.com`): Add a **CNAME** record pointing to `cname.vercel-dns.com`
5. Wait for DNS propagation (typically 1–30 minutes)
6. Vercel automatically provisions SSL certificates once DNS is configured

---

## Step 8: Set Up Automatic Deployments

This is enabled by default with GitHub integration:

- **Production deployments** trigger on every push to the `main` branch
- **Preview deployments** trigger on every pull request
- Each PR gets a unique preview URL for testing before merging

To customize:
1. Go to **Settings → Git**
2. Change the production branch if needed
3. Toggle preview deployments on/off for specific branches

---

## CORS Configuration

Ensure your backend allows requests from your Vercel domain. In your SmashQ API backend, update CORS settings to include:

```
https://smashq-web.vercel.app
https://your-custom-domain.com
```

If using Railway for the backend, set the `CORS_ORIGIN` environment variable to include your frontend URL.

---

## Troubleshooting

### Build fails with "Module not found"
- Ensure all dependencies are listed in `package.json` (not just `devDependencies` for runtime packages)
- Run `npm run build` locally to reproduce the error
- Check that import paths match the actual file names (case-sensitive on Linux, which Vercel uses)

### API calls return CORS errors
- Add your Vercel deployment URL to the backend's CORS allowed origins
- Include both the `.vercel.app` URL and any custom domains
- Make sure the backend sends proper `Access-Control-Allow-Origin` headers

### API calls fail or return network errors
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel environment variables
- Confirm the value starts with `https://` and ends with `/api`
- Check that the backend is running and accessible from a browser
- Remember: `NEXT_PUBLIC_` variables are embedded at build time — after changing them, you must **redeploy**

### Environment variables not taking effect
- Variables prefixed with `NEXT_PUBLIC_` are inlined during the build
- After changing any environment variable, trigger a new deployment: go to **Deployments** → click the three dots on the latest deployment → **Redeploy**
- Verify the variables are assigned to the correct environment (Production vs. Preview)

### Page shows 404 after deployment
- Ensure the `vercel.json` and `next.config.ts` are committed to the repository
- Check that the **Root Directory** is set to `SmashQ-Web` if using a monorepo
- Verify the build output shows all expected routes

### Blank page or hydration errors
- Open browser dev tools and check the Console tab for errors
- Ensure `"use client"` directives are present on components that use React hooks or browser APIs
- Test the production build locally with `npm run build && npm start`

### Slow initial page loads
- The first request after a cold start may be slower; subsequent requests are cached
- Check if dynamic routes can be converted to static generation for better performance
- Vercel's Edge Network caches static assets automatically

### Preview deployments show wrong API URL
- Set `NEXT_PUBLIC_API_BASE_URL` for the **Preview** environment separately if you have a staging backend
- Otherwise, preview deployments will use the production API URL

---

## Useful Vercel CLI Commands (Optional)

Install the Vercel CLI for local testing:

```bash
npm i -g vercel
```

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `vercel`            | Deploy a preview from your local machine   |
| `vercel --prod`     | Deploy to production from local            |
| `vercel env pull`   | Download environment variables to `.env.local` |
| `vercel logs`       | View deployment logs                       |
| `vercel inspect`    | Show details about a deployment            |

---

## Summary of Files Modified for Vercel

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `next.config.ts`   | Security headers, compression, image optimization |
| `vercel.json`      | Build settings, static asset caching              |
| `.env.example`     | Template for required environment variables        |
| `.env.production`  | Production defaults (overridden by Vercel env vars)|
| `types/env.d.ts`   | TypeScript definitions for environment variables   |
