import { max, min } from 'mathjs'
import outliers from 'outliers'
import isNumber from '../../utils/isNumber'

export async function iqrOutlierRemoval(input, filter) {
  const filteredInputValues = input.values.filter(isNumber)
  if (!filteredInputValues.length) {
    return input
  }

  console.time('iqr')
  let currentOutliers = outliers(input.values)
  const causal = false
  const values = input.values.reduce((result, value, index, list) => {
    if (causal) {
      currentOutliers = outliers(input.values.slice(0, index + 1))
    }

    result[index] = currentOutliers.includes(value)
      ? index === 0
        ? value
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
    filterInfo: {},
  }
}
