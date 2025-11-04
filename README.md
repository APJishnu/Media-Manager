# rest-express

A full-stack web application built with React, Express, and TypeScript, featuring authentication, database integration, and a modern UI component library.

## Features

- 🚀 **Full-stack TypeScript** - Type-safe development from frontend to backend
- ⚡ **Vite** - Lightning-fast HMR and build tooling
- 🎨 **Modern UI** - Built with Radix UI primitives and Tailwind CSS
- 🔐 **Authentication** - Passport.js with local strategy
- 💾 **Database** - PostgreSQL with Drizzle ORM
- 🔄 **Real-time** - WebSocket support with ws
- 📱 **Responsive Design** - Mobile-first approach with React components
- 🎭 **Animations** - Smooth transitions with Framer Motion

## Tech Stack

### Frontend
- **React 18** - UI library
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component system
- **Framer Motion** - Animation library
- **Recharts** - Charting library

### Backend
- **Express** - Web framework
- **Drizzle ORM** - Type-safe database access
- **Neon Database** - Serverless PostgreSQL
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **WebSocket** - Real-time communication

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon serverless)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/APJishnu/Media-Manager.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

4. Push database schema:
```bash
npm run db:push
```

## Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or your configured port).

## Building for Production

1. Build the application:
```bash
npm run build
```

This will:
- Build the frontend with Vite
- Bundle the backend with esbuild
- Output to the `dist` directory

2. Start the production server:
```bash
npm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Project Structure

```
rest-express/
├── client/           # Frontend React application
├── server/           # Backend Express application
├── db/              # Database schema and migrations
├── dist/            # Production build output
├── public/          # Static assets
└── package.json     # Project dependencies
```

## Key Dependencies

- **@neondatabase/serverless** - Serverless PostgreSQL client
- **drizzle-orm** - Type-safe ORM
- **express-session** - Session middleware
- **passport** - Authentication
- **react-hook-form** - Form handling
- **zod** - Schema validation
- **lucide-react** - Icon library

## Development Tools

- **tsx** - TypeScript execution for development
- **esbuild** - Fast JavaScript bundler
- **vite** - Frontend build tool
- **drizzle-kit** - Database schema management
- **@replit plugins** - Development experience enhancements

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with using modern web technologies
