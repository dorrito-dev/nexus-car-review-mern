import { useState, useMemo, useEffect } from 'react'
import { Box, Flex, Grid, GridItem, Heading, Text, Stack, Badge, Image, IconButton, Spinner } from '@chakra-ui/react'
import { Star, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchWidget from './SearchWidget'
import PriceSlider from './PriceSlider'
import api from '../../utils/axiosConfig'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const CAR_TYPES = ['Sedan', 'SUV', 'Performance', 'Luxury']

export default function PublicView({ onReadReview }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 50000, max: 250000 })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/reviews/public')
      setReviews(res.data)
    } catch (error) {
      console.error('Failed to fetch public reviews', error)
    } finally {
      setIsLoading(false)
    }
  }

  const availableBrands = useMemo(() => Array.from(new Set(reviews.map(c => c.make))), [reviews])
  const isFilterActive = selectedType !== '' || selectedBrand !== '' || priceRange.min > 50000 || priceRange.max < 250000

  const filteredReviews = useMemo(() => {
    return reviews.filter(car => {
      // In a real app we might match `type` against `car.tags` if tags were implemented on the backend.
      // For now, let's keep the filter generic or skip type filter if not present on schema.
      // Assuming car schema doesn't have tags currently, we just skip it or filter by something else.
      if (selectedBrand && car.make !== selectedBrand) return false
      
      const priceVal = car.price ? parseInt(car.price.replace(/[^0-9]/g, '')) : 0
      if (priceVal > 0 && (priceVal < priceRange.min || priceVal > priceRange.max)) return false
      return true
    })
  }, [selectedType, selectedBrand, priceRange, reviews])

  const clearFilters = () => {
    setSelectedType('')
    setSelectedBrand('')
    setPriceRange({ min: 50000, max: 250000 })
  }

  const featuredReviews = reviews.slice(0, 5) // Grab up to 5 latest for the carousel

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

  if (isLoading) {
    return (
      <Flex h="60vh" justify="center" align="center">
        <Spinner size="xl" color="var(--accent-primary)" />
      </Flex>
    )
  }

  return (
    <Box position="relative">
      <SearchWidget />

      {/* Hero Section / Carousel */}
      {featuredReviews.length > 0 && (
        <Box 
          mb={10} 
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="0 20px 40px rgba(0,0,0,0.5)"
          className="swiper-container-wrapper"
        >
          <Swiper
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={featuredReviews.length > 1}
            style={{ '--swiper-theme-color': 'var(--accent-primary)', '--swiper-navigation-color': 'white' }}
          >
            {featuredReviews.map((car, idx) => {
              const bgImg = car.images?.length > 0 ? car.images[0] : 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000'
              return (
                <SwiperSlide key={car._id}>
                  <Box 
                    className="glass-panel" 
                    p={{ base: 6, md: 16 }} 
                    position="relative" 
                    overflow="hidden"
                    minH={{ base: '400px', md: '500px' }}
                    display="flex"
                    alignItems="center"
                  >
                    <Box 
                      position="absolute" 
                      top={0} left={0} right={0} bottom={0} 
                      bgImage={`url(${bgImg})`}
                      bgSize="cover"
                      bgPosition="center"
                      zIndex={0}
                      filter="grayscale(40%)"
                    />
                    <Box 
                      position="absolute" 
                      top={0} left={0} right={0} bottom={0} 
                      bg="linear-gradient(to top, rgba(15, 17, 21, 1) 0%, rgba(15, 17, 21, 0.4) 50%, rgba(0,0,0,0) 100%)"
                      zIndex={1}
                    />
                    <Box 
                      position="absolute" 
                      top={0} left={0} right={0} bottom={0} 
                      bg="linear-gradient(to right, rgba(15, 17, 21, 0.9) 0%, rgba(15, 17, 21, 0.2) 100%)"
                      zIndex={1}
                    />
                    
                    <Box position="relative" zIndex={2} maxW="600px" pl={{ md: 10 }}>
                      <Badge bg="var(--accent-primary)" color="var(--bg-base)" mb={6} px={4} py={1.5} borderRadius="full" fontWeight="600" textTransform="uppercase" letterSpacing="wider" fontSize="xs">
                        Featured Review
                      </Badge>
                      <Heading as="h1" size={{ base: '3xl', md: '4xl' }} mb={4} fontWeight="300" letterSpacing="tight" lineHeight="1.1">
                        {car.make}<br/>
                        <Box as="span" fontWeight="700" color="var(--accent-primary)">{car.model}</Box>
                      </Heading>
                      <Text fontSize={{ base: 'md', md: 'lg' }} color="var(--accent-muted)" mb={8} maxW="500px" lineHeight="1.6" noOfLines={2}>
                        {car.reviewText}
                      </Text>
                      <Flex gap={4}>
                        <Box as="button" onClick={() => onReadReview(car)} bg="var(--accent-primary)" color="var(--bg-base)" px={8} py={3.5} borderRadius="full" fontWeight="600" _hover={{ opacity: 0.9 }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
                          Read Review
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </Box>
      )}

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
          {filteredReviews.map(car => {
            const fallbackImg = 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000'
            const displayImg = car.images?.length > 0 ? car.images[0] : fallbackImg
            return (
              <GridItem 
                as={motion.div}
                key={car._id} 
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
                  <Image src={displayImg} w="100%" h="100%" objectFit="cover" transition="transform 0.6s ease" _hover={{ transform: 'scale(1.05)' }} filter="grayscale(20%)" />
                  <Badge position="absolute" top={3} right={3} bg="rgba(0,0,0,0.6)" color="white" backdropFilter="blur(8px)" borderRadius="full" px={3} py={1.5} display="flex" alignItems="center" gap={1.5} fontWeight="600">
                    <Star size={12} color="var(--accent-primary)" fill="var(--accent-primary)" strokeWidth={1.5} />
                    {car.rating}
                  </Badge>
                </Box>
                <Box px={2} pb={2}>
                  <Heading size="lg" mb={1} fontWeight="600" letterSpacing="tight">{car.model}</Heading>
                  <Flex justify="space-between" align="center" mt={4}>
                    <Text color="var(--accent-muted)" fontSize="sm">{car.make} • {car.year}</Text>
                    <Text color="var(--accent-primary)" fontWeight="500">{car.price || 'N/A'}</Text>
                  </Flex>
                  <Box mt={4} as="button" w="100%" onClick={() => onReadReview(car)} bg="whiteAlpha.100" color="var(--accent-primary)" px={4} py={2} borderRadius="xl" fontWeight="500" _hover={{ bg: 'whiteAlpha.200' }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
                    Read Review
                  </Box>
                </Box>
              </GridItem>
            )
          })}
        </AnimatePresence>
      </Grid>
      
      {filteredReviews.length === 0 && (
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
