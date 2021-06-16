import React, { useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;

  .button {
    margin: 0 5px;
  }
  input {
    display: none;
  }
`

export default function InputActions({ onChange, onChangeDroppedFile }) {
  const inputFileRef = useRef()

  return (
    <Wrapper>
      <a
        className='button'
        href='#clear'
        onClick={(event) => {
          event.preventDefault()
          onChange({
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
        }}
      >
        Clear
      </a>

      <input
        type='file'
        ref={inputFileRef}
        hidden
        onChange={(event) => {
          onChangeDroppedFile(event.target.files[0] ?? null)
          event.target.value = ''
        }}
      />

      <a
        className='button'
        href='#file'
        onClick={(event) => {
          event.preventDefault()
          inputFileRef.current.click()
        }}
      >
        File
      </a>
    </Wrapper>
  )
}
