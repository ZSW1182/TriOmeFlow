/* TriOmeFlow · export helpers, guided demo and application startup */
function downloadBlob(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},100)}
function downloadJson(name,obj){downloadBlob(name,JSON.stringify(obj,null,2),'application/json')}
function downloadCsv(name,rows){if(!rows.length)return;const keys=Object.keys(rows[0]);const q=v=>`"${String(v??'').replaceAll('"','""')}"`;downloadBlob(name,[keys.join(','),...rows.map(r=>keys.map(k=>q(r[k])).join(','))].join('\n'),'text/csv')}
function exportSummary(){downloadJson('triomeflow-workspace-summary.json',{project:'FluBlockers',facts:FLUBLOCKERS_FACTS,cycle:state.cycle,shortlist:state.shortlist,runs:state.runs})}
function exportCandidates(){downloadCsv('antibody-ranking.csv',rankCandidates([REFERENCE_CANDIDATE,...CANDIDATES],state.weights).map((c,i)=>({rank:i+1,candidate:c.id,score:(c.score*100).toFixed(2),affinity:c.affinity,breadth:c.breadth,stability:c.stability,secretion:c.secretion,deltaG:c.deltaG,source:c.provenance||'FLUBLOCKERS SOURCE'})))}
function exportTrajectory(){const r=currentEpi();downloadCsv('seiar-trajectory.csv',r.trajectory.map(x=>({day:x.day,S:x.S,E:x.E,I:x.I,A:x.A,R:x.R})))}
function exportCycle(){downloadJson(`dbtl-cycle-${state.cycle}.json`,{cycle:state.cycle,shortlist:state.shortlist,circuitUpdate:state.circuitUpdate,epidemicScenario:state.epidemicScenario,queue:state.dbtlQueue.length?state.dbtlQueue:generateQueue(),runs:state.runs})}
function exportMethods(){const md=['# TriOmeFlow Methods','',...METHODS.map(m=>`## ${m.name}\n- Scale: ${m.scale}\n- Origin: ${m.origin}\n- Execution: ${m.execution}\n- Purpose: ${m.purpose}\n- Source: ${m.source}\n`)];downloadBlob('triomeflow-methods.md',md.join('\n'),'text/markdown')}
function exportManifest(){downloadJson('triomeflow-manifest.json',{application:{name:'TriOmeFlow',version:'1.0.0',runtime:'Browser',networkDependency:'None'},sources:SOURCES,methods:METHODS,datasets:{demoVersion:'1.2.0',userOmics:state.omicsUserData},assumptions:ASSUMPTIONS,runs:state.runs,workspace:{cycle:state.cycle,shortlist:state.shortlist,circuitUpdate:state.circuitUpdate,savedScenario:state.epidemicScenario},scientificDisclosure:'Synthetic demonstration outputs are not experimentally validated biological findings.'})}
function toast(msg,type=''){const root=document.getElementById('toast-root');const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=tr(msg);root.appendChild(el);setTimeout(()=>el.remove(),2600)}
function showModal(title,html){const wrap=document.createElement('div');wrap.className='modal-backdrop';wrap.innerHTML=`<div class="modal"><div class="modal-head"><b>${tr(title)}</b><button class="btn ghost small modalClose">${tr('Close')}</button></div><div class="modal-body">${html}</div><div class="modal-foot"><button class="btn primary modalClose">${tr('OK')}</button></div></div>`;if(state.lang==='cn')applyI18n(wrap);document.body.appendChild(wrap);wrap.querySelectorAll('.modalClose').forEach(b=>b.onclick=()=>wrap.remove())}

