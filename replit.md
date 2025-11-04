# MovieHub - Movie & TV Show Management Application

## Overview
MovieHub is a modern, full-stack web application for managing movie and TV show collections. Built with React, TypeScript, and Express, it features a beautiful dark theme inspired by bolt.new, infinite scroll pagination, and comprehensive CRUD operations.

## Recent Changes
- **2025-11-04**: Initial implementation
  - Defined movie data schema with all required fields
  - Built complete frontend with infinite scroll table
  - Implemented add/edit modal with form validation
  - Added delete confirmation dialog
  - Created responsive design with mobile card view
  - Set up dark theme with bolt.new-inspired color scheme
  - Configured storage interface for movie CRUD operations

## Architecture

### Data Model
**Movie Schema** (`shared/schema.ts`):
- `id`: UUID (auto-generated)
- `title`: String (2-255 chars, required)
- `type`: Enum ("Movie" | "TV Show", required)
- `director`: String (required)
- `budget`: String (required, e.g., "$5M")
- `location`: String (required, filming location)
- `duration`: String (required, e.g., "120 min")
- `yearTime`: String (required, e.g., "2024")
- `createdAt`: Timestamp (auto)
- `updatedAt`: Timestamp (auto)

### Frontend Structure
- **Main Page** (`client/src/pages/movies.tsx`): Complete movie management interface
  - Infinite scroll table (desktop) with 10 items per page
  - Card-based layout (mobile/tablet)
  - Add/Edit modal with form validation using Zod
  - Delete confirmation dialog
  - Loading skeletons with shimmer effect
  - Empty state with call-to-action
  
- **Components Used**:
  - Shadcn Dialog for modal forms
  - Shadcn AlertDialog for delete confirmation
  - Shadcn Form with React Hook Form
  - Shadcn Select for type dropdown
  - Toast notifications for feedback

### Backend Structure
- **Storage Interface** (`server/storage.ts`): In-memory storage with full CRUD operations
  - `getAllMovies(page, limit)`: Paginated movie retrieval
  - `getMovie(id)`: Single movie lookup
  - `getMoviesCount()`: Total count for pagination
  - `createMovie(data)`: Create new movie
  - `updateMovie(id, data)`: Update existing movie
  - `deleteMovie(id)`: Remove movie

### API Endpoints (To be implemented in Task 2)
- `GET /api/movies?page=1&limit=10`: Get paginated movies
- `POST /api/movies`: Create new movie
- `GET /api/movies/:id`: Get movie by ID
- `PUT /api/movies/:id`: Update movie
- `DELETE /api/movies/:id`: Delete movie

## Design System

### Color Palette (Dark Theme)
- **Primary Background**: `#0f0f0f` (HSL: 0 0% 6%)
- **Secondary Background**: `#1a1a1a` (cards, modals)
- **Accent Color**: `#3b82f6` (blue-500) for CTAs
- **Text Primary**: `#f5f5f5`
- **Text Secondary**: `#a3a3a3`
- **Border**: `#2d2d2d`
- **Success**: `#10b981`
- **Error**: `#ef4444`
- **Warning**: `#f59e0b`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hierarchy**: Bold headers, regular body, medium labels

### Spacing
- Consistent spacing using Tailwind units: 2, 4, 6, 8, 12, 16
- Padding: p-4, p-6, p-8
- Border radius: rounded-lg (12px)

### Responsive Breakpoints
- **Mobile** (< 640px): Stacked cards, single column forms
- **Tablet** (640px - 1024px): Two-column forms, scrollable table
- **Desktop** (> 1024px): Full table layout

## Key Features

### Infinite Scroll
- Automatically loads more movies as user scrolls
- Uses Intersection Observer API for performance
- Prevents duplicate loading with state management
- Shows loading indicator during fetch

### Form Validation
- Client-side validation using Zod schemas
- Inline error messages below fields
- All fields required with specific constraints
- Type-safe form data handling

### User Experience
- Smooth modal animations (fade + scale)
- Hover effects on table rows
- Loading states on buttons during operations
- Toast notifications for success/error feedback
- Confirmation before destructive actions
- Mobile-optimized card layout

### Accessibility
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management in modals
- Semantic HTML structure
- Proper contrast ratios for text

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- TailwindCSS for styling
- Shadcn UI components
- React Hook Form + Zod validation
- TanStack Query for data fetching
- Wouter for routing

### Backend
- Express.js
- TypeScript
- In-memory storage (MemStorage)
- Drizzle ORM schemas for types
- Zod for validation

## Development Workflow
- Schema-first development approach
- Type-safe API contracts
- Horizontal feature implementation
- Comprehensive error handling

## Next Steps
1. Implement backend API routes with validation
2. Connect frontend to backend endpoints
3. Add comprehensive error handling
4. Test all user journeys
5. Polish animations and transitions
