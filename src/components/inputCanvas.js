import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { useMeasure } from 'react-use'

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

export default function InputCanvas() {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.fillStyle = '#2d3436'
    context.fillRect(0, 0, width, height)

    const canvasData = context.getImageData(0, 0, width, height)
    for (let x = 0; x < points.length; x++) {
      if (points[x] >= 0) {
        const y = points[x]
        const index = (x + (height - y) * width) * 4

        canvasData.data[index + 0] = red
        canvasData.data[index + 1] = green
        canvasData.data[index + 2] = blue
        canvasData.data[index + 3] = alpha
      }
    }

    context.putImageData(canvasData, 0, 0)
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
    [height]
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
