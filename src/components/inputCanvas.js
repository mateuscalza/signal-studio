import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce, useMeasure } from 'react-use'
import styled from 'styled-components'
import fillMissing from '../utils/fillMissing'
import findRadix from '../utils/findRadix'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;

  canvas {
    position: absolute;
  }
`

const red = 9
const green = 132
const blue = 227
const alpha = 255

export default function InputCanvas({ onChange }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])

  useDebounce(() => onChange(fillMissing(points)), 1000, [points])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, width, height)
    context.fillStyle = '#2d3436'
    context.fillRect(0, 0, width, height)

    const canvasData = context.getImageData(0, 0, width, height)

    let initialX = 0
    let finalX = 0

    let hasStarted = false
    let last = undefined
    for (let x = 0; x < Math.min(points.length, width); x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      } else if (typeof points[x] !== 'undefined' && !hasStarted) {
        initialX = x
        hasStarted = true
      }

      const y = typeof points[x] !== 'undefined' ? points[x] : last
      last = y
      const index = (x + (height - y) * width) * 4
      finalX = x

      canvasData.data[index + 0] = red
      canvasData.data[index + 1] = green
      canvasData.data[index + 2] = blue
      canvasData.data[index + 3] = alpha
    }

    const radix = findRadix(finalX - initialX)
    console.log('radix', radix)

    context.putImageData(canvasData, 0, 0)

    context.beginPath()
    context.moveTo(initialX, 0)
    context.lineTo(initialX, height)
    context.stroke()

    context.beginPath()
    context.moveTo(initialX + radix, 0)
    context.lineTo(initialX + radix, height)
    context.stroke()
  }, [canvasRef, width, height, points])

  const handleClick = useCallback(
    (event) => {
      setPoints((oldPoints) => {
        const clone = Array.from(oldPoints)
        clone[event.nativeEvent.offsetX] = height - event.nativeEvent.offsetY
        return clone
      })
    },
    [height]
  )
  const handleMouseMove = useCallback(
    (event) => {
      if (event.buttons !== 1) {
        return
      }
      handleClick(event)
    },
    [handleClick]
  )

  return (
    <Wrapper ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
