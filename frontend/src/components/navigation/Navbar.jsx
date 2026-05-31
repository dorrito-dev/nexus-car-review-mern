import { Flex, Box, Text, Button, Stack, Container } from '@chakra-ui/react'
import { Car, User, ShieldCheck } from 'lucide-react'

export default function Navbar({ currentView, setCurrentView }) {
  const NavItem = ({ viewId, icon: Icon, label }) => {
    const isActive = currentView === viewId;
    return (
      <Button
        variant="ghost"
        onClick={() => setCurrentView(viewId)}
        color={isActive ? "var(--accent-primary)" : "var(--accent-muted)"}
        _hover={{ bg: "whiteAlpha.100", color: "var(--accent-primary)" }}
        _active={{ transform: "scale(0.98)" }}
        bg={isActive ? "whiteAlpha.100" : "transparent"}
        display="flex"
        alignItems="center"
        gap={2}
        borderRadius="full"
        px={4}
        transition="var(--transition-smooth)"
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        <Text display={{ base: "none", md: "block" }} fontWeight={isActive ? "600" : "400"}>
          {label}
        </Text>
      </Button>
    )
  }

  return (
    <Box 
      as="nav" 
      position="fixed" 
      top={0} 
      w="100%" 
      zIndex={200}
      className="glass-nav"
      px={{ base: 4, md: 8 }}
      py={4}
    >
      <Container maxW="1400px" px={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center">
          
          <Flex 
            align="center" 
            gap={3} 
            cursor="pointer" 
            onClick={() => setCurrentView('public')}
            _hover={{ opacity: 0.8 }}
            transition="var(--transition-smooth)"
          >
            <Box p={2} bg="whiteAlpha.100" borderRadius="full" border="1px solid var(--glass-border)">
              <Car color="var(--accent-primary)" size={20} strokeWidth={1.5} />
            </Box>
            <Text fontSize="xl" fontWeight="600" letterSpacing="widest" color="var(--accent-primary)">
              NEXUS
            </Text>
          </Flex>

          <Stack direction="row" gap={2}>
            <NavItem viewId="public" icon={Car} label="Explore" />
            <NavItem viewId="user" icon={User} label="Dashboard" />
            <NavItem viewId="admin" icon={ShieldCheck} label="Admin" />
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
