import { max, min, add, multiply, pow } from 'mathjs'
import regression from 'regression'
import isNumber from '../../utils/isNumber'

export async function polynomialRegression(input, filter) {
  if (!input.values.length || !filter.order) {
    return input
  }

  console.time('polynomial-regression')
  const regressionResult = regression.polynomial(
    input.values.map((value, index) => [index, value]),
    { precision: 10, order: filter.order }
  )
  const equation = regressionResult.equation
  const values = input.values.map((value, index) =>
    equation.reduce(
      (result, mul, power) =>
        add(result, multiply(mul, pow(index, equation.length - power - 1))),
      0
    )
  )
  const filteredOutputValues = values.filter(isNumber)
  console.timeEnd('polynomial-regression')

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
