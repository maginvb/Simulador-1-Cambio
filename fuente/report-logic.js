// Lógica del informe final (config v1.2 · FINAL_QA_v3). Fuente única para el simulador y el QA.
// Resultado = behaviorScores. 01 = effects. 02 = relación entre ambos. 03 = nivel primero, luego mínimos.
const EPS = 1e-9;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const list = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
const fill = (t, o) => t.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));
const TIE = ['', 'unique', 'double', 'triple'];

function topFavorables(indicators, max) {
  const f = indicators.filter(i => i.tone === 'favorable').sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (f.length <= max) return f;
  const cut = Math.abs(f[max - 1].delta);
  return Math.abs(f[max].delta) === cut ? f.filter(i => Math.abs(i.delta) > cut) : f.slice(0, max);
}
export const thresholds = cfg => ({ high: cfg.verdict.bands.find(b => b.id === 'alto').min, mid: cfg.verdict.bands.find(b => b.id === 'medio').min });

export function buildReport(cfg, dec) {
  const V = cfg.verdict, FR = cfg.finalReport, S = FR.sections, PL = FR.behaviorPlainLanguage, minObs = cfg.scoring.minObservationsForInterpretation;
  const picks = cfg.rounds.flatMap(r => r.situations).map(x => x.options.find(o => o.id === dec[x.id])).filter(Boolean);

  const means = cfg.behaviors.map(b => {
    const obs = picks.map(o => o.behaviorScores[b.id]).filter(v => v != null);
    return { id: b.id, obs: obs.length, mean: obs.length ? obs.reduce((a, v) => a + v, 0) / obs.length : null };
  });
  const elig = means.filter(m => m.obs >= minObs);
  const verdictIndex = elig.length ? elig.reduce((a, m) => a + m.mean, 0) / elig.length : null;
  const band = V.bands.find(b => (b.min == null || verdictIndex >= b.min - EPS) && (b.maxExclusive == null || verdictIndex < b.maxExclusive - EPS));
  const minMean = Math.min(...elig.map(m => m.mean));
  const lowest = elig.filter(m => Math.abs(m.mean - minMean) < EPS).map(m => m.id);
  const tieType = TIE[lowest.length], tie = lowest.length > 1;

  const vals = {}; cfg.indicators.forEach(i => (vals[i.id] = i.initial));
  picks.forEach(o => cfg.indicators.forEach(i => { vals[i.id] = Math.max(i.min, Math.min(i.max, vals[i.id] + (o.effects[i.id] || 0))); }));
  const indicators = S.whatHappened.indicators.map(m => {
    const base = cfg.indicators.find(i => i.id === m.id), d = vals[m.id] - base.initial;
    const tone = d === 0 ? 'neutral' : (m.favorableWhen === 'positive' ? d > 0 : d < 0) ? 'favorable' : 'unfavorable';
    return { id: m.id, label: m.label, delta: d, tone, state: d > 0 ? m.positive : d < 0 ? m.negative : m.zero };
  });
  const risk = indicators.find(i => i.id === 'riesgo_cronograma'), cond = indicators.filter(i => i.id !== 'riesgo_cronograma');
  const fav = cond.filter(i => i.tone === 'favorable'), unfAll = indicators.filter(i => i.tone === 'unfavorable');
  const anyFav = fav.length > 0 || risk.tone === 'favorable';
  const effectClass = !anyFav && !unfAll.length ? 'none'
    : fav.length && !unfAll.length ? 'favorable'
    : fav.length && unfAll.length === 1 && unfAll[0].id === 'riesgo_cronograma' ? 'favorableRiskUp'
    : anyFav ? 'mixed' : 'unfavorable';

  // Explicación (máx. 2 frases). Variante lógica explícita para el QA.
  const EX = FR.explanation, names = { a: PL[lowest[0]], b: PL[lowest[1]] };
  let explanation, explanationVariant;
  if (band.id === 'alto') { explanation = EX.alto; explanationVariant = 'alto'; }
  else if (band.id === 'medio') { explanation = fill(EX.medio[tieType], names); explanationVariant = 'medio_' + tieType; }
  else {
    explanation = (anyFav ? EX.bajo.leadIfFavorableEffects : EX.bajo.leadOtherwise) + ' ' + fill(EX.bajo[tieType], names);
    explanationVariant = (anyFav ? 'bajo_parcial_' : 'bajo_sin_favorables_') + tieType;
  }

  // 02 · Relación entre gestión y consecuencias
  const MT = S.mainTension, R = id => MT.rules.find(r => r.id === id);
  const unfList = list(unfAll.map(i => MT.unfavorablePhrases[i.id]));
  const favSel = topFavorables(indicators, MT.maxFavorablesInSummary);
  const selC = favSel.filter(i => i.id !== 'riesgo_cronograma').map(i => MT.favorableNouns[i.id]), selRisk = favSel.some(i => i.id === 'riesgo_cronograma');
  const favLead = selC.length ? cap(list(selC.map(n => n.t))) + (selC.length > 1 || selC[0].pl ? ' mejoraron' : ' mejoró') + (selRisk ? ' y el cronograma ganó margen' : '') : selRisk ? 'El cronograma ganó margen' : '';
  const unfText = () => favLead ? favLead + ', mientras ' + unfList + '.' : 'En el escenario, ' + unfList + '.';
  const LF = MT.lowestFocus;
  const focus = lowest.length === 3 ? LF.tie : lowest.map(id => LF[id]).join(MT.lowestFocusJoin);
  let rule;
  if (effectClass === 'none') rule = 'N';
  else if (band.id === 'alto' && effectClass === 'favorableRiskUp') rule = 'A';
  else if (band.id === 'alto' && effectClass === 'favorable') rule = 'B';
  else if (band.id === 'medio' && effectClass === 'favorable') rule = 'C';
  else if (band.id === 'bajo' && effectClass === 'favorable') rule = 'D';
  else rule = band.id === 'bajo' ? 'F' : 'E';
  const r = R(rule);
  let tensionText = r.text, tensionTitle = r.title;
  if (rule === 'A') tensionText = unfText();
  if (rule === 'B') tensionText = favLead + (risk.tone === 'neutral' ? ' sin que aumentara la presión sobre el plazo' : '') + '.';
  if (rule === 'D') tensionText = favLead + '. Al mismo tiempo, varias respuestas atendieron necesidades inmediatas sin explorar con la misma profundidad ' + focus + '.';
  if (rule === 'E' || rule === 'F') {
    tensionText = unfText() + (rule === 'F' ? ' Al mismo tiempo, algunas causas o barreras de la oposición quedaron insuficientemente atendidas.' : '');
    const onlyRisk = unfAll.length === 1 && unfAll[0].id === 'riesgo_cronograma';
    tensionTitle = !favSel.length ? r.titleVariants.noFavorable : onlyRisk ? r.title : r.titleVariants.otherCost;
  }
  const tensionHeading = MT.titles[r.label];

  // 03 · Nivel primero; después mínimos
  const NS = S.nextStep;
  let nextSteps, nextStepVariant;
  if (band.id === 'alto') { nextStepVariant = 'consolidacion'; nextSteps = [{ title: NS.consolidationText, text: '' }]; }
  else if (lowest.length === 3) { nextStepVariant = 'desarrollo_integrado'; nextSteps = [{ title: NS.developmentText, text: '' }]; }
  else { nextStepVariant = lowest.length === 2 ? 'dos_minimos' : 'minimo_unico'; nextSteps = lowest.map(id => ({ title: NS.byLowest[id].title, text: NS.byLowest[id].text })); }

  return { picks: picks.map(o => o.id), means, verdictIndex, band: band.id, verdict: band.text, explanation, explanationVariant, indicators, effectClass,
    tensionRule: rule, tensionHeading, tensionTitle, tensionText, favSel: favSel.map(i => i.id), nextSteps, nextStepVariant, lowest, tie, tieType, effects: vals };
}

