import { nanoid } from 'nanoid'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`

export default function AddFilter({ onChange, onEnd }) {
  const handleAddFilter = (filterPayload) => (event) => {
    event.preventDefault()
    onChange((oldFilters) => [
      ...oldFilters,
      {
        ...filterPayload,
        id: nanoid(),
      },
    ])
    onEnd()
  }

  return (
    <Wrapper>
      <button
        onClick={handleAddFilter({
          type: 'fft-bandstop',
          stopStart: 60,
          stopEnd: 60,
        })}
      >
        FFT Bandstop
      </button>
    </Wrapper>
  )
}
