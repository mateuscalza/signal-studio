import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'
import { primary } from '../utils/colors'
import padding from '../utils/padding'

const Wrapper = styled.section`
  canvas {
    top: ${padding.top}px;
    left: ${padding.left}px;
  }
`

export default function OutputCanvas({
  fft,
  real,
  imaginary,
  inputResolution,
}) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [hoverPoint, setHoverPoint] = useState([null, null])

  const canvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom

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
    if (
      !canvasWidth ||
      !canvasHeight ||
      !canvas ||
      !inputResolution.x ||
      !inputResolution.y
    ) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    let hasStarted = false
    let last = undefined

    context.beginPath()
    for (let x = 0; x < Math.min(points.length, canvasWidth); x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      }
      hasStarted = true

      const y = typeof points[x] !== 'undefined' ? Math.floor(points[x]) : last
      last = y

      context[x === 0 ? 'moveTo' : 'lineTo'](x, canvasHeight - y)
    }
    context.lineWidth = 2
    context.strokeStyle = primary
    context.stroke()
  }, [
    canvasRef,
    canvasWidth,
    canvasHeight,
    pointsResult.value,
    inputResolution.x,
    inputResolution.y,
  ])

  const handleMouseMove = useCallback(
    (event) => {
      setHoverPoint([
        event.nativeEvent.offsetX,
        canvasHeight - event.nativeEvent.offsetY,
      ])
    },
    [canvasHeight]
  )

  if (pointsResult.error) {
    return pointsResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Output</h2>
      <span className='cursor'>
        {hoverPoint[0]}
        {hoverPoint[0] !== null ? 'x' : null}
        {hoverPoint[1]}
      </span>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
