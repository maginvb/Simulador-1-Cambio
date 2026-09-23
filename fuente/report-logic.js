// Lógica del informe final (config v1.1 rev. 2). Fuente única para el simulador y para el QA.
// Resultado principal = behaviorScores. 01 = effects. 02 = relación entre ambos. 03 = behavior menor.
const EPS = 1e-9;
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const list = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];

// Empate de magnitud en el límite: no se elige arbitrariamente; se mencionan solo los que superan al empatado.
function topFavorables(indicators, max) {
  const f = indicators.filter(i => i.tone === 'favorable').sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (f.length <= max) return f;
  const cut = Math.abs(f[max - 1].delta);
  return Math.abs(f[max].delta) === cut ? f.filter(i => Math.abs(i.delta) > cut) : f.slice(0, max);
}

export function buildReport(cfg, dec) {
  const V = cfg.verdict, FR = cfg.finalReport, S = FR.sections, PL = FR.behaviorPlainLanguage, minObs = cfg.scoring.minObservationsForInterpretation;
  const picks = cfg.rounds.flatMap(r => r.situations).map(x => x.options.find(o => o.id === dec[x.id])).filter(Boolean);

  // Gestión: exclusivamente behaviorScores (sin effects ni diseno.alineacion)
  const means = cfg.behaviors.map(b => {
    const obs = picks.map(o => o.behaviorScores[b.id]).filter(v => v != null);
    return { id: b.id, obs: obs.length, mean: obs.length ? obs.reduce((a, v) => a + v, 0) / obs.length : null };
  });
  const elig = means.filter(m => m.obs >= minObs);
  const verdictIndex = elig.length ? elig.reduce((a, m) => a + m.mean, 0) / elig.length : null;
  const band = V.bands.find(b => (b.min == null || verdictIndex >= b.min - EPS) && (b.maxExclusive == null || verdictIndex < b.maxExclusive - EPS));
  const minMean = Math.min(...elig.map(m => m.mean));
  const lowest = elig.filter(m => Math.abs(m.mean - minMean) < EPS).map(m => m.id);
  const tie = lowest.length > 1;

  // 01 · Consecuencias: exclusivamente effects acumulados
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

  // Explicación (máx. 2 frases)
  const EX = FR.explanation;
  let explanation;
  if (band.id === 'alto') explanation = EX.alto;
  else if (band.id === 'medio') explanation = tie ? EX.medio.tie : EX.medio.unique.replace('{lowest}', PL[lowest[0]]);
  else explanation = (anyFav ? EX.bajo.leadIfFavorableEffects : EX.bajo.leadOtherwise) + ' ' + (tie ? EX.bajo.tie : EX.bajo.unique.replace('{lowest}', PL[lowest[0]]));

  // 02 · Relación entre gestión y consecuencias
  const MT = S.mainTension, R = id => MT.rules.find(r => r.id === id);
  const unfList = list(unfAll.map(i => MT.unfavorablePhrases[i.id]));
  // Avances: solo indicadores favorables, ordenados por |delta| acumulado, máx. 2 (el cronograma cuenta si disminuyó)
  const favSel = topFavorables(indicators, MT.maxFavorablesInSummary);
  const selC = favSel.filter(i => i.id !== 'riesgo_cronograma').map(i => MT.favorableNouns[i.id]), selRisk = favSel.some(i => i.id === 'riesgo_cronograma');
  const favLead = selC.length ? cap(list(selC.map(n => n.t))) + (selC.length > 1 || selC[0].pl ? ' mejoraron' : ' mejoró') + (selRisk ? ' y el cronograma ganó margen' : '') : selRisk ? 'El cronograma ganó margen' : '';
  const unfText = () => favLead ? favLead + ', mientras ' + unfList + '.' : 'En el escenario, ' + unfList + '.';
  const focus = tie ? MT.lowestFocus.tie : MT.lowestFocus[lowest[0]];
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

  // 03 · Aprendizaje
  const NS = S.nextStep;
  let nextStep, nextStepText = '';
  if (verdictIndex >= NS.ifVerdictIndexAtLeast - EPS) nextStep = NS.consistentText;
  else if (tie) nextStep = NS.tieText;
  else { nextStep = NS.byLowest[lowest[0]].title; nextStepText = NS.byLowest[lowest[0]].text; }

  return { picks: picks.map(o => o.id), means, verdictIndex, band: band.id, verdict: band.text, explanation, indicators, effectClass,
    tensionRule: rule, tensionHeading, tensionTitle, tensionText, favSel: favSel.map(i => i.id), nextStep, nextStepText, lowest, tie, effects: vals };
}