// ---------- QA ----------
const sitsOf = cfg => cfg.rounds.flatMap(r => r.situations);
function allRoutes(cfg) {
  const sits = sitsOf(cfg), out = [];
  const walk = (i, dec) => { if (i === sits.length) return out.push(dec); sits[i].options.forEach(o => walk(i + 1, { ...dec, [sits[i].id]: o.id })); };
  walk(0, {}); return out;
}
const unfIds = (cfg, eff) => cfg.indicators.filter(i => { const d = eff[i.id] || 0; return i.direction === 'lower-is-better' ? d > 0 : d < 0; }).map(i => i.id);
const net = e => e.apertura_oposicion + e.capacidad_adaptacion + e.ajuste_operativo - e.riesgo_cronograma;
const body = o => { const k = o.texto.indexOf(':'); return k < 0 ? o.texto : o.texto.slice(k + 1); };
const words = t => t.trim().split(/\s+/).filter(Boolean).length;
const L = i => String.fromCharCode(65 + i);

export function designQA(cfg) {
  const F = [], sits = sitsOf(cfg); let prevKey = -1;
  sits.forEach(s => {
    const keys = s.options.filter(o => o.key);
    if (keys.length !== 1) { F.push(s.id + ': debe haber una sola clave'); return; }
    const k = keys[0], ki = s.options.indexOf(k), sum = o => Object.values(o.behaviorScores).reduce((a, v) => a + v, 0);
    // R1 coherencia de signo
    (cfg.qa.signPhrases || []).forEach(p => s.options.forEach(o => { if (new RegExp(p.re).test(o.feedback_alumno) && Math.sign(o.effects[p.id] || 0) !== p.sign) F.push('R1 ' + o.id + ': signo de ' + p.id); }));
    // R2 costo explicado
    s.options.forEach(o => { const u = unfIds(cfg, o.effects); u.forEach(id => { if (!(o.feedbackCostCovers || []).includes(id)) F.push('R2 ' + o.id + ': costo sin explicar ' + id); }); if (u.length && !/El costo fue/.test(o.feedback_alumno)) F.push('R2 ' + o.id + ': feedback sin costo'); });
    // R4 decisión real de plazo
    if (!s.options.some(o => o.effects.riesgo_cronograma < 0)) F.push('R4 ' + s.id + ': ninguna opción reduce Ri');
    const up = s.options.filter(o => o.effects.riesgo_cronograma > 0);
    if (up.length === 1 && up[0] === k) F.push('R4 ' + s.id + ': la clave es la única que aumenta Ri');
    // R6 posición y longitud
    if (ki === prevKey) F.push('R6 ' + s.id + ': clave en la misma letra que la situación anterior'); prevKey = ki;
    const maxW = Math.max(...s.options.map(o => words(body(o))));
    if (words(body(k)) >= maxW) F.push('R6 ' + s.id + ': la clave es la más larga o empata');
    // R7 pregunta neutral
    const stem = k.texto.split(':')[0].split(/\s+/)[0].toLowerCase().slice(0, 5);
    if (s.question.toLowerCase().includes(stem)) F.push('R7 ' + s.id + ': la pregunta usa el verbo de la clave');
    // R9 alineación
    s.options.forEach(o => { const exp = o.key ? 'alta' : sum(o) >= 5 ? 'media' : 'baja'; if (o.alineacion !== exp) F.push('R9 ' + o.id + ': alineación ' + o.alineacion + ' ≠ ' + exp); });
    if (s.options.some(o => o !== k && sum(o) >= sum(k))) F.push('R9 ' + s.id + ': distractor con conducta ≥ clave');
    // R13 sin dominancia
    const kn = net(k.effects), ku = unfIds(cfg, k.effects).length;
    s.options.filter(o => o !== k).forEach(o => { if (unfIds(cfg, o.effects).length <= ku && net(o.effects) >= kn) F.push('R13 ' + o.id + ' domina a la clave'); });
  });
  return F;
}

