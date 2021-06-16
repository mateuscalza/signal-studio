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
        {buttons}
      </div>
      <div className='range' />
    </>
  )
}
