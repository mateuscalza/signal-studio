import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'
import { primary } from '../utils/colors'
import mapRange from '../utils/mapRange'
import padding from '../utils/padding'

const Wrapper = styled.section`
  height: 220px;

  canvas {
    top: ${padding.top}px;
    left: ${padding.left}px;
    margin-right: ${padding.top}px;
    margin-bottom: ${padding.left}px;
  }
`

export default function OutputCanvas({ output, fft, real, imaginary }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)

  const minCanvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom

  const pointsResult = useAsync(async () => {
    if (!real || !imaginary || !fft) {
      return null
    }
    console.time('ifft')
    const result = fft.inverse(real, imaginary)
    const immutableResult = Array.from(result)
    console.timeEnd('ifft')
    console.log('immutableResult', immutableResult)
    return immutableResult
  }, [real, imaginary])

  useEffect(() => {
    const canvas = canvasRef.current
    const points = pointsResult.value || []
    if (!minCanvasWidth || !canvasHeight || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, minCanvasWidth, canvasHeight)

    let hasStarted = false
    let last = undefined

    context.beginPath()
    for (let x = 0; x < points.length; x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      }
      hasStarted = true

      const y = typeof points[x] !== 'undefined' ? points[x] : last
      last = y

      const mappedY = mapRange(
        y,
        output.minAmplitude,
        output.maxAmplitude,
        canvasHeight,
        0
      )
      context[x === 0 ? 'moveTo' : 'lineTo'](x, mappedY)
    }
    context.lineWidth = 2
    context.strokeStyle = primary
    context.stroke()
  }, [
    canvasRef,
    minCanvasWidth,
    canvasHeight,
    pointsResult.value,
    output.minAmplitude,
    output.maxAmplitude,
  ])

  if (pointsResult.error) {
    return pointsResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Output</h2>
      <canvas
        ref={canvasRef}
        width={Math.max((pointsResult.value || []).length, minCanvasWidth)}
        height={canvasHeight}
      />
    </Wrapper>
  )
}
