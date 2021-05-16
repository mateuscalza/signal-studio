import React, { useEffect, useRef } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  /* box-shadow: 0 -5px 10px rgb(9 132 227 / 30%), 0 5px 10px rgb(9 132 227 / 30%); */
  z-index: 1;

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

export default function FourierCanvas({ points, fft, onChange }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const fftDataResult = useAsync(async () => {
    const length = points.length
    if (!length || !fft) {
      return null
    }
    console.time('fft')
    const result = fft.forward(points, 'none')
    console.timeEnd('fft')
    onChange(result)
    return result
  }, [points])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.fillStyle = '#1c1e1f'
    context.fillRect(0, 0, width, height)

    if (!fftDataResult.value) {
      return
    }

    const fftResultAbsolute = fftDataResult.value.re.map((real, index) =>
      Math.sqrt(Math.pow(real, 2) + Math.pow(fftDataResult.value.im[index], 2))
    )

    const max = Math.max(...fftResultAbsolute)
    const canvasData = context.getImageData(0, 0, width, height)

    for (
      let frequency = 0;
      frequency < Math.min(fftResultAbsolute.length, width);
      frequency++
    ) {
      const y = Math.floor((1 - fftResultAbsolute[frequency] / max) * height)
      const index = (frequency + y * width) * 4

      canvasData.data[index + 0] = red
      canvasData.data[index + 1] = green
      canvasData.data[index + 2] = blue
      canvasData.data[index + 3] = alpha
    }

    context.putImageData(canvasData, 0, 0)
  }, [canvasRef, width, height, fftDataResult.value])

  if (fftDataResult.error) {
    return fftDataResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Wrapper>
  )
}
