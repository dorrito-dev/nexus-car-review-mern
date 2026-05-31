import React, { useState, useEffect } from 'react'
import { 
  Box, Flex, Heading, Text, Badge, Stack, Table, IconButton, Avatar, Button, 
  Spinner, Textarea, Image, SimpleGrid 
} from '@chakra-ui/react'
import { Check, X, Ban, Activity, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/axiosConfig'
import { useAuth } from '../../context/AuthContext'

export default function AdminPanel() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth()
  const activeAdminId = authUser?._id || authUser?.id
  const [activeTab, setActiveTab] = useState('users')
  
  // User Management State
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [expandedUserRow, setExpandedUserRow] = useState(null)

  // Review Moderation State
  const [reviews, setReviews] = useState([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // Rejection State
  const [isRejecting, setIsRejecting] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchPendingReviews()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (error) {
      alert('Error fetching users')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const fetchPendingReviews = async () => {
    setIsLoadingReviews(true)
    try {
      const res = await api.get('/reviews/pending?status=pending')
      setReviews(res.data)
    } catch (error) {
      alert('Error fetching reviews')
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // --- User Actions ---
  const toggleUserRow = (id) => {
    setExpandedUserRow(expandedUserRow === id ? null : id)
  }

  const handleUserStatus = async (userId, newStatus) => {
    // Optimistic UI Update
    const originalUsers = [...users]
    setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
    
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus })
      alert(`User ${newStatus}`)
    } catch (error) {
      setUsers(originalUsers)
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    const originalUsers = [...users]
    setUsers(users.filter(u => u._id !== userId))
    
    try {
      await api.delete(`/users/${userId}`)
      alert('User deleted')
    } catch (error) {
      setUsers(originalUsers)
      alert('Failed to delete user')
    }
  }

  // --- Review Actions ---
  const openReviewDrawer = (review) => {
    setSelectedReview(review)
    setIsRejecting(false)
    setAdminMessage('')
    setIsDrawerOpen(true)
  }

  const handleApproveReview = async (reviewId) => {
    setIsActionLoading(true)
    try {
      await api.patch(`/reviews/${reviewId}/approve`)
      setReviews(reviews.filter(r => r._id !== reviewId))
      alert('Review Approved')
      setIsDrawerOpen(false)
    } catch (error) {
      alert('Failed to approve')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleRejectReview = async (reviewId) => {
    if (!isRejecting) {
      setIsRejecting(true)
      return
    }

    if (!adminMessage.trim()) {
      alert('Please provide a reason')
      return
    }

    setIsActionLoading(true)
    try {
      await api.patch(`/reviews/${reviewId}/reject`, { adminMessage })
      setReviews(reviews.filter(r => r._id !== reviewId))
      alert('Review Rejected')
      setIsDrawerOpen(false)
    } catch (error) {
      alert('Failed to reject')
    } finally {
      setIsActionLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <Flex h="60vh" justify="center" align="center">
        <Spinner size="xl" color="var(--accent-primary)" />
      </Flex>
    )
  }

  if (!authUser || authUser.role !== 'admin') {
    return (
      <Flex h="60vh" justify="center" align="center" direction="column" gap={4}>
         <Heading size="md" color="red.400">Unauthorized Access.</Heading>
      </Flex>
    )
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
        >
          <Flex align="center" gap={2}><FileText size={18} /> Review Moderation</Flex>
        </Button>
      </Flex>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Box>
          <Flex gap={6} mb={8} wrap="wrap">
            <Box flex="1" minW="200px" className="glass-panel" p={6}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text color="var(--accent-muted)" fontSize="sm" fontWeight="500">Total Users</Text>
                <Activity color="var(--accent-muted)" size={16} />
              </Flex>
              <Heading size="xl" fontWeight="400">{users.length}</Heading>
            </Box>
            <Box flex="1" minW="200px" className="glass-panel" p={6}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text color="var(--accent-muted)" fontSize="sm" fontWeight="500">Pending Approvals</Text>
                <Users color="var(--accent-muted)" size={16} />
              </Flex>
              <Heading size="xl" fontWeight="400">{users.filter(u => u.status === 'pending').length}</Heading>
            </Box>
          </Flex>

          <Box className="glass-panel" overflow="hidden">
            {isLoadingUsers ? (
              <Flex justify="center" py={10}><Spinner color="var(--accent-primary)"/></Flex>
            ) : (
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
                  {users.map((user) => (
                    <React.Fragment key={user._id}>
                      <Table.Row 
                        _hover={{ bg: 'whiteAlpha.50' }} 
                        transition="var(--transition-smooth)" 
                        borderBottom={expandedUserRow === user._id ? 'none' : '1px solid var(--glass-border)'}
                        cursor="pointer"
                        onClick={() => toggleUserRow(user._id)}
                      >
                        <Table.Cell py={4} px={6} fontWeight="500" color="var(--accent-muted)">{user._id.substring(0, 8)}...</Table.Cell>
                        <Table.Cell py={4}>
                          <Flex align="center" gap={3}>
                            <Avatar.Root size="sm"><Avatar.Fallback bg="whiteAlpha.200" color="var(--accent-primary)"/></Avatar.Root>
                            <Text>{user.name}</Text>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell py={4}>
                          <Badge 
                            bg={user.status === 'approved' ? 'green.900' : user.status === 'banned' ? 'red.900' : 'yellow.900'} 
                            color={user.status === 'approved' ? 'green.200' : user.status === 'banned' ? 'red.200' : 'yellow.200'}
                            px={2.5} py={0.5} borderRadius="full" fontWeight="500" fontSize="xs"
                          >
                            {user.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell py={4} px={6} textAlign="right">
                          <IconButton variant="ghost" size="sm" borderRadius="full">
                            {expandedUserRow === user._id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                      
                      <AnimatePresence>
                        {expandedUserRow === user._id && (
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
                                      <Text fontSize="sm">{new Date(user.createdAt).toLocaleDateString()}</Text>
                                    </Stack>
                                    
                                    <Flex gap={3} align="flex-end">
                                      {user._id === activeAdminId ? (
                                        <Text fontSize="sm" color="var(--accent-muted)" fontStyle="italic">Cannot modify your own account.</Text>
                                      ) : (
                                        <>
                                          {user.status !== 'approved' && (
                                            <Button size="sm" variant="outline" color="green.400" borderColor="green.400" _hover={{ bg: 'green.900' }} onClick={() => handleUserStatus(user._id, 'approved')}>
                                              <Check size={14} style={{ marginRight: '6px' }}/> Approve
                                            </Button>
                                          )}
                                          {user.status !== 'banned' && (
                                            <Button size="sm" variant="outline" color="red.400" borderColor="red.400" _hover={{ bg: 'red.900' }} onClick={() => handleUserStatus(user._id, 'banned')}>
                                              <Ban size={14} style={{ marginRight: '6px' }}/> Ban User
                                            </Button>
                                          )}
                                          <Button size="sm" variant="ghost" color="var(--accent-muted)" _hover={{ bg: 'whiteAlpha.200' }} onClick={() => handleDeleteUser(user._id)}>
                                            <X size={14} style={{ marginRight: '6px' }}/> Delete
                                          </Button>
                                        </>
                                      )}
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
            )}
          </Box>
        </Box>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <Box>
          <Box className="glass-panel" p={6} mb={8}>
            <Heading size="md" mb={2}>Pending Reviews ({reviews.length})</Heading>
            <Text color="var(--accent-muted)" fontSize="sm">These reviews require your approval before becoming public.</Text>
          </Box>

          {isLoadingReviews ? (
            <Flex justify="center" py={10}><Spinner color="var(--accent-primary)"/></Flex>
          ) : reviews.length === 0 ? (
            <Box textAlign="center" py={10}>
              <FileText size={40} color="var(--accent-muted)" style={{ margin: '0 auto 16px' }} />
              <Text color="var(--accent-muted)">No pending reviews at this time.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {reviews.map(review => (
                <Box 
                  key={review._id} 
                  className="glass-panel" 
                  p={5} 
                  borderRadius="xl"
                  cursor="pointer"
                  _hover={{ transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  transition="all 0.2s"
                  onClick={() => openReviewDrawer(review)}
                >
                  <Badge colorScheme="orange" mb={3}>Pending</Badge>
                  <Heading size="md" mb={2}>{review.make} {review.model}</Heading>
                  <Text noOfLines={3} color="var(--accent-muted)" fontSize="sm" mb={4}>
                    {review.content}
                  </Text>
                  <Flex justify="space-between" fontSize="xs" color="var(--accent-muted)">
                    <Text>By: {review.user?.name || 'Unknown'}</Text>
                    <Text>{new Date(review.createdAt).toLocaleDateString()}</Text>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* Review Moderation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              zIndex: 999,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                backgroundColor: 'var(--bg-base)',
                borderLeft: '1px solid var(--glass-border)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                padding: '24px',
                overflowY: 'auto'
              }}
            >
              <IconButton 
                icon={<X size={20} />} 
                position="absolute" 
                top={4} 
                right={4} 
                variant="ghost" 
                onClick={() => setIsDrawerOpen(false)} 
              />
              
              <Heading size="md" mb={6} borderBottom="1px solid var(--glass-border)" pb={4}>Review Moderation</Heading>
              
              <Stack gap={6}>
                <Box>
                  <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase">Vehicle</Text>
                  <Heading size="lg">{selectedReview.make} {selectedReview.model} ({selectedReview.year})</Heading>
                </Box>
                
                <Flex gap={4}>
                  <Box p={4} bg="rgba(255,255,255,0.03)" borderRadius="xl" border="1px solid var(--glass-border)" flex="1">
                    <Text fontSize="xs" color="var(--accent-muted)">Rating</Text>
                    <Text fontSize="lg" fontWeight="600" color="var(--accent-primary)">{selectedReview.rating} / 5</Text>
                  </Box>
                  <Box p={4} bg="rgba(255,255,255,0.03)" borderRadius="xl" border="1px solid var(--glass-border)" flex="1">
                    <Text fontSize="xs" color="var(--accent-muted)">Price</Text>
                    <Text fontSize="lg" fontWeight="600" color="var(--accent-primary)">{selectedReview.price || 'N/A'}</Text>
                  </Box>
                </Flex>

                <Box>
                  <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase" mb={2}>Review Content</Text>
                  <Box bg="rgba(0,0,0,0.2)" p={4} borderRadius="xl" border="1px solid rgba(255,255,255,0.05)">
                    <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.6">{selectedReview.content}</Text>
                  </Box>
                </Box>

                {selectedReview.images?.length > 0 && (
                  <Box>
                    <Text fontSize="xs" color="var(--accent-muted)" textTransform="uppercase" mb={2}>Attached Images</Text>
                    <Flex gap={3} overflowX="auto">
                      {selectedReview.images.map((img, idx) => (
                        <Image key={idx} src={img} boxSize="120px" objectFit="cover" borderRadius="md" border="1px solid var(--glass-border)"/>
                      ))}
                    </Flex>
                  </Box>
                )}

                <Box mt={6} pt={6} borderTop="1px solid var(--glass-border)">
                  {isRejecting ? (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Text mb={2} fontSize="sm" fontWeight="600" color="red.400">Rejection Reason</Text>
                      <Textarea 
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                        placeholder="Explain what needs to be fixed..."
                        mb={4} bg="rgba(255,255,255,0.05)" border="1px solid rgba(255,0,0,0.3)"
                      />
                      <Flex gap={3} justify="flex-end">
                        <Button variant="ghost" onClick={() => setIsRejecting(false)} disabled={isActionLoading}>Cancel</Button>
                        <Button colorScheme="red" onClick={() => handleRejectReview(selectedReview._id)} isLoading={isActionLoading}>Confirm Rejection</Button>
                      </Flex>
                    </motion.div>
                  ) : (
                    <Flex gap={4} justify="flex-end">
                      <Button variant="outline" colorScheme="red" onClick={() => handleRejectReview()} flex="1">
                        Reject
                      </Button>
                      <Button colorScheme="green" onClick={() => handleApproveReview(selectedReview._id)} flex="1" isLoading={isActionLoading}>
                        Approve
                      </Button>
                    </Flex>
                  )}
                </Box>
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
