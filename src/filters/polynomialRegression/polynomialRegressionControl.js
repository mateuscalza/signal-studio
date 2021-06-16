import React from 'react'

export default function PolynomialRegressionControl({
  input,
  filter,
  onChange,
  buttons,
  filterInfo,
}) {
  return (
    <>
      <div className='settings'>
        <h2>Polynomial Regression</h2>
        <label>
          Order
          <input
            type='number'
            value={String(filter.order)}
            onChange={(event) =>
              onChange({ order: Number(event.target.value) })
            }
            min={1}
            step={1}
            max={3}
          />
        </label>
        <div className='space' />
        <div className='buttons'>
          {filterInfo.string ? (
            <a
              className='button gray'
              href={`data:text/plain;charset=utf-8,${escape(
                filterInfo.string
              )}`}
              download='expression.txt'
            >
              Equation
            </a>
          ) : null}
          {buttons}
        </div>
      </div>
      <div className='range' />
    </>
  )
}
