# upliance.ai Form Builder

A dynamic, responsive form builder application built with React, TypeScript, Redux Toolkit, and Material-UI. Create, customize, and preview forms with advanced features like derived fields and comprehensive validation.

## 🚀 Features

### ✅ **Core Functionality**
- **Dynamic Form Creation**: 7 field types (Text, Number, Textarea, Select, Radio, Checkbox, Date)
- **Field Configuration**: Labels, validation rules, required toggles, default values
- **Derived Fields**: Computed fields based on other field values (e.g., age from DOB)
- **Form Management**: Save, preview, and manage multiple forms
- **LocalStorage Persistence**: No backend required

### ✅ **Advanced Features**
- **Real-time Validation**: Comprehensive validation with custom rules
- **Drag & Drop Reordering**: Intuitive field management
- **Responsive Design**: Works on desktop and mobile
- **Type Safety**: Full TypeScript implementation
- **Professional UI**: Material-UI components with consistent design

## 🛠 **Tech Stack**

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## 📦 **Getting Started**

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd upliance-form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── FieldEditor.tsx     # Field configuration interface
│   ├── FieldList.tsx       # Field management with reordering
│   ├── FormRenderer.tsx    # Form display component
│   ├── FieldConfig.tsx     # Common field properties
│   └── NavigationButtons.tsx  # Consistent navigation
├── pages/              # Route components
│   ├── CreateForm.tsx      # /create - Form builder
│   ├── PreviewForm.tsx     # /preview - Form testing
│   └── MyForms.tsx        # /myforms - Form management
├── store/              # Redux state management
│   ├── formSlice.ts       # Form state & actions
│   └── index.ts           # Store configuration
├── types/              # TypeScript definitions
│   └── form.ts            # Form interfaces & enums
├── utils/              # Helper functions
│   ├── localStorage.ts    # Data persistence
│   ├── validation.ts      # Validation logic
│   ├── derived.ts         # Derived field calculations
│   └── formHelpers.ts     # Utility functions
├── constants/          # App constants
└── hooks/              # Custom React hooks
```

## 🎯 **Usage**

### Creating Forms (/create)
1. Add fields using "Add Field" button
2. Configure each field (label, type, validation, etc.)
3. Set up derived fields for calculations
4. Reorder fields with drag handles
5. Save form with a descriptive name

### Previewing Forms (/preview)
1. Test form as end-user would see it
2. All validations work in real-time
3. Derived fields auto-update
4. Error messages display clearly

### Managing Forms (/myforms)
1. View all saved forms
2. See creation dates and field counts
3. Preview or delete forms
4. Quick access to form statistics

## 🧪 **Scripts**

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check for lint errors
npm run lint:fix        # Fix auto-fixable lint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # TypeScript type checking
```

## 🚀 **Deployment**

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Auto-deploys on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA routing

### Manual Deployment
```bash
npm run build
# Upload contents of 'dist' folder to your hosting provider
```

## 🏆 **Best Practices Implemented**

- ✅ **DRY Principle**: No repeated code, centralized constants
- ✅ **TypeScript**: Strong typing with enums and interfaces  
- ✅ **Component Composition**: Reusable, focused components
- ✅ **State Management**: Predictable Redux patterns
- ✅ **Error Handling**: Safe JSON parsing, try-catch blocks
- ✅ **Code Quality**: ESLint + Prettier configuration
- ✅ **Performance**: Efficient re-renders, memoized selectors

## 📋 **Assignment Requirements**

- ✅ **Dynamic Form Builder**: All 7 field types supported
- ✅ **Field Configuration**: Labels, validation, defaults
- ✅ **Derived Fields**: Parent field dependencies with formulas
- ✅ **Three Routes**: /create, /preview, /myforms
- ✅ **LocalStorage**: Form persistence without backend
- ✅ **Validation**: Comprehensive rules with error display
- ✅ **TypeScript**: Strong type safety throughout
- ✅ **Material-UI**: Professional, responsive design

## 🔧 **Environment Variables**
No environment variables required - runs entirely in browser with localStorage.

## 📝 **License**
MIT License - Feel free to use for learning and development.

---

**Built with ❤️ for upliance.ai technical assessment**
