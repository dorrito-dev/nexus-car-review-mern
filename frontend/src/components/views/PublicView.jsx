import { useState, useMemo } from 'react'
import { Box, Flex, Grid, GridItem, Heading, Text, Stack, Badge, Image, IconButton } from '@chakra-ui/react'
import { Star, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchWidget from './SearchWidget'
import PriceSlider from './PriceSlider'

const mockCars = [
  {
    id: 1,
    make: 'Porsche',
    model: 'Taycan Turbo S',
    year: 2024,
    rating: 4.9,
    price: '$194,900',
    rawPrice: 194900,
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop',
    tags: ['Electric', 'Performance']
  },
  {
    id: 2,
    make: 'Audi',
    model: 'e-tron GT',
    year: 2024,
    rating: 4.7,
    price: '$106,395',
    rawPrice: 106395,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop',
    tags: ['Electric', 'Sedan']
  },
  {
    id: 3,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    rating: 4.8,
    price: '$89,990',
    rawPrice: 89990,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2000&auto=format&fit=crop',
    tags: ['Electric', 'Sedan']
  },
  {
    id: 4,
    make: 'Porsche',
    model: 'Macan EV',
    year: 2024,
    rating: 4.6,
    price: '$78,800',
    rawPrice: 78800,
    image: 'https://images.unsplash.com/photo-1503376712351-4089304323f4?q=80&w=2000&auto=format&fit=crop',
    tags: ['Electric', 'SUV']
  }
]

const CAR_TYPES = ['Sedan', 'SUV', 'Performance', 'Luxury']

export default function PublicView({ onReadReview }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 50000, max: 250000 })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const availableBrands = useMemo(() => Array.from(new Set(mockCars.map(c => c.make))), [])
  const isFilterActive = selectedType !== '' || selectedBrand !== '' || priceRange.min > 50000 || priceRange.max < 250000

  const filteredCars = useMemo(() => {
    return mockCars.filter(car => {
      if (selectedType && !car.tags.includes(selectedType)) return false
      if (selectedBrand && car.make !== selectedBrand) return false
      if (car.rawPrice < priceRange.min || car.rawPrice > priceRange.max) return false
      return true
    })
  }, [selectedType, selectedBrand, priceRange])

  const clearFilters = () => {
    setSelectedType('')
    setSelectedBrand('')
    setPriceRange({ min: 50000, max: 250000 })
  }

  const FilterControls = () => (
    <Stack gap={6} w="100%">
      <Box>
        <Text fontSize="xs" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" mb={3}>
          Car Type
        </Text>
        <Flex gap={2} overflowX="auto" pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          {CAR_TYPES.map(type => {
            const isActive = selectedType === type
            return (
              <Box
                key={type}
                as="button"
                onClick={() => setSelectedType(isActive ? '' : type)}
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="500"
                transition="all 0.2s ease"
                bg={isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}
                color={isActive ? 'black' : 'white'}
                border="1px solid"
                borderColor={isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}
                whiteSpace="nowrap"
                _hover={!isActive && { bg: 'rgba(255,255,255,0.1)' }}
              >
                {type}
              </Box>
            )
          })}
        </Flex>
      </Box>

      <Box>
        <Text fontSize="xs" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" mb={3}>
          Brand
        </Text>
        <Box
          as="select"
          w="100%"
          p={3}
          borderRadius="xl"
          bg="rgba(255, 255, 255, 0.04)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          color="white"
          fontSize="sm"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          css={{
            '& option': {
              background: 'var(--bg-surface)',
              color: 'white'
            }
          }}
          _focus={{ outline: 'none', borderColor: 'var(--accent-primary)' }}
        >
          <option value="">All Brands</option>
          {availableBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </Box>
      </Box>

      <Box px={2}>
        <Text fontSize="xs" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" mb={2}>
          Price Range
        </Text>
        <PriceSlider 
          min={50000} 
          max={250000} 
          onChange={(val) => setPriceRange(val)} 
        />
      </Box>
    </Stack>
  )

  return (
    <Box position="relative">
      <SearchWidget />

      {/* Hero Section */}
      <Box 
        className="glass-panel" 
        p={{ base: 6, md: 16 }} 
        mb={8} 
        position="relative" 
        overflow="hidden"
        minH={{ base: '350px', md: '450px' }}
        display="flex"
        alignItems="center"
        borderRadius="3xl"
      >
        <Box 
          position="absolute" 
          top={0} left={0} right={0} bottom={0} 
          bgImage={`url(${mockCars[0].image})`}
          bgSize="cover"
          bgPosition="center"
          opacity={0.15}
          zIndex={0}
          filter="grayscale(100%)"
        />
        <Box 
          position="absolute" 
          top={0} left={0} right={0} bottom={0} 
          bg="linear-gradient(to right, var(--bg-surface) 0%, rgba(22, 25, 32, 0.4) 100%)"
          zIndex={1}
        />
        
        <Box position="relative" zIndex={2} maxW="600px">
          <Badge bg="var(--accent-primary)" color="var(--bg-base)" mb={6} px={4} py={1.5} borderRadius="full" fontWeight="600" textTransform="uppercase" letterSpacing="wider" fontSize="xs">
            Editorial Review
          </Badge>
          <Heading as="h1" size={{ base: '3xl', md: '4xl' }} mb={4} fontWeight="300" letterSpacing="tight" lineHeight="1.1">
            Silence.<br/>
            <Box as="span" fontWeight="700" color="var(--accent-primary)">Reimagined.</Box>
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="var(--accent-muted)" mb={8} maxW="400px" lineHeight="1.6">
            Explore the raw power of electric acceleration wrapped in an uncompromisingly minimal cabin.
          </Text>
          <Flex gap={4}>
            <Box as="button" onClick={() => onReadReview(mockCars[0])} bg="var(--accent-primary)" color="var(--bg-base)" px={8} py={3.5} borderRadius="full" fontWeight="600" _hover={{ opacity: 0.9 }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
              Read Review
            </Box>
            <Box as="button" bg="transparent" border="1px solid var(--glass-border)" color="var(--accent-primary)" px={8} py={3.5} borderRadius="full" fontWeight="600" _hover={{ bg: 'whiteAlpha.100' }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
              Gallery
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Filter Toggle Button */}
      <Flex justify="flex-end" mb={6}>
        <Box
          as="button"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          display="flex"
          alignItems="center"
          gap={2}
          bg="rgba(255,255,255,0.05)"
          border="1px solid var(--glass-border)"
          px={5}
          py={2.5}
          borderRadius="full"
          color={isFilterActive ? 'var(--accent-primary)' : 'white'}
          transition="var(--transition-smooth)"
          _hover={{ bg: 'rgba(255,255,255,0.1)' }}
        >
          <SlidersHorizontal size={18} />
          <Text fontSize="sm" fontWeight="500">Filters</Text>
          {isFilterActive && <Box w={2} h={2} borderRadius="full" bg="var(--accent-primary)" boxShadow="0 0 8px var(--accent-primary)" />}
        </Box>
      </Flex>

      {/* Collapsible Filter Panel (Desktop & Mobile Unified) */}
      <AnimatePresence>
        {isFiltersOpen && (
          <Box
            as={motion.div}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            overflow="hidden"
            mb={8}
          >
            <Box
              bg="rgba(15, 17, 21, 0.7)"
              backdropFilter="blur(16px)"
              border="1px solid var(--glass-border)"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              boxShadow="0 20px 40px rgba(0,0,0,0.4)"
            >
              <Flex justify="space-between" align="center" mb={6} display={{ base: 'flex', md: 'none' }}>
                <Heading size="sm">Filters</Heading>
                <IconButton 
                  icon={<X size={18} />} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFiltersOpen(false)}
                  color="var(--accent-muted)"
                />
              </Flex>
              
              <Flex gap={{ base: 6, md: 10 }} direction={{ base: 'column', md: 'row' }} align="flex-start">
                <Box flex="2" w="100%"><FilterControls /></Box>
                <Box flex="1" display="flex" flexDirection="column" alignItems={{ base: 'flex-start', md: 'flex-end' }} justify={{ md: 'center' }} h="100%" pt={{ base: 4, md: 8 }} w="100%">
                  <AnimatePresence>
                    {isFilterActive && (
                      <Box
                        as={motion.button}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clearFilters}
                        color="var(--accent-primary)"
                        fontSize="sm"
                        fontWeight="600"
                        bg="rgba(255,255,255,0.05)"
                        px={4}
                        py={2}
                        borderRadius="full"
                        _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                        transition="all 0.2s ease"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        w={{ base: '100%', md: 'auto' }}
                        justifyContent={{ base: 'center', md: 'flex-end' }}
                      >
                        <X size={16} /> Clear All Filters
                      </Box>
                    )}
                  </AnimatePresence>
                </Box>
              </Flex>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Car Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
        <AnimatePresence>
          {filteredCars.map(car => (
            <GridItem 
              as={motion.div}
              key={car.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              layout
              className="glass-panel" 
              p={3} 
              borderRadius="2xl" 
              position="relative" 
              _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.8)' }}
            >
              <Box h="220px" overflow="hidden" position="relative" borderRadius="xl" mb={4}>
                <Image src={car.image} w="100%" h="100%" objectFit="cover" transition="transform 0.6s ease" _hover={{ transform: 'scale(1.05)' }} filter="grayscale(20%)" />
                <Badge position="absolute" top={3} right={3} bg="rgba(0,0,0,0.6)" color="white" backdropFilter="blur(8px)" borderRadius="full" px={3} py={1.5} display="flex" alignItems="center" gap={1.5} fontWeight="600">
                  <Star size={12} color="var(--accent-primary)" fill="var(--accent-primary)" strokeWidth={1.5} />
                  {car.rating}
                </Badge>
              </Box>
              <Box px={2} pb={2}>
                <Stack direction="row" mb={3} wrap="wrap">
                  {car.tags.map(tag => (
                    <Text key={tag} fontSize="xs" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="wider" fontWeight="600">
                      {tag}
                    </Text>
                  ))}
                </Stack>
                <Heading size="lg" mb={1} fontWeight="600" letterSpacing="tight">{car.model}</Heading>
                <Flex justify="space-between" align="center" mt={4}>
                  <Text color="var(--accent-muted)" fontSize="sm">{car.make} • {car.year}</Text>
                  <Text color="var(--accent-primary)" fontWeight="500">{car.price}</Text>
                </Flex>
                <Box mt={4} as="button" w="100%" onClick={() => onReadReview(car)} bg="whiteAlpha.100" color="var(--accent-primary)" px={4} py={2} borderRadius="xl" fontWeight="500" _hover={{ bg: 'whiteAlpha.200' }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
                  Read Review
                </Box>
              </Box>
            </GridItem>
          ))}
        </AnimatePresence>
      </Grid>
      
      {filteredCars.length === 0 && (
        <Flex direction="column" align="center" justify="center" py={20} color="var(--accent-muted)">
          <Text fontSize="lg" mb={4}>No vehicles match your criteria.</Text>
          <Box as="button" onClick={clearFilters} color="var(--accent-primary)" fontWeight="500">
            Clear filters to see all reviews
          </Box>
        </Flex>
      )}
    </Box>
  )
}
