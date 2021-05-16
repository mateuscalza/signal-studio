import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useMeasure } from 'react-use'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  box-shadow: 0 -5px 10px rgb(9 132 227 / 30%), 0 5px 10px rgb(9 132 227 / 30%);
  z-index: 1;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default function FourierCanvas() {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#1c1e1f'
    context.fillRect(0, 0, width, height)
  }, [canvasRef, width, height])

  const handleClick = (event) => {}

  return (
    <Wrapper ref={wrapperRef}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Wrapper>
  )
}
