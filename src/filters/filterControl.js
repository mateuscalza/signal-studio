import React from 'react'
import styled from 'styled-components'
import padding from '../utils/padding'
import FftBandstopControl from './fftBandstop/fftBandstopControl'
import FirBandstopControl from './firBandstop/firBandstopControl'
import IirBandstopControl from './iirBandstop/iirBandstopControl'
import IqrOutlierRemovalControl from './iqrOutlierRemoval/iqrOutlierRemovalControl'
import LinearRegressionControl from './linearRegression/linearRegressionControl'
import NoiseControl from './noise/noiseControl'
import PolynomialRegressionControl from './polynomialRegression/polynomialRegressionControl'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 15px rgba(0, 0, 0, 1);
  margin-top: ${padding.top}px;
  margin-left: ${padding.left}px;
  margin-right: ${padding.top}px;
  margin-bottom: ${padding.left}px;
  color: #fff;
  flex-direction: column;

  .settings {
    display: flex;
    padding: 10px 10px 0 10px;

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

    button,
    .button {
      margin-left: 5px;
    }
  }

  .range {
    min-height: 10px;

    .MuiSlider-root {
      padding: 13px 0 0;
      margin-bottom: -5px;
    }
  }
`

export default function FilterControl({
  input,
  filter,
  filterInfo,
  onChange,
  onRemove,
}) {
  const buttons = (
    <button onClick={onRemove} className='gray'>
      Remove
    </button>
  )
  switch (filter.type) {
    case 'fft-bandstop':
      return (
        <Wrapper>
          <FftBandstopControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'fir-bandstop':
      return (
        <Wrapper>
          <FirBandstopControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'iir-bandstop':
      return (
        <Wrapper>
          <IirBandstopControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'iqr-outlier-removal':
      return (
        <Wrapper>
          <IqrOutlierRemovalControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'linear-regression':
      return (
        <Wrapper>
          <LinearRegressionControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'polynomial-regression':
      return (
        <Wrapper>
          <PolynomialRegressionControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    case 'noise':
      return (
        <Wrapper>
          <NoiseControl
            input={input}
            filter={filter}
            filterInfo={filterInfo}
            onChange={onChange}
            buttons={buttons}
          />
        </Wrapper>
      )
    default:
      return <span>Unknown filter</span>
  }
}
