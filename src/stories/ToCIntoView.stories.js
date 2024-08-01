import React, { useRef } from 'react'
import ToCIntoView from '../components/ToCIntoView'

export default {
  component: ToCIntoView,
  title: 'ToCIntoView',
  argTypes: {
    targetOffsetTop: { control: { type: 'number' } },
    width: { control: { type: 'number' } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'This component show a mini tooltip to indicate the scrolling direction to reach the `targetOffsetTop`.',
      },
    },
  },
}

const Template = (args) => {
  const targetRef = useRef(null)
  return (
    <div className="position-relative border border-dark">
      <section
        ref={targetRef}
        style={{
          height: 150,
          overflow: 'scroll',
        }}
      >
        <div style={{ height: args.targetOffsetTop }}>Scroll to reach the target...</div>
        <div style={{ background: 'limegreen', lineHeight: '20px', height: 20 }}>
          <b>and you found me!</b>
        </div>
        <div style={{ height: args.targetOffsetTop * 2 }}></div>
      </section>
      <ToCIntoView targetRef={targetRef} {...args} />
    </div>
  )
}

export const Default = Template.bind({})

Default.args = {
  targetOffsetTop: 250,
  targetHeight: 20,
}
