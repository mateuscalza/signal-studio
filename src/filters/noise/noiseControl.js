import React from 'react'

export default function NoiseControl({ input, filter, onChange, buttons }) {
  return (
    <>
      <div className='settings'>
        <h2>Noise</h2>
        <label>
          Scale
          <input
            type='number'
            value={String(filter.scale)}
            onChange={(event) =>
              onChange({ scale: Number(event.target.value) })
            }
            min={0}
            step={0.01}
            max={5}
          />
        </label>
        <div className='space' />
        <div className='buttons'>{buttons}</div>
      </div>
      <div className='range' />
    </>
  )
}
