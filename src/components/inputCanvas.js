import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce, useMeasure } from 'react-use'
import styled from 'styled-components'
import { primary } from '../utils/colors'
import fillMissing from '../utils/fillMissing'
import findRadix from '../utils/findRadix'
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

export default function InputCanvas({ input, onChange }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])

  const minCanvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom

  useDebounce(
    () => {
      const values = fillMissing(points)
      onChange((old) => ({
        ...old,
        source: 'draw',
        values,
      }))
    },
    200,
    [points]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!minCanvasWidth || !canvasHeight || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvasHeight)

    let initialX = 0
    let finalX = 0

    let hasStarted = false
    let last = undefined

    context.beginPath()
    for (let x = 0; x < points.length; x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      } else if (typeof points[x] !== 'undefined' && !hasStarted) {
        initialX = x
        hasStarted = true
      }

      const y = typeof points[x] !== 'undefined' ? points[x] : last
      last = y
      finalX = x

      context[x === initialX ? 'moveTo' : 'lineTo'](
        x,
        mapRange(y, input.minAmplitude, input.maxAmplitude, canvasHeight, 0)
      )
    }
    context.lineWidth = 2
    context.strokeStyle = primary
    context.stroke()

    context.beginPath()
    context.moveTo(initialX, 0)
    context.lineTo(initialX, canvasHeight)
    context.strokeStyle = 'rgba(255,255,255,0.1)'
    context.stroke()

    const radix = findRadix(finalX - initialX)
    context.beginPath()
    context.moveTo(initialX + radix, 0)
    context.lineTo(initialX + radix, canvasHeight)
    context.stroke()
  }, [canvasRef, minCanvasWidth, canvasHeight, points, input])

  useEffect(() => {
    if (input.source === 'draw') {
      return
    }

    setPoints(input.values)
  }, [input])

  const handleClick = useCallback(
    (event) => {
      setPoints((oldPoints) => {
        const clone = Array.from(oldPoints)
        const value = mapRange(
          event.nativeEvent.offsetY,
          canvasHeight,
          0,
          input.minAmplitude,
          input.maxAmplitude
        )
        clone[event.nativeEvent.offsetX] = value
        return clone
      })
    },
    [canvasHeight, input]
  )
  const handleMouseMove = useCallback(
    (event) => {
      // setHoverPoint([
      //   event.nativeEvent.offsetX,
      //   canvasHeight - event.nativeEvent.offsetY,
      // ])
      if (event.buttons !== 1) {
        return
      }
      handleClick(event)
    },
    [handleClick, canvasHeight]
  )

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Input</h2>
      <canvas
        ref={canvasRef}
        width={Math.max(points.length, minCanvasWidth)}
        height={canvasHeight}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
