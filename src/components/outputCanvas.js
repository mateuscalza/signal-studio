import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useMeasure } from 'react-use'
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
  const [cursor, setCursor] = useState([null, null])
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
    context.moveTo(
      0,
      mapRange(0, output.minAmplitude, output.maxAmplitude, canvasHeight, 0)
    )
    context.lineTo(
      canvas.width,
      mapRange(0, output.minAmplitude, output.maxAmplitude, canvasHeight, 0)
    )
    context.strokeStyle = 'rgba(255,255,255,0.1)'
    context.stroke()

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

  const handleMouseMove = useCallback(
    (event) => {
      setCursor([
        event.nativeEvent.offsetX * output.interval + output.initialTime,
        output.values[event.nativeEvent.offsetX] ?? null,
      ])
    },
    [output.values, output.interval, output.initialTime]
  )

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Output</h2>
      {cursor[1] !== null ? (
        <span className='cursor'>
          {cursor[1].toFixed(3)} at {cursor[0].toFixed(3)}s
        </span>
      ) : null}
      <canvas
        ref={canvasRef}
        width={Math.max((output.values || []).length, minCanvasWidth)}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
