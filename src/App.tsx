import { Routes, Route } from 'react-router-dom'
import { DashboardContainer } from '@/components/layout/DashboardContainer'
import { LandingPage } from '@/pages/LandingPage'
import { WelcomeDashboard } from '@/pages/WelcomeDashboard'
import { PatientCommandCenter } from '@/pages/PatientCommandCenter'
import { RegionalDashboard } from '@/pages/RegionalDashboard'

export default function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="app" element={<DashboardContainer />}>
        <Route index element={<WelcomeDashboard />} />
        <Route path="patient" element={<PatientCommandCenter />} />
        <Route path="patient/:patientId" element={<PatientCommandCenter />} />
        <Route path="regional" element={<RegionalDashboard />} />
      </Route>
    </Routes>
  )
}
