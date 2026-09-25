# Simulador · Resistencia al cambio

¿Cómo estás gestionando la resistencia al cambio?

Versión 1.2 · especificación FINAL_QA_v3 · claves C → A → B · umbrales 2,50 / 2,00.

## Publicar con GitHub Pages
1. Sube todo el contenido de esta carpeta a la raíz del repositorio (reemplaza lo anterior).
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. El simulador quedará disponible en `https://<usuario>.github.io/<repositorio>/`.

## Contenido
- `index.html` — simulador completo en un solo archivo.
- `fuente/` — archivos fuente editables:
  - `Simulador Resistencia al Cambio.dc.html` — interfaz del simulador.
  - `report-logic.js` — lógica del informe final y QA automático (27 rutas y reglas de diseño).
  - `config/resistencia-al-cambio_v1.2.json` — configuración: todos los textos visibles, situaciones, alternativas, D/A/I, efectos, eventos, umbrales e informe.
  - `support.js` — runtime necesario para la interfaz.
- `docs/Especificacion_FINAL_QA_v3.md` — especificación aprobada.
- `QA Implementación v1.2.md` — resultado del QA: 27/27 rutas aprobadas, sin hallazgos.

La carpeta `fuente/` debe servirse desde un servidor (GitHub Pages sirve). No funciona abriéndola con doble clic.
