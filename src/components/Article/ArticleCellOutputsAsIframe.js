import React from 'react'

/**
 * Renders a Jupyter Notebook cell's outputs as an iframe.
 *
 * @param {Object} props - The component props.
 * @param {boolean} [props.isJavascriptTrusted=false] - Whether to trust JavaScript output.
 * @param {boolean} [props.isolationMode=false] - Whether to run the iframe in isolation mode.
 * @param {Array} [props.outputs=[]] - The cell's output data.
 * @param {string|number} [props.height='auto'] - The height of the iframe.
 * @param {Array} [props.vndMimeTypes=[]] - The MIME types to render as iframes.
 * @param {number} [props.cellIdx] - The index of the cell in the notebook.
 * @returns {JSX.Element|null} The rendered component, or null if JavaScript output is not trusted.
 */
const ArticleCellOutputsAsIframe = ({
  isJavascriptTrusted = false,
  isolationMode = false,
  outputs = [],
  height = 'auto',
  vndMimeTypes = [],
  cellIdx,
}) => {
  if (!isJavascriptTrusted) {
    return null
  }
  const iframeHeight = isNaN(height) ? 200 : height
  // if in isolationMode, the srcDoc will be the output data
  const srcDoc = isolationMode
    ? outputs.reduce((acc, output) => {
        if (output.output_type === 'display_data' && output.data['text/html']) {
          if (Array.isArray(output.data['text/html'])) {
            acc.push(...output.data['text/html'])
          } else {
            acc.push(output.data['text/html'])
          }
        }
        return acc
      }, [])
    : [
        '<!DOCTYPE html>\n',
        '<html>\n',
        `<head><meta charset="utf-8"><title>${cellIdx}</title>`,
        '  <link rel="preconnect" href="https://fonts.googleapis.com">\n',
        '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n',
        '  <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital@0;1&display=swap" rel="stylesheet">\n',
        '  <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha512-c3Nl8+7g4LMSTdrm621y7kf9v3SDPnhxLNhcjFJbKECVnmZHTdo+IRO05sNLTH/D3vA6u1X32ehoLC7WFVdheg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>\n',
      ]
  console.debug(
    '[ArticleCellOutputsAsIframe] \n - vndMimeTypes:',
    vndMimeTypes,
    '\n - cellIdx:',
    cellIdx,
  )
  return (
    <iframe
      style={{ backgroundColor: 'grey' }}
      sandbox="allow-scripts allow-modal"
      loading="eager"
      srcDoc={srcDoc.join('')}
      height={`${iframeHeight}px`}
      width="100%"
    ></iframe>
  )
}

export default ArticleCellOutputsAsIframe
