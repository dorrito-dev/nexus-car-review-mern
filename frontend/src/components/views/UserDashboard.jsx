import { useState } from 'react'
import { Box, Heading, Text, Input, Textarea, Button, Flex, Stack, SimpleGrid, Spinner, Grid, GridItem } from '@chakra-ui/react'
import { UploadCloud, Star, PenTool, DollarSign, Link } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UserDashboard() {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
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

  return (
    <Box maxW="1400px" mx="auto">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr 1fr' }} gap={10} alignItems="start">
        
        {/* Left Panel: History & Profile */}
        <GridItem pr={{ lg: 8 }} borderRight={{ lg: '1px solid var(--glass-border)' }}>
          <Box mb={8} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Box w="80px" h="80px" borderRadius="full" bg="whiteAlpha.100" mb={4} display="flex" alignItems="center" justifyContent="center" border="1px solid var(--glass-border)">
              <Text fontSize="2xl" fontWeight="500" color="var(--accent-primary)">DR</Text>
            </Box>
            <Heading size="sm" mb={1} fontWeight="600" letterSpacing="tight">Driver Nexus</Heading>
            <Text color="var(--accent-muted)" fontSize="xs">Enthusiast Reviewer</Text>
          </Box>

          <Box>
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="var(--accent-muted)" mb={4} fontWeight="600">
              Your History
            </Text>
            <Flex justify="space-between" align="center" py={3} borderBottom="1px solid var(--glass-border)">
              <Flex gap={3} align="center"><PenTool size={16} color="var(--accent-muted)"/><Text fontSize="sm" color="var(--accent-muted)">Total Posts</Text></Flex>
              <Text fontWeight="600" fontSize="md">12</Text>
            </Flex>
            <Flex justify="space-between" align="center" py={3}>
              <Flex gap={3} align="center"><Star size={16} color="var(--accent-muted)"/><Text fontSize="sm" color="var(--accent-muted)">Helpful Votes</Text></Flex>
              <Text fontWeight="600" fontSize="md">340</Text>
            </Flex>
          </Box>
        </GridItem>

        {/* Center Panel: The Canvas */}
        <GridItem className="glass-panel" p={{ base: 6, md: 10 }}>
          <Box mb={8}>
            <Heading size="xl" mb={2} fontWeight="400" letterSpacing="tight">Draft a Review</Heading>
            <Text color="var(--accent-muted)">Share your detailed driving experience with the community.</Text>
          </Box>

          <Stack gap={8}>
            {/* Make / Model */}
            <SimpleGrid columns={2} gap={6}>
              <Box>
                <Text mb={2} fontSize="sm" fontWeight="500" color="var(--accent-muted)">Make</Text>
                <Input 
                  placeholder="e.g. Porsche" 
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
                  variant="unstyled" 
                  p={4}
                  {...inputStyles}
                  bg="transparent"
                  className="bg-transparent"
                />
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
              <Button 
                as={motion.button}
                whileHover={{ y: -1, boxShadow: '0 10px 25px -5px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg" 
                bg="linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,1) 100%)" 
                color="black" 
                fontWeight="600" 
                borderRadius="full"
                px={10}
                h="54px"
                transition="all 0.2s ease"
                _disabled={{ opacity: 0.7, cursor: 'not-allowed', bg: 'var(--accent-muted)' }}
                _hover={{ opacity: 0.95 }}
                w={{ base: '100%', md: 'auto' }}
              >
                {isSubmitting ? (
                  <Flex align="center" gap={3}>
                    <Spinner size="sm" color="black" />
                    Processing...
                  </Flex>
                ) : (
                  'Submit for Approval'
                )}
              </Button>
            </Flex>
          </Stack>
        </GridItem>

        {/* Right Panel: Metadata */}
        <GridItem>
          <Stack gap={8}>
            {/* Image Upload */}
            <Box className="glass-panel" p={6}>
              <Text mb={4} fontSize="sm" fontWeight="600" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest">Imagery</Text>
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                p={8} 
                border="1px dashed rgba(255, 255, 255, 0.15)" 
                borderRadius="xl"
                bg="transparent"
                cursor="pointer"
                _hover={{ bg: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                transition="all 0.2s ease"
              >
                <UploadCloud size={32} color="var(--accent-muted)" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
                <Text fontWeight="500" color="var(--accent-primary)" fontSize="sm" textAlign="center" mb={1}>Click to upload</Text>
                <Text fontSize="xs" color="var(--accent-muted)" textAlign="center">SVG, PNG, JPG (max 5MB)</Text>
              </Flex>
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
                    <Link size={16} color="var(--accent-muted)" style={{ marginRight: '8px' }} />
                    <Input 
                      variant="unstyled" 
                      placeholder="e.g. https://porsche.com" 
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
