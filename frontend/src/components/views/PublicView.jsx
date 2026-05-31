import { useState, useMemo, useEffect } from 'react'
import { Box, Flex, Grid, GridItem, Heading, Text, Stack, Badge, Image, IconButton, Spinner } from '@chakra-ui/react'
import { Star, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchWidget from './SearchWidget'
import PriceSlider from './PriceSlider'
import api from '../../utils/axiosConfig'

import { useNavigate } from 'react-router-dom'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const DEFAULT_PRICE_MIN = 0
const DEFAULT_PRICE_MAX = 5000000

export default function PublicView() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: DEFAULT_PRICE_MIN, max: DEFAULT_PRICE_MAX })
  const [searchQuery, setSearchQuery] = useState('')
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

  const availableBrands = useMemo(() => Array.from(new Set(reviews.map(c => c.make).filter(Boolean))), [reviews])
  const availableTypes = useMemo(() => Array.from(new Set(reviews.map(c => c.type).filter(Boolean))), [reviews])

  const isFilterActive = selectedType !== '' || selectedBrand !== '' || priceRange.min > DEFAULT_PRICE_MIN || priceRange.max < DEFAULT_PRICE_MAX || searchQuery !== ''

  const filteredReviews = useMemo(() => {
    return reviews.filter(car => {
      const lowerCaseQuery = searchQuery.toLowerCase()
      const makeStr = car.make || ''
      const modelStr = car.model || ''

      const matchesSearch =
        makeStr.toLowerCase().includes(lowerCaseQuery) ||
        modelStr.toLowerCase().includes(lowerCaseQuery)

      const matchesBrand = selectedBrand === "" || car.make === selectedBrand
      const matchesType = selectedType === "" || car.type === selectedType

      const priceVal = car.price ? parseInt(String(car.price).replace(/[^0-9]/g, '')) : 0
      const matchesPrice = (priceRange.min === DEFAULT_PRICE_MIN && priceRange.max === DEFAULT_PRICE_MAX) ||
        (priceVal >= priceRange.min && priceVal <= priceRange.max)

      return matchesSearch && matchesBrand && matchesType && matchesPrice
    })
  }, [searchQuery, selectedType, selectedBrand, priceRange, reviews])

  const groupedReviews = useMemo(() => {
    const groups = {}
    filteredReviews.forEach(car => {
      const makeStr = car.make || ''
      const modelStr = car.model || ''
      const key = `${makeStr.toLowerCase().trim()}-${modelStr.toLowerCase().trim()}`

      if (!groups[key]) {
        groups[key] = {
          primaryReview: car,
          allReviews: []
        }
      }

      groups[key].allReviews.push(car)

      if (car.rating > groups[key].primaryReview.rating) {
        groups[key].primaryReview = car
      }
    })
    return Object.values(groups)
  }, [filteredReviews])

  const clearFilters = () => {
    setSelectedType('')
    setSelectedBrand('')
    setSearchQuery('')
    setPriceRange({ min: DEFAULT_PRICE_MIN, max: DEFAULT_PRICE_MAX })
  }

  const featuredReviews = reviews.slice(0, 5) // Grab up to 5 latest for the carousel

  const FilterControls = () => (
    <Stack gap={6} w="100%">
      <Box>
        <Text fontSize="xs" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" mb={3}>
          Car Type
        </Text>
        <Flex gap={2} overflowX="auto" pb={2} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          {availableTypes.length === 0 && <Text fontSize="sm" color="var(--accent-muted)">No types available</Text>}
          {availableTypes.map(type => {
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
                _hover={!isActive ? { bg: 'rgba(255,255,255,0.1)' } : {}}
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
          min={DEFAULT_PRICE_MIN}
          max={DEFAULT_PRICE_MAX}
          initialValue={[priceRange.min, priceRange.max]}
          onChangeEnd={(val) => setPriceRange({ min: val[0], max: val[1] })}
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
      <SearchWidget
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => setIsFiltersOpen(!isFiltersOpen)}
      />

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
                    minH="350px"
                    maxH="500px"
                    height={{ base: "40vh", md: "50vh", lg: "60vh" }}
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
                      bg="blackAlpha.700"
                      zIndex={1}
                      sx={{
                        backdropFilter: 'blur(12px)',
                        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 80%)',
                        maskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 80%)'
                      }}
                    />

                    {/* Anchor text to bottom left */}
                    <Stack position="relative" zIndex={2} h="100%" w="100%" justify="flex-end" align="flex-start" p={{ base: 6, md: 12 }} gap={4}>
                      <Heading as="h1" size={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="white" letterSpacing="tight" lineHeight="1.1" textShadow="0px 4px 12px rgba(0, 0, 0, 0.8)">
                        {car.make} <Box as="span" fontWeight="800" color="white">{car.model}</Box>
                      </Heading>

                      <Flex gap={3} flexWrap="wrap" align="center">
                        <Badge bg="blackAlpha.400" color="white" backdropFilter="blur(10px)" px={3} py={1} borderRadius="full" textTransform="none" fontSize="sm" fontWeight="600">
                          {car.price || 'Price upon request'}
                        </Badge>
                        {car.keySpecs && car.keySpecs.split(',').slice(0, 2).map((spec, i) => (
                          <Badge key={i} bg="blackAlpha.400" color="white" backdropFilter="blur(10px)" px={3} py={1} borderRadius="full" textTransform="none" fontSize="sm" fontWeight="500">
                            {spec.trim()}
                          </Badge>
                        ))}
                      </Flex>

                      <Box as="button" mt={2} onClick={() => navigate('/read', { state: { car } })} bg="white" color="black" px={8} py={3.5} borderRadius="full" fontWeight="600" _hover={{ bg: 'gray.200', transform: 'translateY(-2px)' }} transition="all 0.2s">
                        Read Review
                      </Box>
                    </Stack>
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
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
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
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={clearFilters}
                        style={{
                          color: 'var(--accent-primary)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={16} /> Clear All Filters
                      </motion.button>
                    )}
                  </AnimatePresence>
                </Box>
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Car Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
        <AnimatePresence>
          {groupedReviews.map(group => {
            const car = group.primaryReview
            const alternativeReviews = group.allReviews
            const reviewCount = alternativeReviews.length

            const fallbackImg = 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000'
            const displayImg = car.images?.length > 0 ? car.images[0] : fallbackImg
            return (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Box
                  className="glass-panel"
                  p={3}
                  borderRadius="2xl"
                  position="relative"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px -8px rgba(0,0,0,0.8)' }}
                >
                  <Box h="220px" overflow="hidden" position="relative" borderRadius="xl" mb={4}>
                    <Image src={displayImg} w="100%" h="100%" objectFit="cover" transition="transform 0.6s ease" _hover={{ transform: 'scale(1.05)' }} filter="grayscale(20%)" />

                    <Flex position="absolute" top={3} right={3} gap={2}>
                      {reviewCount > 1 && (
                        <Badge bg="whiteAlpha.200" color="white" backdropFilter="blur(4px)" borderRadius="full" px={3} py={1.5} display="flex" alignItems="center" fontWeight="600" textTransform="none">
                          {reviewCount} Reviews
                        </Badge>
                      )}
                      <Badge bg="rgba(0,0,0,0.6)" color="white" backdropFilter="blur(8px)" borderRadius="full" px={3} py={1.5} display="flex" alignItems="center" gap={1.5} fontWeight="600">
                        <Star size={12} color="var(--accent-primary)" fill="var(--accent-primary)" strokeWidth={1.5} />
                        {car.rating}
                      </Badge>
                    </Flex>
                  </Box>
                  <Box px={2} pb={2}>
                    <Heading size="lg" mb={1} fontWeight="600" letterSpacing="tight">{car.model}</Heading>
                    <Flex justify="space-between" align="center" mt={4}>
                      <Text color="var(--accent-muted)" fontSize="sm">{car.make} • {car.year}</Text>
                      <Text color="var(--accent-primary)" fontWeight="500">{car.price || 'N/A'}</Text>
                    </Flex>
                    <Box mt={4} as="button" w="100%" onClick={() => navigate('/read', { state: { car, alternativeReviews } })} bg="whiteAlpha.100" color="var(--accent-primary)" px={4} py={2} borderRadius="xl" fontWeight="500" _hover={{ bg: 'whiteAlpha.200' }} _active={{ transform: 'scale(0.98)' }} transition="var(--transition-smooth)">
                      Read Review
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </Grid>

      {groupedReviews.length === 0 && (
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
