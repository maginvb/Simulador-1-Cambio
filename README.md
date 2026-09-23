# Simulador · Resistencia al cambio

¿Estás gestionando la resistencia… o la estás aumentando?

## Publicar con GitHub Pages
1. Sube todo el contenido de esta carpeta a la raíz del repositorio.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. El simulador quedará disponible en `https://<usuario>.github.io/<repositorio>/`.

## Contenido
- `index.html` — simulador completo en un solo archivo (funciona sin conexión).
- `fuente/` — archivos fuente editables:
  - `Simulador Resistencia al Cambio.dc.html` — interfaz del simulador.
  - `report-logic.js` — lógica del informe final y QA de las 27 rutas.
  - `uploads/resistencia-o-aumento-001_v1.1_DRAFT.json` — configuración (situaciones, alternativas, behaviorScores, effects, umbrales, textos del informe).
  - `support.js` — runtime necesario para la interfaz.
- `QA Informe Final.md` — resultado del QA: 27 PASS / 0 FAIL.

La carpeta `fuente/` debe servirse desde un servidor (GitHub Pages sirve); no funciona abriéndola con doble clic por las restricciones del navegador para `fetch`.
