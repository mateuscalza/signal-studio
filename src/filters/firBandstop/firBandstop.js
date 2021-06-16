import { FirCoeffs, FirFilter } from 'fili'
import { max, min } from 'mathjs'

export async function firBandstop(input, filter) {
  if (
    !input.values.length ||
    filter.stopStart >= filter.stopEnd ||
    typeof filter.stopStart !== 'number' ||
    typeof filter.stopEnd !== 'number' ||
    typeof filter.order !== 'number' ||
    typeof filter.order <= 0
  ) {
    return input
  }

  console.time('fir')
  const firCalculator = new FirCoeffs()
  const Fs = 1 / input.interval
  console.log('Fs', Fs)
  const firFilterCoefficients = firCalculator.bandstop({
    order: filter.order,
    Fs,
    F1: filter.stopStart,
    F2: filter.stopEnd,
  })
  console.log('firFilterCoefficients', firFilterCoefficients)
  const firFilter = new FirFilter(firFilterCoefficients)
  const values = firFilter.multiStep(input.values)
  console.timeEnd('fir')

  return {
    ...input,
    values,
    minAmplitude: min(values),
    maxAmplitude: max(values),
  }
}
