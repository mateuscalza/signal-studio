import React, { useEffect, useRef } from 'react'
import { useAsync, useMeasure } from 'react-use'
import styled from 'styled-components'
import padding from '../utils/padding'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;

  canvas {
    position: absolute;
    top: ${padding.top}px;
    left: ${padding.left}px;
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 3px 3px 6px rgb(0 0 0 / 20%);
  }
`

const red = 9
const green = 132
const blue = 227
const alpha = 255

export default function FourierCanvas({
  points,
  fft,
  onChange,
  inputResolution,
  fourierClearRange,
}) {
  const [wrapperRef, { width, height }] = useMeasure()

  const canvasWidth = width - padding.left - padding.right
  const canvasHeight = height - padding.top - padding.bottom

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

    const real = Array.from(result.re)
    const imaginary = Array.from(result.im)

    // fftshift(real)
    // fftshift(imaginary)

    // const preserve = 0.01
    // const nToClear = Math.floor((real.length / 2) * (1 - preserve))
    // const map = (value, index, list) =>
    //   index < nToClear || list.length - index < nToClear ? 0 : value

    // real = real.map(map)
    // imaginary = imaginary.map(map)

    // ifftshift(real)
    // ifftshift(imaginary)

    const immutableResult = {
      re: real,
      im: imaginary,
    }

    console.timeEnd('fft')
    return immutableResult
  }, [points])

  useEffect(() => {
    if (!fftDataResult.value) {
      return
    }

    const min = Math.min(...fourierClearRange)
    const max = Math.max(...fourierClearRange)

    const map = (y, x) => (x >= min && x <= max ? 0 : y)
    const filteredResultClone = {
      im: Array.from(fftDataResult.value.im).map(map),
      re: Array.from(fftDataResult.value.re).map(map),
    }

    onChange(filteredResultClone)
  }, [fourierClearRange, fftDataResult, onChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvasWidth || !canvasHeight || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    if (!fftDataResult.value) {
      return
    }

    const fftResultAbsolute = fftDataResult.value.re.map((real, index) =>
      Math.sqrt(Math.pow(real, 2) + Math.pow(fftDataResult.value.im[index], 2))
    )

    const max = Math.max(...fftResultAbsolute)
    context.beginPath()
    for (
      let frequency = 0;
      frequency < Math.min(fftResultAbsolute.length, canvasWidth);
      frequency++
    ) {
      const y = Math.floor(
        (1 - fftResultAbsolute[frequency] / max) * canvasHeight
      )

      context[frequency === 0 ? 'moveTo' : 'lineTo'](frequency, y)
    }
    context.lineWidth = 2
    context.strokeStyle = `rgba(${red},${green},${blue},1)`
    context.stroke()
  }, [canvasRef, canvasWidth, canvasHeight, fftDataResult.value])

  if (fftDataResult.error) {
    return fftDataResult.error.message
  }

  return (
    <Wrapper ref={wrapperRef}>
      <h2>FFT</h2>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Wrapper>
  )
}
