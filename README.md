# PugDebug-INNOVATON-2026

## React + TypeScript + Vite Boilerplate

Boilerplate starter with:

- React 19 + TypeScript + Vite
- PrimeReact UI components
- React Router setup with shared layout and 404 route

### Run the project

```bash
npm install
npm run dev
```

### Included routing setup

- `/` renders `Home`
- `/playground` renders `Playground`
- `*` renders `NotFound`

Routes are defined in `src/App.tsx`, and shared shell/navigation is in `src/components/Layout.tsx`.

### PrimeReact setup

PrimeReact styles and icons are loaded in `src/main.tsx` in this order:

1. PrimeReact theme
2. PrimeReact base styles
3. PrimeIcons
4. Local global styles (`src/index.css`)

This order keeps PrimeReact defaults while allowing local overrides.
