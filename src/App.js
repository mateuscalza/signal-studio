import React from 'react'
import styled from 'styled-components'
import InputCanvas from './components/inputCanvas'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default function App() {
  return (
    <Wrapper>
      <InputCanvas />
    </Wrapper>
  )
}
