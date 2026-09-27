/* TriOmeFlow · project facts, demo data and CSV validation */
const FLUBLOCKERS_FACTS = {
  bindingFreeEnergy: { label:'Binding Free Energy', value:-11.4, unit:'kcal/mol', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'PRECOMPUTED', evidence:'COMPUTATIONAL' },
  kd: { label:'Dissociation Constant', value:6.8, unit:'nM', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'PRECOMPUTED', evidence:'COMPUTATIONAL' },
  baselineR0: { label:'Baseline R₀', value:4.47, unit:'', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'STATIC', evidence:'SIMULATION' },
  wtOd: { label:'Wild-type LGG Max OD', value:3.0, unit:'OD', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'STATIC', evidence:'COMPUTATIONAL' },
  growthModel: { label:'Growth Model', value:'Gompertz', source:'FLUBLOCKERS SOURCE', mode:'STATIC', evidence:'COMPUTATIONAL' },
  rnaPredicted: { label:'Predicted Structural Transition', value:50, unit:'°C', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'PRECOMPUTED', evidence:'COMPUTATIONAL' },
  rnaObserved: { label:'Experimental Expression Change', value:30, unit:'°C', approximate:true, source:'FLUBLOCKERS SOURCE', mode:'STATIC', evidence:'EXPERIMENTAL' },
  interventionRange: { label:'Reported Coverage Range', value:[30,50], unit:'%', source:'FLUBLOCKERS SOURCE', mode:'STATIC', evidence:'SIMULATION' }
};

const REFERENCE_STRUCTURES = {
  medi8852H5: {pdb:'5JW4',title:'MEDI8852 Fab–H5 HA crystal reference',method:'X-ray diffraction',resolution:'3.70 Å',source:'RCSB PDB',evidence:'REFERENCE ASSET',note:'Experimental crystal structure metadata used as structural context only; coordinates are not bundled.'}
};

