import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Fft as FFT } from 'fili'
import InputCanvas from './components/inputCanvas'
import FourierCanvas from './components/fourierCanvas'
import OutputCanvas from './components/outputCanvas'
import findRadix from './utils/findRadix'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default function App() {
  const [points, setPoints] = useState([])
  const radix = useMemo(
    () => (points.length ? findRadix(points.length) : null),
    [points]
  )
  const fft = useMemo(() => (radix ? new FFT(radix) : null), [radix])
  const [fftData, setFFTData] = useState(null)

  return (
    <Wrapper>
      <InputCanvas onChange={setPoints} />
      <FourierCanvas points={points} fft={fft} onChange={setFFTData} />
      <OutputCanvas fft={fft} real={fftData?.re} imaginary={fftData?.im} />
    </Wrapper>
  )
}
