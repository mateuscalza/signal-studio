import { max, median, min } from 'mathjs'
import outliers from 'outliers'

export async function iqrOutlierRemoval(input, filter) {
  const filteredValues = input.values.filter(
    (value) => typeof value === 'number'
  )
  if (!filteredValues.length) {
    return input
  }

  console.time('iqr')
  const currentOutliers = outliers(input.values)
  const currentMedian = median()
  const values = input.values.map((value, index, list) =>
    currentOutliers.includes(value) ? currentMedian : value
  )
  console.timeEnd('iqr')

  return {
    ...input,
    values,
    minAmplitude: min(values),
    maxAmplitude: max(values),
  }
}
