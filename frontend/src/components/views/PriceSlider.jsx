import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

export default function PriceSlider({ min, max, onChangeEnd, initialValue }) {
  const [minVal, setMinVal] = useState(initialValue?.[0] ?? min)
  const [maxVal, setMaxVal] = useState(initialValue?.[1] ?? max)
  const minValRef = useRef(initialValue?.[0] ?? min)
  const maxValRef = useRef(initialValue?.[1] ?? max)
  const range = useRef(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  useEffect(() => {
    if (initialValue) {
      setMinVal(initialValue[0])
      setMaxVal(initialValue[1])
      minValRef.current = initialValue[0]
      maxValRef.current = initialValue[1]
    }
  }, [initialValue])

  const handleMouseUp = () => {
    if (onChangeEnd) {
      onChangeEnd([minVal, maxVal])
    }
  }

  // Update track width when minVal changes
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxValRef.current)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Update track width when maxVal changes
  useEffect(() => {
    const minPercent = getPercent(minValRef.current)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <Box w="100%" position="relative" pt={2} pb={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="sm" color="var(--accent-primary)" fontWeight="500">{formatPrice(minVal)}</Text>
        <Text fontSize="sm" color="var(--accent-primary)" fontWeight="500">{formatPrice(maxVal)}</Text>
      </Flex>
      
      <Box position="relative" h="4px">
        {/* Two overlapping invisible native range inputs */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1)
            setMinVal(value)
            minValRef.current = value
          }}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onKeyUp={handleMouseUp}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? '5' : '3' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1)
            setMaxVal(value)
            maxValRef.current = value
          }}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onKeyUp={handleMouseUp}
          className="thumb thumb--right"
          style={{ zIndex: '4' }}
        />

        {/* Custom Track UI */}
        <Box
          position="absolute"
          w="100%"
          h="4px"
          bg="rgba(255,255,255,0.1)"
          borderRadius="full"
          zIndex="1"
        />
        <Box
          ref={range}
          position="absolute"
          h="4px"
          bg="var(--accent-primary)"
          borderRadius="full"
          zIndex="2"
        />
      </Box>
    </Box>
  )
}
