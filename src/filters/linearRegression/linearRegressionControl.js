import React from 'react'

export default function LinearRegressionControl({ buttons, filterInfo }) {
  return (
    <>
      <div className='settings'>
        <h2>Linear Regression</h2>
        <div className='space' />
        <div className='buttons'>
          {buttons}
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
        </div>
      </div>
      <div className='range' />
    </>
  )
}
