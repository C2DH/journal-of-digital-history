import React from 'react'
import ArticleCellContent from './ArticleCellContent'
import ArticleCellSourceCode from './ArticleCellSourceCode'
import ArticleCellOutput from './ArticleCellOutput'
import { Container, Row, Col } from 'react-bootstrap'

const ArticleCellGroup = ({ cellGroup, step=0, currentStep=-1, progress=0.0, onDataHrefClick, debug, style, height=200, width=200 }) => {
  const sections = cellGroup.getGroupSections()
  const sectionWidth = width / 2
  return (
    <div className="ArticleCellGroup py-5 d-flex flex-column" style={{ width, height, alignIems: 'stretch' }}>
      <div className="border-bottom border-accent flex-grow-1">
      {sections.map((section,i) => (
        <h3 key={i} style={{
          width: sectionWidth,
        }}>{section.title}</h3>
      ))}
      </div>
      <div className="border-bottom border-accent d-flex"><div className="position-relative h-100">
      {sections.map((section,i) => (
        <div className="position-absolute h-100" key={i} style={{ top:0, width: width/3, overflow: 'scroll' }}>
        {section.cells.map((cell,j) => {
            const data = step + i/1000
            return (
              <div key={[i,j].join('-')} className={`ArticleCellGroup  ${data === currentStep? ' active': ''}`}
                id={`C-${cell.idx}`}
                onClick={(e) => {
                  const dataHref = e.target.getAttribute('data-href')
                  onDataHrefClick({ dataHref, idx: cell.idx })
                }}
              >
                {cell.type === 'markdown'
                  ? <ArticleCellContent layer={cell.layer} content={cell.content} idx={cell.idx} num={cell.num} hideNum />
                  : (
                    <>
                    <ArticleCellSourceCode content={cell.content} language="python" />
                    {cell.outputs.length
                      ? cell.outputs.map((output,i) => <ArticleCellOutput output={output} key={i} />)
                      : <div className="ArticleCellSourceCode_no_output">no output</div>
                    }
                    </>
                  )
                }
              </div>
            )})}
        </div>
      ))}</div>
      </div>
    </div>
  )
}

// const ArticleCellGroup = ({ cellGroup, step=0, currentStep=-1, progress=0.0, onDataHrefClick, debug, style, height=200, width }) => {
//   const sections = cellGroup.getGroupSections()
//   return (
//     <Container fluid className="ArticleCellGroup position-relative  text-white">
//       <Row>
//         <Col md={{span: 2, offset:0}}>
//       <div className="ArticleCellGroup_toc bg-white p-3 mt-3 text-right" style={{
//         position: 'sticky',
//         top: '2rem',
//       }}>
//       {sections.map((section,i) => (<h3 className="ArticleCellGroup_sectionHeader text-accent border-bottom border-accent mb-5" key={i}>{section.title}</h3>))}
//       </div>
//         </Col>
//         <Col md={{span: 8, offset:0}} className="bg-accent" style={{ height: height, overflow: 'scroll'}}>
//     {cellGroup.cells.map((cell, i) => {
//       if(cell.isHeading) {
//         return null
//       }
//       const data = step + i/1000
//       return (
//         <div className={`ArticleCellGroup border-top border-accent  ${data === currentStep? ' active': ''}`}
//           id={`C-${cell.idx}`}
//           onClick={(e) => {
//             const dataHref = e.target.getAttribute('data-href')
//             onDataHrefClick({ dataHref, idx: cell.idx })
//           }}
//         >
//           {cell.type === 'markdown'
//             ? <ArticleCellContent layer={cell.layer} content={cell.content} idx={cell.idx} num={cell.num} hideNum />
//             : (
//               <>
//               <ArticleCellSourceCode content={cell.content} language="python" />
//               {cell.outputs.length
//                 ? cell.outputs.map((output,i) => <ArticleCellOutput output={output} key={i} />)
//                 : <div className="ArticleCellSourceCode_no_output">no output</div>
//               }
//               </>
//             )
//           }
//         </div>
//       )
//     })}
//         </Col>
//       </Row>
//     </Container>
//   )
// }

export default ArticleCellGroup
