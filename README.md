# SmartShare

A premium digital business card platform built with React, TypeScript, and Firebase. Create, share, and track professional digital business cards with QR code integration.

## Features

- **Digital Business Cards** — Create stunning, customizable digital business cards with multiple themes and layouts
- **QR Code Generation** — Instantly generate QR codes for any URL or text content
- **QR Code Scanner** — Scan QR codes directly from your device's camera
- **Real-Time Analytics** — Track profile views, link clicks, and contact saves
- **Contact Management** — Manage and export contacts saved from your cards
- **Cross-Platform** — Works on web and Android (via Capacitor)

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Analytics)
- **Build:** Vite
- **Mobile:** Capacitor (Android)
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/nfsprogramming/Smart-Share.git
cd Smart-Share
npm install
```

### Environment Setup

Create a `.env` file in the project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── card/       # Card display components
│   └── ui/         # Base UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── pages/          # Route pages
├── utils/          # Utility functions & Firebase config
└── types.ts        # TypeScript type definitions
```