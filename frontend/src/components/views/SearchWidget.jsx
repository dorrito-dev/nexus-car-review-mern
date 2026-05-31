import React, { useState, useEffect, useRef } from 'react'
import { Box, Flex, Input, IconButton, Kbd } from '@chakra-ui/react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchWidget({ searchQuery, setSearchQuery, onFilterClick }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isScrolled) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => inputRef.current?.focus(), 400)
        } else {
          inputRef.current?.focus()
        }
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        if (isScrolled) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => inputRef.current?.focus(), 400)
        } else {
          inputRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isScrolled])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFabClick = () => {
    if (isScrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }

  return (
    <Box
      as={motion.div}
      position={isScrolled ? 'fixed' : 'relative'}
      bottom={isScrolled ? '32px' : 'auto'}
      right={isScrolled ? '32px' : '0'}
      left={isScrolled ? 'auto' : '0'}
      top={isScrolled ? 'auto' : '0'}
      zIndex={150}
      mx={isScrolled ? 0 : 'auto'}
      className={isScrolled ? 'fab-pulse' : ''}
      borderRadius={isScrolled ? 'full' : '0'}
      initial={false}
      animate={{
        width: isScrolled ? 56 : '100%',
        maxWidth: isScrolled ? 56 : 600,
        height: isScrolled ? 56 : 'auto',
        y: isScrolled ? 0 : 20,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      mb={isScrolled ? 0 : 12}
    >
      <Flex 
        p={isScrolled ? 0 : 2} 
        borderRadius="full" 
        align="center" 
        justify={isScrolled ? 'center' : 'flex-start'}
        h={isScrolled ? '100%' : 'auto'}
        w="100%"
        boxShadow={isFocused ? '0 0 0 1px var(--accent-muted), 0 8px 32px -4px rgba(0,0,0,0.8)' : '0 8px 32px -4px rgba(0,0,0,0.5)'}
        bg={isScrolled ? 'rgba(15, 17, 21, 0.85)' : 'rgba(22, 25, 32, 0.4)'}
        backdropFilter={isScrolled ? 'blur(24px)' : 'blur(16px)'}
        border="1px solid var(--glass-border)"
        transition="var(--transition-smooth)"
        cursor={isScrolled ? 'pointer' : 'default'}
        onClick={handleFabClick}
        _hover={isScrolled ? { bg: 'rgba(25, 29, 36, 0.95)', transform: 'translateY(-2px)' } : {}}
      >
        <Box pl={isScrolled ? 0 : 4} color="var(--accent-primary)">
          <Search size={20} strokeWidth={2} />
        </Box>
        
        <AnimatePresence>
          {!isScrolled && (
            <Box as={motion.div} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '100%' }} exit={{ opacity: 0, width: 0 }} display="flex" flex={1} overflow="hidden">
              <Input 
                ref={inputRef}
                flex={1}
                variant="unstyled" 
                placeholder="Search minimal models..." 
                px={4} 
                color="var(--accent-primary)"
                _placeholder={{ color: 'whiteAlpha.600' }}
                className="minimal-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="transparent"
                border="none"
                _focus={{ outline: 'none', boxShadow: 'none' }}
              />
              
              <AnimatePresence>
                {!isFocused && (
                  <Box
                    as={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    mr={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Kbd bg="whiteAlpha.100" color="var(--accent-muted)" borderColor="var(--glass-border)" fontSize="xs" px={2} py={1} borderRadius="md">
                      ⌘K
                    </Kbd>
                  </Box>
                )}
              </AnimatePresence>

              <IconButton 
                aria-label="Filter" 
                variant="ghost" 
                borderRadius="full" 
                color="var(--accent-primary)"
                _hover={{ bg: 'whiteAlpha.100' }}
                _active={{ transform: 'scale(0.95)' }}
                transition="var(--transition-smooth)"
                bg="transparent"
                onClick={onFilterClick}
              >
                <SlidersHorizontal size={18} strokeWidth={1.5} />
              </IconButton>
            </Box>
          )}
        </AnimatePresence>
      </Flex>
    </Box>
  )
}
