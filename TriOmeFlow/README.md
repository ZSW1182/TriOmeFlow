# TriOmeFlow

TriOmeFlow is an offline bilingual bioinformatics workspace built around the FluBlockers project. It brings the main analysis and modeling steps into one browser interface, with source results, live calculations and demo data kept separate.

The repository contains both the readable source version and a single-file version for competition demos.

## Run it

For local use, open `index.html` in Chrome or Edge. A local server is also fine:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

For an offline competition demo, open:

```text
dist/TriOmeFlow_Submission.html
```

That file is self-contained and does not depend on the split source files.

## Modules

| Module | What it does |
| --- | --- |
| Overview | Shows the project structure and key cross-scale results |
| Tri-Omics | Handles local CSV input and multi-omics views |
| Workflow Studio | Builds a FastQC/BWA-MEM/GATK workflow and previews Nextflow code |
| Antibody Studio | Reviews MEDI8852-HA context, ranking, Pareto results and binding calculations |
| Circuit Lab | Compares RNA-thermometer model evidence and experimental observations |
| Epidemic Twin | Runs browser-side SEIAR simulations and intervention scenarios |
| DBTL Loop | Carries evidence into the next design cycle |
| Methods & Provenance | Records methods, datasets, runs, sources and assumptions |

## Repository layout

```text
TriOmeFlow/
├── index.html
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── .gitattributes
├── assets/
│   └── triomeflow-logo.svg
├── demo/
│   └── example_omics.csv
├── docs/
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
├── dist/
│   └── TriOmeFlow_Submission.html
└── src/
    ├── styles.css
    ├── scientific-core.js
    ├── data.js
    ├── i18n.js
    ├── app.js
    ├── scientific-gl.js
    └── runtime.js
```

## Source code

- `src/scientific-core.js` — Langmuir occupancy, weight normalization, candidate ranking, Pareto screening, RK4 integration and SEIAR calculations.
- `src/data.js` — project facts, demo data, methods, source records, assumptions and CSV parsing/validation.
- `src/i18n.js` — English/Chinese text and translation helpers.
- `src/app.js` — shared state, page rendering and module interactions.
- `src/scientific-gl.js` — the local WebGL scientific viewer.
- `src/runtime.js` — exports, guided demo, keyboard controls and startup.
- `src/styles.css` — interface and responsive layout styles.

## CSV input

Tri-Omics accepts long-format CSV files:

```csv
sample_id,feature_id,value,group
S01,IL6,2.31,control
S02,IL6,2.08,treated
```

Required columns are `sample_id`, `feature_id` and `value`. `group` is optional. A small test file is included at `demo/example_omics.csv`.

## Data boundaries

The interface distinguishes project-derived results, browser calculations, precomputed results and synthetic demo data. Molecular and RNA 3D views are schematic unless validated coordinates are supplied. Workflow Studio previews Nextflow code and simulates execution locally; it does not submit jobs to Docker, Kubernetes or an external cluster.

## GitHub Pages

No build step is needed.

1. Upload the repository to GitHub.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.

GitHub Pages will serve the root `index.html`.

## Browser

Chrome and Edge are recommended. Hardware acceleration helps with the WebGL views.

## Version

TriOmeFlow v1.0.0
