import React from 'react'

export default function FftBandstopControl({ filter, onChange }) {
  return (
    <>
      <h2>FFT Bandstop</h2>
      <label>
        Start
        <input
          type='number'
          value={filter.stopStart}
          onChange={(event) => onChange({ stopStart: event.target.value })}
        />
      </label>
      <label>
        Stop
        <input
          type='number'
          value={filter.stopEnd}
          onChange={(event) => onChange({ stopEnd: event.target.value })}
        />
      </label>
      {/* <label>
        Order
        <input
          type='number'
          value={filter.order}
          onChange={(event) => onChange({ order: event.target.value })}
        />
      </label> */}
    </>
  )
}
