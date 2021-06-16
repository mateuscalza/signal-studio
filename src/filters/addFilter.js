import { nanoid } from 'nanoid'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;

  button {
    margin-bottom: 10px;
  }
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
          stopStart: 59,
          stopEnd: 61,
        })}
      >
        FFT Bandstop
      </button>
      <button
        onClick={handleAddFilter({
          type: 'iir-bandstop',
          order: 3,
          characteristic: 'butterworth',
          stopStart: 59,
          stopEnd: 61,
        })}
      >
        IIR Bandstop
      </button>
      <button
        onClick={handleAddFilter({
          type: 'fir-bandstop',
          order: 3,
          stopStart: 59,
          stopEnd: 61,
        })}
      >
        FIR Bandstop
      </button>
      <button
        onClick={handleAddFilter({
          type: 'iqr-outlier-removal',
        })}
      >
        Interquartile Range Outlier Removal
      </button>
      <button
        onClick={handleAddFilter({
          type: 'noise',
          scale: 0.1,
        })}
      >
        Noise
      </button>
      <button
        onClick={handleAddFilter({
          type: 'linear-regression',
        })}
      >
        Linear Regression
      </button>
      <button
        onClick={handleAddFilter({
          type: 'polynomial-regression',
          order: 3,
        })}
      >
        Polynomial Regression
      </button>
    </Wrapper>
  )
}
