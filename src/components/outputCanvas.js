import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAsync, useMeasure } from 'react-use'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`
const red = 9

const green = 132
const blue = 227
const alpha = 255

export default function OutputCanvas({ fft, real, imaginary }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)

  const pointsResult = useAsync(async () => {
    if (!real || !imaginary || !fft) {
      return null
    }
    console.time('ifft')
    const result = fft.inverse(real, imaginary)
    const immutableResult = Array.from(result)
    console.timeEnd('ifft')
    return immutableResult
  }, [real, imaginary])

  useEffect(() => {
    const canvas = canvasRef.current
    const points = pointsResult.value || []
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.fillStyle = '#2d3436'
    context.fillRect(0, 0, width, height)

    const canvasData = context.getImageData(0, 0, width, height)

    let hasStarted = false
    let last = undefined
    for (let x = 0; x < Math.min(points.length, width); x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      }
      hasStarted = true

      const y = typeof points[x] !== 'undefined' ? points[x] : last
      last = y
      const index = (x + (height - y) * width) * 4

      canvasData.data[index + 0] = red
      canvasData.data[index + 1] = green
      canvasData.data[index + 2] = blue
      canvasData.data[index + 3] = alpha
    }

    context.putImageData(canvasData, 0, 0)
  }, [canvasRef, width, height, pointsResult.value])

  if (pointsResult.error) {
    return pointsResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Wrapper>
  )
}
