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
  display: flex;
  flex: 1;
  flex-direction: column;
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
  const [inputResolution, setInputResolution] = useState({ x: null, y: null })
  const radix = useMemo(
    () => (input.values.length ? findRadix(input.values.length) : null),
    [input.values]
  )
  const fft = useMemo(() => (radix ? new FFT(radix) : null), [radix])
  const [fftData, setFFTData] = useState(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(([file]) => setDroppedFile(file), [setDroppedFile]),
  })

  return (
    <Wrapper
      {...getRootProps()}
      className={isDragActive ? 'is-loading is-grabbing' : ''}
    >
      <InputCanvas
        input={input}
        onChange={setInput}
        onChangeResolution={setInputResolution}
      />
      <FourierCanvas
        points={input.values}
        fft={fft}
        onChange={setFFTData}
        inputResolution={inputResolution}
        fourierClearRange={fourierClearRange}
      />
      <FourierClearRange
        value={fourierClearRange}
        onChange={setFourierClearRange}
      />
      <OutputCanvas
        fft={fft}
        real={fftData?.re}
        imaginary={fftData?.im}
        inputResolution={inputResolution}
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
