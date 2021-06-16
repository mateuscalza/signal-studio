import React, { useMemo } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  button {
    margin: 5px;
  }
`
export default function Download({ input, output }) {
  const csv = useMemo(
    () =>
      escape(
        output.values
          .map(
            (value, index) =>
              `${index * output.interval + output.initialTime},${value}`
          )
          .join('\n')
      ),
    [output]
  )

  return (
    <Wrapper>
      <a
        className='button'
        href={`data:text/csv;charset=utf-8,${csv}`}
        download='output.csv'
      >
        Download output
      </a>
    </Wrapper>
  )
}
