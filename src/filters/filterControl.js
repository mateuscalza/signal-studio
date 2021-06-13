import React from 'react'
import styled from 'styled-components'
import FftBandstopControl from './fftBandstop/fftBandstopControl'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: #1a1a1a;
  box-shadow: 0 0 15px rgba(0, 0, 0, 1);
  padding: 10px;
  margin: 5px;
  border-radius: 15px;
  color: #fff;

  h2 {
    margin: 0 0;
    display: flex;
    font-size: 1.1rem;
    justify-content: center;
    align-items: center;
    width: 80px;
    font-weight: 500;
    text-align: center;
    line-height: 1;
    color: #fff;
    cursor: grab;
  }

  label {
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0 0 0 10px;
    padding: 0 0 0 10px;
  }
`

export default function FilterControl({ filter, onChange }) {
  switch (filter.type) {
    case 'fft-bandstop':
      return (
        <Wrapper>
          <FftBandstopControl filter={filter} onChange={onChange} />
        </Wrapper>
      )
    default:
      return <span>Unknown filter</span>
  }
}
