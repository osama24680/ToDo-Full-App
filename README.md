# ToDo Full App — Frontend

A full-stack todo application. This repository is the **React + TypeScript frontend**; it talks to a **Strapi 5** REST API for authentication and data.

- **Backend repo:** [todoApp-strapi-hostinger](https://github.com/osama24680/todoApp-strapi-hostinger)
- **Live API:** `https://mediumslateblue-grasshopper-147625.hostingersite.com/api`

## Features

- **Authentication** — register and log in with email and password (Strapi users-permissions). The JWT is stored in `localStorage` under `loggedInUser`.
- **Protected routes** — guests are redirected to `/login`; logged-in users can't open `/login` or `/register`.
- **My todos (`/`)** — list the logged-in user's todos, add new ones, and edit or delete them through modal dialogs.
- **All todos (`/todos`)** — paginated list with page size (10 / 50 / 100) and sort order (oldest / latest).
- **Generate random todos** — creates 10 fake todos with Faker, handy for testing pagination.
- **Form validation** — Yup schemas with React Hook Form, plus toast notifications for success and errors.
- **Loading skeletons** while data is being fetched.

## Tech stack

| Area | Tools |
|---|---|
| Framework | React 18, TypeScript, Vite |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5, Axios |
| Forms | React Hook Form, Yup |
| UI | Tailwind CSS, Headless UI (modals), class-variance-authority, tailwind-merge |
| Notifications | react-hot-toast |
| Fake data | @faker-js/faker |

## Getting started

### Prerequisites

- Node.js 18 or newer
- A running Strapi backend (the live API above, or the backend repo running locally)

### Install and run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check with `tsc`, then build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Configuration

The API base URL is set in [`src/Config/axios.config.ts`](src/Config/axios.config.ts):

```ts
baseURL: "https://mediumslateblue-grasshopper-147625.hostingersite.com/api",
```

To use a local backend, change it to `http://localhost:1337/api`.

## API endpoints used

| Method | Endpoint | Used for |
|---|---|---|
| `POST` | `/auth/local/register` | Register |
| `POST` | `/auth/local` | Log in |
| `GET` | `/users/me?populate=todos` | Current user's todos (home page) |
| `GET` | `/todos?pagination[page]=…&pagination[pageSize]=…&sort=createdAt:ASC\|DESC` | Paginated todos |
| `POST` | `/todos` | Create a todo (the backend links it to the logged-in user) |
| `PUT` | `/todos/:documentId` | Update a todo |
| `DELETE` | `/todos/:documentId` | Delete a todo |

All requests except register and login send `Authorization: Bearer <jwt>`.

### Required Strapi permissions

In the Strapi admin, go to **Settings → Users & Permissions → Roles → Authenticated** and enable:

- **Todo:** `find`, `create`, `update`, `delete`
- **Users-permissions → User:** `me`

## Project structure

```
src/
├── components/
│   ├── auth/ProtectedRoute.tsx   # Redirects based on login state
│   ├── errors/ErrorHandler.tsx   # Route error boundary
│   ├── ui/                       # Button, Input, Textarea, Modal, Paginator
│   ├── Navbar.tsx                # Navigation and logout
│   ├── TodoList.tsx              # User's todos with add / edit / delete
│   └── TodoSkeleton.tsx          # Loading placeholder
├── Config/axios.config.ts        # Axios instance (API base URL)
├── Data/index.ts                 # Login and register form field definitions
├── Hooks/useCustomQuery.ts       # TanStack Query + Axios wrapper
├── Interfaces/index.ts           # Shared TypeScript types
├── Validation/index.ts           # Yup schemas
├── pages/                        # Home, Todos, Login, Register, Layout, 404
├── router/index.tsx              # Route definitions
├── App.tsx
└── main.tsx                      # React Query provider
```

## Deployment

```bash
npm run build
```

Upload the contents of `dist/` to any static host. Because the app uses client-side routing, the host must serve `index.html` for unknown paths; otherwise refreshing `/todos` or `/login` returns a 404.