const TOUR_STEPS=[
  {route:'overview',selector:'[data-tour="overview-map"]',title:'MULTISCALE OVERVIEW',text:'FluBlockers connects molecular interaction, engineered probiotic behavior, regulatory feedback and epidemic dynamics within one computational workspace.'},
  {route:'tri-omics',selector:'[data-tour="omics-network"]',title:'CROSS-DOMAIN SIGNALS',text:'Explore a clearly labeled synthetic Host–Probiotic–Virus network while preserving provenance and cross-view interpretation.'},
  {route:'workflow',selector:'.workflow-canvas',title:'REPRODUCIBLE WORKFLOW',text:'Compose and inspect a local bioinformatics DAG with live Nextflow code generation and deterministic execution simulation.'},
  {route:'antibody',selector:'[data-tour="antibody-view"]',title:'MULTI-OBJECTIVE ANTIBODY DESIGN',text:'Inspect MEDI8852–HA source context and re-rank synthetic candidates using live multi-objective scoring and Pareto analysis.'},
  {route:'epidemic',selector:'[data-tour="epidemic-chart"]',title:'POPULATION IMPACT',text:'Translate source-reported intervention directions into an offline live SEIAR scenario simulation with explicit demo assumptions.'},
  {route:'dbtl',selector:'[data-tour="dbtl-decision"]',title:'CLOSE THE LOOP',text:'Aggregate evidence, conflicts and simulation context into deterministic next-cycle research actions.'}
];
function startTour(){const keepLang=state.lang;state={...structuredClone(DEFAULT_STATE),lang:keepLang,route:TOUR_STEPS[0].route,tour:{index:0}};persist();renderApp()}
function renderTour(){const step=TOUR_STEPS[state.tour.index];return `<div class="tour-dimmer"></div><div class="tour-panel"><div class="count">${String(state.tour.index+1).padStart(2,'0')} / ${String(TOUR_STEPS.length).padStart(2,'0')}</div><h3>${step.title}</h3><p>${step.text}</p><div class="tour-actions"><button class="btn small" id="tourExit">Exit</button><div><button class="btn ghost small" id="tourBack" ${state.tour.index===0?'disabled':''}>Back</button><button class="btn primary small" id="tourNext">${state.tour.index===TOUR_STEPS.length-1?'Complete':'Next'}</button></div></div></div>`}
function applyTourHighlight(){document.querySelectorAll('.tour-highlight').forEach(x=>x.classList.remove('tour-highlight'));const step=TOUR_STEPS[state.tour.index];document.querySelector(step.selector)?.classList.add('tour-highlight');document.getElementById('tourExit')?.addEventListener('click',()=>{state.tour=null;persist();renderApp()});document.getElementById('tourBack')?.addEventListener('click',()=>{if(state.tour.index>0){state.tour.index--;state.route=TOUR_STEPS[state.tour.index].route;persist();renderApp()}});document.getElementById('tourNext')?.addEventListener('click',()=>{if(state.tour.index===TOUR_STEPS.length-1){state.tour=null;persist();renderApp();toast('Guided Demo complete · explore freely','success')}else{state.tour.index++;state.route=TOUR_STEPS[state.tour.index].route;persist();renderApp()}})}

window.addEventListener('hashchange',()=>{const r=location.hash.slice(1);if(ROUTES.some(x=>x[0]===r)){state.route=r;persist();renderApp()}});
window.addEventListener('keydown',e=>{
  if(e.target && ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  if((e.key==='g'||e.key==='G') && !state.tour){e.preventDefault();startTour();return;}
  if(!state.tour) return;
  if(e.key==='Escape'){e.preventDefault();state.tour=null;persist();renderApp();return;}
  if(e.key==='ArrowLeft' && state.tour.index>0){e.preventDefault();state.tour.index--;state.route=TOUR_STEPS[state.tour.index].route;persist();renderApp();return;}
  if(e.key==='ArrowRight'){
    e.preventDefault();
    if(state.tour.index===TOUR_STEPS.length-1){state.tour=null;persist();renderApp();toast('Guided Demo complete · explore freely','success');}
    else{state.tour.index++;state.route=TOUR_STEPS[state.tour.index].route;persist();renderApp();}
  }
});

const requestedLang=new URLSearchParams(location.search).get('lang');if(requestedLang==='cn'||requestedLang==='en')state.lang=requestedLang;const initial=location.hash.slice(1);if(ROUTES.some(x=>x[0]===initial))state.route=initial;
renderApp();
