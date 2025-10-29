import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.scss'
import './styles/legacy.css'

import AppLayout from './ui/AppLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import HospitalsPage from './pages/HospitalsPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import RequestsPage from './pages/RequestsPage'
import EmergencyServicesPage from './pages/emergencyServices'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'hospitals', element: <HospitalsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'user-dashboard', element: <UserDashboard /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
      { path: 'hospital-dashboard', element: <HospitalDashboard /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'emergency', element: <EmergencyServicesPage /> },
    ],
  },
])

const container = document.getElementById('app')
if (container) {
  const root = createRoot(container)
  root.render(<RouterProvider router={router} />)
}