export function runQA(cfg) {
  const sits = cfg.rounds.flatMap(r => r.situations), rows = [];
  const walk = (i, dec) => { if (i === sits.length) return rows.push(checkRoute(cfg, dec)); sits[i].options.forEach(o => walk(i + 1, { ...dec, [sits[i].id]: o.id })); };
  walk(0, {});
  return rows;
}

function checkRoute(cfg, dec) {
  const r = buildReport(cfg, dec), F = [];
  const opts = cfg.rounds.flatMap(x => x.situations).flatMap(s => s.options), picks = r.picks.map(id => opts.find(o => o.id === id));
  const NS = cfg.finalReport.sections.nextStep, MT = cfg.finalReport.sections.mainTension;
  // Gestión
  const exp = cfg.behaviors.map(b => picks.reduce((a, o) => a + o.behaviorScores[b.id], 0) / picks.length);
  exp.forEach((e, k) => { if (Math.abs(e - r.means[k].mean) > 1e-12) F.push('promedio ' + cfg.behaviors[k].id); });
  const vi = exp.reduce((a, v) => a + v, 0) / exp.length;
  if (Math.abs(vi - r.verdictIndex) > 1e-12) F.push('verdictIndex');
  const eb = vi >= 2.5 - EPS ? 'alto' : vi >= 2.0 - EPS ? 'medio' : 'bajo';
  if (eb !== r.band) F.push('categoría');
  const mut = JSON.parse(JSON.stringify(cfg));
  mut.rounds.forEach(x => x.situations.forEach(s => s.options.forEach(o => { if (o.diseno) o.diseno.alineacion = 'alta'; o.effects = { apertura_oposicion: -50, capacidad_adaptacion: -50, ajuste_operativo: -50, riesgo_cronograma: 50 }; })));
  const rm = buildReport(mut, dec);
  if (rm.verdict !== r.verdict) F.push('resultado depende de effects/alineacion');
  const mn = Math.min(...exp), low = cfg.behaviors.filter((b, k) => Math.abs(exp[k] - mn) < 1e-9).map(b => b.id);
  if (low.join() !== r.lowest.join()) F.push('behavior menor');
  // Effects
  cfg.indicators.forEach(i => { const e = Math.max(i.min, Math.min(i.max, i.initial + picks.reduce((a, o) => a + (o.effects[i.id] || 0), 0))); if (e !== r.effects[i.id]) F.push('effect ' + i.id); });
  const rk = r.indicators.find(i => i.id === 'riesgo_cronograma');
  if ((rk.delta > 0 && (rk.state !== 'Aumentó' || rk.tone !== 'unfavorable')) || (rk.delta < 0 && (rk.state !== 'Disminuyó' || rk.tone !== 'favorable')) || (rk.delta === 0 && rk.state !== 'Sin cambio')) F.push('dirección riesgo');
  const unf = r.indicators.filter(i => i.tone === 'unfavorable'), favs = r.indicators.filter(i => i.tone === 'favorable');
  // Explicación
  const sentences = (r.explanation.match(/[.?!](\s|$)/g) || []).length;
  if (sentences > 2) F.push('explicación > 2 frases');
  if (r.band === 'alto' && /menos|débil|debilidad|poco consistente/i.test(r.explanation)) F.push('déficit en resultado alto');
  if (/necesidades concretas/.test(r.explanation) && !favs.length) F.push('explicación afirma efecto no sustentado');
  if (!r.tie && r.band !== 'alto' && !r.explanation.includes(cfg.finalReport.behaviorPlainLanguage[r.lowest[0]])) F.push('explicación no nombra aspecto menor');
  if (r.tie && Object.values(cfg.finalReport.behaviorPlainLanguage).some(t => r.explanation.includes(t))) F.push('empate resuelto en explicación');
  // Sección 02
  const allText = [r.verdict, r.explanation, r.tensionTitle, r.tensionText, r.nextStep, r.nextStepText].join(' ');
  if (/(aument[óa]\w*|intensific\w*) (la )?resistencia|resistencia (aument|se intensific)/i.test(allText)) F.push('afirma que la resistencia aumentó');
  if (/aumentó la presión|aumentó el riesgo|requirió tiempo/.test(r.tensionTitle + r.tensionText) && rk.delta <= 0) F.push('tensión de plazo inventada');
  if (/sin que aumentara la presión|ganó margen/.test(r.tensionText) && rk.delta >= 0 && !(rk.delta === 0 && /sin que aumentara/.test(r.tensionText) && !/ganó margen/.test(r.tensionText))) F.push('riesgo mal descrito');
  if (/ganó margen/.test(r.tensionText) && rk.delta >= 0) F.push('margen inventado');
  if (/aumentó la presión/.test(r.tensionTitle + r.tensionText) && rk.delta <= 0) F.push('aumento de riesgo inventado');
  if (rk.delta > 0 && !/aumentó la presión/.test(r.tensionText) && r.tensionRule !== 'N') F.push('aumento de riesgo omitido en 02');
  if (/resolvieron/.test(allText)) F.push('afirma necesidad resuelta');
  if (/razonable/.test(allText)) F.push('categoría inexistente');
  // Avances en 02: máx. 2, todos reales, los de mayor |delta|
  { const MTn = MT.favorableNouns, t = r.tensionText.toLowerCase();
    const ment = Object.keys(MTn).filter(id => t.includes(MTn[id].t)).concat(/ganó margen/.test(t) ? ['riesgo_cronograma'] : []);
    if (ment.length > MT.maxFavorablesInSummary) F.push('más de 2 avances en 02');
    ment.forEach(id => { if (r.indicators.find(i => i.id === id).tone !== 'favorable') F.push('avance inexistente ' + id); });
    if (r.tensionRule !== 'C' && r.tensionRule !== 'N') { const exp2 = topFavorables(r.indicators, MT.maxFavorablesInSummary).map(i => i.id).sort().join(); if (ment.slice().sort().join() !== exp2) F.push('avances seleccionados ≠ mayor magnitud'); }
    unf.forEach(i => { if (r.tensionRule !== 'N' && r.tensionRule !== 'C' && !t.includes(MT.unfavorablePhrases[i.id])) F.push('efecto desfavorable no descrito ' + i.id); });
    if (/^Hubo avances/.test(r.tensionTitle) && !favs.length) F.push('título afirma avances inexistentes');
    if (/aumentó la presión sobre el plazo\.$/.test(r.tensionTitle) && !(unf.length === 1 && unf[0].id === 'riesgo_cronograma')) F.push('título omite otros costos'); }
  // Causalidad no sustentada conducta → consecuencia (título, texto, explicación, recomendación)
  { const CONN = /\b(eso|esto|lo que)\s+(aument|reduj|provoc|gener|caus|dej|mejor|empeor)|\bporque\b|\bdebido a\b|\ba causa de\b|\bpor (eso|ello)\b|\ben consecuencia\b|\bprovoc(ó|aron)\b|\bcaus(ó|aron)\b|\bgener(ó|aron)\b|\brequiri(ó|eron)\b|\bdejaron tensiones\b|\bcomo no\b/i;
    const BEH = /consisten|desigual|débil|razonable|gestion|comprend|escuch|comprob|decisiones|respuestas/i;
    const EFF = /plazo|cronograma|riesgo|apertura para|condiciones para|realidad operativa|tensiones|costos/i;
    [['tensionTitle', r.tensionTitle], ['tensionText', r.tensionText], ['explicación', r.explanation], ['recomendación', r.nextStep + ' ' + r.nextStepText]].forEach(([k, txt]) =>
      txt.split(/(?<=[.?!])\s+/).forEach(sn => { if (CONN.test(sn) && BEH.test(sn) && EFF.test(sn)) F.push('causalidad no sustentada en ' + k); })); }
  if (/fortalecieron|favorables|positivos|avanzó favorablemente/.test(r.tensionTitle + r.tensionText) && !favs.length) F.push('efecto favorable inventado');
  if (['E', 'F'].includes(r.tensionRule)) { if (!unf.length) F.push('costo inventado'); unf.forEach(i => { if (!r.tensionText.includes(MT.unfavorablePhrases[i.id])) F.push('costo omitido ' + i.id); }); if (favs.some(i => r.tensionText.includes(MT.unfavorablePhrases[i.id]))) F.push('deterioro inventado'); }
  const trade = unf.length > 0 || r.band !== 'alto';
  if (r.tensionHeading === MT.titles.balance && trade && r.tensionRule !== 'N') F.push('balance con contraste');
  if (r.tensionHeading === MT.titles.tension && !trade) F.push('tensión inexistente');
  if (r.band === 'alto' && /poco consistente|desigual|insuficientemente/.test(r.tensionTitle)) F.push('02 contradice resultado');
  if (r.band !== 'alto' && /con consistencia|consistentes entre sí/.test(r.tensionTitle)) F.push('02 contradice resultado');
  const visibleSecs = [r.verdict, r.explanation, r.tensionTitle, r.tensionText, r.nextStep, r.nextStepText];
  const pc = visibleSecs.join(' ').match(/poco consistente/gi) || [];
  if (pc.length > 1) F.push('"poco consistente" repetido');
  if (r.band === 'bajo' && !/poco consistente/.test(r.verdict)) F.push('respuesta baja sin valoración');
  const consist = [r.verdict, r.explanation, r.tensionTitle + ' ' + r.tensionText].filter(t => /consisten|desigual/i.test(t)).length;
  if (consist >= 3) F.push('misma valoración en 3 secciones');
  const grams = t => { const w = t.toLowerCase().replace(/[.,:;¿?]/g, '').split(/\s+/), g = new Set(); for (let k = 0; k + 6 <= w.length; k++) g.add(w.slice(k, k + 6).join(' ')); return g; };
  const gx = grams(r.explanation), shared = [...grams(r.tensionTitle + ' ' + r.tensionText)].filter(g => gx.has(g));
  if (shared.length) F.push('repetición mecánica explicación/02: ' + shared[0]);
  if (['E', 'F'].includes(r.tensionRule)) {
    const fc = favs.filter(i => i.id !== 'riesgo_cronograma'), nouns = MT.favorableNouns;
    const mentioned = fc.filter(i => r.tensionText.toLowerCase().includes(nouns[i.id].t));
    if (favs.length && !mentioned.length && !/ganó margen/.test(r.tensionText)) F.push('E/F sin avances');
    if (mentioned.length > MT.maxFavorablesInSummary) F.push('E/F repite lista de 01');
    Object.keys(nouns).forEach(id => { const ind = r.indicators.find(i => i.id === id); if (ind.tone !== 'favorable' && r.tensionText.toLowerCase().includes(nouns[id].t)) F.push('avance inventado ' + id); });
  }
  // Sección 03
  if (vi >= 2.5 - EPS && r.nextStep !== NS.consistentText) F.push('03 correctiva en alto');
  if (vi < 2.5 - EPS && low.length > 1 && r.nextStep !== NS.tieText) F.push('empate resuelto arbitrariamente');
  if (vi < 2.5 - EPS && low.length === 1 && r.nextStep !== NS.byLowest[low[0]].title) F.push('03 ≠ behavior menor');
  // Datos internos
  if (/\d|%|score|_/.test(allText + r.indicators.map(i => i.label + i.state).join(' ')) || cfg.behaviors.some(b => allText.includes(b.label))) F.push('dato interno visible');
  if (/Obtuvistes/.test(allText)) F.push('ortografía');
  return { ruta: r.picks.join(' · '), means: r.means.map(m => m.mean.toFixed(3)).join(' / '), verdictIndex: r.verdictIndex.toFixed(4), band: r.band, verdict: r.verdict, explanation: r.explanation,
    indicadores: r.indicators.map(i => i.state).join(' / '), effectClass: r.effectClass, rule: r.tensionRule, heading: r.tensionHeading, tensionTitle: r.tensionTitle, tensionText: r.tensionText,
    lowest: r.tie ? 'empate: ' + r.lowest.join(', ') : r.lowest.join(''), nextStep: r.nextStep, ok: F.length === 0, issues: [...new Set(F)] };
}
