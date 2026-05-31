import { ChakraProvider, defaultSystem, Box } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/navigation/Navbar'
import PublicView from './components/views/PublicView'
import UserDashboard from './components/views/UserDashboard'
import AdminPanel from './components/views/AdminPanel'
import ReadReview from './components/views/ReadReview'
import AuthForms from './components/views/AuthForms'
import ErrorBoundary from './components/ErrorBoundary'

import './index.css'

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null; // Let the dashboard handle its own loading spinner if needed, or wait here
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

function AppRoutes() {
  return (
    <Box w="100%" minH="100vh">
      <Navbar />
      
      <Box pt="100px" pb="4rem" px={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/read" element={<ReadReview />} />
            <Route path="/login" element={<AuthForms />} />
            
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
