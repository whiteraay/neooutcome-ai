import { Routes, Route } from 'react-router-dom'
import { DashboardContainer } from '@/components/layout/DashboardContainer'
import { WelcomeDashboard } from '@/pages/WelcomeDashboard'
import { PatientCommandCenter } from '@/pages/PatientCommandCenter'
import { RegionalDashboard } from '@/pages/RegionalDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardContainer />}>
        <Route index element={<WelcomeDashboard />} />
        <Route path="patient" element={<PatientCommandCenter />} />
        <Route path="patient/:patientId" element={<PatientCommandCenter />} />
        <Route path="regional" element={<RegionalDashboard />} />
      </Route>
    </Routes>
  )
}
