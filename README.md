# Word App Client

This is the frontend client for the Word App, a vocabulary learning and practice application. Built with [Vue 3](https://vuejs.org/) and [Vite](https://vitejs.dev/), it provides a fast, modern, and responsive user experience.

## Features

- User authentication (login, signup, password reset)
- Vocabulary management (add, edit, view, and practice words)
- Language support and management
- Practice exercises and progress tracking
- Responsive UI with reusable components
- API integration for backend communication

## Project Structure

```
src/
	assets/         # Static assets (CSS, images)
	components/     # Reusable UI components
	composables/    # Vue composables (e.g., useUserAuth)
	data/           # API and token accessors
	pages/          # Application pages (Home, Login, Signup, etc.)
	router/         # Vue Router setup
	store/          # Pinia stores (user state)
	types/          # TypeScript models and interfaces
	utils/          # Utility functions and constants
public/           # Public static files
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3001.

### Build

To build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

- `.env.development` — Development environment settings
- `.env.production` — Production environment settings

## Deployment

Using GitHub Actions, see [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
It automates deployment to a remote server using SFTP connection.

