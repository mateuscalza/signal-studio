import { Fft as FFT } from 'fili'
import findRadix from './findRadix'

export default function fftAbsolute(values) {
  const radix = findRadix(values.length)
  const fft = new FFT(radix)

  const forwardResult = fft.forward(values, 'none')

  const fftResultAbsolute = forwardResult.re.map((real, index) =>
    Math.sqrt(Math.pow(real, 2) + Math.pow(forwardResult.im[index], 2))
  )
  return fftResultAbsolute
}
