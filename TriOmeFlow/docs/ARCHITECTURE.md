# Architecture

TriOmeFlow is a static browser application. It does not require a backend for the competition demo.

## Load order

`index.html` loads the JavaScript files in this order:

1. `scientific-core.js`
2. `data.js`
3. `i18n.js`
4. `app.js`
5. `scientific-gl.js`
6. `runtime.js`

Keep this order when editing `index.html`; later files use functions and data defined earlier.

## File roles

### `scientific-core.js`
Numerical functions used by the interface: Langmuir occupancy, weight normalization, candidate ranking, Pareto screening, RK4 integration and SEIAR simulation.

### `data.js`
Project facts, demo datasets, method/source records, assumptions, CSV parsing and validation.

### `i18n.js`
English/Chinese interface text and translation helpers.

### `app.js`
Shared application state, module rendering and user interactions.

### `scientific-gl.js`
Dependency-free WebGL views used by the scientific modules.

### `runtime.js`
Exports, guided-demo controls, keyboard shortcuts, route handling and startup.

## Local data handling

Workspace state is stored in `localStorage`. Uploaded CSV files are read in the browser. The competition build does not require a CDN or a remote JavaScript package.
