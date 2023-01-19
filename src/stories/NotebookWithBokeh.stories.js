import React from 'react'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import ArticleCell from '../components/Article/ArticleCell'

// Stories for hoks and methds, following Josh Farrant https://farrant.me/posts/documenting-react-hooks-with-storybook
// accessed 04 01 2023
export default {
  title: 'tests/Notebook with bokeh',
  component: ArticleCell,
  argTypes: {
    metadata: { control: { type: 'object' }, defaultValue: {} },
  },
}

const Template = ({ cells, metadata, isJavascriptTrusted }) => {
  const articleTree = useIpynbNotebookParagraphs({
    id: 'memoid',
    cells,
    metadata,
  })

  console.debug('[Article] loading articleTree paragraphs:', articleTree.paragraphs.length)

  return [
    articleTree.paragraphs.map((p, i) => (
      <ArticleCell isJavascriptTrusted={isJavascriptTrusted} key={i} {...p} />
    )),
  ]
}
export const Default = Template.bind({})

Default.args = {
  isJavascriptTrusted: true,
  metadata: {},
  cells: [
    {
      cell_type: 'code',
      execution_count: 1,
      id: '93cb5090',
      metadata: {
        jdh: {
          module: 'object',
          object: {
            source: [
              'figure 5: Lethal Collective Extralegal Incidents, 1783-1865. Hover over points for event-specfic data.',
            ],
          },
        },
        tags: ['figure-5'],
      },
      outputs: [
        {
          data: {
            'text/html': [
              '\n',
              '    <div class="bk-root">\n',
              '        <a href="https://bokeh.org" target="_blank" class="bk-logo bk-logo-small bk-logo-notebook"></a>\n',
              '        <span id="1040">Loading BokehJS ...</span>\n',
              '    </div>',
            ],
          },
          metadata: {},
          output_type: 'display_data',
        },
        {
          data: {
            'application/javascript':
              '\n(function(root) {\n  function now() {\n    return new Date();\n  }\n\n  const force = true;\n\n  if (typeof root._bokeh_onload_callbacks === "undefined" || force === true) {\n    root._bokeh_onload_callbacks = [];\n    root._bokeh_is_loading = undefined;\n  }\n\n  const JS_MIME_TYPE = \'application/javascript\';\n  const HTML_MIME_TYPE = \'text/html\';\n  const EXEC_MIME_TYPE = \'application/vnd.bokehjs_exec.v0+json\';\n  const CLASS_NAME = \'output_bokeh rendered_html\';\n\n  /**\n   * Render data to the DOM node\n   */\n  function render(props, node) {\n    const script = document.createElement("script");\n    node.appendChild(script);\n  }\n\n  /**\n   * Handle when an output is cleared or removed\n   */\n  function handleClearOutput(event, handle) {\n    const cell = handle.cell;\n\n    const id = cell.output_area._bokeh_element_id;\n    const server_id = cell.output_area._bokeh_server_id;\n    // Clean up Bokeh references\n    if (id != null && id in Bokeh.index) {\n      Bokeh.index[id].model.document.clear();\n      delete Bokeh.index[id];\n    }\n\n    if (server_id !== undefined) {\n      // Clean up Bokeh references\n      const cmd_clean = "from bokeh.io.state import curstate; print(curstate().uuid_to_server[\'" + server_id + "\'].get_sessions()[0].document.roots[0]._id)";\n      cell.notebook.kernel.execute(cmd_clean, {\n        iopub: {\n          output: function(msg) {\n            const id = msg.content.text.trim();\n            if (id in Bokeh.index) {\n              Bokeh.index[id].model.document.clear();\n              delete Bokeh.index[id];\n            }\n          }\n        }\n      });\n      // Destroy server and session\n      const cmd_destroy = "import bokeh.io.notebook as ion; ion.destroy_server(\'" + server_id + "\')";\n      cell.notebook.kernel.execute(cmd_destroy);\n    }\n  }\n\n  /**\n   * Handle when a new output is added\n   */\n  function handleAddOutput(event, handle) {\n    const output_area = handle.output_area;\n    const output = handle.output;\n\n    // limit handleAddOutput to display_data with EXEC_MIME_TYPE content only\n    if ((output.output_type != "display_data") || (!Object.prototype.hasOwnProperty.call(output.data, EXEC_MIME_TYPE))) {\n      return\n    }\n\n    const toinsert = output_area.element.find("." + CLASS_NAME.split(\' \')[0]);\n\n    if (output.metadata[EXEC_MIME_TYPE]["id"] !== undefined) {\n      toinsert[toinsert.length - 1].firstChild.textContent = output.data[JS_MIME_TYPE];\n      // store reference to embed id on output_area\n      output_area._bokeh_element_id = output.metadata[EXEC_MIME_TYPE]["id"];\n    }\n    if (output.metadata[EXEC_MIME_TYPE]["server_id"] !== undefined) {\n      const bk_div = document.createElement("div");\n      bk_div.innerHTML = output.data[HTML_MIME_TYPE];\n      const script_attrs = bk_div.children[0].attributes;\n      for (let i = 0; i < script_attrs.length; i++) {\n        toinsert[toinsert.length - 1].firstChild.setAttribute(script_attrs[i].name, script_attrs[i].value);\n        toinsert[toinsert.length - 1].firstChild.textContent = bk_div.children[0].textContent\n      }\n      // store reference to server id on output_area\n      output_area._bokeh_server_id = output.metadata[EXEC_MIME_TYPE]["server_id"];\n    }\n  }\n\n  function register_renderer(events, OutputArea) {\n\n    function append_mime(data, metadata, element) {\n      // create a DOM node to render to\n      const toinsert = this.create_output_subarea(\n        metadata,\n        CLASS_NAME,\n        EXEC_MIME_TYPE\n      );\n      this.keyboard_manager.register_events(toinsert);\n      // Render to node\n      const props = {data: data, metadata: metadata[EXEC_MIME_TYPE]};\n      render(props, toinsert[toinsert.length - 1]);\n      element.append(toinsert);\n      return toinsert\n    }\n\n    /* Handle when an output is cleared or removed */\n    events.on(\'clear_output.CodeCell\', handleClearOutput);\n    events.on(\'delete.Cell\', handleClearOutput);\n\n    /* Handle when a new output is added */\n    events.on(\'output_added.OutputArea\', handleAddOutput);\n\n    /**\n     * Register the mime type and append_mime function with output_area\n     */\n    OutputArea.prototype.register_mime_type(EXEC_MIME_TYPE, append_mime, {\n      /* Is output safe? */\n      safe: true,\n      /* Index of renderer in `output_area.display_order` */\n      index: 0\n    });\n  }\n\n  // register the mime type if in Jupyter Notebook environment and previously unregistered\n  if (root.Jupyter !== undefined) {\n    const events = require(\'base/js/events\');\n    const OutputArea = require(\'notebook/js/outputarea\').OutputArea;\n\n    if (OutputArea.prototype.mime_types().indexOf(EXEC_MIME_TYPE) == -1) {\n      register_renderer(events, OutputArea);\n    }\n  }\n\n  \n  if (typeof (root._bokeh_timeout) === "undefined" || force === true) {\n    root._bokeh_timeout = Date.now() + 5000;\n    root._bokeh_failed_load = false;\n  }\n\n  const NB_LOAD_WARNING = {\'data\': {\'text/html\':\n     "<div style=\'background-color: #fdd\'>\\n"+\n     "<p>\\n"+\n     "BokehJS does not appear to have successfully loaded. If loading BokehJS from CDN, this \\n"+\n     "may be due to a slow or bad network connection. Possible fixes:\\n"+\n     "</p>\\n"+\n     "<ul>\\n"+\n     "<li>re-rerun `output_notebook()` to attempt to load from CDN again, or</li>\\n"+\n     "<li>use INLINE resources instead, as so:</li>\\n"+\n     "</ul>\\n"+\n     "<code>\\n"+\n     "from bokeh.resources import INLINE\\n"+\n     "output_notebook(resources=INLINE)\\n"+\n     "</code>\\n"+\n     "</div>"}};\n\n  function display_loaded() {\n    const el = document.getElementById("1040");\n    if (el != null) {\n      el.textContent = "BokehJS is loading...";\n    }\n    if (root.Bokeh !== undefined) {\n      if (el != null) {\n        el.textContent = "BokehJS " + root.Bokeh.version + " successfully loaded.";\n      }\n    } else if (Date.now() < root._bokeh_timeout) {\n      setTimeout(display_loaded, 100)\n    }\n  }\n\n\n  function run_callbacks() {\n    try {\n      root._bokeh_onload_callbacks.forEach(function(callback) {\n        if (callback != null)\n          callback();\n      });\n    } finally {\n      delete root._bokeh_onload_callbacks\n    }\n    console.debug("Bokeh: all callbacks have finished");\n  }\n\n  function load_libs(css_urls, js_urls, callback) {\n    if (css_urls == null) css_urls = [];\n    if (js_urls == null) js_urls = [];\n\n    root._bokeh_onload_callbacks.push(callback);\n    if (root._bokeh_is_loading > 0) {\n      console.debug("Bokeh: BokehJS is being loaded, scheduling callback at", now());\n      return null;\n    }\n    if (js_urls == null || js_urls.length === 0) {\n      run_callbacks();\n      return null;\n    }\n    console.debug("Bokeh: BokehJS not loaded, scheduling load and callback at", now());\n    root._bokeh_is_loading = css_urls.length + js_urls.length;\n\n    function on_load() {\n      root._bokeh_is_loading--;\n      if (root._bokeh_is_loading === 0) {\n        console.debug("Bokeh: all BokehJS libraries/stylesheets loaded");\n        run_callbacks()\n      }\n    }\n\n    function on_error(url) {\n      console.error("failed to load " + url);\n    }\n\n    for (let i = 0; i < css_urls.length; i++) {\n      const url = css_urls[i];\n      const element = document.createElement("link");\n      element.onload = on_load;\n      element.onerror = on_error.bind(null, url);\n      element.rel = "stylesheet";\n      element.type = "text/css";\n      element.href = url;\n      console.debug("Bokeh: injecting link tag for BokehJS stylesheet: ", url);\n      document.body.appendChild(element);\n    }\n\n    for (let i = 0; i < js_urls.length; i++) {\n      const url = js_urls[i];\n      const element = document.createElement(\'script\');\n      element.onload = on_load;\n      element.onerror = on_error.bind(null, url);\n      element.async = false;\n      element.src = url;\n      console.debug("Bokeh: injecting script tag for BokehJS library: ", url);\n      document.head.appendChild(element);\n    }\n  };\n\n  function inject_raw_css(css) {\n    const element = document.createElement("style");\n    element.appendChild(document.createTextNode(css));\n    document.body.appendChild(element);\n  }\n\n  \n  const js_urls = ["https://cdn.bokeh.org/bokeh/release/bokeh-2.4.2.min.js", "https://cdn.bokeh.org/bokeh/release/bokeh-gl-2.4.2.min.js", "https://cdn.bokeh.org/bokeh/release/bokeh-widgets-2.4.2.min.js", "https://cdn.bokeh.org/bokeh/release/bokeh-tables-2.4.2.min.js", "https://cdn.bokeh.org/bokeh/release/bokeh-mathjax-2.4.2.min.js"];\n  const css_urls = [];\n  \n\n  const inline_js = [\n    function(Bokeh) {\n      Bokeh.set_log_level("info");\n    },\n    function(Bokeh) {\n    \n    \n    }\n  ];\n\n  function run_inline_js() {\n    \n    if (root.Bokeh !== undefined || force === true) {\n      \n    for (let i = 0; i < inline_js.length; i++) {\n      inline_js[i].call(root, root.Bokeh);\n    }\n    if (force === true) {\n        display_loaded();\n      }} else if (Date.now() < root._bokeh_timeout) {\n      setTimeout(run_inline_js, 100);\n    } else if (!root._bokeh_failed_load) {\n      console.log("Bokeh: BokehJS failed to load within specified timeout.");\n      root._bokeh_failed_load = true;\n    } else if (force !== true) {\n      const cell = $(document.getElementById("1040")).parents(\'.cell\').data().cell;\n      cell.output_area.append_execute_result(NB_LOAD_WARNING)\n    }\n\n  }\n\n  if (root._bokeh_is_loading === 0) {\n    console.debug("Bokeh: BokehJS loaded, going straight to plotting");\n    run_inline_js();\n  } else {\n    load_libs(css_urls, js_urls, function() {\n      console.debug("Bokeh: BokehJS plotting callback run at", now());\n      run_inline_js();\n    });\n  }\n}(window));',
            'application/vnd.bokehjs_load.v0+json': '',
          },
          metadata: {},
          output_type: 'display_data',
        },
        {
          data: {
            'text/html': [
              '\n',
              '\n',
              '\n',
              '\n',
              '\n',
              '\n',
              '  <div class="bk-root" id="7c97bd82-963b-41c8-92e8-4116b07b0d9e" data-root-id="1007"></div>\n',
            ],
          },
          metadata: {},
          output_type: 'display_data',
        },
        {
          data: {
            'application/javascript':
              '(function(root) {\n  function embed_document(root) {\n    \n  const docs_json = {"69756cd8-8778-49ec-8611-9092f3cc2b9b":{"defs":[],"roots":{"references":[{"attributes":{"below":[{"id":"1018"},{"id":"1038"}],"center":[{"id":"1021"},{"id":"1025"}],"left":[{"id":"1022"},{"id":"1039"}],"renderers":[{"id":"1036"}],"title":{"id":"1008"},"toolbar":{"id":"1027"},"width":800,"x_range":{"id":"1010"},"x_scale":{"id":"1014"},"y_range":{"id":"1012"},"y_scale":{"id":"1016"}},"id":"1007","subtype":"Figure","type":"Plot"},{"attributes":{},"id":"1005","type":"PanTool"},{"attributes":{"axis":{"id":"1022"},"coordinates":null,"dimension":1,"group":null,"ticker":null},"id":"1025","type":"Grid"},{"attributes":{"callback":null,"tooltips":[["Year","@Year"],["State","@State"],["Description","@Description"]]},"id":"1003","type":"HoverTool"},{"attributes":{},"id":"1046","type":"BasicTickFormatter"},{"attributes":{"align":"center","coordinates":null,"group":null,"text":"Number of lethal collective extralegal incidents"},"id":"1039","type":"Title"},{"attributes":{"source":{"id":"1002"}},"id":"1037","type":"CDSView"},{"attributes":{},"id":"1019","type":"BasicTicker"},{"attributes":{"coordinates":null,"formatter":{"id":"1043"},"group":null,"major_label_policy":{"id":"1044"},"ticker":{"id":"1023"}},"id":"1022","type":"LinearAxis"},{"attributes":{},"id":"1043","type":"BasicTickFormatter"},{"attributes":{"align":"center","coordinates":null,"group":null,"text":"Year"},"id":"1038","type":"Title"},{"attributes":{"axis":{"id":"1018"},"coordinates":null,"group":null,"ticker":null},"id":"1021","type":"Grid"},{"attributes":{"overlay":{"id":"1026"}},"id":"1004","type":"BoxZoomTool"},{"attributes":{"bottom_units":"screen","coordinates":null,"fill_alpha":0.5,"fill_color":"lightgrey","group":null,"left_units":"screen","level":"overlay","line_alpha":1.0,"line_color":"black","line_dash":[4,4],"line_width":2,"right_units":"screen","syncable":false,"top_units":"screen"},"id":"1026","type":"BoxAnnotation"},{"attributes":{},"id":"1014","type":"LinearScale"},{"attributes":{},"id":"1047","type":"AllLabels"},{"attributes":{"tools":[{"id":"1003"},{"id":"1004"},{"id":"1005"},{"id":"1006"}]},"id":"1027","type":"Toolbar"},{"attributes":{"coordinates":null,"formatter":{"id":"1046"},"group":null,"major_label_policy":{"id":"1047"},"ticker":{"id":"1019"}},"id":"1018","type":"LinearAxis"},{"attributes":{},"id":"1049","type":"Selection"},{"attributes":{"fill_alpha":{"value":0.2},"fill_color":{"value":"red"},"hatch_alpha":{"value":0.2},"hatch_color":{"value":"red"},"line_alpha":{"value":0.2},"line_color":{"value":"red"},"size":{"value":8},"x":{"field":"Year"},"y":{"field":"Number"}},"id":"1035","type":"Circle"},{"attributes":{},"id":"1012","type":"DataRange1d"},{"attributes":{},"id":"1016","type":"LinearScale"},{"attributes":{"fill_color":{"value":"red"},"hatch_color":{"value":"red"},"line_color":{"value":"red"},"size":{"value":8},"x":{"field":"Year"},"y":{"field":"Number"}},"id":"1033","type":"Circle"},{"attributes":{"coordinates":null,"group":null,"text":"figure 5: Lethal Collective Extralegal Incidents, 1783-1865. Hover over points for event-specfic data."},"id":"1008","type":"Title"},{"attributes":{},"id":"1006","type":"WheelZoomTool"},{"attributes":{},"id":"1023","type":"BasicTicker"},{"attributes":{},"id":"1048","type":"UnionRenderers"},{"attributes":{},"id":"1010","type":"DataRange1d"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"red"},"hatch_alpha":{"value":0.1},"hatch_color":{"value":"red"},"line_alpha":{"value":0.1},"line_color":{"value":"red"},"size":{"value":8},"x":{"field":"Year"},"y":{"field":"Number"}},"id":"1034","type":"Circle"},{"attributes":{"coordinates":null,"data_source":{"id":"1002"},"glyph":{"id":"1033"},"group":null,"hover_glyph":null,"muted_glyph":{"id":"1035"},"nonselection_glyph":{"id":"1034"},"view":{"id":"1037"}},"id":"1036","type":"GlyphRenderer"},{"attributes":{},"id":"1044","type":"AllLabels"},{"attributes":{"data":{"Actions":["Lethal Violence","Lethal Violence","Lethal Violence","Lethal Violence; Seized Person(s)","Lethal Violence","Lethal Violence","Lethal Violence","Seized Person(s)","Lethal Violence","Seized Person(s); Lethal Violence; Property Destroyed","Threat"],"Date":["1784/03","1784/07","1784/07","1784/09","1784/10","1784/12","1787/01","1787/01","1787/01","1787/02","1787/07","1865/10"],"Description":["a","b","c","d","e","f","g","h","i","l"],"Location":["a","b","c","d","e","f","g","h","i","l"],"Note":["NaN","NaN","NaN","NaN","NaN","NaN","NaN","NaN","NaN","NaN","NaN"],"Number":[6,20,3,4,5,6,1,2,3,4],"Persons Named as Rioters":["William Patterson","John Franklin","John Armstrong","Jonathon Arnold","John Johnson; Enoch Brown; Draper","Patrick Leonard; Thomas Nicholson; Joseph Frowks","Thomas O. Selfridge","Nathaniel Aitkens","William Faulk","Powell"],"Rioter Classification":["Political; Tory","Pennamite; Squatter","Yankee; Squatter","Yankee; Squatter","Unknown","Political; Vigilante","Debtor; Shaysite; Anti-Tax","Debtor; Shaysite; Anti-Tax","Debtor; Shaysite; Anti-Tax"],"Source":["sourcea",""],"State":["New York","Pennsylvania","Pennsylvania","Pennsylvania","Pennsylvania","South Carolina","Massachusetts","Massachusetts","Massachusetts","Massachusetts","Pennsylvania"],"Target Classification":["Political; Whig (Revolution)","Yankee; Squatter","Pennamite; Squatter","Pennamite; Militia; Squatter","Unknown","Tory; Political; Legal","Military","Merchant","Unknown","Merchant; Military"],"Year":[1784,1787,1788,1791,1794,1794,1796,1797,1799,1800],"index":[0,1,2,3,4,5,6,7,8,9]},"selected":{"id":"1049"},"selection_policy":{"id":"1048"}},"id":"1002","type":"ColumnDataSource"}],"root_ids":["1007"]},"title":"Bokeh Application","version":"2.4.2"}};\n  const render_items = [{"docid":"69756cd8-8778-49ec-8611-9092f3cc2b9b","root_ids":["1007"],"roots":{"1007":"7c97bd82-963b-41c8-92e8-4116b07b0d9e"}}];\n  root.Bokeh.embed.embed_items_notebook(docs_json, render_items);\n\n  }\n  if (root.Bokeh !== undefined) {\n    embed_document(root);\n  } else {\n    let attempts = 0;\n    const timer = setInterval(function(root) {\n      if (root.Bokeh !== undefined) {\n        clearInterval(timer);\n        embed_document(root);\n      } else {\n        attempts++;\n        if (attempts > 100) {\n          clearInterval(timer);\n          console.log("Bokeh: ERROR: Unable to run BokehJS code because BokehJS library is missing");\n        }\n      }\n    }, 10, root)\n  }\n})(window);',
            'application/vnd.bokehjs_exec.v0+json': '',
          },
          metadata: {
            'application/vnd.bokehjs_exec.v0+json': {
              id: '1007',
            },
          },
          output_type: 'display_data',
        },
      ],
      source: [
        'from bokeh.plotting import figure, output_notebook, show\n',
        'from bokeh.models.sources import ColumnDataSource\n',
        'from bokeh.models import HoverTool, BoxZoomTool, PanTool, WheelZoomTool, Title\n',
        '\n',
        'import pandas as pd\n',
        '\n',
        'df = pd.read_csv("data/1783_1865.csv")\n',
        "source = ColumnDataSource(data = pd.read_csv('data/1783_1865.csv'))\n",
        'hover = HoverTool(tooltips=[("Year", "@Year"),("State", "@State"),("Description", "@Description")])\n',
        'p = figure(title="figure 5: Lethal Collective Extralegal Incidents, 1783-1865. Hover over points for event-specfic data.", plot_width=800, plot_height=600, tools=[hover, BoxZoomTool(), PanTool(), WheelZoomTool()])\n',
        "p.circle('Year', 'Number', size=8, color='red', source=source)\n",
        'p.add_layout(Title(text="Year", align="center"), "below")\n',
        'p.add_layout(Title(text="Number of lethal collective extralegal incidents", align="center"), "left")\n',
        '\n',
        'output_notebook()\n',
        'show(p)',
      ],
    },
  ],
}
