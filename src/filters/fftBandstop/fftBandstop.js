import { Fft as FFT } from 'fili'
import findRadix from '../../utils/findRadix'

export async function fftBandstop(input, filter) {
  if (
    !input.values.length ||
    filter.stopStart >= filter.stopEnd ||
    typeof filter.stopStart !== 'number' ||
    typeof filter.stopEnd !== 'number'
  ) {
    return input
  }

  console.time('fft/ifft')
  const radix = findRadix(input.values.length)
  const fft = new FFT(radix)

  // FFT
  const forwardResult = fft.forward(input.values, 'none')
  const real = Array.from(forwardResult.re)
  const imaginary = Array.from(forwardResult.im)

  // Remove band
  const map = (y, x) => (x >= filter.stopStart && x <= filter.stopEnd ? 0 : y)
  const newReal = Array.from(real).map(map)
  const newImaginary = Array.from(imaginary).map(map)

  // IFFT
  const reverseResult = fft.inverse(newReal, newImaginary)
  const immutableReverseResult = Array.from(reverseResult)
  console.timeEnd('fft/ifft')

  return {
    ...input,
    values: immutableReverseResult,
  }
}
