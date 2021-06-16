/* eslint-disable import/no-webpack-loader-syntax */

import pReduce from 'p-reduce'
import { useEffect, useState } from 'react'
import { useThrottle } from 'react-use'
import { applyFilter } from './applyFilter'

export default function useFilters(input, filters) {
  const throttledInput = useThrottle(input, 300)
  const throttledFilters = useThrottle(filters, 300)
  const [result, setResult] = useState(input)

  useEffect(() => {
    const controller = {
      abort: () => {},
    }

    pReduce(
      throttledFilters,
      (currentInput, currentFilter) =>
        applyFilter(currentInput, currentFilter, controller),
      throttledInput
    )
      .catch((error) => {
        alert(error.message)
        return {
          ...throttledInput,
          values: [],
        }
      })
      .then(setResult)

    return () => controller.abort()
  }, [throttledInput, throttledFilters])

  return result
}
