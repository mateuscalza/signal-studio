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

export default function OutputCanvas({ output }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)

  const minCanvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom

  useEffect(() => {
    const canvas = canvasRef.current
    const values = output.values || []
    if (!minCanvasWidth || !canvasHeight || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(
      0,
      0,
      Math.max(minCanvasWidth, values.length),
      canvasHeight
    )

    let hasStarted = false
    let last = undefined

    context.beginPath()
    for (let x = 0; x < values.length; x++) {
      if (typeof values[x] === 'undefined' && !hasStarted) {
        continue
      }
      hasStarted = true

      const y = typeof values[x] !== 'undefined' ? values[x] : last
      last = y

      const mappedY = mapRange(
        y,
        Math.min(output.minAmplitude, output.originalMinAmplitude),
        Math.max(output.maxAmplitude, output.originalMaxAmplitude),
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
    output.values,
    output.minAmplitude,
    output.maxAmplitude,
    output.originalMinAmplitude,
    output.originalMaxAmplitude,
  ])

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Output</h2>
      <canvas
        ref={canvasRef}
        width={Math.max((output.values || []).length, minCanvasWidth)}
        height={canvasHeight}
      />
    </Wrapper>
  )
}
