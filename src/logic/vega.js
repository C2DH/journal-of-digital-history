import { useMemo } from 'react'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { extent, bisectLeft } from 'd3-array'
import { scaleTime, scaleLinear } from 'd3-scale'

const getFromEncodingPosition = ({ type, field, format} = {}) => {
  // The type of measurement ("quantitative", "temporal", "ordinal", or "nominal")
  // for the encoded field or constant value (datum).
  // It can also be a "geojson" type for encoding ‘geoshape’.
  if (type === 'temporal') {
    return [
      (d) => moment.utc(d[field], d[format]),
      scaleTime
    ]
  }
  if (type === 'quantitative') {
    return [
      (d) => d[field],
      scaleLinear // or TODO get some other scale rom encoding
    ]
  }
}

export const getClosestDatumIdxFromX = ({x, xValues }) => {
  const insertIdx = parseInt(bisectLeft(xValues, x), 10)
  const closestDatumIdx = insertIdx === 0
      ? 0
      : (
        Math.abs(x - xValues[insertIdx]) >  Math.abs(x - xValues[insertIdx - 1])
        ? insertIdx - 1
        : insertIdx
      )
  return closestDatumIdx
}

export const getClosestDatumIdxFromXY = ({x, y, xValues, yValues}) => {
  const insertIdx = parseInt(bisectLeft(xValues, x), 10)
  const closestDatumIdx = insertIdx === 0
      ? 0
      : (
        Math.abs(x - xValues[insertIdx]) >  Math.abs(x - xValues[insertIdx - 1])
        ? insertIdx - 1
        : insertIdx
      )
  return closestDatumIdx
}

export const useVegaliteProps = ({ encoding = {}, data, width, height }) => {
  const { xMin, xMax, yMin, yMax, xScaleFn, yScaleFn, values } = useMemo(() => {
    const [xFn, xScaleFn] = getFromEncodingPosition(encoding.x)
    const [yFn, yScaleFn] = getFromEncodingPosition(encoding.y)
    const xValues = []
    const yValues = []
    const values = data.values.map((d, i) => {
      xValues.push(xFn(d))
      yValues.push(yFn(d))
      return {
        ...d,
        vx: xValues[i],
        vy: yValues[i],
      }
    })

    const [xMin, xMax] = extent(values, (d) => d.vx)
    const [yMin, yMax] = extent(values, (d) => d.vy)
    return { xMin, xMax, yMin, yMax, xValues, yValues, xScaleFn, yScaleFn, values }
  }, [encoding, data])
  // scales
  const xScale = xScaleFn().domain([xMin, xMax]).range([0, width])
  const yScale = yScaleFn().domain([yMin, yMax]).range([0, height])
  return { xScale, yScale, xMin, xMax, yMin, yMax, values }
}


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
    const xScale = scaleTime().domain([xMin, xMax]).range([0, width])
    const yScale = scaleLinear().domain([yMin, yMax]).range([height, 0])
    // value fn, for x is the moment time value
    const x = (d) => xScale(d.data.x)
    const y0 = (d,i) => yScale(d[0]) ?? 0
    const y1 = (d) => yScale(d[1]) ?? 0
    //
    return { xScale, yScale, x, y0, y1 }
  }, [xMin, xMax, yMin, yMax, height, width])

  return { xScale, yScale, x, y0, y1, xMin, xMax, yMin, yMax, keys, values }
}
