# StudyPilot – Student Life Toolkit (Frontend)

A modular React + TypeScript application that centralizes core student productivity workflows: scheduling, budgeting, exam prep, and structured study planning.

Built with **Vite**, **Redux Toolkit + RTK Query**, **React Hook Form + Zod**, **TailwindCSS**, and **Firebase Authentication**.

## Overview

StudyPilot is a comprehensive student productivity platform. This repository contains the **frontend client**. It delivers a cohesive user experience for tracking classes, managing finances, generating exam practice questions, and breaking large study goals into actionable tasks.

The app emphasizes: consistency, validated data entry, reusable UI primitives, responsive layout, and a clean state architecture. A separate backend (not included here) powers protected endpoints consumed via RTK Query. Firebase handles authentication & token issuance (JWT utilities provided).

## Core Features

### 1. Class Schedule Tracker

Manage weekly classes efficiently.

- Create / edit / delete schedule entries
- Fields: subject, instructor, day, start/end time
- Color coding by subject for visual scanning
- Quick edit modal (`ScheduleEdit.tsx`)
- Type-safe models (`schedule.type.ts`)

### 2. Budget Tracker

Stay on top of income & expenses.

- Categorized transactions (income / expense)
- Add / update / delete transactions (modals in `Budget/` directory)
- Transaction statistics & aggregation (`TransactionStats.tsx`)
- History feed + chart visualization (`TransactionChart.tsx` via `react-google-charts`)
- Validation via `budget.schema.ts`

### 3. Exam Q&A Generator

Prepare smarter with randomized exam practice.

- Input exam context (`ExamInput.tsx`)
- Supports different question styles (MCQ / short / true-false foundation) – extensible pattern
- Difficulty selection (easy | medium | hard)
- Fetch layer abstracted through `examApi.ts`

### 4. Study Planner

Break long-term goals into structured tasks.

- Create study goals & sub tasks (`CreateStudyGoalModal`, `AddStudyTaskModal`)
- Edit, update, and delete goals / tasks (modular modals)
- Prioritization & deadline assignment (see `studyGoal.schema.ts`)
- Detailed view (`StudyDetails.tsx`) for progress context

### Unique Feature: AI‑Assisted Task Generation (Extensible Modal)

`GenerateStudyTaskModal.tsx` introduces an opinionated entry point for automated task suggestions. While current logic is rule‑based (priority + deadline scaffolding), it is architected to plug into a future AI backend (e.g., semantic expansion of a syllabus). The modal pattern + typed API layer make this enhancement low-friction.

### Additional UX enhancements:

- Unified form system (`/components/form`) with consistent validation + error surfacing
- Cloudinary file upload helper (`cloudinaryUpload.ts`) for attachments (e.g., notes/resources)
- Toast notifications (`sonner`), alert dialogs (`sweetalert2`)
- Auto token refresh & local persistence strategies

## Architecture & Tech Stack

- Framework: React 19 + TypeScript
- Build: Vite + ES modules
- Styling: TailwindCSS (utility-first) + custom theme tokens
- State: Redux Toolkit (slices abstracted through RTK Query base API)
- Data Fetching: RTK Query (`baseApi.ts`, resource-specific API files)
- Forms & Validation: React Hook Form + Zod schemas (`/schemas`)
- Auth: Firebase (email/password + password reset flows)
- Charts: react-google-charts
- Notifications: sonner + sweetalert2

### Folder Highlights

```
src/
	components/         Reusable UI primitives & form controls
	pages/              Feature pages + modal composition
	redux/              Store + RTK Query API definitions
	schemas/            Zod validation schemas (source of truth)
	types/              Strongly typed domain models
	utils/              Cross-cutting helpers (JWT, formatting, uploader)
	firebase/           Firebase config + auth actions
	routes/             Route protection + navigation setup
	theme/              Theme composition / Tailwind customization
```

## Authentication Flow

1. User registers / logs in via Firebase methods (`firebase.action.ts`).
2. JWT or Firebase token persisted using localStorage utils (`localStorage.ts`).
3. Auth guard wrapper `ProtectedRoute.tsx` gates private routes.
4. Token attached automatically through Axios base query (`axiosBaseQuery.ts`).

## State Management Strategy

- Central store in `store.ts` wiring RTK Query + slices.
- Feature endpoints (auth, budget, schedule, exam, study goals) defined in separate `*.api.ts` files for isolation.
- Cache invalidation patterns via RTK Query tags (extensible).

## Data Validation & Error Handling

- Zod schemas: `auth.schema.ts`, `budget.schema.ts`, `exam.schema.ts`, `studyGoal.schema.ts`.
- Reusable `<SFormError />` component surfaces field + root errors.
- Humanized backend/Firebase error translation (`formatFirebaseError.ts`).

## UI / UX Principles

- Responsive layout (flex/grid + fluid container wrapper `Container.tsx`).
- Semantic components: headings (`SectionHeading`, `TitleText`, `NormalText`).
- Icons & CTA affordances (`IconButton`).
- Loading states via `<Loader />` to reduce layout shift.
- Color-coded taxonomy (e.g., subjects, priorities) for scannability.

## Reusable Form System

`/components/form` abstracts: input, password, textarea, select, radio, checkbox, file upload, date picker. Each control:

- Accepts RHF props & error states
- Shares consistent Tailwind variants
- Reduces boilerplate in feature modals

## Environment Configuration

Create a `.env` (or `.env.local`) file mirroring Firebase + API needs.

```
VITE_API_BASE_URL=https://your-backend.example.com/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
VITE_CLOUDINARY_CLOUD_NAME=...
```

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Add environment variables (.env)

# 3. Run development server
pnpm dev

# 4. Open
http://localhost:5173
```

## Presentation Video

Presentation Video: https://youtu.be/qQhIdA_wL1o

[![Demonstration Video](https://img.youtube.com/vi/qQhIdA_wL1o/0.jpg)](https://youtu.be/qQhIdA_wL1o)
