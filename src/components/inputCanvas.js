import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce, useMeasure } from 'react-use'
import styled from 'styled-components'
import { primary } from '../utils/colors'
import fillMissing from '../utils/fillMissing'
import findRadix from '../utils/findRadix'
import padding from '../utils/padding'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  canvas {
    position: absolute;
    top: ${padding.top}px;
    left: ${padding.left}px;
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: 3px 3px 6px rgb(0 0 0 / 20%);
  }
`

export default function InputCanvas({ onChange, onChangeResolution }) {
  const [wrapperRef, { width, height }] = useMeasure()
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])

  useDebounce(() => onChange(fillMissing(points)), 200, [points])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!width || !height || !canvas) {
      return
    }

    const context = canvas.getContext('2d')
    context.clearRect(0, 0, width, height)

    let initialX = 0
    let finalX = 0

    let hasStarted = false
    let last = undefined

    context.beginPath()
    for (let x = 0; x < Math.min(points.length, width); x++) {
      if (typeof points[x] === 'undefined' && !hasStarted) {
        continue
      } else if (typeof points[x] !== 'undefined' && !hasStarted) {
        initialX = x
        hasStarted = true
      }

      const y = typeof points[x] !== 'undefined' ? points[x] : last
      last = y
      finalX = x

      context[x === initialX ? 'moveTo' : 'lineTo'](x, height - y)
    }
    context.lineWidth = 2
    context.strokeStyle = primary
    context.stroke()

    context.beginPath()
    context.moveTo(initialX, 0)
    context.lineTo(initialX, height)
    context.strokeStyle = 'rgba(255,255,255,0.1)'
    context.stroke()

    const radix = findRadix(finalX - initialX)
    context.beginPath()
    context.moveTo(initialX + radix, 0)
    context.lineTo(initialX + radix, height)
    context.stroke()
  }, [canvasRef, width, height, points])

  useEffect(() => {
    onChangeResolution({
      x: width - padding.left - padding.right,
      y: height - padding.top - padding.bottom,
    })
  }, [width, height, onChangeResolution])

  const handleClick = useCallback(
    (event) => {
      setPoints((oldPoints) => {
        const clone = Array.from(oldPoints)
        clone[event.nativeEvent.offsetX] = height - event.nativeEvent.offsetY
        return clone
      })
    },
    [height]
  )
  const handleMouseMove = useCallback(
    (event) => {
      if (event.buttons !== 1) {
        return
      }
      handleClick(event)
    },
    [handleClick]
  )

  return (
    <Wrapper ref={wrapperRef}>
      <h2>Input</h2>
      <canvas
        ref={canvasRef}
        width={width - padding.left - padding.right}
        height={height - padding.top - padding.bottom}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />
    </Wrapper>
  )
}
