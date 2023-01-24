import React from 'react'

const ArticleCellIframeOutputs = ({
  isJavascriptTrusted,
  outputs = [],
  cellIdx,
  height = 'auto',
}) => {
  if (!isJavascriptTrusted) {
    return null
  }
  const iframeHeight = isNaN(height) ? 100 : height
  // concatenate src doc for each output
  const srcDoc = outputs.reduce(
    (acc, output, i) => {
      if (output.output_type === 'display_data' && output.data['application/javascript']) {
        acc.push(
          '<script>\n',
          '  window.addEventListener("load", function () { \n',
          '    var element = $("#root");\n',
          ...output.data['application/javascript'],
          '  })\n',
          '</script>',
        )
      }
      if (i === outputs.length - 1) {
        acc.push('</body></html>')
      }
      return acc
    },
    [
      '<!DOCTYPE html>\n',
      '<html>\n',
      `<head><meta charset="utf-8"><title>${cellIdx}</title>`,
      '  <link rel="preconnect" href="https://fonts.googleapis.com">\n',
      '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n',
      '  <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital@0;1&display=swap" rel="stylesheet">\n',
      '  <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js" integrity="sha512-c3Nl8+7g4LMSTdrm621y7kf9v3SDPnhxLNhcjFJbKECVnmZHTdo+IRO05sNLTH/D3vA6u1X32ehoLC7WFVdheg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>\n',
      '  <script src="https://code.jquery.com/jquery-3.6.3.slim.min.js" integrity="sha256-ZwqZIVdD3iXNyGHbSYdsmWP//UBokj2FHAxKuSBKDSo=" crossorigin="anonymous"></script>\n',
      '  <script>require.config({ paths: { d3: "https://d3js.org/d3.v5.min" } });</script>\n',
      '  <style>\n',
      '    html, body { width: 100%; height: 100%; }\n',
      '    body { margin: 0; padding: 0; font-family: "Fira Sans", sans-serif; font-size:1em}\n',
      '    svg { width: 100%; height: 100%; }\n',
      '    #root { width: 100%; height: 100%; }\n',
      '  </style>\n',
      '</head>\n',
      '  <body>\n',
      '    <div id="root"></div>\n',
    ],
  )
  return (
    <iframe
      sandbox="allow-scripts allow-modal"
      loading="eager"
      srcDoc={srcDoc.join('')}
      height={`${iframeHeight}px`}
      width="100%"
    ></iframe>
  )
}

export default ArticleCellIframeOutputs
