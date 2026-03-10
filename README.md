# Haapavesi Digi Assistant

## Project info

**URL**: https://haapavesi-guide-hub.vercel.app

Haapavesi Guide Hub is a web application that provides a centralized guide to the town of Haapavesi in Northern Ostrobothnia, Finland.[page:1]

## Tech stack

This project is built with:[page:1]

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (backend, database, auth)
- Vercel (deployment)

## Local development

Prerequisites:[page:1]

- Node.js and npm installed
- Git installed

Steps:

```sh
# 1. Clone the repository
git clone https://github.com/c-aleksi/haapavesi-guide-hub.git

# 2. Go to project directory
cd haapavesi-guide-hub

# 3. Install dependencies
npm install

# 4. Create .env file and configure environment variables (Supabase keys, etc.)

# 5. Start dev server
npm run dev
```

The app will be available at http://localhost:5173 by default (Vite default port).[page:1]

## Project structure

- `src/` – React components, pages, hooks and utilities
- `public/` – static assets and base HTML
- `supabase/` – database schema, migrations and Supabase configuration
- `tailwind.config.ts`, `postcss.config.js` – styling configuration
- `vite.config.ts` – Vite build and dev server configuration
- `vitest.config.ts` – test configuration
- `tsconfig*.json` – TypeScript configuration files[page:1]

## Scripts

Common npm scripts (see `package.json`):[page:1]

- `npm run dev` – start development server with HMR
- `npm run build` – build production bundle
- `npm run preview` – preview built app locally
- `npm run test` – run tests with Vitest
- `npm run lint` – run ESLint

## Deployment

The project is deployed to Vercel and connected to this GitHub repository for automatic deployments from the `main` branch.[page:1]

To update the production deployment:

1. Commit and push changes to `main`.
2. Vercel will automatically build and deploy the latest version.[page:1]

Custom domains and additional deployment settings can be configured in the Vercel project settings.[page:1]
```
