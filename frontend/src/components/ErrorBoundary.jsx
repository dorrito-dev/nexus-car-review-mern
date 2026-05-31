import React from 'react';
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex minH="60vh" align="center" justify="center" px={4}>
          <Box className="glass-panel" p={10} borderRadius="2xl" textAlign="center" maxW="500px">
            <Flex justify="center" mb={6}>
              <Box p={4} bg="rgba(255,50,50,0.1)" borderRadius="full" color="red.400">
                <AlertTriangle size={40} />
              </Box>
            </Flex>
            <Heading size="md" mb={4}>Something went wrong loading your dashboard</Heading>
            <Text color="var(--accent-muted)" mb={4} fontSize="sm">
              We've encountered an unexpected error. Please try refreshing the page or logging in again.
            </Text>
            {this.state.error && (
              <Box mb={6} p={4} bg="blackAlpha.500" borderRadius="md" textAlign="left" maxH="200px" overflowY="auto" fontSize="xs" color="red.200">
                <Text fontWeight="bold">{this.state.error.toString()}</Text>
                <Text mt={2} whiteSpace="pre-wrap">{this.state.error.stack}</Text>
              </Box>
            )}
            <Button 
              bg="var(--accent-primary)" 
              color="black" 
              onClick={() => window.location.reload()}
              _hover={{ opacity: 0.9 }}
            >
              Refresh Page
            </Button>
          </Box>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
