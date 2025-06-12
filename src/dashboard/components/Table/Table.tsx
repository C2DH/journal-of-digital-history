import { ArrowSeparateVertical } from 'iconoir-react'
import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TableProps } from './interface'
import { convertDate } from '../../utils/convertDate'
import { convertLink } from '../../utils/convertLink'
import { convertStatus } from '../../utils/convertStatus'
import { isOrcid } from '../../utils/orcid'
import { getCleanData, getVisibleHeaders } from '../../utils/table'

import './Table.css'

const Table = ({ title, headers, data, sortBy, sortOrder, setSortBy, setSortOrder }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const visibleHeaders = getVisibleHeaders({ data, headers })
  const cleanData = getCleanData({ data, visibleHeaders })

  const handleSort = (header: string) => {
    if (sortBy === header) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(header)
      setSortOrder('asc')
    }
  }

  const handleRowClick = (pid: string) => {
    navigate(`/${title}/${pid}`)
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {visibleHeaders.map((header, idx) => (
            <th key={idx} className={`${header}`}>
              <button
                type="button"
                onClick={() => handleSort(header)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                aria-label={`Sort by ${header}`}
              >
                {t(`${title}.${header}`)}
                <ArrowSeparateVertical
                  style={{
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    transform:
                      sortBy === header
                        ? sortOrder === 'asc'
                          ? 'rotate(0deg)'
                          : 'rotate(180deg)'
                        : 'rotate(0deg)',
                    opacity: sortBy === header ? 1 : 0.4, // faded if not active
                    transition: 'transform 0.2s, opacity 0.2s',
                    display: 'inline-block',
                  }}
                  width={16}
                  height={16}
                  aria-label={
                    sortBy === header
                      ? sortOrder === 'asc'
                        ? 'Ascending'
                        : 'Descending'
                      : 'Unsorted'
                  }
                />
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cleanData.map((row, rIdx) => {
          const isAbstract = title === 'abstracts'
          return (
            <tr
              key={rIdx}
              {...(isAbstract
                ? { onClick: () => handleRowClick(String(row[0])), style: { cursor: 'pointer' } }
                : {})}
            >
              {row.map((cell, cIdx) => {
                const header = headers[cIdx].toLowerCase()
                let content: React.ReactNode = '-'

                if (cell === '' || cell === null) {
                  content = '-'
                } else if (typeof cell === 'string' && header === 'status') {
                  content = convertStatus(cell)
                } else if (typeof cell === 'string' && (cell.startsWith('http') || isOrcid(cell))) {
                  content = convertLink(cell)
                } else if (typeof cell === 'string' && DateTime.fromISO(cell).isValid) {
                  content = convertDate(cell)
                } else {
                  content = cell
                }

                return (
                  <td key={cIdx} className={`${header}`}>
                    {content}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table
