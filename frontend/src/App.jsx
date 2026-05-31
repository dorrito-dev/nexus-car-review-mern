import { useState } from 'react'
import { ChakraProvider, defaultSystem, Box } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/navigation/Navbar'
import PublicView from './components/views/PublicView'
import UserDashboard from './components/views/UserDashboard'
import AdminPanel from './components/views/AdminPanel'
import ReadReview from './components/views/ReadReview'

import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('public')
  const [selectedCar, setSelectedCar] = useState(null)

  const handleReadReview = (car) => {
    setSelectedCar(car)
    setCurrentView('read')
  }

  const handleBackToPublic = () => {
    setCurrentView('public')
    setTimeout(() => setSelectedCar(null), 300) // Clear after exit animation
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <Box w="100%" minH="100vh">
        <Navbar 
          currentView={currentView === 'read' ? 'public' : currentView} 
          setCurrentView={(view) => {
            if (currentView === 'read') setSelectedCar(null)
            setCurrentView(view)
          }} 
        />
        
        {/* Main Content Area */}
        <Box pt="100px" pb="4rem" px={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
          <AnimatePresence mode="wait">
            {currentView === 'public' && (
              <motion.div
                key="public"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <PublicView onReadReview={handleReadReview} />
              </motion.div>
            )}

            {currentView === 'user' && (
              <motion.div
                key="user"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <UserDashboard />
              </motion.div>
            )}

            {currentView === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <AdminPanel />
              </motion.div>
            )}

            {currentView === 'read' && (
              <motion.div
                key="read"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ReadReview car={selectedCar} onBack={handleBackToPublic} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
