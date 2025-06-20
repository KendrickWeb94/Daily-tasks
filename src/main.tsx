import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '../node_modules/@fontsource/inter/index.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
       <App />
   </ThemeProvider>
  </StrictMode>,
)
