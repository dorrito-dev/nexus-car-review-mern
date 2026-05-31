import { Flex, Box, Text, Button, Stack, Container, Menu } from '@chakra-ui/react'
import { Car, User as UserIcon, ShieldCheck, LogOut, ChevronDown, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('public');
  };

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

          <Stack direction="row" gap={2} align="center">
            <NavItem viewId="public" icon={Car} label="Explore" />
            
            {!user ? (
              <Button
                onClick={() => setCurrentView('login')}
                bg="var(--accent-primary)"
                color="var(--bg-base)"
                borderRadius="full"
                px={6}
                fontWeight="600"
                _hover={{ opacity: 0.9 }}
                _active={{ transform: "scale(0.98)" }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <LogIn size={16} /> <Text display={{ base: "none", md: "block" }}>Login</Text>
              </Button>
            ) : (
              <>
                {user.role === 'user' && <NavItem viewId="user" icon={UserIcon} label="Dashboard" />}
                {user.role === 'admin' && <NavItem viewId="admin" icon={ShieldCheck} label="Admin" />}
                
                <Box pl={2} borderLeft="1px solid var(--glass-border)">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    color="red.400"
                    _hover={{ bg: "red.900", color: "red.300" }}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <LogOut size={16} /> <Text display={{ base: "none", md: "block" }}>Logout</Text>
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
