/* TriOmeFlow · numerical/scientific core */
function langmuirOccupancy(concentration, kd) {
  const c = Math.max(0, Number(concentration) || 0);
  const k = Math.max(Number.EPSILON, Number(kd) || 0);
  return c / (k + c);
}

function normalizeWeights(weights, changedKey) {
  const keys = ['affinity','breadth','stability','secretion'];
  const next = Object.fromEntries(keys.map(k => [k, Math.max(0, Number(weights[k]) || 0)]));
  const fixed = Math.max(0, Math.min(100, next[changedKey] ?? 0));
  next[changedKey] = fixed;
  const others = keys.filter(k => k !== changedKey);
  const remaining = 100 - fixed;
  const currentOther = others.reduce((s,k)=>s+next[k],0);
  if (currentOther <= 0) {
    const each = remaining / others.length;
    others.forEach(k => next[k] = each);
  } else {
    others.forEach(k => next[k] = remaining * (next[k] / currentOther));
  }
  // remove floating drift deterministically from the final non-changed key
  const sum = keys.reduce((s,k)=>s+next[k],0);
  const target = others[others.length - 1] ?? changedKey;
  next[target] += 100 - sum;
  return next;
}

function rankCandidates(candidates, weights) {
  const denom = Math.max(1, Object.values(weights).reduce((a,b)=>a+Number(b || 0),0));
  return candidates.map(c => {
    const score = (
      c.affinity * (weights.affinity || 0) +
      c.breadth * (weights.breadth || 0) +
      c.stability * (weights.stability || 0) +
      c.secretion * (weights.secretion || 0)
    ) / denom;
    return {...c, score};
  }).sort((a,b)=> b.score - a.score || a.id.localeCompare(b.id));
}

function paretoFront(candidates) {
  const metrics = ['affinity','breadth','stability','secretion'];
  return candidates.filter((c, i) => !candidates.some((other,j) => {
    if (i === j) return false;
    const noWorse = metrics.every(m => other[m] >= c[m]);
    const strictlyBetter = metrics.some(m => other[m] > c[m]);
    return noWorse && strictlyBetter;
  }));
}

function interventionParams(base) {
  const c = Math.max(0, Math.min(1, Number(base.coverage) || 0));
  let beta = base.beta;
  let k = base.k;
  let gamma = base.gamma;
  if (base.intervention === 'medi8852' || base.intervention === 'combined') {
    beta *= (1 - 0.58 * c); // deterministic demo assumption
    k *= (1 - 0.46 * c);    // deterministic demo assumption
  }
  if (base.intervention === '1g01' || base.intervention === 'combined') {
    gamma *= (1 + 0.72 * c); // deterministic demo assumption
  }
  return {beta, k, gamma, omega: base.omega, p: base.p};
}

function derivatives(state, params, N) {
  const {S,E,I,A,R} = state;
  const {beta,k,gamma,omega,p} = params;
  const force = beta * S * (I + k*A) / N;
  return {
    S: -force,
    E: force - omega*E,
    I: (1-p)*omega*E - gamma*I,
    A: p*omega*E - gamma*A,
    R: gamma*(I+A),
  };
}

function addState(a, b, scale=1) {
  return {
    S: a.S + b.S*scale,
    E: a.E + b.E*scale,
    I: a.I + b.I*scale,
    A: a.A + b.A*scale,
    R: a.R + b.R*scale,
  };
}

function rk4Step(state, dt, params, N) {
  const k1 = derivatives(state, params, N);
  const k2 = derivatives(addState(state,k1,dt/2), params, N);
  const k3 = derivatives(addState(state,k2,dt/2), params, N);
  const k4 = derivatives(addState(state,k3,dt), params, N);
  const next = {};
  for (const key of ['S','E','I','A','R']) {
    next[key] = state[key] + dt*(k1[key] + 2*k2[key] + 2*k3[key] + k4[key])/6;
    if (next[key] < 0 && next[key] > -1e-8) next[key] = 0;
  }
  // correct floating drift into S to keep N conserved
  const total = next.S+next.E+next.I+next.A+next.R;
  next.S += N-total;
  return next;
}

function reproductionIndicator({beta,k,gamma,p}) {
  return beta * ((1-p) + k*p) / gamma;
}

function simulateSEIAR(config) {
  const cfg = structuredClone(config);
  const dt = cfg.dt || 0.25;
  const N = cfg.N;
  const params = interventionParams(cfg);
  let state = {...cfg.initial};
  const trajectory = [{day:0, ...state}];
  const steps = Math.round(cfg.days/dt);
  for (let step=1; step<=steps; step++) {
    state = rk4Step(state, dt, params, N);
    const day = step*dt;
    if (Math.abs(day - Math.round(day)) < dt/2 || step === steps) {
      trajectory.push({day:Number(day.toFixed(4)), ...state});
    }
  }
  let peak = trajectory[0];
  for (const row of trajectory) if (row.I > peak.I) peak = row;
  const last = trajectory[trajectory.length-1];
  const cumulative = N - last.S;
  const scenarioR = reproductionIndicator({...params});
  return {
    trajectory,
    effectiveParameters: params,
    metrics: {
      peakI: peak.I,
      peakDay: peak.day,
      cumulative,
      scenarioR,
    }
  };
}

function coverageSweep(preset, coverages = Array.from({length:21},(_,i)=>i/20)) {
  return coverages.map(coverage => {
    const result = simulateSEIAR({...preset, coverage});
    return {coverage, ...result.metrics};
  });
}

function calibrationResponse(temp, {midpoint=50,slope=0.32,constraintTemp=30,influence=0}) {
  const w = Math.max(0, Math.min(1, influence));
  const effectiveMid = midpoint*(1-w) + constraintTemp*w;
  return 1/(1+Math.exp(-slope*(temp-effectiveMid)));
}
