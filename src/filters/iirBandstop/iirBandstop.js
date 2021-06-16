import { CalcCascades, IirFilter } from 'fili'
import { max, min } from 'mathjs'

export async function iirBandstop(input, filter) {
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

  console.time('iir')
  const iirCalculator = new CalcCascades()
  const Fs = 1 / input.interval
  const center = (filter.stopStart + filter.stopEnd) / 2
  const width = filter.stopEnd - filter.stopStart + 1
  const iirFilterCoefficients = iirCalculator.bandstop({
    order: filter.order,
    characteristic: filter.characteristic,
    Fs,
    Fc: center,
    BW: width,
  })
  const iirFilter = new IirFilter(iirFilterCoefficients)
  const values = iirFilter.multiStep(input.values)
  console.timeEnd('iir')

  return {
    ...input,
    values,
    minAmplitude: min(values),
    maxAmplitude: max(values),
  }
}
