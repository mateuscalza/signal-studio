import { max, median, min } from 'mathjs'
import outliers from 'outliers'

export async function iqrOutlierRemoval(input, filter) {
  if (!input.values.length) {
    return input
  }

  console.time('iqr')
  console.log(
    'input.values',
    input.values.filter((i) => typeof i !== 'number')
  )
  const currentOutliers = outliers(input.values)
  console.log('currentOutliers', currentOutliers)
  const currentMedian = median(
    input.values.filter((value) => typeof value === 'number')
  )
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