const CANDIDATES = [
  {id:'MEDI8852-C01', affinity:.91,breadth:.80,stability:.93,secretion:.84,deltaG:-12.0,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C02', affinity:.87,breadth:.94,stability:.86,secretion:.91,deltaG:-11.7,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C03', affinity:.96,breadth:.89,stability:.88,secretion:.82,deltaG:-12.4,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C04', affinity:.83,breadth:.92,stability:.95,secretion:.90,deltaG:-11.3,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C05', affinity:.93,breadth:.86,stability:.90,secretion:.88,deltaG:-12.1,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C06', affinity:.85,breadth:.97,stability:.82,secretion:.86,deltaG:-11.5,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C07', affinity:.90,breadth:.90,stability:.91,secretion:.92,deltaG:-11.9,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'},
  {id:'MEDI8852-C08', affinity:.88,breadth:.84,stability:.97,secretion:.89,deltaG:-11.6,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'}
];

const REFERENCE_CANDIDATE = {
  id:'MEDI8852-WT', affinity:.84,breadth:.88,stability:.91,secretion:.88,deltaG:-11.4,
  provenance:'FLUBLOCKERS SOURCE', evidence:'COMPUTATIONAL', reference:true
};

const OMICS_NODES = [
  {id:'IL6',label:'IL6',domain:'Host',type:'Gene',effect:2.31,fdr:.003,centrality:.84,x:315,y:155,description:'Illustrative host-response feature'},
  {id:'IFITM3',label:'IFITM3',domain:'Host',type:'Gene',effect:1.82,fdr:.009,centrality:.70,x:215,y:235,description:'Illustrative antiviral-response feature'},
  {id:'MX1',label:'MX1',domain:'Host',type:'Gene',effect:1.64,fdr:.012,centrality:.68,x:400,y:250,description:'Illustrative interferon-response feature'},
  {id:'CXCL10',label:'CXCL10',domain:'Host',type:'Gene',effect:2.05,fdr:.006,centrality:.73,x:295,y:330,description:'Illustrative inflammatory-response feature'},
  {id:'LGG',label:'Engineered LGG',domain:'Probiotic',type:'Strain',effect:.71,fdr:.018,centrality:.82,x:635,y:210,description:'Synthetic probiotic-domain feature'},
  {id:'Lacto',label:'Lactobacillus',domain:'Probiotic',type:'Taxon',effect:.58,fdr:.027,centrality:.61,x:690,y:325,description:'Synthetic abundance feature'},
  {id:'M32',label:'Metabolite M32',domain:'Metabolite',type:'Metabolite',effect:.63,fdr:.021,centrality:.65,x:500,y:365,description:'Synthetic metabolite feature'},
  {id:'M18',label:'Metabolite M18',domain:'Metabolite',type:'Metabolite',effect:-.52,fdr:.032,centrality:.49,x:525,y:95,description:'Synthetic metabolite feature'},
  {id:'HA',label:'Influenza HA',domain:'Virus',type:'Protein',effect:.79,fdr:.004,centrality:.86,x:835,y:150,description:'Viral target context'},
  {id:'H1N1',label:'H1N1',domain:'Virus',type:'Subtype',effect:.66,fdr:.016,centrality:.63,x:870,y:285,description:'Viral subtype context'}
].map(n => ({...n, provenance:'TRIOMEFLOW DEMO', evidence:'SYNTHETIC'}));

const OMICS_EDGES = [
  ['IL6','LGG',.71,'positive'],['IL6','HA',.66,'positive'],['IL6','M32',.62,'positive'],['IFITM3','HA',.74,'positive'],
  ['MX1','H1N1',.68,'positive'],['CXCL10','LGG',-.53,'negative'],['CXCL10','M32',.57,'positive'],['LGG','M32',.69,'positive'],
  ['Lacto','M18',-.48,'negative'],['M18','HA',-.51,'negative'],['M32','H1N1',.55,'positive'],['LGG','HA',.59,'positive']
].map(([source,target,association,type],i)=>({id:`E${i+1}`,source,target,association,type,fdr:0.004+i*0.003,provenance:'TRIOMEFLOW DEMO'}));

const PATHWAYS = [
  {name:'Influenza A',db:'KEGG',ratio:.31,count:8,p:.0017,features:['MX1','IFITM3','IL6','CXCL10']},
  {name:'Cytokine signaling',db:'GO BP',ratio:.27,count:7,p:.0032,features:['IL6','CXCL10']},
  {name:'Interferon response',db:'GO BP',ratio:.24,count:6,p:.0061,features:['MX1','IFITM3']},
  {name:'Host–virus interaction',db:'DEMO',ratio:.19,count:5,p:.012,features:['HA','H1N1','IFITM3']},
  {name:'Microbial response',db:'DEMO',ratio:.16,count:4,p:.019,features:['LGG','Lacto','M32']}
].map(p=>({...p,provenance:'TRIOMEFLOW DEMO',evidence:'SYNTHETIC'}));

const DEMO_HEATMAP = Array.from({length:10},(_,r)=>Array.from({length:12},(_,c)=>{
  const v = Math.sin((r+1)*0.82 + c*0.45) * 1.45 + Math.cos(c*0.31-r*.2)*.35;
  return Number(v.toFixed(2));
}));

const METHODS = [
  {id:'M01',name:'Swiss-Model',scale:'Molecular',origin:'FluBlockers',execution:'Precomputed',purpose:'MEDI8852 scFv homology modeling',source:'FLUBLOCKERS SOURCE'},
  {id:'M02',name:'ZDOCK',scale:'Molecular',origin:'FluBlockers',execution:'Precomputed',purpose:'Protein–protein docking',source:'FLUBLOCKERS SOURCE'},
  {id:'M03',name:'PyMOL / iMODS',scale:'Molecular',origin:'FluBlockers',execution:'Precomputed',purpose:'Structural visualization and flexibility assessment',source:'FLUBLOCKERS SOURCE'},
  {id:'M04',name:'PRODIGY',scale:'Molecular',origin:'FluBlockers',execution:'Precomputed',purpose:'Binding-energy prediction',source:'FLUBLOCKERS SOURCE'},
  {id:'M05',name:'Langmuir',scale:'Molecular',origin:'FluBlockers + TriOmeFlow',execution:'Live',purpose:'Binding occupancy calculation',source:'FLUBLOCKERS SOURCE'},
  {id:'M06',name:'Gompertz',scale:'Cellular',origin:'FluBlockers',execution:'Static',purpose:'Best-fit growth model among Logistic/Gompertz/Richards',source:'FLUBLOCKERS SOURCE'},
  {id:'M07',name:'RNAfold',scale:'Regulatory',origin:'FluBlockers',execution:'Precomputed',purpose:'37°C / 50°C RNA structure comparison',source:'FLUBLOCKERS SOURCE'},
  {id:'M08',name:'SEIAR + L-BFGS-B',scale:'Population',origin:'FluBlockers',execution:'Static',purpose:'Source epidemic model and parameter fitting',source:'FLUBLOCKERS SOURCE'},
  {id:'M09',name:'RK4 SEIAR engine',scale:'Population',origin:'TriOmeFlow',execution:'Live',purpose:'Offline scenario simulation',source:'TRIOMEFLOW DEMO'},
  {id:'M10',name:'Weighted multi-objective ranking',scale:'Molecular',origin:'TriOmeFlow',execution:'Live',purpose:'Candidate re-ranking from deterministic demo inputs',source:'TRIOMEFLOW DEMO'},
  {id:'M11',name:'Rule-based DBTL orchestration',scale:'Cross-scale',origin:'TriOmeFlow',execution:'Live',purpose:'Deterministic research decision workflow',source:'TRIOMEFLOW DEMO'},
  {id:'M12',name:'BioForge Workflow Orchestration',scale:'Bioinformatics workflow',origin:'BioForge → TriOmeFlow',execution:'Live',purpose:'Interactive DAG composition and Nextflow DSL2 code preview with deterministic local execution simulation',source:'TRIOMEFLOW DEMO'}
];

const SOURCES = [
  {id:'S01',title:'2025 iGEM FluBlockers 项目模型体系总结',type:'Project model summary',strength:'SUMMARY',note:'Contains the source-derived molecular, growth, SEIAR, RNA thermometer and multiscale framework facts used in this demo.'},
  {id:'S02',title:'赛道1~4.docx',type:'Competition product/design document',strength:'DESIGN CONCEPT',note:'Supports software architecture and DBTL/product-design concepts; not treated as primary experimental data.'},
  {id:'S03',title:'Bioforge.html',type:'Bioinformatics workflow UI prototype',strength:'DESIGN PROTOTYPE',note:'Provides the original FastQC / BWA-MEM / GATK workflow-composer interaction concept integrated into Workflow Studio.'},
  {id:'S04',title:'RCSB PDB 5JW4 · MEDI8852 Fab–H5 HA',type:'Reference crystal structure metadata',strength:'REFERENCE ASSET',note:'X-ray diffraction, 3.70 Å. Used only as experimentally resolved structural context; the offline viewer remains a schematic because coordinates are not bundled.'}
];

const ASSUMPTIONS = [
  {id:'A01',title:'Antibody candidate metrics',status:'OPEN',level:'SYNTHETIC',detail:'Non-reference candidate affinity/breadth/stability/secretion metrics are deterministic demonstration values.'},
  {id:'A02',title:'Multi-omics associations',status:'OPEN',level:'SYNTHETIC',detail:'Host–Probiotic–Virus network and enrichment results are illustrative demonstration data.'},
  {id:'A03',title:'SEIAR numerical preset',status:'OPEN',level:'DEMO PRESET',detail:'Specific beta/k/gamma/omega/p values, initial conditions and intervention multipliers are TriOmeFlow demo assumptions.'},
  {id:'A04',title:'RNA recalibration curve',status:'OPEN',level:'MODELING DEMO',detail:'The calibrated sigmoid is an illustrative phenomenological response curve, not a completed FluBlockers calibration result.'},
  {id:'A05',title:'Molecular structure viewport',status:'OPEN',level:'REFERENCE PLACEHOLDER',detail:'No validated FluBlockers H1N1 docking PDB was supplied. RCSB PDB 5JW4 metadata is used as experimentally resolved MEDI8852–HA structural context, while the offline geometry remains explicitly schematic.'},
  {id:'A06',title:'RNA structure visualization',status:'OPEN',level:'SCHEMATIC',detail:'No validated dot-bracket / RNAfold SVG was supplied; structure views are schematic.'},
  {id:'A07',title:'BioForge workflow execution',status:'OPEN',level:'MODELING DEMO',detail:'Workflow Studio generates local Nextflow previews and simulates execution deterministically; it does not contact Docker, Kubernetes or an external compute cluster.'}
];

function parseCsvText(text) {
  const lines = String(text).trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const parseLine = line => {
    const out=[]; let cur=''; let quoted=false;
    for (let i=0;i<line.length;i++) {
      const ch=line[i];
      if (ch==='"') {
        if (quoted && line[i+1]==='"') {cur+='"'; i++;}
        else quoted=!quoted;
      } else if (ch===',' && !quoted) { out.push(cur); cur=''; }
      else cur+=ch;
    }
    out.push(cur); return out;
  };
  const headers = parseLine(lines[0]).map(x=>x.trim());
  return lines.slice(1).map(line => {
    const vals=parseLine(line);
    const obj={}; headers.forEach((h,i)=>obj[h]=(vals[i]??'').trim()); return obj;
  });
}

function validateLongFormatCsv(rows) {
  const errors=[]; const required=['sample_id','feature_id','value'];
  if (!rows.length) return {valid:false, errors:['Dataset is empty']};
  const keys = Object.keys(rows[0]);
  for (const col of required) if (!keys.includes(col)) errors.push(`Missing required column: ${col}`);
  if (keys.includes('value')) rows.forEach((r,i)=>{ if (r.value==='' || !Number.isFinite(Number(r.value))) errors.push(`Row ${i+2}: non-numeric value`); });
  const missingIds = rows.filter(r=>!r.sample_id || !r.feature_id).length;
  if (missingIds) errors.push(`${missingIds} rows contain missing sample_id or feature_id`);
  return {valid:errors.length===0, errors};
}
