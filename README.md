# Form Builder

A simple form builder application built with React and TypeScript. Create custom forms, preview them, and manage multiple forms easily.

## Features

- Create forms with different field types (text, number, email, date, select, radio, checkbox)
- Add validation rules to fields
- Preview forms before saving
- Save and manage multiple forms
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:3000`

## How to Use

### Creating a Form
1. Click "Create" in the navigation
2. Add fields using the "Add Field" button
3. Configure each field by clicking on it
4. Set field labels, types, and validation rules
5. Save your form with a name

### Previewing Forms
1. While creating a form, click "Preview" to test it
2. Or from "My Forms", click the preview button on any saved form
3. Test all fields and validations work correctly

### Managing Forms
1. Go to "My Forms" to see all your saved forms
2. Preview or delete forms as needed
3. Create new forms from this page

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Main pages (Create, Preview, MyForms)
├── store/         # Redux state management
├── types/         # TypeScript type definitions
├── utils/         # Helper functions
└── constants/     # App constants
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit
- Material-UI
- Vite
- React Router

## Browser Support

Works on all modern browsers including Chrome, Firefox, Safari, and Edge.

## License

MIT
