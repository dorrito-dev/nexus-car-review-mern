import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, Text, Badge, Stack, Image, IconButton, Grid, GridItem } from '@chakra-ui/react'
import { ArrowLeft, Zap, Star, DollarSign, Link as LinkIcon, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useNavigate, useLocation } from 'react-router-dom'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

export default function ReadReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCar = location.state?.car;
  const alternativeReviews = location.state?.alternativeReviews || [];
  
  const [activeCar, setActiveCar] = useState(initialCar);

  useEffect(() => {
    if (location.state?.car) {
      setActiveCar(location.state.car)
    }
  }, [location.state?.car])

  if (!activeCar) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <MotionBox 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      maxW="1200px" 
      mx="auto" 
      pb={12}
    >
      {/* Back Button */}
      <MotionBox variants={itemVariants} mb={6}>
        <IconButton 
          variant="ghost" 
          color="var(--accent-muted)" 
          _hover={{ color: 'var(--accent-primary)', bg: 'whiteAlpha.100' }} 
          borderRadius="full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </IconButton>
      </MotionBox>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCar._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero Header Section */}
          <MotionFlex variants={itemVariants} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb={10} gap={6}>
            <Box>
              <Stack direction="row" gap={3} mb={4} wrap="wrap">
                <Text color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" fontSize="sm">
                  {activeCar.make}
                </Text>
                {activeCar.type && (
                  <Badge bg="whiteAlpha.100" color="var(--accent-primary)" px={2} borderRadius="md" fontWeight="500">
                    {activeCar.type}
                  </Badge>
                )}
              </Stack>
              <Heading size="3xl" fontWeight="300" letterSpacing="tight" color="var(--accent-primary)">
                {activeCar.model}
              </Heading>
              {activeCar.user?.name && (
                <Text color="var(--accent-muted)" mt={2} fontSize="sm">
                  Reviewed by <Box as="span" fontWeight="500" color="var(--accent-primary)">{activeCar.user.name}</Box>
                </Text>
              )}
            </Box>

            <Flex align="center" gap={4} bg="var(--bg-surface-elevated)" p={4} borderRadius="2xl" border="1px solid var(--glass-border)">
              <Box>
                <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600">Rating</Text>
                <Text fontSize="2xl" fontWeight="600" color="var(--accent-primary)">{activeCar.rating}</Text>
              </Box>
              <Box h="40px" w="1px" bg="var(--glass-border)"></Box>
              <Flex gap={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    color={activeCar.rating >= star ? 'var(--accent-primary)' : 'var(--accent-muted)'} 
                    fill={activeCar.rating >= star ? 'var(--accent-primary)' : 'transparent'} 
                    strokeWidth={1.5}
                  />
                ))}
              </Flex>
            </Flex>
          </MotionFlex>

          {/* Main Content Layout */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={12}>
            {/* Left Column: Editorial Content */}
            <GridItem as={motion.div} variants={itemVariants}>
              <Box className="glass-panel" p={0} overflow="hidden" mb={8} h="400px" borderRadius="3xl">
                <Image src={activeCar.images && activeCar.images.length > 0 ? activeCar.images[0] : 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000'} w="100%" h="100%" objectFit="cover" filter="grayscale(15%)" />
              </Box>

              <Box color="var(--accent-primary)" sx={{ p: { mb: 6, fontSize: 'lg', lineHeight: '1.8', color: 'var(--accent-muted)' }, h2: { fontSize: '2xl', fontWeight: '500', mb: 4, mt: 8, color: 'var(--accent-primary)' } }}>
                <Text whiteSpace="pre-wrap" fontSize="lg" lineHeight="1.8" color="var(--accent-muted)">
                  {activeCar.content}
                </Text>
              </Box>
            </GridItem>

            {/* Right Column: Meta Info & Specs */}
            <GridItem as={motion.div} variants={itemVariants}>
              <Stack gap={8}>
                
                {/* Vehicle Data Card */}
                <Box className="glass-panel" p={6}>
                  <Text fontSize="sm" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" mb={6}>
                    Vehicle Data
                  </Text>
                  <Stack gap={5}>
                    <Flex align="center" gap={4}>
                      <Box p={2} bg="whiteAlpha.100" borderRadius="md"><DollarSign size={18} color="var(--accent-primary)"/></Box>
                      <Box>
                        <Text fontSize="xs" color="var(--accent-muted)">Market Price</Text>
                        <Text fontWeight="500">{activeCar.price}</Text>
                      </Box>
                    </Flex>
                    {activeCar.referenceLink && (
                      <Flex align="center" gap={4}>
                        <Box p={2} bg="whiteAlpha.100" borderRadius="md"><LinkIcon size={18} color="var(--accent-primary)"/></Box>
                        <Box>
                          <Text fontSize="xs" color="var(--accent-muted)">Reference Link</Text>
                          <Text as="a" href={activeCar.referenceLink} target="_blank" rel="noopener noreferrer" fontWeight="500" color="var(--accent-primary)" _hover={{ textDecoration: 'underline' }} cursor="pointer">View Official Page</Text>
                        </Box>
                      </Flex>
                    )}
                  </Stack>
                </Box>

                {/* Key Specs Card */}
                {activeCar.keySpecs && (
                  <Box className="glass-panel" p={6}>
                    <Text fontSize="sm" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" mb={6}>
                      Key Specifications
                    </Text>
                    <Flex gap={3} align="flex-start">
                      <Box p={2} bg="whiteAlpha.100" borderRadius="md" mt={1}>
                        <FileText size={18} color="var(--accent-primary)"/>
                      </Box>
                      <Text fontSize="sm" color="var(--accent-muted)" lineHeight="1.6" whiteSpace="pre-wrap">
                        {activeCar.keySpecs}
                      </Text>
                    </Flex>
                  </Box>
                )}

              </Stack>
            </GridItem>
          </Grid>
        </motion.div>
      </AnimatePresence>

      {/* Alternative Perspectives */}
      {alternativeReviews.length > 1 && (
        <Box mt={16} pt={10} borderTop="1px solid var(--glass-border)">
          <Text fontSize="sm" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" mb={8}>
            Alternative Perspectives
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {alternativeReviews.filter(r => r._id !== activeCar._id).map(alt => (
              <Box 
                key={alt._id} 
                className="glass-panel" 
                p={5} 
                borderRadius="xl"
                cursor="pointer"
                onClick={() => setActiveCar(alt)}
                _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 30px -10px rgba(0,0,0,0.6)' }}
                transition="all 0.3s ease"
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontWeight="600" color="var(--accent-primary)">{alt.user?.name || 'Reviewer'}</Text>
                  <Flex align="center" gap={1}>
                    <Star size={14} color="var(--accent-primary)" fill="var(--accent-primary)" />
                    <Text fontSize="sm" fontWeight="600">{alt.rating}</Text>
                  </Flex>
                </Flex>
                <Text fontSize="sm" color="var(--accent-muted)" noOfLines={2} lineHeight="1.6">
                  {alt.content}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}

    </MotionBox>
  )
}
