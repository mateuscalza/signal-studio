import fftBandstopWorker from 'workerize-loader!./fftBandstop/fftBandstop'
import firBandstopWorker from 'workerize-loader!./firBandstop/firBandstop'
import iirBandstopWorker from 'workerize-loader!./iirBandstop/iirBandstop'
import iqrOutlierRemovalWorker from 'workerize-loader!./iqrOutlierRemoval/iqrOutlierRemoval'
import noiseWorker from 'workerize-loader!./noise/noise'
import linearRegressionWorker from 'workerize-loader!./linearRegression/linearRegression'
import polynomialRegressionWorker from 'workerize-loader!./polynomialRegression/polynomialRegression'

let workerResult
let fftBandstopWorkerInstance
let firBandstopWorkerInstance
let iirBandstopWorkerInstance
let iqrOutlierRemovalWorkerInstance
let noiseWorkerInstance
let linearRegressionWorkerInstance
let polynomialRegressionWorkerInstance

export async function applyFilter(input, filter, controller = {}) {
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
      workerResult = await fftBandstopWorkerInstance.fftBandstop(input, filter)
      console.timeEnd('worker')
      return workerResult
    case 'fir-bandstop':
      console.time('worker')
      if (!firBandstopWorkerInstance) {
        firBandstopWorkerInstance = firBandstopWorker()
      }
      controller.abort = () => {
        firBandstopWorkerInstance?.terminate()
        firBandstopWorkerInstance = undefined
      }
      workerResult = await firBandstopWorkerInstance.firBandstop(input, filter)
      console.timeEnd('worker')
      return workerResult
    case 'iir-bandstop':
      console.time('worker')
      if (!iirBandstopWorkerInstance) {
        iirBandstopWorkerInstance = iirBandstopWorker()
      }
      controller.abort = () => {
        iirBandstopWorkerInstance?.terminate()
        iirBandstopWorkerInstance = undefined
      }
      workerResult = await iirBandstopWorkerInstance.iirBandstop(input, filter)
      console.timeEnd('worker')
      return workerResult
    case 'iqr-outlier-removal':
      console.time('worker')
      if (!iqrOutlierRemovalWorkerInstance) {
        iqrOutlierRemovalWorkerInstance = iqrOutlierRemovalWorker()
      }
      controller.abort = () => {
        iqrOutlierRemovalWorkerInstance?.terminate()
        iqrOutlierRemovalWorkerInstance = undefined
      }
      workerResult = await iqrOutlierRemovalWorkerInstance.iqrOutlierRemoval(
        input,
        filter
      )
      console.timeEnd('worker')
      return workerResult
    case 'noise':
      console.time('worker')
      if (!noiseWorkerInstance) {
        noiseWorkerInstance = noiseWorker()
      }
      controller.abort = () => {
        noiseWorkerInstance?.terminate()
        noiseWorkerInstance = undefined
      }
      workerResult = await noiseWorkerInstance.noise(input, filter)
      console.timeEnd('worker')
      return workerResult
    case 'linear-regression':
      console.time('worker')
      if (!linearRegressionWorkerInstance) {
        linearRegressionWorkerInstance = linearRegressionWorker()
      }
      controller.abort = () => {
        linearRegressionWorkerInstance?.terminate()
        linearRegressionWorkerInstance = undefined
      }
      workerResult = await linearRegressionWorkerInstance.linearRegression(
        input,
        filter
      )
      console.timeEnd('worker')
      return workerResult
    case 'polynomial-regression':
      console.time('worker')
      if (!polynomialRegressionWorkerInstance) {
        polynomialRegressionWorkerInstance = polynomialRegressionWorker()
      }
      controller.abort = () => {
        polynomialRegressionWorkerInstance?.terminate()
        polynomialRegressionWorkerInstance = undefined
      }
      workerResult =
        await polynomialRegressionWorkerInstance.polynomialRegression(
          input,
          filter
        )
      console.timeEnd('worker')
      return workerResult

    default:
      throw new Error('Unknown filter')
  }
}
