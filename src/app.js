import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import InputCanvas from './components/inputCanvas'
import FourierCanvas from './components/fourierCanvas'
import OutputCanvas from './components/outputCanvas'
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
  const [filters, setFilters] = useState([
    {
      id: 'a',
      type: 'fft-bandstop',
      stopStart: 5,
      stopEnd: 15,
    },
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
      <FiltersControls input={input} filters={filters} onChange={setFilters} />
      <FourierCanvas input={input} output={output} />
      <OutputCanvas output={output} />
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