export function runQA(cfg) {
  const routes = allRoutes(cfg).map(dec => checkRoute(cfg, dec));
  const design = designQA(cfg), G = [];
  const T = thresholds(cfg), key = sitsOf(cfg).map(s => L(s.options.findIndex(o => o.key))).join('-');
  // R14 equilibrio diagnóstico
  cfg.behaviors.forEach(b => { if (!routes.some(r => r.lowestIds.includes(b.id))) G.push('R14 ' + b.id + ' nunca aparece como mínimo'); });
  cfg.behaviors.forEach((b, k) => { const v = new Set(routes.map(r => r.meansRaw[k].toFixed(3))); if (v.size < 2) G.push('R14 ' + b.id + ' no varía'); });
  // Pruebas extremas
  const nul = JSON.parse(JSON.stringify(cfg)); sitsOf(nul).forEach(s => s.options.forEach(o => Object.keys(o.effects).forEach(k => (o.effects[k] = 0))));
  allRoutes(nul).forEach(dec => { const a = buildReport(nul, dec), b = buildReport(cfg, dec); if (a.verdict !== b.verdict || a.tensionRule !== 'N' || a.indicators.some(i => i.tone !== 'neutral')) G.push('efectos nulos: ' + a.picks.join('·')); });
  const summary = {
    key, thresholds: T, routes: routes.length, pass: routes.filter(r => r.ok).length,
    bands: ['alto', 'medio', 'bajo'].reduce((o, b) => ({ ...o, [b]: routes.filter(r => r.band === b).length }), {}),
    risk: { up: routes.filter(r => r.riDelta > 0).length, down: routes.filter(r => r.riDelta < 0).length, zero: routes.filter(r => r.riDelta === 0).length },
    minima: routes.reduce((o, r) => { const k = r.lowestIds.map(id => id[0].toUpperCase()).join('+'); o[k] = (o[k] || 0) + 1; return o; }, {}),
    adverseNonRisk: routes.filter(r => r.adverseNonRisk).length
  };
  const E = cfg.qa && cfg.qa.expected;
  if (E) {
    Object.keys(E.bands).forEach(b => { if (E.bands[b] !== summary.bands[b]) G.push('distribución ' + b + ': ' + summary.bands[b] + ' ≠ ' + E.bands[b]); });
    Object.keys(E.risk).forEach(b => { if (E.risk[b] !== summary.risk[b]) G.push('riesgo ' + b + ': ' + summary.risk[b] + ' ≠ ' + E.risk[b]); });
    if (E.keyPattern && E.keyPattern !== key) G.push('patrón de claves ' + key + ' ≠ ' + E.keyPattern);
  }
  const ok = design.length === 0 && G.length === 0 && summary.pass === summary.routes;
  return { ok, summary, design, global: G, routes };
}

