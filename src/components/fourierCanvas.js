import React, { useEffect, useRef } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'
import { fftshift, ifftshift } from 'fftshift'
import padding from '../utils/padding'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #2c3e50;
  z-index: 1;

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

export default function FourierCanvas({ points, fft, onChange }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const fftDataResult = useAsync(async () => {
    const length = points.length
    if (!length || !fft) {
      return null
    }
    console.time('fft')

    //  Instance of a filter coefficient calculator
    // var iirCalculator = new Fili.CalcCascades()

    // // get available filters
    // var availableFilters = iirCalculator.available()

    // // calculate filter coefficients
    // var iirFilterCoeffs = iirCalculator.lowpass({
    //   order: 3, // cascade 3 biquad filters (max: 12)
    //   characteristic: 'butterworth',
    //   Fs: 1000, // sampling frequency
    //   Fc: 100, // cutoff frequency / center frequency for bandpass, bandstop, peak
    //   BW: 1, // bandwidth only for bandstop and bandpass filters - optional
    //   gain: 0, // gain for peak, lowshelf and highshelf
    //   preGain: false, // adds one constant multiplication for highpass and lowpass
    //   // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    // })

    // // create a filter instance from the calculated coeffs
    // var iirFilter = new Fili.IirFilter(iirFilterCoeffs)
    // console.log(points)

    // const filtered = iirFilter
    //   .multiStep(points)
    //   .map((value) => Math.max(value, 0))
    // console.log(filtered)

    const result = fft.forward(points, 'none')

    let real = Array.from(result.re)
    let imaginary = Array.from(result.im)

    fftshift(real)
    fftshift(imaginary)

    const preserve = 0.01
    const nToClear = Math.floor((real.length / 2) * (1 - preserve))
    const map = (value, index, list) =>
      index < nToClear || list.length - index < nToClear ? 0 : value

    real = real.map(map)
    imaginary = imaginary.map(map)

    ifftshift(real)
    ifftshift(imaginary)

    const immutableResult = {
      im: imaginary,
      re: real,
    }

    console.timeEnd('fft')
    onChange(immutableResult)
    return immutableResult
  }, [points])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, width, height)

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
      <canvas
        ref={canvasRef}
        width={width - padding.left - padding.right}
        height={height - padding.top - padding.bottom}
      />
    </Wrapper>
  )
}
