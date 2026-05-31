import { Box, Flex, Heading, Text, Badge, Stack, Image, IconButton, Grid, GridItem } from '@chakra-ui/react'
import { ArrowLeft, Zap, Star, DollarSign, Link as LinkIcon, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

export default function ReadReview({ car, onBack }) {
  if (!car) return null

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
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </IconButton>
      </MotionBox>

      {/* Hero Header Section */}
      <MotionFlex variants={itemVariants} direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} mb={10} gap={6}>
        <Box>
          <Stack direction="row" gap={3} mb={4} wrap="wrap">
            <Text color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" fontSize="sm">
              {car.make}
            </Text>
            {car.tags?.map(tag => (
              <Badge key={tag} bg="whiteAlpha.100" color="var(--accent-primary)" px={2} borderRadius="md" fontWeight="500">
                {tag}
              </Badge>
            ))}
          </Stack>
          <Heading size="3xl" fontWeight="300" letterSpacing="tight" color="var(--accent-primary)">
            {car.model}
          </Heading>
        </Box>

        <Flex align="center" gap={4} bg="var(--bg-surface-elevated)" p={4} borderRadius="2xl" border="1px solid var(--glass-border)">
          <Box>
            <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600">Aggregate</Text>
            <Text fontSize="2xl" fontWeight="600" color="var(--accent-primary)">{car.rating}</Text>
          </Box>
          <Box h="40px" w="1px" bg="var(--glass-border)"></Box>
          <Flex gap={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={20} 
                color={car.rating >= star ? 'var(--accent-primary)' : 'var(--accent-muted)'} 
                fill={car.rating >= star ? 'var(--accent-primary)' : 'transparent'} 
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
            <Image src={car.image} w="100%" h="100%" objectFit="cover" filter="grayscale(15%)" />
          </Box>

          <Box color="var(--accent-primary)" sx={{ p: { mb: 6, fontSize: 'lg', lineHeight: '1.8', color: 'var(--accent-muted)' }, h2: { fontSize: '2xl', fontWeight: '500', mb: 4, mt: 8, color: 'var(--accent-primary)' } }}>
            <p>
              The {car.make} {car.model} represents a paradigm shift in how we approach the electric driving experience. For decades, manufacturers have chased the raw emotion of internal combustion, attempting to artificially inject soul into electric drivetrains. With the {car.model}, {car.make} takes a different approach: they let the silence speak for itself.
            </p>
            <h2>Uncompromising Dynamics</h2>
            <p>
              Behind the wheel, the immediate torque delivery is nothing short of intoxicating. But power is a cheap commodity in the EV era. What sets the {car.model} apart is the chassis tuning. The damping is extraordinarily sophisticated, isolating occupants from harsh impacts while transmitting crucial textural information from the road surface directly to the driver's fingertips.
            </p>
            <p>
              The steering rack is quick, perhaps a fraction too quick immediately off-center, but it imbues the heavy vehicle with an unexpected agility. Turn-in is razor-sharp, and the torque vectoring system works imperceptibly in the background to rotate the car around its axis.
            </p>
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
                    <Text fontWeight="500">{car.price}</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={4}>
                  <Box p={2} bg="whiteAlpha.100" borderRadius="md"><LinkIcon size={18} color="var(--accent-primary)"/></Box>
                  <Box>
                    <Text fontSize="xs" color="var(--accent-muted)">Reference Link</Text>
                    <Text fontWeight="500" color="var(--accent-primary)" _hover={{ textDecoration: 'underline' }} cursor="pointer">View Official Page</Text>
                  </Box>
                </Flex>
              </Stack>
            </Box>

            {/* Key Specs Card */}
            <Box className="glass-panel" p={6}>
              <Text fontSize="sm" color="var(--accent-muted)" textTransform="uppercase" letterSpacing="widest" fontWeight="600" mb={6}>
                Key Specifications
              </Text>
              <Flex gap={3} align="flex-start">
                <Box p={2} bg="whiteAlpha.100" borderRadius="md" mt={1}>
                  <FileText size={18} color="var(--accent-primary)"/>
                </Box>
                <Text fontSize="sm" color="var(--accent-muted)" lineHeight="1.6">
                  {car.make === 'Porsche' 
                    ? "Range: 278 miles (EPA)\n0-60mph: 2.6s\nPower Output: 750 hp / 774 lb-ft"
                    : car.make === 'Tesla'
                    ? "Range: 359 miles (EPA)\n0-60mph: 1.99s\nPower Output: 1,020 hp"
                    : "Range: 249 miles (EPA)\n0-60mph: 3.1s\nPower Output: 637 hp"
                  }
                </Text>
              </Flex>
            </Box>

          </Stack>
        </GridItem>
      </Grid>
    </MotionBox>
  )
}
