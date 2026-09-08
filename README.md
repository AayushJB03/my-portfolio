# Aayush Bhadbhade — Portfolio

Personal portfolio built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Overview

This project contains the source for a developer portfolio with projects, blogs, certificates, favorites, GitHub activity, and a contact flow. It uses the Next.js App Router and keeps most site content in static data files under `src/data`.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- MDX
- Motion
- Radix UI primitives

## Features

- App Router pages for profile, blogs, projects, certificates, utilities, and favorites
- Project detail pages with dynamic routes
- Supabase-backed certificate and page data helpers
- GitHub activity and blog feed integrations
- TMDB-backed favorites API
- Global search, theme switching, and sound/haptic providers
- MDX support for content rendering

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create an environment file:

```bash
cp env.sample .env
```

Fill in the required values in `.env`, then start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

See `env.sample` for the full list. The main values used by the app are:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GITHUB_TOKEN=
DEVTO_API_KEY=
TMDB_API_KEY=
TMDB_API_READ_ACCESS_TOKEN=
TMDB_FAV_MOVIES_LIST_ID=
TMDB_FAV_WEB_SERIES_LIST_ID=
```

## Scripts

```bash
pnpm dev       # Start the local dev server
pnpm build     # Create a production build
pnpm start     # Run the production server
pnpm lint      # Run Next.js linting
pnpm lint:fix  # Run ESLint with fixes
pnpm format    # Format the codebase
```

## Project Structure

```text
src/
  app/          App Router pages, layouts, API routes, metadata routes
  components/   Reusable UI, profile sections, site shell, providers
  core/         Standalone feature modules
  data/         Static site data and configuration
  lib/          Supabase clients, utilities, and file helpers
public/         Static assets
```

## Notes

The repository is private by default and intended as a personal portfolio codebase. Keep secrets in `.env` and use `env.sample` as the public reference for required configuration.
