/* eslint-disable import/no-webpack-loader-syntax */

import pReduce from 'p-reduce'
import { useEffect, useState } from 'react'
import fftBandstopWorker from 'workerize-loader!./fftBandstop/fftBandstop'

let fftBandstopWorkerInstance

export async function applyFilter(input, filter, controller) {
  switch (filter.type) {
    case 'fft-bandstop':
      console.time('worker')
      if (!fftBandstopWorkerInstance) {
        fftBandstopWorkerInstance = fftBandstopWorker()
      }
      controller.abort = () => {
        fftBandstopWorkerInstance?.terminate()
        fftBandstopWorkerInstance = undefined
      }
      const workerResult = await fftBandstopWorkerInstance.fftBandstop(
        input,
        filter
      )
      console.timeEnd('worker')
      return workerResult
    default:
      throw new Error('Unknown filter')
  }
}

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
      .catch((error) => alert(error.message))
      .then(setResult)

    return () => controller.abort()
  }, [input, filters])

  return result
}
