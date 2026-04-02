import { markdownParser } from "./markdown";

/**
 * useMemo hook that processes the outputs of an article figure to extract captions, pictures and other outputs.
 * It checks if a caption has been added to the cell metadata.
 * */
export const getFigureOutputs = (outputs, metadata) =>
  [{ metadata }].concat(outputs).reduce(
    (acc, output = {}) => {
      if (output.metadata && Array.isArray(output.metadata?.jdh?.object?.source)) {
        // look for catpions in the outputs metadata
        acc.captions.push(markdownParser.render(output.metadata.jdh.object.source.join('\n')))
      }

      const mimetypes = Object.keys(output.data ?? [])
      const mimetype = mimetypes.find((d) => d.indexOf('image/') === 0)
      const outputProps = output ? Object.keys(output) : []
      const isOutputEmpty =
        outputProps.length === 0 ||
        (outputProps.length === 1 && outputProps.shift() === 'metadata')
      const isHTML = mimetypes.includes('text/html')

      if (isHTML) {
        acc.htmlOutputs.push(output)
      }

      if (mimetype) {
        acc.pictures.push({
          // ...output,
          src: output.metadata?.jdh?.object?.src,
          base64: `data:${mimetype};base64,${output.data[mimetype]}`,
        })
      } else if (!isOutputEmpty) {
        acc.otherOutputs.push(output)
      }

      return acc
    },
    { captions: [], pictures: [], otherOutputs: [], htmlOutputs: [] },
  );


/**
 * Get column layout from the given outputs
 * 
 * @param {object[]} outputs
 *    Array of outputs from which to get the column layout
 * @param {object} defaultColumLayout 
 *    The default column layout if not specified in the outputs
 * 
 * @returns
 *    The column layout defined in the given outputs
 *    or the defaultColumnLayout if not defiend 
 */
export const getOutputsColumnLayout = (outputs, defaultColumLayout = {}) =>
  outputs.reduce((acc, output) => {
    if (output.metadata?.jdh?.object?.bootstrapColumLayout) {
      acc = { acc, ...output.metadata.jdh?.object?.bootstrapColumLayout }
    }
    return acc
  }, defaultColumLayout);


/**
 * Get aspect ratio for the figure
 * From https://css-tricks.com/aspect-ratio-boxes/
 * Even when that is a little unintuitive, like for vertical padding.
 * This isn’t a hack, but it is weird: padding-top and padding-bottom is based on the parent element’s width.
 * So if you had an element that is 500px wide, and padding-top of 100%, the padding-top would be 500px.
 * 
 * @param {string[]} tags
 *    The list of tags of the figure 
 * 
 * @returns 
 *    A float which represents the aspect ration of the figure
 */
export const getFigureRatio = tags =>
  tags.reduce((acc, tag) => {
    const ratio = tag.match(/^aspect-ratio-(\d+)-(\d+)$/); // e.g. aspect-ratio-16-9 w/h
    return ratio ? ratio[2] / (ratio[1] || 1) : acc;
  }, 0);


/**
 * Get the height of the figure output from tags
 *  
 * @param {string[]} tags     
 *    The list of tags from which to get the height       
 * @param {int} defaultHeight  
 *    The default height to return if the height is not specified in tags
 * 
 * @returns 
 *    The cell output height if any has been specified with the tags. 
 *    Otherwise the default height
 */
export const getFigureHeight = (tags, defaultHeight = 0) =>
  tags.reduce((acc, tag) => {
      const m = tag.match(/^h-(\d+)px$/) // h-100px
      return m ? m[1] : acc;
    }, defaultHeight);


/**
 * Check if any of the tags specify a height or aspect ratio for the figure output
 * 
 * @param {string[]} tags 
 *    The list of tags from which to get the height       
 * 
 * @returns 
 *    true if any of the tags specify a height or aspect ratio, false otherwise
 */
export const isTaggedFigure = (tags) => tags.some(tag => /^h-(\d+)px$/.test(tag) || /^aspect-ratio-(\d+)-(\d+)$/.test(tag));


/**
 * Get the page size for data table
 * 
 * @param {string[]} tags 
 *    The list of tags from which to get the page size       
 * 
 * @returns 
 *    The page size from tags or -1 if not defined
 */
export const getDataTablePageSize = tags =>
  tags.find((d) => {
    const m = d.match(/^page-size-(\d+)$/);
    return m ? m[1] : false;
  }) || -1


/**
 * Returns true when the source code is a simple image display pattern:
 *   1. from IPython.display import Image
 *   2. metadata= { ... }
 *   3. display(Image(...), metadata=metadata)
 * with no other top-level statements.
 */
export const isSimpleImageDisplay = (source) => {
  if (!source) return false;

  const lines = Array.isArray(source) ? source : source.split('\n');
  const statements = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    // Closing delimiters at column 0 are continuations of the previous statement
    if (/^[}\])]/.test(trimmed)) continue;
    if (/^\S/.test(line)) {
      statements.push(trimmed);
    }
    // indented lines are part of the current statement – skip
  }

  if (statements.length !== 3) return false;

  const importOk = /^from\s+IPython\.display\s+import\s+Image\b/.test(statements[0]);
  const metadataOk = /^metadata\s*=/.test(statements[1]);
  const displayOk = /^display\s*\(\s*Image\s*\(/.test(statements[2]);

  return importOk && metadataOk && displayOk;
}
