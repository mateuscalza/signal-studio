import Slider from '@material-ui/core/Slider'
import React from 'react'
import { useMeasure } from 'react-use'
import styled from 'styled-components'
import padding from '../utils/padding'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;
  height: 50px;

  main {
    position: absolute;
    top: ${padding.top}px;
    left: ${padding.left}px;
    background-color: #34495e;
    box-shadow: 3px 3px 6px rgb(0 0 0 / 20%);
  }
`

export default function FourierClearRange({ value, onChange }) {
  const [wrapperRef, { width, height }] = useMeasure()

  const rangeWidth = width - padding.left - padding.right

  return (
    <Wrapper ref={wrapperRef}>
      <main
        style={{
          width: rangeWidth,
          height: height - padding.top - padding.bottom,
        }}
      >
        <Slider
          min={0}
          max={rangeWidth}
          step={1}
          value={value}
          onChange={(event, newValue) => onChange(newValue)}
          valueLabelDisplay='auto'
          aria-labelledby='range-slider'
        />
      </main>
    </Wrapper>
  )
}
