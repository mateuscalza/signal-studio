import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Fft as FFT } from 'fili'
import { useDropzone } from 'react-dropzone'
import InputCanvas from './components/inputCanvas'
import FourierCanvas from './components/fourierCanvas'
import OutputCanvas from './components/outputCanvas'
import findRadix from './utils/findRadix'
import FourierClearRange from './components/fourierClearRange'
import Modal from './components/modal'
import CsvParser from './components/csvParser'
import useFilters from './filters/filters'
import FiltersControls from './filters/filtersControls'

const Wrapper = styled.div`
  flex: 1;
`

export default function App() {
  const [input, setInput] = useState({
    source: 'none',
    values: [],
    minAmplitude: 0,
    maxAmplitude: 1,
    interval: 1,
    initialTime: 0,
  })
  const [droppedFile, setDroppedFile] = useState(null)
  const [fourierClearRange, setFourierClearRange] = useState([59, 61])
  const radix = useMemo(
    () => (input.values.length ? findRadix(input.values.length) : null),
    [input.values]
  )
  const fft = useMemo(() => (radix ? new FFT(radix) : null), [radix])
  const [fftData, setFFTData] = useState(null)
  const [filters, setFilters] = useState([
    {
      id: 'a',
      type: 'fft-bandstop',
      stopStart: 5,
      stopEnd: 15,
    },
    // {
    //   id: 'b',
    //   type: 'fir-bandstop',
    //   settings: {
    //     stopStart: 5,
    //     stopEnd: 15,
    //   },
    // },
    // {
    //   id: 'c',
    //   type: 'iir-bandstop',
    //   settings: {
    //     stopStart: 5,
    //     stopEnd: 15,
    //   },
    // },
  ])

  const output = useFilters(input, filters)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(([file]) => setDroppedFile(file), [setDroppedFile]),
  })

  return (
    <Wrapper
      {...getRootProps()}
      className={isDragActive ? 'is-loading is-grabbing' : ''}
    >
      <InputCanvas input={input} onChange={setInput} />
      <FiltersControls filters={filters} onChange={setFilters} />
      <FourierCanvas
        points={input.values}
        fft={fft}
        onChange={setFFTData}
        fourierClearRange={fourierClearRange}
      />
      <OutputCanvas
        output={output}
        fft={fft}
        real={fftData?.re}
        imaginary={fftData?.im}
      />
      <Modal
        isVisible={Boolean(droppedFile)}
        onClose={() => setDroppedFile(false)}
      >
        {droppedFile ? (
          <CsvParser
            file={droppedFile}
            onChangeInput={setInput}
            onEnd={() => setDroppedFile(false)}
          />
        ) : null}
      </Modal>
    </Wrapper>
  )
}
