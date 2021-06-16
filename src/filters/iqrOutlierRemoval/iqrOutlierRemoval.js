import { max, median, min } from 'mathjs'
import outliers from 'outliers'
import isNumber from '../../utils/isNumber'

export async function iqrOutlierRemoval(input, filter) {
  const filteredInputValues = input.values.filter(isNumber)
  if (!filteredInputValues.length) {
    return input
  }

  console.time('iqr')
  const currentNonCausalOutliers = outliers(input.values)
  const currentNonCausalMedian = median(filteredInputValues)
  const values = input.values.reduce((result, value, index, list) => {
    result[index] = currentNonCausalOutliers.includes(value)
      ? index === 0
        ? currentNonCausalMedian
        : result[index - 1]
      : value
    return result
  }, [])
  const filteredOutputValues = values.filter(isNumber)
  console.timeEnd('iqr')

  return {
    ...input,
    values,
    minAmplitude: min(filteredOutputValues),
    maxAmplitude: max(filteredOutputValues),
  }
}
