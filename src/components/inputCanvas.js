import React from 'react'
import styled from 'styled-components'
import { useMeasure } from 'react-use'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default function InputCanvas() {
  const [wrapperRef, { width, height }] = useMeasure()

  return (
    <Wrapper ref={wrapperRef}>
      <canvas width={width} height={height} />
    </Wrapper>
  )
}
