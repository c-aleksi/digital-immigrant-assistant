# Digital Immigrant Assistant

## Overview

Digital Immigrant Assistant is a web application that provides structured guidance and localized information for immigrants and new residents in Haapavesi, Finland.

The application helps users navigate practical topics such as relocation, documents and residence status, work and employment, education, healthcare, family services, and local resources. It is designed as a centralized guide that combines structured content with an admin-managed knowledge base.

Production URL  
https://digital-immigrant-assistant.vercel.app

---

## Features

User functionality

- Guided information for immigrants and new residents
- Structured content organized by life situations
- Localized information related to Haapavesi and Finland
- Responsive interface for desktop and mobile

Admin functionality

- Admin panel for managing guide content
- Editing and publishing informational articles
- Managing content collections and steps
- Database-backed content management via Supabase

---

## Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

Backend and data

- Supabase
- Supabase Edge Functions
- PostgreSQL (via Supabase)

Infrastructure

- GitHub (source control)
- Vercel (deployment and hosting)

---

## Repository

GitHub repository

https://github.com/c-aleksi/digital-immigrant-assistant

---

## Local Development

### Prerequisites

The following tools must be installed:

Node.js  
npm  
Git

### Clone repository

```bash
git clone https://github.com/c-aleksi/digital-immigrant-assistant.git
cd digital-immigrant-assistant
````

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root and add required environment variables.
Typical configuration includes Supabase connection values.

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Environment variables used in production must also be configured in Vercel project settings.

### Start development server

```bash
npm run dev
```

By default the application runs on:

[http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
  components/        reusable UI components
  pages/             application pages (public and admin)
  contexts/          React context providers
  hooks/             custom React hooks
  services/          API and service layer
  types/             TypeScript types

public/
  static assets

supabase/
  functions/         Supabase Edge Functions
  migrations/        database migrations
  config.toml        Supabase configuration
```

Configuration files

```
vite.config.ts
tailwind.config.ts
tsconfig*.json
vitest.config.ts
vercel.json
```

---

## Available Scripts

Common npm scripts defined in `package.json`.

Development server

```bash
npm run dev
```

Production build

```bash
npm run build
```

Preview production build locally

```bash
npm run preview
```

Lint code

```bash
npm run lint
```

Run tests

```bash
npm run test
```

---

## Deployment

The project is deployed on Vercel.

Deployment flow

1. Changes are committed locally.
2. Code is pushed to the `main` branch.
3. Vercel automatically builds and deploys the project.
4. The new version becomes available on the production URL.

Deployment configuration can be managed in Vercel project settings.

---

## Notes

This repository represents the independent development repository for the Digital Immigrant Assistant project.

It contains the frontend application, admin interface, and Supabase configuration required to run the system.

```
```
