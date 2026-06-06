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

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (with CSS variable theme-mapping & custom keyframes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
To build and check compilation:
```bash
npm run build
```

---

## 💻 Code Quality

This project is configured with TypeScript checks and ESLint linting:
```bash
# Run linting
npm run lint

# Run type check
npx tsc --noEmit
```
