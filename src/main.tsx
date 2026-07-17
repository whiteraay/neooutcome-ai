import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/components/ui/toast'
import { LivePatientsProvider } from '@/hooks/useLivePatients'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LivePatientsProvider>
        <TooltipProvider delayDuration={200}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TooltipProvider>
      </LivePatientsProvider>
    </BrowserRouter>
  </StrictMode>,
)
