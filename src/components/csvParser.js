import * as math from 'mathjs'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useLocalStorage } from 'react-use'
import { max, median, min } from 'simple-statistics'
import { useFileContents } from '../hooks/fileContents'
import fillMissing from '../utils/fillMissing'

/* eslint-disable no-implied-eval */

const maxSupportedFrequency = 1000000
const minInterval = 1 / maxSupportedFrequency
const timeRound = String(maxSupportedFrequency).length - 1

export default function CsvParser({ file, onChangeInput, onEnd }) {
  const [lineSeparator, setLineSeparator] = useLocalStorage(
    'lineSeparator',
    '\\n'
  )
  const [columnSeparator, setColumnSeparator] = useLocalStorage(
    'columnSeparator',
    ','
  )
  const [interval, setInterval] = useState('1')
  const [maxAmplitude, setMaxAmplitude] = useState('1')
  const [minAmplitude, setMinAmplitude] = useState('0')
  const [skipLines, setSkipLines] = useState('0')
  const [dropLastLines, setDropLastLines] = useState('0')
  const [valueColumn, setValueColumn] = useLocalStorage('valueColumn', '0')
  const [timeColumn, setTimeColumn] = useLocalStorage(
    'timeColumn',
    'No time column'
  )
  const fileContents = useFileContents(file)
  const items = useMemo(() => {
    const content = fileContents.value
    if (!content || !lineSeparator) {
      return []
    }

    const lineSeparatorRegExp = new RegExp(lineSeparator)
    const columnSeparatorRegExp = columnSeparator
      ? new RegExp(columnSeparator)
      : null

    const valueColumnIndex =
      valueColumn && isFinite(valueColumn) ? Number(valueColumn) - 1 : null

    const timeColumnIndex =
      timeColumn && isFinite(timeColumn) ? Number(timeColumn) - 1 : null

    const lines = content.split(lineSeparatorRegExp).map((line) => {
      const columns = columnSeparatorRegExp
        ? line.split(columnSeparatorRegExp)
        : [line]

      const value = Number(columns[valueColumnIndex])
      const time =
        timeColumnIndex !== null ? Number(columns[timeColumnIndex]) : null
      return [
        isNaN(value) && value !== null ? null : value,
        isNaN(time) && time !== null ? null : time,
      ]
    })

    const sortedLines =
      timeColumnIndex !== null
        ? lines.sort(([, aTime], [, bTime]) => aTime - bTime)
        : lines

    return sortedLines
  }, [fileContents, lineSeparator, columnSeparator, valueColumn, timeColumn])
  const [datasetMedianInterval, datasetMinTime] = useMemo(() => {
    const firstItem = items.find((item) => typeof item[1] === 'number')
    if (!firstItem) {
      return [null, 0]
    }

    const [, ...differences] = items.map(([, time], index) =>
      index !== 0 &&
      typeof time === 'number' &&
      typeof items[index - 1][1] === 'number'
        ? time - items[index - 1][1]
        : 0
    )
    return [median(differences), firstItem[1] || 0]
  }, [items])
  const [datasetMinAmplitude, datasetMaxAmplitude] = useMemo(() => {
    const values = items.map(([value]) =>
      typeof value === 'number' ? value : 0
    )

    if (!values.length) {
      return [null, null]
    }

    return [min(values), max(values)]
  }, [items])

  useEffect(() => {
    if (typeof datasetMedianInterval === 'number') {
      const normalizedInterval = math.round(
        Math.max(minInterval, datasetMedianInterval),
        timeRound
      )
      setInterval(String(normalizedInterval))
    } else {
      setInterval(String(1))
    }
  }, [datasetMedianInterval])

  useEffect(() => {
    if (
      typeof datasetMinAmplitude === 'number' &&
      typeof datasetMaxAmplitude === 'number'
    ) {
      setMinAmplitude(String(datasetMinAmplitude))
      setMaxAmplitude(String(datasetMaxAmplitude))
    } else {
      setInterval('1')
    }
  }, [datasetMinAmplitude, datasetMaxAmplitude])

  useDebounce(
    () => {
      const values = fillMissing(items.map(([value]) => value)).slice(
        Number(skipLines),
        items.length - Number(dropLastLines)
      )
      if (
        !isFinite(minAmplitude) ||
        !isFinite(maxAmplitude) ||
        !isFinite(interval) ||
        !isFinite(datasetMinTime)
      ) {
        return
      }

      const minAmplitudeNumber = Number(minAmplitude)
      const maxAmplitudeNumber = Number(maxAmplitude)
      onChangeInput((old) => ({
        ...old,
        values,
        source: 'file',
        minAmplitude: minAmplitudeNumber,
        maxAmplitude: maxAmplitudeNumber,
        originalMinAmplitude: minAmplitudeNumber,
        originalMaxAmplitude: maxAmplitudeNumber,
        interval: Number(interval),
        initialTime: datasetMinTime,
        filterInfo: {},
      }))
    },
    500,
    [
      items,
      minAmplitude,
      maxAmplitude,
      interval,
      datasetMinTime,
      skipLines,
      dropLastLines,
    ]
  )

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onEnd()
      }}
    >
      <label>
        Line separator
        <input
          value={lineSeparator}
          onChange={(event) => setLineSeparator(event.target.value)}
        />
      </label>
      <label>
        Column separator
        <input
          value={columnSeparator}
          onChange={(event) => setColumnSeparator(event.target.value)}
        />
      </label>
      <label>
        Value column
        <select
          value={valueColumn}
          onChange={(event) => setValueColumn(event.target.value)}
        >
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
          <option value='9'>9</option>
          <option value='10'>10</option>
          <option value='11'>11</option>
          <option value='12'>12</option>
          <option value='13'>13</option>
          <option value='14'>14</option>
          <option value='15'>15</option>
        </select>
      </label>
      <label>
        Time column (seconds)
        <select
          value={timeColumn}
          onChange={(event) => setTimeColumn(event.target.value)}
        >
          <option value='No time column'>No time column</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
          <option value='9'>9</option>
          <option value='10'>10</option>
          <option value='11'>11</option>
          <option value='12'>12</option>
          <option value='13'>13</option>
          <option value='14'>14</option>
          <option value='15'>15</option>
        </select>
      </label>
      <label>
        Time interval (seconds)
        <input
          type='number'
          value={interval}
          onChange={(event) => setInterval(event.target.value)}
        />
      </label>
      <label>
        Minimum amplitude
        <input
          type='number'
          value={minAmplitude}
          onChange={(event) => setMinAmplitude(event.target.value)}
        />
      </label>
      <label>
        Maximum amplitude
        <input
          type='number'
          value={maxAmplitude}
          onChange={(event) => setMaxAmplitude(event.target.value)}
        />
      </label>
      <label>
        Skip lines
        <input
          type='number'
          value={skipLines}
          onChange={(event) => setSkipLines(event.target.value)}
          min={0}
          step={1}
        />
      </label>
      <label>
        Drop last lines
        <input
          type='number'
          value={dropLastLines}
          onChange={(event) => setDropLastLines(event.target.value)}
          min={0}
          step={1}
        />
      </label>

      <div className='space' />

      <input type='submit' value='Ok' />
    </form>
  )
}
