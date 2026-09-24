# QA v4 — Alineamiento, coherencia y congruencia (config v1.1 DRAFT)

Motor e informe: **27/27 PASS** (sin cambios en textos del informe).

## Verificado sin observaciones
- Línea de tiempo: Día + días restantes = 10 en S1 (2+8), S2 (5+5), S3 (8+2). Pantalla 2 y `puntoDePartida` = "Día 2 · Quedan 8 días".
- Eventos condicionales: "Tres días después" coincide con Día 2 → Día 5; todas las opciones de S1 y S2 tienen evento para la situación siguiente.
- Feedback ↔ effects sobre cronograma coherentes en las 6 opciones que lo mencionan (costo ↔ riesgo sube; "velocidad"/"protegiste" ↔ riesgo baja).
- Opciones "alta" (S1_B, S2_B, S3_B) = behaviorScores más altos de cada situación.
- Pregunta de la pantalla 1 = pregunta del informe = verdict.question.
- Rol único: Responsable de Operaciones (config, pantalla 2, cabecera). Sin restos de Valeria/Diego.
- Informe: sin datos internos, sin causalidad no sustentada, ≤2 mejoras reales (según runQA).

## Corregido (solo formal, sin efecto en motor ni en lo que ve el participante)
1. `indicators[].label` alineados con las etiquetas visibles en panel de impacto e informe:
   - Apertura para plantear → **expresar** preocupaciones
   - Capacidad del equipo para adaptarse → **Condiciones para adaptarse**
   - Ajuste del cambio a la realidad operativa → **Ajuste a la realidad operativa**
2. Código sin uso de la antigua selección de protagonista eliminado.
3. Changelog v1.1 rev. 4 actualizado.

## Pendiente de decisión (afecta contenido de situaciones o metadatos)
| # | Hallazgo | Propuesta |
|---|---|---|
| P1 | La interfaz de las situaciones reformula el `framing` del config: dudas de S1 como citas directas ("¿Para qué sirve realmente…?"), Bruno "lo que **pasa**" vs config "lo que **ocurre**". | Actualizar `framing` del config para que coincida con lo que se muestra. |
| P2 | S1: la frase final del config "Tienes que decidir qué hacer primero." no aparece en la interfaz. | Mostrarla en la interfaz, o retirarla del config. |
| P3 | Formato de cabecera del framing: S1 "Día 2 · Faltan 8 días"; S2/S3 "Día 5. Faltan 5 días." | Unificar a "Día N · Faltan N días" (no cambia lo visible). |
| P4 | Terminología: pantalla 2 "Quedan 8 días"; situaciones "Faltan N días para el lanzamiento". | Unificar a "Quedan" o a "Faltan". |
| P5 | `duracionSimuladorMin` = `duracionTallerMin` = 75. | Confirmar duración real del simulador. |
| P6 | `sharedProfile.descripcion` en 3.ª persona ("Conoce bien…"); el protagonista ahora es "tú". No se muestra en la interfaz. | Pasarla a 2.ª persona o eliminarla. |
| P7 | `trajectoryLabels.S3_C` = "Contuviste" para "Crear una excepción temporal". | Cambiar a "Exceptuaste" / "Habilitaste una excepción". |
| P8 | Propósito R3 repite "automáticamente" dos veces. | "…sin descartarla ni convertirla automáticamente en un veto al cambio." |
| P9 | S1_A y S2_A (media de behaviorScores 1,33) figuran con `diseno.alineacion` "media". Uso solo interno. | Confirmar o pasar a "baja". |
