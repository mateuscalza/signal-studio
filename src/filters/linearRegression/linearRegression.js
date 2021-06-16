import { max, min } from 'mathjs'
import regression from 'regression'
import isNumber from '../../utils/isNumber'

export async function linearRegression(input, filter) {
  if (!input.values.length) {
    return input
  }

  console.time('linear-regression')
  const regressionResult = regression.linear(
    input.values.map((value, index) => [index, value]),
    { precision: 5 }
  )
  const values = input.values.map(
    (value, index) =>
      regressionResult.equation[0] * index + regressionResult.equation[1]
  )
  const filteredOutputValues = values.filter(isNumber)
  console.timeEnd('linear-regression')

  return {
    ...input,
    values,
    minAmplitude: min(filteredOutputValues),
    maxAmplitude: max(filteredOutputValues),
    filterInfo: {
      equation: regressionResult.equation,
      string: regressionResult.string,
    },
  }
}
