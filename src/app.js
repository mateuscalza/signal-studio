import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import CsvParser from './components/csvParser'
import FourierCanvas from './components/fourierCanvas'
import InputCanvas from './components/inputCanvas'
import Modal from './components/modal'
import OutputCanvas from './components/outputCanvas'
import AddFilter from './filters/addFilter'
import useFilters from './filters/filters'
import FiltersControls from './filters/filtersControls'
import Download from './components/download'
import InputActions from './components/inputActions'

const Wrapper = styled.div`
  flex: 1;
`

export default function App() {
  const [input, setInput] = useState({
    source: 'none',
    values: [],
    minAmplitude: 0,
    maxAmplitude: 1,
    originalMinAmplitude: 0,
    originalMaxAmplitude: 1,
    interval: 1 / 1000,
    initialTime: 0,
    filterInfo: {},
  })
  const [droppedFile, setDroppedFile] = useState(null)
  const [isAddingFilter, setIsAddingFilter] = useState(false)
  const [filters, setFilters] = useState([])
  const [output, filtersInfo] = useFilters(input, filters)
  const { getRootProps, isDragActive } = useDropzone({
    onDrop: useCallback(([file]) => setDroppedFile(file), [setDroppedFile]),
  })

  return (
    <Wrapper
      {...getRootProps()}
      className={isDragActive ? 'is-loading is-grabbing' : ''}
    >
      <InputActions onChange={setInput} onChangeDroppedFile={setDroppedFile} />
      <InputCanvas input={input} onChange={setInput} />
      <FiltersControls
        input={input}
        filters={filters}
        filtersInfo={filtersInfo}
        onChange={setFilters}
        onAddFilter={() => setIsAddingFilter(true)}
      />
      <FourierCanvas input={input} output={output} />
      <OutputCanvas output={output} />
      <Download output={output} />

      <Modal
        isVisible={Boolean(droppedFile)}
        onClose={() => setDroppedFile(false)}
        height={500}
      >
        {droppedFile ? (
          <CsvParser
            file={droppedFile}
            onChangeInput={setInput}
            onEnd={() => setDroppedFile(false)}
          />
        ) : null}
      </Modal>
      <Modal
        isVisible={isAddingFilter}
        onClose={() => setIsAddingFilter(false)}
        height={250}
      >
        <AddFilter
          onChange={setFilters}
          onEnd={() => setIsAddingFilter(false)}
        />
      </Modal>
    </Wrapper>
  )
}
