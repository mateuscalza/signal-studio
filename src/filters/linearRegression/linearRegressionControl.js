import React from 'react'

export default function LinearRegressionControl({
  input,
  filter,
  onChange,
  buttons,
}) {
  return (
    <>
      <div className='settings'>
        <h2>Linear Regression</h2>
        {buttons}
      </div>
      <div className='range' />
    </>
  )
}
