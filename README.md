# PDV – Voluntary Departure Plan Severance Calculator

An interactive, modular, and beautifully designed frontend application built to estimate severance packages under the French Voluntary Departure Plan (**Plan de Départ Volontaire - PDV**).

---

## 📌 Project Overview

This simulator computes legal and extra-legal indemnities, reclassification leave allowances, and applicable social contributions and income taxes in accordance with majority agreements (such as the Casino group agreements) and French collective bargaining rules.

It has been styled following modern frontend conventions, matching clean aesthetic designs, polished responsive cards, custom toggles/sliders, smooth animations, and is fully internationalized.

---

## ✨ Key Features

- **📊 Comprehensive Calculation Engine**: Computes legal severance (ILL), conventional severance (ICL), and extra-legal multipliers. Highlights tax-exempt severance package figures (legal + supra-legal) in the main hero display while listing global grand totals (reclassification leave and optional bonuses) in the detailed panels.
- **🔄 Local Storage Persistence**: Your input values are automatically saved in your browser and restored on reload.
- **🌐 Bilingual Support (i18n)**: Instantly switch between English 🇬🇧 and French 🇫🇷 with localized form fields, summaries, and guides.
- **🌓 Light & Dark Theme Toggles**: Responsive theme-matching with seamless transitions.
- **🗓️ Reclassification Leave Simulation**: Interactive slider to adjust active leave duration, showing automatic calculations of caps, capitalized allowances, and charges.
- **📉 Social Charges & Taxation Details**: Detailed breakdown of CSG/CRDS, pension contributions, and income tax estimations.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Static HTML Export)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (with CSS variable theme-mapping & custom keyframes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🛠️ Installation & Local Development

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed, then follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
Compiles the static export into the `out/` directory:
```bash
npm run build
```

### 4. Local Cloudflare Pages Preview
Preview the static build using Wrangler:
```bash
npm run pages:preview
```

---

## ☁️ Deployment on Cloudflare Pages

This project is configured for **Static HTML Export** (`output: 'export'`), which provides maximum performance, instant global CDN delivery, zero cold starts, and full reliability on Cloudflare Pages.

### Option A: Continuous Deployment via GitHub (Recommended)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository (`louisvolant/PDV`) and choose the `master` branch.
4. Configure the build settings:
   - **Framework preset**: `None` or `Next.js (Static Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (default)
5. Set Environment Variables under **Environment variables (advanced)**:
   - Variable name: `NODE_VERSION`
   - Value: `20` (or `22`)
6. Click **Save and Deploy**. Cloudflare Pages will build and deploy the app on every push to `master`.

---

### Option B: Manual / CLI Deployment with Wrangler

You can also deploy directly from your local terminal or via CI/CD pipelines:
```bash
npm run pages:deploy
```

---

## 🔐 Environment Variables & `keep_vars`

- **Git-based Deployments (Cloudflare Pages)**: Environment variables are managed natively via the Cloudflare Dashboard under **Settings > Environment variables**. Cloudflare Pages Git deployments preserve all dashboard-configured variables and secrets across builds. Cloudflare Pages configuration validation does not allow `keep_vars` inside `wrangler.toml` for Pages projects, as variables are non-destructive in Pages Git integration.
- **CLI / Manual Deployments**: When using the Wrangler CLI for direct uploads, the `--keep-vars` flag is included in the deployment script to ensure remote dashboard variables are never overwritten:

```bash
wrangler pages deploy out --project-name=pdv-calculator --keep-vars
```

```toml
name = "pdv-calculator"
compatibility_date = "2024-09-01"
pages_build_output_dir = "out"

[vars]
# Add shared non-sensitive environment variables here if needed
```

> **Note**: For client-side variables in Next.js, make sure to prefix them with `NEXT_PUBLIC_` so they are embedded during build time.

---

## 💻 Code Quality & Testing

This project is configured with TypeScript checks and ESLint:

```bash
# Run linting
npm run lint

# Run type check
npx tsc --noEmit
```
