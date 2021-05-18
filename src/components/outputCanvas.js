import React, { useEffect, useRef } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'
import padding from '../utils/padding'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #2c3e50;

  canvas {
    position: absolute;
    top: ${padding.top}px;
    left: ${padding.left}px;
    background-color: #34495e;
    box-shadow: 3px 3px 6px rgb(0 0 0 / 20%);
  }
`
const red = 9

const green = 132
const blue = 227
const alpha = 255

export default function OutputCanvas({
  fft,
  real,
  imaginary,
  inputResolution,
}) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)

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

    const canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight)

    let hasStarted = false
    let last = undefined

    for (let x = 0; x < Math.min(points.length, canvasWidth); x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      }
      hasStarted = true

      const y = typeof points[x] !== 'undefined' ? Math.floor(points[x]) : last
      last = y

      const index =
        (x +
          Math.floor((1 - y / inputResolution.y) * canvasHeight) *
            canvasWidth) *
        4

      canvasData.data[index + 0] = red
      canvasData.data[index + 1] = green
      canvasData.data[index + 2] = blue
      canvasData.data[index + 3] = alpha
    }

    context.putImageData(canvasData, 0, 0)
  }, [
    canvasRef,
    canvasWidth,
    canvasHeight,
    pointsResult.value,
    inputResolution.x,
    inputResolution.y,
  ])

  if (pointsResult.error) {
    return pointsResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Wrapper>
  )
}
