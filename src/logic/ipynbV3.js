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
  }, undefined);


/**
 * Get the height of the figure from tags
 *  
 * @param {string[]} tags     
 *    The list of tags from which to get the height       
 * @param {int} windowHeight  
 *    Height of the window used to calculate default height
 * @param {boolean} isCover   
 *    Boolean value which indicates the image is a cover. Used to calculate default height
 * 
 * @returns 
 *    The figure height if any has been specified with the tags. 
 *    Otherwise default is windowHeight * .5 for standard image
 *    windowHeight * .8 for cover image
 */
export const getFigureHeight = (tags, defaultHeight = 0) =>
  tags.reduce((acc, tag) => {
      const m = tag.match(/^h-(\d+)px$/) // h-100px
      return m ? m[1] : acc;
    }, defaultHeight);


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
