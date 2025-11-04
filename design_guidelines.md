# Design Guidelines for Movie/TV Show Management Application

## Design Approach
**Utility-Focused Design System Approach**: This application prioritizes efficiency and usability as a data management tool. The design follows a modern dark theme aesthetic inspired by bolt.new, using consistent patterns and established UI components.

## Core Design Elements

### A. Typography
- **Font Family**: Inter or Geist
- **Hierarchy**:
  - Headers: Bold weights for primary headings
  - Body text: Regular weights for readability
  - Labels: Medium weights for form fields and table headers
  - Captions: Smaller sizes for secondary information

### B. Layout System
**Tailwind Spacing Primitives**: Use units of 2, 4, 6, 8, 12, and 16 for consistent spacing throughout
- Padding: p-4, p-6, p-8
- Margins: m-2, m-4, m-8
- Gaps: gap-4, gap-6, gap-8
- Border radius: rounded-xl (12px) for cards and modals, rounded-lg for buttons and inputs

### C. Visual Treatment

**Dark Theme Color Palette**:
- Primary Background: #0f0f0f
- Secondary Background: #1a1a1a (cards, modals, table rows)
- Accent Color: #3b82f6 (blue-500) for CTAs and interactive elements
- Text Primary: #f5f5f5
- Text Secondary: #a3a3a3
- Border Color: #2d2d2d
- Success: #10b981
- Error: #ef4444
- Warning: #f59e0b

**Surface Effects**:
- Modern glassmorphism on modal backgrounds
- Subtle shadows on elevated elements (cards, dropdowns)
- Hover states with slight brightness increase
- Smooth transitions on all interactive elements

### D. Component Library

**Navigation & Layout**:
- Header: Fixed top bar with app branding and primary action (Add Movie button)
- Main content area: Full-width table container with breathing room
- Footer: Minimal with credits/links

**Data Display**:
- Movie Table: Clean rows with alternating subtle background colors, hover states highlighting entire row
- Columns: Title, Type, Director, Budget, Location, Duration, Year/Time, Actions
- Loading skeleton: Shimmer effect matching table structure
- Empty state: Centered icon, message, and CTA when no movies exist

**Forms & Inputs**:
- Modal form: Centered, maximum width 600px, dark background with border
- Input fields: Full-width, rounded corners, focused border accent color
- Dropdowns: Shadcn Select component with custom dark styling
- Inline validation: Error messages in error color below fields
- Submit button: Full-width, accent color, disabled state during loading

**Interactive Elements**:
- Primary button: Accent color background, white text, rounded-lg, hover brightness increase
- Delete button: Error color with confirmation dialog
- Edit button: Secondary styling with icon
- Modal overlay: Dark backdrop with backdrop blur

**Feedback Components**:
- Toast notifications: Top-right positioning, auto-dismiss, success/error variants
- Confirmation dialog: Centered alert with title, description, and action buttons
- Loading states: Spinner for buttons, skeleton for table rows

### E. Responsive Design

**Breakpoints**:
- Mobile (< 640px): Stack form fields vertically, simplify table to card view
- Tablet (640px - 1024px): Two-column form layout, scrollable table
- Desktop (> 1024px): Full layout with all columns visible

**Mobile Adaptations**:
- Table converts to stacked cards showing key information
- Form fields stack with full width
- Modal takes full screen on small devices
- Touch-friendly button sizes (minimum 44px height)

### F. Animations
**Minimal, purposeful animations**:
- Modal entrance: Fade-in with slight scale (0.95 to 1)
- Toast notifications: Slide from top
- Loading skeleton: Shimmer pulse effect
- Hover transitions: 150ms ease-in-out
- No scroll-triggered animations or excessive motion

## Images
This application does not require images as it is a data management tool focused on tabular information and forms. The visual interest comes from the dark theme, typography, and component design rather than imagery.

## Accessibility
- Keyboard navigation: Tab through all interactive elements, Enter to submit, Escape to close modals
- ARIA labels on all buttons and form controls
- Focus visible indicators using accent color
- Screen reader friendly error messages
- Semantic HTML throughout (table, form, button elements)
- Minimum contrast ratios met for text readability

## Key Implementation Priorities
1. **Data clarity**: Table must be scannable with clear visual hierarchy
2. **Efficient workflows**: Modal forms for quick add/edit without page navigation
3. **Smooth performance**: Infinite scroll implementation must feel instantaneous
4. **Trustworthy interactions**: Loading states and confirmations prevent user errors
5. **Professional polish**: Consistent spacing, borders, and hover states throughout