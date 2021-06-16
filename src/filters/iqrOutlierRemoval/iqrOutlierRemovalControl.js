import React from 'react'

export default function IqrOutlierRemovalControl({
  input,
  filter,
  onChange,
  buttons,
}) {
  return (
    <>
      <div className='settings'>
        <h2>IQR Outlier Removal</h2>
        <div className='space' />
        <div className='buttons'>{buttons}</div>
      </div>
      <div className='range' />
    </>
  )
}
