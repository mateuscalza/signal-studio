import { Slider } from '@material-ui/core'
import React from 'react'
import findRadix from '../../utils/findRadix'

export default function IirBandstopControl({
  input,
  filter,
  onChange,
  buttons,
  filterInfo,
}) {
  const min = 0
  const max =
    input.values && input.values.length
      ? findRadix(input.values.length) - 1
      : null

  return (
    <>
      <div className='settings'>
        <h2>IIR Bandstop</h2>
        <label>
          Start
          <input
            type='number'
            value={String(filter.stopStart)}
            onChange={(event) =>
              onChange({ stopStart: Number(event.target.value) })
            }
            min={min}
            max={filter.stopEnd}
            step={1}
          />
        </label>
        <label>
          Stop
          <input
            min={filter.stopStart}
            max={max}
            type='number'
            value={String(filter.stopEnd)}
            onChange={(event) =>
              onChange({ stopEnd: Number(event.target.value) })
            }
            step={1}
          />
        </label>
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
            max={12}
          />
        </label>
        <div className='space' />
        <div className='buttons'>
          {filterInfo.iirFilterCoefficients?.length ? (
            <a
              className='button gray'
              href={`data:text/json;charset=utf-8,${escape(
                JSON.stringify(filterInfo.iirFilterCoefficients[0])
              )}`}
              download='coefficients.json'
            >
              Coefficients
            </a>
          ) : null}
          {buttons}
        </div>
      </div>
      <div className='range'>
        {max ? (
          <Slider
            min={min}
            max={max}
            step={1}
            value={[filter.stopStart, filter.stopEnd]}
            onChange={(event, [stopStart, stopEnd]) =>
              onChange({ stopStart, stopEnd })
            }
            valueLabelDisplay='auto'
            aria-labelledby='range-slider'
          />
        ) : null}
      </div>
    </>
  )
}
