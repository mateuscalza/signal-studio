export default function fillMissing(array1D) {
  let hasStarted = false
  let last = undefined

  const newArray1D = []

  let newIndex = 0
  for (let index = 0; index < array1D.length; index++) {
    if (typeof array1D[index] === 'undefined' && !hasStarted) {
      continue
    }
    hasStarted = true

    const value = typeof array1D[index] !== 'undefined' ? array1D[index] : last
    last = value
    newArray1D[newIndex++] = value
  }

  return newArray1D
}
