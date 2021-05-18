import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce, useMeasure } from 'react-use'
import styled from 'styled-components'
import Slider from '@material-ui/core/Slider'

const padding = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 50,
}

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

  console.log(value)

  return (
    <Wrapper ref={wrapperRef}>
      <main
        style={{
          width: width - padding.left - padding.right,
          height: height - padding.top - padding.bottom,
        }}
      >
        <Slider
          min={0}
          max={width}
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
