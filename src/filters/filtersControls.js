import React, { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import styled from 'styled-components'
import FilterControl from './filterControl'

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;

  .sortable {
    width: 100%;
  }
`

export default function FiltersControls({ filters, onChange }) {
  return (
    <Wrapper>
      <ReactSortable list={filters} setList={onChange} className='sortable'>
        {filters.map((filter, index) => (
          <FilterControl
            key={filter.id}
            filter={filter}
            onChange={(filterUpdate) =>
              onChange((old) =>
                old.map((currentFilter, currentIndex) =>
                  currentIndex === index
                    ? {
                        ...currentFilter,
                        ...filterUpdate,
                      }
                    : currentFilter
                )
              )
            }
          />
        ))}
      </ReactSortable>
      <button>Add filter</button>
    </Wrapper>
  )
}