function checkRoute(cfg, dec) {
  const r = buildReport(cfg, dec), F = [], T = thresholds(cfg);
  const opts = sitsOf(cfg).flatMap(s => s.options), picks = r.picks.map(id => opts.find(o => o.id === id));
  const NS = cfg.finalReport.sections.nextStep, MT = cfg.finalReport.sections.mainTension, PL = cfg.finalReport.behaviorPlainLanguage;
  // Conducta y umbrales leídos del config
  const exp = cfg.behaviors.map(b => picks.reduce((a, o) => a + o.behaviorScores[b.id], 0) / picks.length);
  exp.forEach((e, k) => { if (Math.abs(e - r.means[k].mean) > 1e-12) F.push('promedio ' + cfg.behaviors[k].id); });
  const vi = exp.reduce((a, v) => a + v, 0) / exp.length;
  if (Math.abs(vi - r.verdictIndex) > 1e-12) F.push('verdictIndex');
  const eb = vi >= T.high - EPS ? 'alto' : vi >= T.mid - EPS ? 'medio' : 'bajo';
  if (eb !== r.band) F.push('categoría ≠ umbrales del config');
  const mn = Math.min(...exp), low = cfg.behaviors.filter((b, k) => Math.abs(exp[k] - mn) < 1e-9).map(b => b.id);
  if (low.join() !== r.lowest.join()) F.push('conducta mínima');
  // Efectos adversos: el veredicto no depende de effects
  const mut = JSON.parse(JSON.stringify(cfg));
  sitsOf(mut).forEach(s => s.options.forEach(o => { o.alineacion = 'alta'; o.effects = { apertura_oposicion: -50, capacidad_adaptacion: -50, ajuste_operativo: -50, riesgo_cronograma: 50 }; }));
  const rm = buildReport(mut, dec);
  if (rm.verdict !== r.verdict || rm.nextStepVariant !== r.nextStepVariant) F.push('resultado depende de effects/alineación');
  if (rm.indicators.some(i => i.tone !== 'unfavorable')) F.push('efectos adversos mal representados');
  const rmk = rm.indicators.find(i => i.id === 'riesgo_cronograma'); if (rmk.state !== 'Aumentó') F.push('signo de Ri en adversos');
  // Effects
  cfg.indicators.forEach(i => { const e = Math.max(i.min, Math.min(i.max, i.initial + picks.reduce((a, o) => a + (o.effects[i.id] || 0), 0))); if (e !== r.effects[i.id]) F.push('effect ' + i.id); });
  const rk = r.indicators.find(i => i.id === 'riesgo_cronograma');
  if ((rk.delta > 0 && (rk.state !== 'Aumentó' || rk.tone !== 'unfavorable')) || (rk.delta < 0 && (rk.state !== 'Disminuyó' || rk.tone !== 'favorable')) || (rk.delta === 0 && rk.state !== 'Sin cambio')) F.push('dirección riesgo');
  const unf = r.indicators.filter(i => i.tone === 'unfavorable'), favs = r.indicators.filter(i => i.tone === 'favorable');
  // Explicación: variante lógica
  const tt = TIE[low.length];
  const expVar = eb === 'alto' ? 'alto' : eb === 'medio' ? 'medio_' + tt : (favs.length ? 'bajo_parcial_' : 'bajo_sin_favorables_') + tt;
  if (r.explanationVariant !== expVar) F.push('variante de explicación ' + r.explanationVariant + ' ≠ ' + expVar);
  if ((r.explanation.match(/[.?!](\s|$)/g) || []).length > 2) F.push('explicación > 2 frases');
  if (r.band === 'alto' && /menos|débil|debilidad|poco consistente/i.test(r.explanation)) F.push('déficit en resultado alto');
  if (r.band !== 'alto' && low.length < 3 && low.some(id => !r.explanation.includes(PL[id]))) F.push('explicación no nombra los mínimos');
  if (low.length === 3 && Object.values(PL).some(t => r.explanation.includes(t))) F.push('empate triple resuelto en explicación');
  // Sección 02
  const ns = r.nextSteps.map(n => n.title + ' ' + n.text).join(' ');
  const allText = [r.verdict, r.explanation, r.tensionTitle, r.tensionText, ns].join(' ');
  if (/(aument[óa]\w*|intensific\w*) (la )?resistencia|resistencia (aument|se intensific)/i.test(allText)) F.push('afirma que la resistencia aumentó');
  if (/aumentó la presión|aumentó el riesgo|requirió tiempo/.test(r.tensionTitle + r.tensionText) && rk.delta <= 0) F.push('tensión de plazo inventada');
  if (/ganó margen/.test(r.tensionText) && rk.delta >= 0) F.push('margen inventado');
  if (/sin que aumentara la presión/.test(r.tensionText) && rk.delta !== 0) F.push('riesgo mal descrito');
  if (rk.delta > 0 && !/aumentó la presión/.test(r.tensionText) && !['N', 'C'].includes(r.tensionRule)) F.push('aumento de riesgo omitido en 02');
  if (/resolvieron|razonable/.test(allText)) F.push('término no permitido');
  { const MTn = MT.favorableNouns, t = r.tensionText.toLowerCase();
    const tf = Object.values(MT.unfavorablePhrases).reduce((a, p) => a.split(p).join(' '), t);
    const ment = Object.keys(MTn).filter(id => tf.includes(MTn[id].t)).concat(/ganó margen/.test(t) ? ['riesgo_cronograma'] : []);
    if (ment.length > MT.maxFavorablesInSummary) F.push('más de 2 avances en 02');
    ment.forEach(id => { if (r.indicators.find(i => i.id === id).tone !== 'favorable') F.push('avance inexistente ' + id); });
    if (!['C', 'N'].includes(r.tensionRule)) { const e2 = topFavorables(r.indicators, MT.maxFavorablesInSummary).map(i => i.id).sort().join(); if (ment.slice().sort().join() !== e2) F.push('avances ≠ mayor magnitud'); }
    unf.forEach(i => { if (!['N', 'C'].includes(r.tensionRule) && !t.includes(MT.unfavorablePhrases[i.id])) F.push('costo omitido ' + i.id); });
    if (/^Hubo avances/.test(r.tensionTitle) && !favs.length) F.push('título afirma avances inexistentes'); }
  { const CONN = /\b(eso|esto|lo que)\s+(aument|reduj|provoc|gener|caus|dej|mejor|empeor)|\bporque\b|\bdebido a\b|\ba causa de\b|\bpor (eso|ello)\b|\ben consecuencia\b|\bprovoc(ó|aron)\b|\bcaus(ó|aron)\b|\bgener(ó|aron)\b|\brequiri(ó|eron)\b/i;
    const BEH = /consisten|desigual|débil|gestion|comprend|escuch|comprob|decisiones|respuestas/i, EFF = /plazo|cronograma|riesgo|apertura para|condiciones para|realidad operativa|costos/i;
    [r.tensionTitle, r.tensionText, r.explanation, ns].forEach(txt => txt.split(/(?<=[.?!])\s+/).forEach(sn => { if (CONN.test(sn) && BEH.test(sn) && EFF.test(sn)) F.push('causalidad no sustentada'); })); }
  const trade = unf.length > 0 || r.band !== 'alto';
  if (r.tensionHeading === MT.titles.balance && trade && r.tensionRule !== 'N') F.push('balance con contraste');
  if (r.tensionHeading === MT.titles.tension && !trade) F.push('tensión inexistente');
  if (r.band === 'alto' && /poco consistente|desigual|insuficientemente/.test(r.tensionTitle)) F.push('02 contradice resultado');
  if (r.band !== 'alto' && /con consistencia|consistentes entre sí/.test(r.tensionTitle)) F.push('02 contradice resultado');
  if ((allText.match(/poco consistente/gi) || []).length > 1) F.push('"poco consistente" repetido');
  // Sección 03 · R17
  const nsVar = eb === 'alto' ? 'consolidacion' : low.length === 3 ? 'desarrollo_integrado' : low.length === 2 ? 'dos_minimos' : 'minimo_unico';
  if (r.nextStepVariant !== nsVar) F.push('03 variante ' + r.nextStepVariant + ' ≠ ' + nsVar);
  if (eb === 'alto' && (r.nextSteps.length !== 1 || r.nextSteps[0].title !== NS.consolidationText)) F.push('R17 alto sin consolidación');
  if (eb === 'alto' && exp.some(e => e < cfg.qa.highMinBehavior - EPS)) F.push('R17 ruta alta con conducta < ' + cfg.qa.highMinBehavior);
  if (nsVar === 'dos_minimos' && r.nextSteps.map(n => n.title).join() !== low.map(id => NS.byLowest[id].title).join()) F.push('03 no muestra ambas recomendaciones');
  if (nsVar === 'minimo_unico' && r.nextSteps[0].title !== NS.byLowest[low[0]].title) F.push('03 ≠ conducta mínima');
  if (/\d|%|score|_/.test(allText + r.indicators.map(i => i.label + i.state).join(' ')) || cfg.behaviors.some(b => allText.includes(b.label))) F.push('dato interno visible');
  return { ruta: r.picks.map(id => id.slice(-1)).join('-'), meansRaw: exp, means: exp.map(m => m.toFixed(2)).join(' / '), verdictIndex: +vi.toFixed(4), band: r.band,
    riDelta: rk.delta, adverseNonRisk: r.indicators.some(i => i.id !== 'riesgo_cronograma' && i.delta < 0), lowestIds: low,
    explanationVariant: r.explanationVariant, rule: r.tensionRule, nextStepVariant: r.nextStepVariant, ok: F.length === 0, issues: [...new Set(F)] };
}
