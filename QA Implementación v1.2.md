# QA de implementación — config v1.2 (FINAL_QA_v3)

**Resultado: APROBADO · 27/27 rutas sin observaciones · 0 hallazgos de diseño · 0 hallazgos globales**

## Reglas de diseño
- R1 signo, R2 costo explicado, R4 plazo, R6 posición/longitud, R7 pregunta neutral, R9 alineación, R13 dominancia: sin hallazgos.
- Claves C · A · B (sin repetir letra).
- Longitud (palabras sin título): S1 22/26/**21** · S2 **27**/30/23 · S3 30/**22**/28.
- Balance neto (Ap+Co+Aj−Ri): S1 6/12/**20** · S2 **27**/0/9 · S3 6/**18**/7.

## Motor
- Umbrales leídos del config: 2,50 / 2,00.
- Bandas: 3 altas · 11 medias · 13 bajas (= especificación).
- Riesgo: 13 ↑ · 11 ↓ · 3 sin cambio (= especificación).
- Por claves: 3 → 1 alta · 2 → 2 altas + 4 medias · 1 → 7 medias + 5 bajas · 0 → 8 bajas.
- Ruta C-A-B: D/A/I 2,67 · Ap +28 · Co +22 · Aj +21 · Ri +6.
- Rangos: D 1,00–2,67 · A 1,33–2,67 · I 1,00–2,67.
- Mínimos: D 8 · A 4 · D+I 7 · D+A 5 · triple 3. Las tres conductas aparecen como mínima (R14).
- 4 rutas con Ap, Co o Aj por debajo del inicio.

## Informe
- R17: las 3 rutas altas (B-A-B, C-A-B, C-C-B) muestran consolidación; ninguna conducta < 2,00.
- Sección 03: consolidación 3 · mínimo único 10 · dos mínimos 12 · desarrollo integrado 2 (C-B-A bajo, C-C-A medio).
- Explicación: la variante lógica coincide con la esperada en las 27 rutas (incluida “bajo con consecuencias favorables parciales”).
- Efectos nulos: veredicto sin cambios, regla N, los cuatro indicadores “Sin cambio”.
- Efectos adversos: veredicto y sección 03 sin cambios; Ri se muestra como “Aumentó” y desfavorable.

## Implementación
- Contenido de facilitador (qué mide, sustento) no aparece en la interfaz (R16).
- Sin restos de `chip()`, `dirText()`, `persist()`, `localStorage`, `trajectoryLabels` ni `framing`.
- Único texto fijo en plantilla: “Preparando la simulación…”, que se muestra antes de que cargue el config. El mensaje de error de carga también está fijo en el código por el mismo motivo; `ui.loadError` existe en el config pero no se puede usar si el config no carga.
- La versión exportable y la independiente usan el mismo código y config v1.2.
