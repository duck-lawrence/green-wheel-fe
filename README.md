<p align="center">
  <img src="docs/green-wheel-text.svg" alt="Green Wheel" />
</p>

# Green Wheel Frontend

Green Wheel is a self-drive vehicle rental platform that connects customers with a managed vehicle fleet. This repository contains the Next.js 15 front end that serves the public marketing pages, the authenticated customer portal, and the internal staff/admin workspace.

## [Documentation](https://docs.google.com/document/d/1YYFCutl6D6C-bexIc14sZuamJwadSp8Y/edit?usp=sharing&ouid=102744078799902508261&rtpof=true&sd=true)

## [BACK-END](https://github.com/duck-lawrence/green-wheel-be)


## Project Information

### 💻 Tech Stack

#### 🖥️ Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)


#### ⚙️ Dev Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

## Getting Started

### Prerequisites
- Node.js 20 or newer (Next.js 15 + Turbopack require a modern runtime).
- npm 10+ (ships with Node) or pnpm 9+ (enable with `corepack enable`) for dependency management.
- Docker Desktop (optional) to run the ASP.NET Core API, SQL Server, and Redis dependencies locally.
- Access to the Green Wheel backend API (default `http://localhost:5160/api/`) and any third-party credentials (MoMo sandbox, Google OAuth).

### Clone & install
```bash
git clone https://github.com/<your-org>/green-wheel-fe.git
cd green-wheel-fe
npm install
```

If you work from the monorepo, run `npm install` inside `green-wheel-fe/` after the clone so that local packages are available to the Next.js workspace.

## Environment Configuration
1. Copy `.env.example` to `.env`.
2. Update each variable to match your environment.

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_API_URL` | Yes | Base URL of the ASP.NET Core API (keep the trailing `/api/`). | `http://localhost:0000/api/` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID exposed in the browser for social login. | `123.apps.googleusercontent.com` |

Tips:
- The API URL must be reachable from the browser. Ensure CORS in the backend allows the frontend origin you use during development.
- Start the backend before the frontend so TanStack Query can hydrate data on first render.

## Key Features
- Multi-portal experience covering public marketing pages, a customer rental portal, and a staff/admin dashboard from a single codebase.
- Data fetching and caching powered by TanStack Query and Axios interceptors with automatic token refresh on 401 responses.
- Shared state via Zustand stores for tokens, navigation, and booking filters to keep global state predictable.
- Internationalisation with i18next, including runtime language detection and namespaced translation files.
- Modern UI stack combining Tailwind CSS v4, HeroUI components, Formik/Yup forms, and Recharts-based analytics.

## Architecture Overview
- **Next.js App Router:** Nested segments under `src/app` split the public marketing pages and authenticated `(private)` areas (`dashboard`, `profile`, `contract`, `vehicle-rental`).
- **Providers layer:** `src/providers` composes HeroUI, TanStack Query, i18next, and disclosure context so layouts stay focused on rendering.
- **Data layer:** REST clients in `src/services` centralise Axios calls, while `src/hooks/queries` wraps TanStack Query for strongly typed data fetching.
- **State management:** Persistent Zustand stores in `src/hooks/singleton/store` expose tokens, filters, and navigation state across portals.
- **Utilities & models:** Shared helpers, DTOs, constants, and type definitions live under `src/utils`, `src/models`, and `src/constants`, keeping feature modules lightweight.

## Development Workflow
- Launch the dev server with `npm run dev` (Turbopack) and visit `http://localhost:3000`.
- Run linting via `npm run lint` to enforce the Next.js, TypeScript, and custom ESLint ruleset.
- Produce a production build with `npm run build`, then preview it locally using `npm run start`.
- When adding API calls, define the client in `src/services`, expose a typed hook in `src/hooks/queries`, and reuse the shared Axios instance for consistent interceptors.
- Translation updates live in `public/locales`. Restart the dev server after adding new namespaces or keys to refresh the client-side i18n cache.

## Project Credits

<div align="center">

| No | Student ID | Name | GitHub URL |ROLE
| --- | --- | --- | --- |--- |
| 1 | SE192160 | Trang Thuận Đức | [duck-lawrence](https://github.com/duck-lawrence) |Leader|
| 2 | SE183274 | Ngô Gia Huy | [devgiahuy](https://github.com/devgiahuy) |Front-end|
| 3 | SE192427 | Lê Hoàng Duy | [MavilH](https://github.com/MavilH) |Back-end|
| 4 | SE194177 | Nguyễn Quang Huy | [WuagHy](https://github.com/WuagHy) |Back-end|
| 5 | QE190133 | Phạm Hồng Phúc | [PhucPhamHong-dev](https://github.com/PhucPhamHong-dev)|Front-end|


## </div>

<div align="center">

### 🙏 Thank You for Being Part of Green Wheel!

</div>

We appreciate your contributions and dedication to the Green Wheel project.

- For questions or suggestions, please communicate within the project team or use the repository's [issue tracker](../../issues).
- **Note:** External contributions are not accepted, as this is a closed group project.

<div align="center">

Let's build something great together! 🚀

</div>
