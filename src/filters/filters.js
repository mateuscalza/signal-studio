/* eslint-disable import/no-webpack-loader-syntax */

import pReduce from 'p-reduce'
import { useEffect, useState } from 'react'
import { useThrottle } from 'react-use'
import { applyFilter } from './applyFilter'

export default function useFilters(input, filters) {
  const throttledInput = useThrottle(input, 300)
  const throttledFilters = useThrottle(filters, 300)
  const [result, setResult] = useState(input)
  const [filtersInfo, setFiltersInfo] = useState(input)

  useEffect(() => {
    const controller = {
      abort: () => {},
    }

    pReduce(
      throttledFilters,
      async ([currentInput, currentFiltersInfo], currentFilter, index) => {
        const filterResult = await applyFilter(
          currentInput,
          currentFilter,
          controller
        )
        currentFiltersInfo[index] = filterResult.filterInfo
        return [filterResult, currentFiltersInfo]
      },
      [throttledInput, []]
    )
      .catch((error) => {
        alert(error.message)
        return {
          ...throttledInput,
          values: [],
        }
      })
      .then(([currentInput, currentFiltersInfo]) => {
        setResult(currentInput)
        setFiltersInfo(currentFiltersInfo)
      })

    return () => controller.abort()
  }, [throttledInput, throttledFilters])

  return [result, filtersInfo]
}
