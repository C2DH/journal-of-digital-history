import { colorsPeerReviewChart } from '../../styles/theme'
import { series } from './constant'

const Legend = () => {
  return (
    <div>
      {series.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: colorsPeerReviewChart[i],
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
            {typeof s.label === 'function' ? s.label('legend') : s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Legend
