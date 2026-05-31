import React, { useState } from 'react'
import { Box, Flex, Heading, Text, Badge, Stack, Table, IconButton, Avatar, Button } from '@chakra-ui/react'
import { Check, X, Ban, Activity, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const usersData = [
  { id: 'USR-1042', name: 'Alex P.', email: 'alex@example.com', role: 'Reviewer', status: 'Pending', date: 'Oct 24, 2024' },
  { id: 'USR-1043', name: 'Sarah L.', email: 'sarah.l@test.com', role: 'Moderator', status: 'Active', date: 'Oct 23, 2024' },
  { id: 'USR-1044', name: 'Mike J.', email: 'mj88@domain.net', role: 'Reviewer', status: 'Flagged', date: 'Oct 23, 2024' },
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')
  const [expandedRow, setExpandedRow] = useState(null)

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <Box>
      <Heading size="2xl" mb={8} fontWeight="300" letterSpacing="tight">Admin Portal</Heading>

      {/* Tabs */}
      <Flex mb={8} gap={6} borderBottom="1px solid var(--glass-border)">
        <Button
          variant="unstyled"
          pb={4}
          borderRadius="0"
          borderBottom={activeTab === 'users' ? '2px solid var(--accent-primary)' : '2px solid transparent'}
          color={activeTab === 'users' ? 'var(--accent-primary)' : 'var(--accent-muted)'}
          fontWeight={activeTab === 'users' ? '500' : '400'}
          onClick={() => setActiveTab('users')}
          bg="transparent"
          _hover={{ color: 'var(--accent-primary)', bg: 'transparent' }}
          _focus={{ boxShadow: 'none', outline: 'none', bg: 'transparent' }}
          _focusVisible={{ boxShadow: 'none', outline: 'none', bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          _selected={{ bg: 'transparent' }}
        >
          <Flex align="center" gap={2}><Users size={18} /> User Management</Flex>
        </Button>
        <Button
          variant="unstyled"
          pb={4}
          borderRadius="0"
          borderBottom={activeTab === 'reviews' ? '2px solid var(--accent-primary)' : '2px solid transparent'}
          color={activeTab === 'reviews' ? 'var(--accent-primary)' : 'var(--accent-muted)'}
          fontWeight={activeTab === 'reviews' ? '500' : '400'}
          onClick={() => setActiveTab('reviews')}
          bg="transparent"
          _hover={{ color: 'var(--accent-primary)', bg: 'transparent' }}
          _focus={{ boxShadow: 'none', outline: 'none', bg: 'transparent' }}
          _focusVisible={{ boxShadow: 'none', outline: 'none', bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
          _selected={{ bg: 'transparent' }}
        >
          <Flex align="center" gap={2}><FileText size={18} /> Review Moderation</Flex>
        </Button>
      </Flex>

      {activeTab === 'users' && (
        <Box>
          <Flex gap={6} mb={8} wrap="wrap">
            <Box flex="1" minW="200px" className="glass-panel" p={6}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text color="var(--accent-muted)" fontSize="sm" fontWeight="500">Total Users</Text>
                <Activity color="var(--accent-muted)" size={16} />
              </Flex>
              <Heading size="xl" fontWeight="400">892</Heading>
              <Text fontSize="xs" color="green.400" mt={2}>+5% this week</Text>
            </Box>
            <Box flex="1" minW="200px" className="glass-panel" p={6}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text color="var(--accent-muted)" fontSize="sm" fontWeight="500">Pending Approvals</Text>
                <Users color="var(--accent-muted)" size={16} />
              </Flex>
              <Heading size="xl" fontWeight="400">24</Heading>
              <Text fontSize="xs" color="var(--accent-muted)" mt={2}>Requires attention</Text>
            </Box>
          </Flex>

          <Box className="glass-panel" overflow="hidden">
            <Table.Root variant="unstyled" w="100%">
              <Table.Header borderBottom="1px solid var(--glass-border)">
                <Table.Row>
                  <Table.ColumnHeader color="var(--accent-muted)" fontWeight="500" py={4} px={6}>User ID</Table.ColumnHeader>
                  <Table.ColumnHeader color="var(--accent-muted)" fontWeight="500" py={4}>Name</Table.ColumnHeader>
                  <Table.ColumnHeader color="var(--accent-muted)" fontWeight="500" py={4}>Status</Table.ColumnHeader>
                  <Table.ColumnHeader color="var(--accent-muted)" fontWeight="500" py={4} textAlign="right" px={6}>Details</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {usersData.map((user) => (
                  <React.Fragment key={user.id}>
                    <Table.Row 
                      _hover={{ bg: 'whiteAlpha.50' }} 
                      transition="var(--transition-smooth)" 
                      borderBottom={expandedRow === user.id ? 'none' : '1px solid var(--glass-border)'}
                      cursor="pointer"
                      onClick={() => toggleRow(user.id)}
                    >
                      <Table.Cell py={4} px={6} fontWeight="500" color="var(--accent-muted)">{user.id}</Table.Cell>
                      <Table.Cell py={4}>
                        <Flex align="center" gap={3}>
                          <Avatar.Root size="sm"><Avatar.Fallback bg="whiteAlpha.200" color="var(--accent-primary)"/></Avatar.Root>
                          <Text>{user.name}</Text>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell py={4}>
                        <Badge 
                          bg={user.status === 'Active' ? 'green.900' : user.status === 'Flagged' ? 'red.900' : 'yellow.900'} 
                          color={user.status === 'Active' ? 'green.200' : user.status === 'Flagged' ? 'red.200' : 'yellow.200'}
                          px={2.5} py={0.5} borderRadius="full" fontWeight="500" fontSize="xs"
                        >
                          {user.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell py={4} px={6} textAlign="right">
                        <IconButton variant="ghost" size="sm" borderRadius="full">
                          {expandedRow === user.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                    
                    <AnimatePresence>
                      {expandedRow === user.id && (
                        <Table.Row borderBottom="1px solid var(--glass-border)">
                          <Table.Cell colSpan={4} p={0}>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box bg="whiteAlpha.50" p={6} px={8}>
                                <Flex justify="space-between" align="flex-start" wrap="wrap" gap={6}>
                                  <Stack gap={1}>
                                    <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase">Email Address</Text>
                                    <Text fontSize="sm">{user.email}</Text>
                                  </Stack>
                                  <Stack gap={1}>
                                    <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase">Role</Text>
                                    <Text fontSize="sm">{user.role}</Text>
                                  </Stack>
                                  <Stack gap={1}>
                                    <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase">Joined Date</Text>
                                    <Text fontSize="sm">{user.date}</Text>
                                  </Stack>
                                  
                                  <Flex gap={3} align="flex-end">
                                    <Button size="sm" variant="outline" color="green.400" borderColor="green.400" _hover={{ bg: 'green.900' }}>
                                      <Check size={14} style={{ marginRight: '6px' }}/> Approve
                                    </Button>
                                    <Button size="sm" variant="outline" color="red.400" borderColor="red.400" _hover={{ bg: 'red.900' }}>
                                      <Ban size={14} style={{ marginRight: '6px' }}/> Ban User
                                    </Button>
                                    <Button size="sm" variant="ghost" color="var(--accent-muted)" _hover={{ bg: 'whiteAlpha.200' }}>
                                      <X size={14} style={{ marginRight: '6px' }}/> Delete
                                    </Button>
                                  </Flex>
                                </Flex>
                              </Box>
                            </motion.div>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      )}

      {activeTab === 'reviews' && (
        <Box className="glass-panel" p={10} textAlign="center">
          <FileText size={40} color="var(--accent-muted)" style={{ margin: '0 auto 16px' }} />
          <Heading size="md" mb={2}>Review Moderation</Heading>
          <Text color="var(--accent-muted)">Select a review from the queue to begin moderation.</Text>
        </Box>
      )}
    </Box>
  )
}
