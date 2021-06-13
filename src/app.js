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
  const output = input

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(([file]) => setDroppedFile(file), [setDroppedFile]),
  })

  return (
    <Wrapper
      {...getRootProps()}
      className={isDragActive ? 'is-loading is-grabbing' : ''}
    >
      <InputCanvas input={input} onChange={setInput} />
      <FourierCanvas
        points={input.values}
        fft={fft}
        onChange={setFFTData}
        fourierClearRange={fourierClearRange}
      />
      <FourierClearRange
        value={fourierClearRange}
        onChange={setFourierClearRange}
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
