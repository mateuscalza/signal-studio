import React from 'react'

export default function PolynomialRegressionControl({
  input,
  filter,
  onChange,
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
            max={15}
          />
        </label>
      </div>
      <div className='range' />
    </>
  )
}
