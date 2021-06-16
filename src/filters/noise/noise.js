import { max, mean, min } from 'mathjs'
import isNumber from '../../utils/isNumber'

export async function noise(input, filter) {
  const filteredInputValues = input.values.filter(isNumber)
  if (!filteredInputValues.length) {
    return input
  }

  console.time('iqr')
  const currentScaledMean = mean(filteredInputValues) * filter.scale
  const values = input.values.map(
    (value, index) => (Math.random() - 0.5) * currentScaledMean + value
  )
  const filteredOutputValues = values.filter(isNumber)
  console.timeEnd('iqr')

  return {
    ...input,
    values,
    minAmplitude: min(filteredOutputValues),
    maxAmplitude: max(filteredOutputValues),
    filterInfo: {},
  }
}
