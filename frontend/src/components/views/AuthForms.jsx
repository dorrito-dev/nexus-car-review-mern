import { useState } from 'react';
import { Box, Flex, Heading, Text, Stack, Input, Button, Link } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { Car } from 'lucide-react';

export default function AuthForms({ currentView, setCurrentView }) {
  const { login, register, isLoading, error } = useAuth();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(loginEmail, loginPassword);
      setCurrentView(user.role === 'admin' ? 'admin' : 'user');
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        contactInfo: { phone: regPhone, address: regAddress }
      });
      setCurrentView('user'); // New users are always 'user' role
    } catch (err) {
      // Error handled in context
    }
  };

  const inputStyles = {
    bg: 'transparent',
    border: '1px solid whiteAlpha.300',
    color: 'white',
    _placeholder: { color: 'var(--accent-muted)' },
    _focus: { outline: 'none', borderColor: 'var(--accent-primary)', boxShadow: '0 0 0 1px var(--accent-primary)' },
    transition: 'var(--transition-smooth)'
  };

  return (
    <Flex minH="80vh" align="center" justify="center" px={4}>
      <Box className="glass-panel" p={10} borderRadius="3xl" w="100%" maxW="450px" position="relative" overflow="hidden">
        
        {/* Decorative Background Element */}
        <Box position="absolute" top="-50%" left="-50%" w="200%" h="200%" bg="radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)" zIndex={0} pointerEvents="none" />
        
        <Box position="relative" zIndex={1}>
          <Flex direction="column" align="center" mb={8}>
            <Box p={3} bg="whiteAlpha.100" borderRadius="full" border="1px solid var(--glass-border)" mb={4}>
              <Car color="var(--accent-primary)" size={24} strokeWidth={1.5} />
            </Box>
            <Heading size="xl" fontWeight="300" letterSpacing="tight">
              {currentView === 'login' ? 'Welcome Back' : 'Join Nexus'}
            </Heading>
            <Text color="var(--accent-muted)" mt={2}>
              {currentView === 'login' ? 'Sign in to manage your reviews' : 'Apply to become a reviewer'}
            </Text>
          </Flex>

          {error && (
            <Box p={3} mb={6} bg="red.900" color="red.200" borderRadius="md" fontSize="sm" textAlign="center" border="1px solid red.800">
              {error}
            </Box>
          )}

          {currentView === 'login' ? (
            <form onSubmit={handleLogin}>
              <Stack gap={5}>
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  {...inputStyles}
                />
                <Input 
                  placeholder="Password" 
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  {...inputStyles}
                />
                <Button 
                  type="submit" 
                  w="100%" 
                  bg="var(--accent-primary)" 
                  color="var(--bg-base)" 
                  mt={4} 
                  py={6}
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{ opacity: 0.9 }}
                  loading={isLoading}
                >
                  Sign In
                </Button>
              </Stack>
              <Text mt={6} textAlign="center" fontSize="sm" color="var(--accent-muted)">
                Don't have an account?{' '}
                <Link color="var(--accent-primary)" onClick={() => setCurrentView('register')} cursor="pointer">
                  Apply here
                </Link>
              </Text>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <Stack gap={5}>
                <Input 
                  placeholder="Full Name" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  {...inputStyles}
                />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  {...inputStyles}
                />
                <Input 
                  placeholder="Password" 
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  {...inputStyles}
                />
                <Flex gap={4}>
                  <Input 
                    placeholder="Phone" 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    {...inputStyles}
                  />
                  <Input 
                    placeholder="City, State" 
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    required
                    {...inputStyles}
                  />
                </Flex>
                <Button 
                  type="submit" 
                  w="100%" 
                  bg="var(--accent-primary)" 
                  color="var(--bg-base)" 
                  mt={4} 
                  py={6}
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{ opacity: 0.9 }}
                  loading={isLoading}
                >
                  Submit Application
                </Button>
              </Stack>
              <Text mt={6} textAlign="center" fontSize="sm" color="var(--accent-muted)">
                Already a reviewer?{' '}
                <Link color="var(--accent-primary)" onClick={() => setCurrentView('login')} cursor="pointer">
                  Sign in
                </Link>
              </Text>
            </form>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
