import { useMemo } from 'react'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { extent } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale'


export const useStackProps = ({ encoding, data, width, height }) => {
  // { "t": "2014-01-01", "layer": "v0", "c": 20 },
  // { "t": "2014-01-01", "layer": "v1", "c": 30 },
  // { "t": "2014-01-01", "layer": "v2", "c": 30 },
  // to
  // { "t": "2014-01-01", "v0": 20, "v1": 30, "v2": c, x: new Date },
  const { xMin, xMax, yMin, yMax, keys, values } = useMemo(() => {
    const values = data.values.map(d => ({
      ...d,
      x: moment.utc(d[encoding.x.field], d[encoding.x.format]),
    }))
    const xGroups = groupBy(values, encoding.x.field)
    const [yMin, yMax] = Object.keys(xGroups).reduce(([valueMin, valueMax], idx) => {
      const aggregation = xGroups[idx].reduce((acc, d) => acc + d[encoding.y.field], 0)
      return [
        Math.min(0, aggregation),
        Math.max(valueMax, aggregation)
      ]
    }, [Infinity,-Infinity])
    const colorGroups = groupBy(values, encoding.color.field)
    const [xMin, xMax] = extent(values, (d) => d.x)
    const keys = Object.keys(colorGroups)
    // format data according to keys
    const groupedData = Object.keys(xGroups).map((x) => xGroups[x].reduce((acc, d) => {
      acc[d[encoding.color.field]] = d[encoding.y.field]
      acc[d[encoding.x.field]] = d[encoding.x.field]
      acc.x = d.x
      return acc
    }, { x }))
    return { xMin, xMax, yMin, yMax, keys, values: groupedData }
  }, [encoding, data])

  // scales
  const { xScale, yScale, x, y0, y1 } = useMemo(() => {
    const xScale = scaleTime().domain([xMin, xMax]).range([100, width -100])
    const yScale = scaleLinear().domain([yMin, yMax]).range([100, height - 100])
    // value fn, for x is the moment time value
    const x = (d) => xScale(d.data.x)
    const y0 = (d,i) => yScale(d[0]) ?? 0
    const y1 = (d) => yScale(d[1]) ?? 0
    //
    return { xScale, yScale, x, y0, y1 }
  }, [xMin, xMax, yMin, yMax, height, width])

  return { xScale, yScale, x, y0, y1, xMin, xMax, yMin, yMax, keys, values }
}
