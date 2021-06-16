/* eslint-disable import/no-webpack-loader-syntax */

import pReduce from 'p-reduce'
import { useEffect, useState } from 'react'
import { applyFilter } from './applyFilter'

export default function useFilters(input, filters) {
  const [result, setResult] = useState(input)

  useEffect(() => {
    const controller = {
      abort: () => {},
    }

    pReduce(
      filters,
      (currentInput, currentFilter) =>
        applyFilter(currentInput, currentFilter, controller),
      input
    )
      .catch((error) => {
        alert(error.message)
        return {
          ...input,
          values: [],
        }
      })
      .then(setResult)

    return () => controller.abort()
  }, [input, filters])

  return result
}
