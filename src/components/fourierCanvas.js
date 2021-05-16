import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useAsync, useMeasure } from 'react-use'
import { Fft as FFT } from 'fili'
// import * as X from 'fili'

// window.X = X

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-shadow: 0 -5px 10px rgb(9 132 227 / 30%), 0 5px 10px rgb(9 132 227 / 30%);
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

function findRadix(length) {
  let radix = 2
  while (length >= radix) {
    radix = radix * 2
  }
  return radix / 2
}

// const points = [
//   164, 167, 171, 172, 174, 177, 179, 180, 184, 185, 188, 189, 192, 193, 195,
//   195, 195, 197, 199, 200, 200, 203, 204, 205, 205, 206, 207, 207, 207, 209,
//   211, 211, 211, 212, 212, 213, 214, 214, 216, 216, 217, 218, 218, 218, 219,
//   219, 219, 220, 220, 220, 221, 221, 221, 221, 222, 222, 222, 222, 222, 222,
//   222, 222, 222, 222, 222, 222, 221, 221, 221, 219, 219, 219, 218, 217, 217,
//   216, 215, 214, 213, 213, 212, 212, 210, 209, 209, 207, 206, 206, 206, 203,
//   202, 200, 199, 196, 193, 192, 190, 186, 183, 179, 177, 175, 175, 173, 172,
//   171, 170, 169, 168, 167, 166, 166, 166, 166, 165, 165, 165, 164, 164, 164,
//   163, 163, 163, 163, 163, 163, 163, 163, 163, 163, 163, 163, 164, 166, 166,
//   168, 169, 170, 171, 172, 174, 178, 180, 183, 185, 188, 188, 193, 194, 197,
//   203, 209, 212, 213, 215, 216, 217, 217, 219, 219, 221, 221, 223, 223, 223,
//   223, 223, 224, 224, 224, 225, 225, 226, 226, 227, 227, 227, 227, 227, 227,
//   227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227,
//   227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227, 227,
//   227, 227, 226, 225, 225, 224, 224, 223, 222, 222, 220, 220, 217, 217, 216,
//   216, 214, 213, 212, 210, 209, 208, 206, 205, 203, 200, 198, 194, 188, 179,
//   175, 173, 172, 172, 170, 170, 170, 165, 162, 162, 161, 159, 159, 159, 158,
//   158,
// ]

export default function FourierCanvas({ points }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const fftData = useAsync(async () => {
    const length = points.length
    if (!length) {
      return null
    }
    const radix = findRadix(length)
    console.time('fft')
    const fft = new FFT(radix)
    // window.fft = fft
    // const Fs = length
    // const samplingPeriod = 1 / Fs

    const result = fft.forward(points, 'none')

    // const originalBuffer = fft.inverse(fftResult.re, fftResult.im)
    // console.log('originalBuffer', originalBuffer)

    console.timeEnd('fft')
    return result
    // return []
  }, [points])

  console.log('fftData', fftData)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.fillStyle = '#1c1e1f'
    context.fillRect(0, 0, width, height)

    if (!fftData.value) {
      return
    }

    const fftResultAbsolute = fftData.value.re.map((real, index) =>
      Math.sqrt(Math.pow(real, 2) + Math.pow(fftData.value.im[index], 2))
    )
    console.log(fftData.value.re.length)

    const max = Math.max(...fftResultAbsolute)
    const canvasData = context.getImageData(0, 0, width, height)

    for (let frequency = 0; frequency < fftResultAbsolute.length; frequency++) {
      const y = Math.floor((1 - fftResultAbsolute[frequency] / max) * height)
      const index = (frequency + y * width) * 4

      canvasData.data[index + 0] = red
      canvasData.data[index + 1] = green
      canvasData.data[index + 2] = blue
      canvasData.data[index + 3] = alpha
    }

    context.putImageData(canvasData, 0, 0)
  }, [canvasRef, width, height, fftData.value])

  if (fftData.error) {
    return fftData.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Wrapper>
  )
}
