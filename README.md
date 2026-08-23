# ICT ELECTION SMKN 20

A modern, high-performance, and real-time electronic voting system (E-Voting) built exclusively for the IT Extracurricular (ICT) of SMKN 20 Jakarta.

## Overview
This platform ensures a secure, transparent, and seamless voting experience for students to elect their next ICT club president. Featuring a high-end UI/UX architecture, strict validation, and a cinematic real-time dashboard, the system guarantees an elite digital election experience.

## Key Features

- **Strict Voter Validation:** Authenticates voters securely using their NIS (Nomor Induk Siswa).
- **Anti-Fraud Mechanism:** Tracks device fingerprints and local sessions alongside database-level verifications to prevent double-voting.
- **Cinematic Real-Time Dashboard:** A high-end dashboard projecting live vote counts and participation rates utilizing WebSockets.
- **Soft Structuralism UI/UX:** Premium aesthetic focusing on glassmorphism, editorial typography, asymmetrical bento grids, and smooth `cubic-bezier` animations.
- **Core Web Vitals Optimized:** Fast loading via intelligent asset optimization, `next/image` prioritization for LCP (Largest Contentful Paint), and minimal main-thread blocking.

## Tech Stack

- **Frontend:** [Next.js 16 (App Router)](https://nextjs.org/) & React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Live Data:** Supabase Realtime (`postgres_changes`)
- **Transactions:** Supabase RPC (Remote Procedure Call) for atomic, safe vote insertions.
- **Typography:** Plus Jakarta Sans

## Architecture Highlights

1. **Double-Bezel Glassmorphism:** Custom multi-layered transparent UI for depth without overwhelming shadows.
2. **Button-in-Button CTA:** Premium micro-interactions enforcing clear user focus.
3. **Optimistic Rendering & Lazy Loading:** Ensures smooth transitions and reduces bandwidth usage for assets off-screen.
4. **Data Integrity:** Voting logic is handled at the database level via Postgres RPC to prevent race conditions during high-concurrency spikes.

---
*Designed & Engineered for ICT SMKN 20 Jakarta.*
