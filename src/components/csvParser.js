import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { median } from 'simple-statistics'
import { useFileContents } from '../hooks/fileContents'

export default function CsvParser({ file, onChange }) {
  const [lineSeparator, setLineSeparator] = useLocalStorage(
    'lineSeparator',
    '\\n'
  )
  const [columnSeparator, setColumnSeparator] = useLocalStorage(
    'columnSeparator',
    ','
  )
  const [interval, setInterval] = useState(1)
  const [valueColumn, setValueColumn] = useLocalStorage('valueColumn', 0)
  const [timeColumn, setTimeColumn] = useLocalStorage('timeColumn', null)
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

    const lines = content.split(lineSeparatorRegExp).map((line) => {
      const columns = columnSeparatorRegExp
        ? line.split(columnSeparatorRegExp)
        : [line]

      const value = Number(columns[valueColumn])
      const time = timeColumn ? Number(columns[timeColumn]) : null
      return [
        isNaN(value) && value !== null ? null : value,
        isNaN(time) && time !== null ? null : time,
      ]
    })

    const sortedLines = timeColumn
      ? lines.sort(([, aTime], [, bTime]) => aTime - bTime)
      : lines

    return sortedLines
  }, [fileContents, lineSeparator, columnSeparator, valueColumn, timeColumn])
  const datasetMedianInterval = useMemo(() => {
    const hasTime = items.find((item) => typeof item[1] === 'number')
    if (!hasTime) {
      return null
    }

    const [, ...differences] = items.map(([, time], index) =>
      index !== 0 ? time - items[index - 1][1] : null
    )
    return median(differences)
  }, [items])

  useEffect(() => {
    if (
      typeof datasetMedianInterval === 'number' &&
      datasetMedianInterval > 0
    ) {
      setInterval(String(datasetMedianInterval))
    }
  }, [datasetMedianInterval])

  return (
    <form>
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
          onChange={(event) => setValueColumn(Number(event.target.value) - 1)}
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
        Time column
        <select
          onChange={(event) =>
            setTimeColumn(
              event.target.value && isFinite(event.target.value)
                ? Number(event.target.value) - 1
                : null
            )
          }
        >
          <option>No time column</option>
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
    </form>
  )
}
