import { useState, useEffect } from 'react'
import { Box, Heading, Text, Input, Textarea, Button, Flex, Stack, SimpleGrid, Spinner, Grid, GridItem, Badge } from '@chakra-ui/react'
import { UploadCloud, Star, PenTool, DollarSign, Link as LinkIcon, AlertTriangle, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/axiosConfig'

export default function UserDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  
  // Form State
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('Sedan') // default type
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [price, setPrice] = useState('')
  const [referenceLink, setReferenceLink] = useState('')
  const [keySpecs, setKeySpecs] = useState('')
  const [images, setImages] = useState([])
  
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // My Posts State
  const [myReviews, setMyReviews] = useState([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [activeTab, setActiveTab] = useState('All') // All, pending, approved, rejected

  const isPending = user?.status === 'pending' || user?.status === 'banned'

  useEffect(() => {
    fetchMyReviews()
  }, [])

  const fetchMyReviews = async () => {
    try {
      const res = await api.get('/reviews/me')
      setMyReviews(res.data)
    } catch (error) {
      alert(`Error fetching history: ${error.response?.data?.message || 'Something went wrong.'}`)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const handleSubmit = async () => {
    if (!make || !model || !rating || !content || !price) {
      alert('Missing Fields: Please provide make, model, price, rating, and review details.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        make,
        model,
        year: year ? parseInt(year) : 2024,
        type,
        rating,
        content,
        price,
        referenceLink,
        keySpecs,
        images
      }

      await api.post('/reviews', payload)
      
      alert('Review Submitted: Your review has been sent for admin approval.')

      // Reset form
      setMake('')
      setModel('')
      setYear('')
      setType('Sedan')
      setRating(0)
      setContent('')
      setPrice('')
      setReferenceLink('')
      setKeySpecs('')
      setImages([])
      
      // Refresh history
      fetchMyReviews()
    } catch (error) {
      alert(`Submission Failed: ${error.response?.data?.message || 'Something went wrong.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Mock Image Upload for now (simulate Cloudinary)
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIsUploading(true)
    
    // Simulate upload delay
    setTimeout(() => {
      setImages([...images, 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000'])
      setIsUploading(false)
      alert('Image Uploaded successfully.')
    }, 1500)
  }

  const inputStyles = {
    bg: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'xl',
    color: 'var(--accent-primary)',
    transition: 'all 0.2s ease',
    _placeholder: { color: 'whiteAlpha.400' },
    _focusWithin: {
      outline: 'none',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
      bg: 'rgba(255, 255, 255, 0.06)'
    }
  }

  const filteredReviews = myReviews.filter(review => {
    if (activeTab === 'All') return true
    return review.status === activeTab.toLowerCase()
  })

  if (isAuthLoading) {
    return (
      <Flex h="60vh" justify="center" align="center">
        <Spinner size="xl" color="var(--accent-primary)" />
      </Flex>
    )
  }

  if (!user) {
    return (
      <Flex h="60vh" justify="center" align="center" direction="column" gap={4}>
         <Heading size="md" color="var(--accent-muted)">Authentication required to view your dashboard.</Heading>
      </Flex>
    )
  }

  return (
    <Box maxW="1400px" mx="auto">
      {isPending && (
        <Flex 
          bg="rgba(255, 165, 0, 0.1)" 
          border="1px solid rgba(255, 165, 0, 0.3)" 
          p={4} 
          borderRadius="xl" 
          mb={8} 
          align="center" 
          gap={3}
          color="orange.300"
        >
          <AlertTriangle size={20} />
          <Text fontWeight="500">Your account is pending Admin approval. You cannot submit public reviews yet.</Text>
        </Flex>
      )}

      <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr 1fr' }} gap={10} alignItems="start">
        
        {/* Left Panel: History & Profile */}
        <GridItem pr={{ lg: 8 }} borderRight={{ lg: '1px solid var(--glass-border)' }}>
          <Box mb={8} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Box w="80px" h="80px" borderRadius="full" bg="whiteAlpha.100" mb={4} display="flex" alignItems="center" justifyContent="center" border="1px solid var(--glass-border)">
              <Text fontSize="2xl" fontWeight="500" color="var(--accent-primary)">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'DR'}
              </Text>
            </Box>
            <Heading size="sm" mb={1} fontWeight="600" letterSpacing="tight">{user?.name || 'Driver Nexus'}</Heading>
            <Text color="var(--accent-muted)" fontSize="xs">Enthusiast Reviewer</Text>
          </Box>

          <Box>
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="var(--accent-muted)" mb={4} fontWeight="600">
              My Posts
            </Text>
            
            {/* Tabs / Pills */}
            <Flex gap={2} mb={6} flexWrap="wrap">
              {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
                <Box
                  key={tab}
                  as="button"
                  onClick={() => setActiveTab(tab)}
                  px={3} py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="600"
                  transition="all 0.2s"
                  bg={activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}
                  color={activeTab === tab ? 'black' : 'var(--accent-muted)'}
                  _hover={activeTab !== tab ? { bg: 'rgba(255,255,255,0.1)', color: 'white' } : {}}
                >
                  {tab}
                </Box>
              ))}
            </Flex>

            {isLoadingReviews ? (
              <Flex justify="center" py={10}>
                <Spinner size="md" color="var(--accent-muted)" />
              </Flex>
            ) : filteredReviews.length === 0 ? (
              <Text fontSize="sm" color="var(--accent-muted)" textAlign="center" py={6}>No reviews found.</Text>
            ) : (
              <Stack gap={4}>
                <AnimatePresence mode="popLayout">
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Box 
                        p={4} 
                        bg="rgba(255,255,255,0.03)" 
                        borderRadius="xl" 
                        border="1px solid"
                        borderColor={review.status === 'rejected' ? 'red.800' : 'var(--glass-border)'}
                      >
                      <Flex justify="space-between" align="start" mb={2}>
                        <Text fontSize="sm" fontWeight="600" color="var(--accent-primary)">{review.make} {review.model}</Text>
                        <Badge 
                          colorScheme={review.status === 'approved' ? 'green' : review.status === 'rejected' ? 'red' : 'orange'} 
                          variant="subtle" 
                          fontSize="2xs" 
                          px={2} py={0.5} 
                          borderRadius="full"
                        >
                          {review.status}
                        </Badge>
                      </Flex>
                      <Text fontSize="xs" color="var(--accent-muted)" mb={review.status === 'rejected' && review.adminMessage ? 3 : 0}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>

                      {review.status === 'rejected' && review.adminMessage && (
                        <Flex mt={3} p={3} bg="red.900" color="red.100" borderRadius="md" fontSize="xs" gap={2} align="start">
                          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <Box>
                            <Text fontWeight="600" mb={1}>Admin Feedback:</Text>
                            <Text>{review.adminMessage}</Text>
                          </Box>
                        </Flex>
                      )}
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            )}
          </Box>
        </GridItem>

        {/* Center Panel: The Canvas */}
        <GridItem className="glass-panel" p={{ base: 6, md: 10 }} opacity={isPending ? 0.6 : 1} pointerEvents={isPending ? 'none' : 'auto'}>
          <Box mb={8}>
            <Heading size="xl" mb={2} fontWeight="400" letterSpacing="tight">Draft a Review</Heading>
            <Text color="var(--accent-muted)">Share your detailed driving experience with the community.</Text>
          </Box>

          <Stack gap={8}>
            {/* Make / Model / Year */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Make</Text>
                <Input 
                  placeholder="e.g. Porsche" 
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  variant="unstyled" 
                  p={4}
                  {...inputStyles}
                  bg="transparent"
                  className="bg-transparent"
                />
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Model</Text>
                <Input 
                  placeholder="e.g. 911 GT3" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  variant="unstyled" 
                  p={4}
                  {...inputStyles}
                  bg="transparent"
                  className="bg-transparent"
                />
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Year</Text>
                <Input 
                  placeholder="e.g. 2024"
                  type="number" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  variant="unstyled" 
                  p={4}
                  {...inputStyles}
                  bg="transparent"
                  className="bg-transparent"
                />
              </Box>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Body Type</Text>
                <Box position="relative">
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      color: 'var(--accent-primary)',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Sedan" style={{ background: '#0F1115' }}>Sedan</option>
                    <option value="SUV" style={{ background: '#0F1115' }}>SUV</option>
                    <option value="Performance" style={{ background: '#0F1115' }}>Performance</option>
                    <option value="Luxury" style={{ background: '#0F1115' }}>Luxury</option>
                  </select>
                </Box>
              </Box>
            </SimpleGrid>

            {/* Rating */}
            <Box>
              <Text mb={3} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Your Rating</Text>
              <Flex gap={3}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Box
                    key={star}
                    as="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    transition="var(--transition-smooth)"
                    transform={(hoveredStar || rating) >= star ? 'scale(1.1)' : 'scale(1)'}
                  >
                    <Star
                      size={28}
                      color={(hoveredStar || rating) >= star ? 'var(--accent-primary)' : 'var(--accent-muted)'}
                      fill={(hoveredStar || rating) >= star ? 'var(--accent-primary)' : 'transparent'}
                      strokeWidth={1.5}
                      transition="var(--transition-smooth)"
                    />
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Review Details Textarea */}
            <Box>
              <Text mb={3} fontSize="sm" fontWeight="600" color="var(--accent-primary)">Review Details</Text>
              <Textarea 
                placeholder="How does it handle corners? What's the interior quality like? Dive deep into the driving dynamics and tactile experience..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                minH="350px"
                lineHeight="1.6"
                fontSize="md"
                variant="unstyled" 
                p={6}
                bg="rgba(255, 255, 255, 0.06)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                color="var(--accent-primary)"
                boxShadow="inset 0 2px 10px rgba(0,0,0,0.2)"
                transition="all 0.2s ease"
                _placeholder={{ color: 'whiteAlpha.500' }}
                _focusWithin={{
                  outline: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  bg: 'rgba(255, 255, 255, 0.08)'
                }}
              />
            </Box>

            {/* Submit CTA */}
            <Flex justify="flex-end" mt={2}>
              <motion.button
                whileHover={{ y: -1, boxShadow: '0 10px 25px -5px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting || isPending}
                style={{
                  width: 'auto',
                  height: '54px',
                  padding: '0 40px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  color: 'black',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,1) 100%)',
                  cursor: isSubmitting || isPending ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || isPending ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? (
                  <Flex align="center" gap={3}>
                    <Spinner size="sm" color="black" />
                    Processing...
                  </Flex>
                ) : (
                  'Submit for Approval'
                )}
              </motion.button>
            </Flex>
          </Stack>
        </GridItem>

        {/* Right Panel: Metadata */}
        <GridItem opacity={isPending ? 0.6 : 1} pointerEvents={isPending ? 'none' : 'auto'}>
          <Stack gap={8}>
            {/* Image Upload */}
            <Box className="glass-panel" p={6}>
              <Text mb={4} fontSize="sm" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest">Imagery</Text>
              
              <Box position="relative">
                <Input 
                  type="file"
                  accept="image/*"
                  position="absolute"
                  top={0} left={0} w="100%" h="100%"
                  opacity={0}
                  cursor="pointer"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  zIndex={2}
                />
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  p={8} 
                  border="1px dashed rgba(255, 255, 255, 0.15)" 
                  borderRadius="xl"
                  bg="transparent"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  transition="all 0.2s ease"
                >
                  {isUploading ? (
                    <Spinner size="md" color="var(--accent-primary)" mb={2}/>
                  ) : (
                    <UploadCloud size={32} color="var(--accent-muted)" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                  )}
                  <Text fontWeight="500" color="var(--accent-primary)" fontSize="sm" textAlign="center" mb={1}>Click to upload</Text>
                  <Text fontSize="xs" color="var(--accent-muted)" textAlign="center">SVG, PNG, JPG (max 5MB)</Text>
                </Flex>
              </Box>

              {images.length > 0 && (
                <Flex gap={2} mt={4} wrap="wrap">
                  {images.map((img, idx) => (
                    <Box key={idx} w="60px" h="60px" borderRadius="lg" overflow="hidden" border="1px solid var(--glass-border)">
                      <img src={img} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>

            {/* Technical Specifications */}
            <Box className="glass-panel" p={6} bg="rgba(0, 0, 0, 0.2)">
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="var(--accent-muted)" mb={5} fontWeight="600">
                Tech Specs
              </Text>
              
              <Stack gap={5}>
                <Box>
                  <Text mb={2} fontSize="xs" fontWeight="500" color="var(--accent-muted)">Market Price</Text>
                  <Flex align="center" p={3} {...inputStyles}>
                    <DollarSign size={16} color="var(--accent-muted)" style={{ marginRight: '8px' }} />
                    <Input 
                      variant="unstyled" 
                      placeholder="e.g. 194,900" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      _placeholder={{ color: 'whiteAlpha.400' }}
                      _focus={{ outline: 'none' }}
                      w="100%"
                      bg="transparent"
                      className="bg-transparent"
                    />
                  </Flex>
                </Box>
                <Box>
                  <Text mb={2} fontSize="xs" fontWeight="500" color="var(--accent-muted)">Reference Link</Text>
                  <Flex align="center" p={3} {...inputStyles}>
                    <LinkIcon size={16} color="var(--accent-muted)" style={{ marginRight: '8px' }} />
                    <Input 
                      variant="unstyled" 
                      placeholder="e.g. https://porsche.com" 
                      value={referenceLink}
                      onChange={(e) => setReferenceLink(e.target.value)}
                      _placeholder={{ color: 'whiteAlpha.400' }}
                      _focus={{ outline: 'none' }}
                      w="100%"
                      bg="transparent"
                      className="bg-transparent"
                    />
                  </Flex>
                </Box>
                <Box>
                  <Text mb={2} fontSize="xs" fontWeight="500" color="var(--accent-muted)">Key Specs</Text>
                  <Textarea 
                    placeholder="e.g. Range: 300 miles, 0-60mph: 2.6s..." 
                    value={keySpecs}
                    onChange={(e) => setKeySpecs(e.target.value)}
                    rows={3}
                    variant="unstyled" 
                    p={3}
                    {...inputStyles}
                    fontSize="sm"
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </GridItem>

      </Grid>
    </Box>
  )
}
