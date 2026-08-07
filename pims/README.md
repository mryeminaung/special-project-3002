# Web Frontend Setup

This is the web frontend for the Special Project 3002 application, built with React, TypeScript, Vite, and Tailwind CSS.

## Prerequisites

- Node.js (version 18 or higher)
- npm
- The backend server running on `http://localhost:8000` (see backend README for setup)

## Installation

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

1. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

2. The app is configured to proxy API requests to `http://localhost:8000`, so ensure the backend is running.

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Axios for API calls
- React Hook Form
- TanStack Table
- Motion for animations
