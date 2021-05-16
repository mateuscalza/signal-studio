import React from 'react'
import styled from 'styled-components'
import InputCanvas from './components/inputCanvas'
import FourierCanvas from './components/fourierCanvas'
import OutputCanvas from './components/outputCanvas'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default function App() {
  return (
    <Wrapper>
      <InputCanvas />
      <FourierCanvas />
      <OutputCanvas />
    </Wrapper>
  )
}
