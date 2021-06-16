import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMeasure } from 'react-use'
import styled from 'styled-components'
import { primary, secondary } from '../utils/colors'
import fftAbsolute from '../utils/fftAbsolute'
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

export default function FourierCanvas({ input, output }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const [cursor, setCursor] = useState([null, null])

  const minCanvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom
  const canvasRef = useRef(null)

  const inputFFT = useMemo(() => fftAbsolute(input.values), [input.values])
  const outputFFT = useMemo(() => fftAbsolute(output.values), [output.values])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!minCanvasWidth || !canvasHeight || !canvas) {
      return
    }

    const context = canvas.getContext('2d')

    context.clearRect(
      0,
      0,
      Math.max(outputFFT.length, inputFFT.length, minCanvasWidth),
      canvasHeight
    )
    context.lineWidth = 2

    const maxInputFFT = Math.max(...inputFFT)
    context.strokeStyle = primary
    context.beginPath()
    for (let frequency = 0; frequency < inputFFT.length; frequency++) {
      const y = Math.floor(
        (1 - inputFFT[frequency] / maxInputFFT) * canvasHeight
      )
      context[frequency === 0 ? 'moveTo' : 'lineTo'](
        mapRange(frequency, 0, inputFFT.length, 0, minCanvasWidth),
        y
      )
    }
    context.stroke()

    const maxOutputFFT = Math.max(...outputFFT)
    context.strokeStyle = secondary
    context.beginPath()
    for (let frequency = 0; frequency < outputFFT.length; frequency++) {
      const y = Math.floor(
        (1 - outputFFT[frequency] / maxOutputFFT) * canvasHeight
      )
      context[frequency === 0 ? 'moveTo' : 'lineTo'](
        mapRange(frequency, 0, inputFFT.length, 0, minCanvasWidth),
        y
      )
    }
    context.stroke()
  }, [canvasRef, minCanvasWidth, canvasHeight, inputFFT, outputFFT])

  const handleMouseMove = useCallback(
    (event) => {
      if (!inputFFT.length || !outputFFT.length) {
        return
      }

      const frequency = Math.floor(
        mapRange(
          event.nativeEvent.offsetX,
          0,
          minCanvasWidth,
          0,
          inputFFT.length
        )
      )
      if (!isFinite(inputFFT[frequency]) || !outputFFT[frequency]) {
        return
      }

      setCursor([frequency, inputFFT[frequency], outputFFT[frequency] ?? null])
    },
    [inputFFT, outputFFT, minCanvasWidth]
  )

  return (
    <Wrapper ref={wrapperRef}>
      <h2>FFT</h2>
      {cursor[0] !== null && cursor[1] !== null && cursor[2] !== null ? (
        <span className='cursor'>
          Input {cursor[1].toFixed(3)}, output {cursor[2].toFixed(3)} at{' '}
          {cursor[0]}Hz
        </span>
      ) : null}
      <canvas
        ref={canvasRef}
        width={minCanvasWidth}
        height={canvasHeight}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
