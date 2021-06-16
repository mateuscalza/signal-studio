import React from 'react'
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
  button {
    margin: 5px;
  }
`

export default function FiltersControls({
  input,
  filters,
  onAddFilter,
  onChange,
  filtersInfo,
}) {
  return (
    <Wrapper>
      <ReactSortable
        list={filters}
        setList={onChange}
        className='sortable'
        handle='h2'
      >
        {filters.map((filter, index) => (
          <FilterControl
            key={filter.id}
            filter={filter}
            input={input}
            filterInfo={filtersInfo[index] || {}}
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
            onRemove={() =>
              onChange((old) =>
                old.filter(
                  (currentFilter, currentIndex) => currentIndex !== index
                )
              )
            }
          />
        ))}
      </ReactSortable>
      <button
        onClick={(event) => {
          event.preventDefault()
          onAddFilter()
        }}
      >
        Add filter
      </button>
    </Wrapper>
  )
}
