import { useRef, useState } from 'react';
import { useArticleStore } from '../../store'
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
  // vndMimeTypes = [],
  cellIdx,
}) => {
  if (!isJavascriptTrusted || !outputs.length) {
    return null
  }
  const ref = useRef(null);

  const [iframeHeight, setHeight] = useState(isNaN(height) ? 200 : height);
  const iframeHeader = useArticleStore((state) => state.iframeHeader)
  const articleVersion = useArticleStore((state) => state.articleVersion)
  const addIframeHeader = useArticleStore((state) => state.addIframeHeader)

  const onLoad = () => {
    if(height === 0 || height === 'auto') 
      setHeight(ref.current.contentWindow.document.body.scrollHeight);
  };

  // if in isolationMode, the srcDoc will be the output data
  const srcDoc = isolationMode
    ? outputs.reduce((acc, output) => {
        const isEmbeddable = ['execute_result', 'display_data'].includes(output.output_type)
        if (isEmbeddable) {
          // application/javascript
          if (output.data['application/javascript']) {
            acc.push('<script>')

            if (Array.isArray(output.data['application/javascript']))
              acc.push(...output.data['application/javascript'])
            else acc.push(output.data['application/javascript'])

            acc.push('</script>')
          }

          // text/html
          if (output.data['text/html']) {
            if (Array.isArray(output.data['text/html'])) {
              acc.push(...output.data['text/html'])
            } else {
              acc.push(output.data['text/html'])
            }
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

  let iframeSrcDoc = srcDoc.join('').trim()
  // use regex to test if there is an iframe to prevent nested iframes.
  // if there is an iframe, get t
  const isIframeOrMedia =
    /(<iframe[\s\S]*<\/iframe>|<audio[\s\S]*<\/audio>|<video[\s\S]*<\/video>)/g.test(iframeSrcDoc)

  if (isIframeOrMedia) {
    const isIframe = /<iframe[\s\S]*<\/iframe>/g.test(iframeSrcDoc)
    if (isIframe) {
      // replace the height iframe with our iframeHeight variable; the width will be 100%
      iframeSrcDoc = iframeSrcDoc.replace(
        /height=".*?"/,
        `height="${iframeHeight}px"
      style="width: 100%;"`,
      )
      // replace the width iframe with our iframeHeight variable; the width will be 100%
      iframeSrcDoc = iframeSrcDoc.replace(/width=".*?"/, `width="100%"`)
    }
    return <div dangerouslySetInnerHTML={{ __html: iframeSrcDoc }}></div>
  }

  //  Issue #681: Isolation mode
  //  Check if iframeSrcDoc starts with a script tag
  //  If it does, remove the script tag and add it to the iframeHeader
  const scriptTagMatch = iframeSrcDoc.match(/^<script[\s\S]*?<\/script>/)
  if (scriptTagMatch) {
    const scriptTag = scriptTagMatch[0]
    iframeSrcDoc = iframeSrcDoc.replace(scriptTag, '').trim()
    addIframeHeader(scriptTag)
  }

  //  Go deeper with the Iframe Inception Pattern  :)
  iframeSrcDoc =
    (iframeHeader.length
      ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>'
      : '') +
    (articleVersion === 3 ? '<style> body { color:white; } </style>' : '') +
    '<link rel="stylesheet" href="/css/iframe.css">' +
    iframeHeader.join('') +
    iframeSrcDoc

  return (
    <iframe
      ref={ref}
      onLoad={onLoad}
      sandbox="allow-scripts allow-modal allow-same-origin"
      loading="eager"
      srcDoc={iframeSrcDoc}
      height={`${iframeHeight}px`}
      width="100%"
    ></iframe>
  )
}

export default ArticleCellOutputsAsIframe
