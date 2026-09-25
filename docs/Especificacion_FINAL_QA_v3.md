# Simulador de resistencia al cambio — versión final optimizada

## Estado

Versión final optimizada v3 de diseño y especificación después del control de calidad conceptual, pedagógico, lógico y de motor de feedback. La arquitectura se basa en tres conductas observables y cuatro indicadores de consecuencia.

**Importante:** los puntajes de conducta y los efectos numéricos son una calibración del simulador. Hodges sustenta la dirección conceptual de las decisiones, no los valores numéricos concretos.

### Abreviaturas

- **Conductas (1 a 3):** D = Diagnostica antes de actuar · A = Ajusta la intervención a la barrera · I = Integra la oposición como insumo.
- **Efectos:** Ap = Apertura para expresar preocupaciones · Co = Condiciones para adaptarse · Aj = Ajuste a la realidad operativa · Ri = Riesgo sobre el cronograma.
- En **Ap, Co y Aj**, mayor es mejor. En **Ri**, menor es mejor.
- Panel: 🟢 favorable · 🟠 desfavorable · ⚪ sin cambio.

---

# PARTE 1 · Reglas finales de diseño

| # | Regla |
|---|---|
| **R1** | **Coherencia de signo.** Si el texto o el feedback afirma un efecto sobre un indicador, el signo del efecto debe coincidir. |
| **R2** | **Costo explicado.** Todo efecto desfavorable del panel se explica de forma explícita en el feedback. |
| **R3** | **Trade-off real.** Toda opción tiene un costo o limitación plausible. Solo aparece en el panel cuando afecta causalmente a uno de los cuatro indicadores. |
| **R4** | **Decisión real de plazo.** En cada situación, al menos una opción disminuye el riesgo sobre el cronograma y la clave nunca es la única alternativa que lo aumenta. |
| **R5** | **Riesgo ≠ tiempo utilizado.** Ri representa la probabilidad de no llegar al hito. Invertir tiempo puede aumentar, mantener o reducir el riesgo según sus consecuencias. Escala orientativa: 0 sin efecto · ±1 a 3 leve · ±4 a 5 moderado · ±6 a 7 alto. |
| **R6** | **Posición y longitud.** La clave no se repite en la misma letra en situaciones consecutivas y no es la alternativa más larga ni empata como la más larga. |
| **R7** | **Pregunta neutral.** La pregunta no usa el verbo de la clave ni presupone la respuesta. |
| **R8** | **Distractor honesto.** Ninguna alternativa confiesa su propia debilidad. Cada distractor debe ofrecer una ventaja real o resolver una parte legítima del problema. |
| **R9** | **Conducta demostrada.** Los puntajes D/A/I califican lo que la decisión demuestra, no beneficios hipotéticos posteriores. Alineación de la opción: clave = alta; distractor con suma D+A+I ≥ 5 = media; suma < 5 = baja. |
| **R10** | **Tiempo narrativo.** El feedback respeta el momento de la historia. Si describe algo posterior al lanzamiento, lo señala expresamente. |
| **R11** | **Una sola fuente.** Todo texto visible y todos los umbrales salen del config. |
| **R12** | **QA completo.** Antes de aprobar se revisan las 27 rutas, una variante de efectos adversos y otra de efectos nulos. |
| **R13** | **Sin dominancia.** Ningún distractor puede verse superior a la clave en el panel: no puede tener igual o menos efectos desfavorables y, al mismo tiempo, un balance neto igual o mayor que la clave. Para QA: balance neto = Ap + Co + Aj − Ri. |
| **R14** | **Equilibrio diagnóstico.** Las tres conductas deben variar entre rutas y poder aparecer como la dimensión mínima, sola o empatada. Los puntajes no se alteran artificialmente para forzar una distribución. Si hay empate en la dimensión más baja, el informe muestra las recomendaciones de todas las dimensiones empatadas. |
| **R15** | **Lo que se pregunta se mide.** Ningún texto de cabecera o resultado afirma algo que el motor no calcule. |
| **R16** | **Transparencia pedagógica.** “Qué está midiendo” y el sustento técnico son solo para facilitador/debrief; nunca aparecen antes de que el participante decida. |
| **R17** | **Coherencia de tono del informe.** Un resultado alto recibe siempre un mensaje integrado de consolidación, sin convertir la conducta mínima en una “debilidad”. En resultados medio o bajo, la sección 03 sí usa la conducta o conductas mínimas para orientar el desarrollo. Como salvaguarda, ninguna ruta alta puede tener D, A o I por debajo de 2,00. |

---

# PARTE 2 · Rúbrica final de conductas

| Conducta | 3 | 2 | 1 |
|---|---|---|---|
| **D · Diagnostica antes de actuar** | Contrasta causas con varias perspectivas antes de decidir | Recoge información parcial, reconoce una barrera explícita o verifica mientras interviene | Actúa sobre un supuesto o deja la verificación para después |
| **A · Ajusta la intervención a la barrera** | Ejecuta una respuesta que atiende las barreras relevantes | Atiende una barrera real, pero deja otras sin resolver, o todavía no ejecuta la respuesta | La intervención no corresponde suficientemente a la barrera o agrava alguna |
| **I · Integra la oposición como insumo** | La voz crítica modifica cómo se analiza, diseña o ejecuta la decisión | La voz se escucha y tiene una influencia parcial en la decisión | La objeción se posterga, canaliza o neutraliza sin influir en la decisión actual |

---

# PARTE 3 · Contenido final

## Pantalla de inicio

**Pregunta**  
**¿Cómo estás gestionando la resistencia al cambio?**

**Bajada**  
Explora cómo tus decisiones como líder influyen en la forma de comprender, atender y aprovechar las reacciones que aparecen durante un cambio.

## Pantalla “Asume el reto”

- **Rol:** Responsable de Operaciones.
- **Datos:** 6 años en la organización, 2 en el cargo, 18 personas a cargo.
- **El cambio:** la organización se prepara para implementar un nuevo proceso digital que modificará parte de la forma habitual de trabajar. La preparación ya ha comenzado: el equipo debe familiarizarse con la nueva forma de trabajo y realizar prácticas mientras la operación continúa funcionando.
- **Punto de partida:** Día 2 · Quedan 8 días para el lanzamiento.

---

## SITUACIÓN 1 · Día 2 · Faltan 8 días para el lanzamiento

### ¿Qué haces primero?

- Seis personas aún no completan las prácticas previstas.
- En el equipo empiezan a surgir dudas:
  - “¿Para qué sirve realmente este nuevo proceso?”
  - “¿Qué va a cambiar en nuestra forma de trabajar?”
  - “¿De verdad facilitará la operación?”
- **Bruno, operador con experiencia:** “El diseño no refleja suficientemente lo que ocurre en la operación diaria.”
- **Restricción:** la fecha de lanzamiento no se mueve.
- Tienes que decidir qué hacer primero.

### A · Aclarar y recoger

Comunicas propósito, cronograma y aspectos ya definidos; habilitas además un formulario anónimo para recoger las principales preocupaciones y responderlas al día siguiente.

- **D/A/I:** **1 / 2 / 1**
- **Efectos:** Ap 0 · Co +3 · Aj 0 · Ri −3
- **Panel:** ⚪ 🟢 ⚪ 🟢
- **Feedback:** “Ganaste velocidad y el cronograma ganó margen. El formulario recogió los temas principales que preocupaban al equipo. El costo fue dejar pendiente la conversación necesaria para comprender qué había detrás de esas preocupaciones.”
- **Etiqueta:** Aclaraste
- **Alineación:** baja

### B · Probar antes de ampliar

Creas un pequeño grupo con Bruno, dos operadores y un supervisor para utilizar el nuevo proceso en casos reales y regresar con problemas, evidencias y recomendaciones.

- **D/A/I:** **2 / 2 / 3**
- **Efectos:** Ap +2 · Co +3 · Aj +10 · Ri +3
- **Panel:** 🟢 🟢 🟢 🟠
- **Feedback:** “Ganaste evidencia concreta sobre la operación y Bruno pudo influir en la prueba. El costo fue dedicar varios bloques de trabajo de un grupo clave y recoger, por ahora, la perspectiva de solo una parte del equipo.”
- **Etiqueta:** Probaste
- **Alineación:** media

### C · Explorar causas ✔ CLAVE

Convocas una conversación breve para distinguir si el problema es de comprensión, carga, autonomía, rol o capacidad, antes de definir acciones.

- **D/A/I:** **3 / 2 / 3**
- **Efectos:** Ap +12 · Co +5 · Aj +4 · Ri +1
- **Panel:** 🟢 🟢 🟢 🟠
- **Feedback:** “Ganaste comprensión: descubriste que las reacciones no tenían una única causa y que requerían respuestas diferentes. El costo fue dedicar un bloque de trabajo a comprenderlas cuando el plazo ya era exigente.”
- **Etiqueta:** Exploraste
- **Alineación:** alta

**Qué estaba en juego:** Comprender qué información obtenías y qué podía quedar fuera antes de intervenir.

**Para reflexionar:** ¿Qué información obtuviste gracias a tu decisión? · ¿Qué información pudo quedar fuera?

**Qué está midiendo —solo facilitador:** Interpretar antes de reaccionar.

**Sustento —Hodges, cap. 4:** la oposición puede tener causas distintas y el líder necesita comprender cómo las personas interpretan el cambio y profundizar debajo de la conducta observable antes de elegir la intervención. La alternativa B es un distractor fuerte porque un piloto puede involucrar y generar evidencia, pero escucha solo una parte del sistema. La alternativa A informa y recoge temas, pero todavía no alcanza la causa de fondo.

---

## SITUACIÓN 2 · Día 5 · Faltan 5 días para el lanzamiento

### ¿Cómo respondes a quienes no avanzan?

*Aparece antes el evento correspondiente a la decisión de la Situación 1.*

- Algo más de la mitad del equipo completa correctamente las prácticas.
- En el resto del equipo:
  - algunas personas repiten errores o abandonan ejercicios;
  - algunas temen quedar expuestas al equivocarse;
  - otras dicen que la carga de trabajo les deja poco tiempo.
- **Restricción:** la fecha de lanzamiento no puede modificarse.

### A · Práctica compartida ✔ CLAVE

Reservas dos bloques breves en la jornada para practicar en grupos pequeños, sin evaluación, con apoyo de compañeros que dominan el proceso y feedback durante la práctica.

- **D/A/I:** **2 / 3 / 2**
- **Efectos:** Ap +8 · Co +15 · Aj +5 · Ri +1
- **Panel:** 🟢 🟢 🟢 🟠
- **Feedback:** “Mejoraste las condiciones para aprender y aparecieron errores que antes permanecían ocultos. El costo fue utilizar dos bloques de capacidad operativa en un momento de alta demanda.”
- **Etiqueta:** Facilitaste
- **Alineación:** alta

### B · Exigir y acompañar

Utilizas los espacios de supervisión ya previstos para hacer seguimiento diario del avance de cada persona y convocas a quienes van más atrás a dos sesiones obligatorias con su supervisor.

- **D/A/I:** **1 / 1 / 1**
- **Efectos:** Ap −6 · Co +4 · Aj 0 · Ri −2
- **Panel:** 🟠 🟢 ⚪ 🟢
- **Feedback:** “Aceleraste el seguimiento sin liberar capacidad operativa y el cronograma ganó algo de margen. El costo fue hacer más visible quién se estaba quedando atrás: algunas personas dejaron de mostrar sus dificultades por temor a quedar expuestas.”
- **Etiqueta:** Exigiste
- **Alineación:** baja

### C · Tiempo protegido

Repriorizas durante 48 horas parte de la carga de quienes presentan mayor retraso y les permites practicar individualmente, solicitando ayuda cuando la necesiten.

- **D/A/I:** **2 / 2 / 2**
- **Efectos:** Ap +2 · Co +8 · Aj +1 · Ri +2
- **Panel:** 🟢 🟢 🟢 🟠
- **Feedback:** “Creaste espacio real para practicar. Algunas personas avanzaron rápidamente; otras siguieron repitiendo errores porque su dificultad no era solo de tiempo. El costo fue trasladar durante dos días parte de la carga hacia otros miembros del equipo.”
- **Etiqueta:** Repriorizaste
- **Alineación:** media

**Qué estaba en juego:** Identificar qué barrera estabas atendiendo y cuál podía permanecer sin respuesta.

**Para reflexionar:** ¿Qué barrera atendiste principalmente con tu decisión? · ¿Qué barrera quedó menos atendida?

**Qué está midiendo —solo facilitador:** Ajustar la respuesta a la barrera que realmente dificulta el aprendizaje.

**Sustento —Hodges, cap. 4, Learning anxiety:** la ansiedad de aprendizaje puede aparecer por temor a que algo sea demasiado difícil, por miedo a quedar en evidencia o por tener que abandonar formas conocidas de trabajar. Hodges plantea reducirla mediante un entorno seguro y apoyo como formación, coaching y feedback. La alternativa A atiende simultáneamente seguridad, práctica y acompañamiento. La B protege mejor la capacidad y el plazo, pero aumenta la exposición individual. La C responde a una barrera real —falta de tiempo— y permite ayuda reactiva, aunque no crea una práctica estructurada y acompañada.

---

## SITUACIÓN 3 · Día 8 · Faltan 2 días para el lanzamiento

### ¿Qué haces con la objeción al nuevo paso de aprobación?

*Aparecen antes los eventos correspondientes a las decisiones anteriores.*

- El nuevo proceso exige una aprobación adicional antes de cerrar ciertos casos urgentes, para aumentar el control.
- **Bruno y otros operadores:** sostienen que el paso puede generar retrasos.
- **Responsable del proyecto:** advierte que modificar el diseño a dos días del lanzamiento también representa un riesgo.

### A · Observar después del lanzamiento

Mantienes el diseño aprobado, creas un registro específico de casos urgentes durante la primera semana y revisas los tiempos cada día para decidir con datos si el paso debe ajustarse.

- **D/A/I:** **1 / 2 / 1**
- **Efectos:** Ap +3 · Co 0 · Aj −2 · Ri −5
- **Panel:** 🟢 ⚪ 🟠 🟢
- **Feedback:** “Protegiste la fecha y tendrás evidencia real después del lanzamiento. El costo fue postergar la verificación: durante la primera semana, algunos casos urgentes podrían sufrir el retraso antes de que puedas corregirlo.”
- **Etiqueta:** Observaste
- **Alineación:** baja

### B · Validar antes del lanzamiento ✔ CLAVE

Reproduces varios casos urgentes con operadores y proyecto; si el problema aparece de manera consistente, modificas únicamente ese paso antes de implementar.

- **D/A/I:** **3 / 3 / 3**
- **Efectos:** Ap +8 · Co +2 · Aj +12 · Ri +4
- **Panel:** 🟢 🟢 🟢 🟠
- **Feedback:** “Convertiste la objeción en una hipótesis comprobable. Confirmaste que el problema aparecía en determinadas urgencias y ajustaste únicamente ese paso. El costo fue introducir presión adicional sobre el cronograma durante los últimos dos días.”
- **Etiqueta:** Validaste
- **Alineación:** alta

### C · Crear una excepción temporal

Mantienes el proceso principal, habilitas una vía especial para urgencias y registras durante una semana cuándo se utiliza antes de decidir si debe convertirse en un ajuste permanente.

- **D/A/I:** **1 / 1 / 2**
- **Efectos:** Ap +5 · Co −2 · Aj +5 · Ri +1
- **Panel:** 🟢 🟠 🟢 🟠
- **Feedback:** “Diste una salida inmediata a los casos urgentes sin modificar el diseño principal. El costo fue dedicar parte de los dos últimos días a habilitar una segunda forma de trabajar, que el equipo tendrá que aprender y controlar sin haber comprobado todavía si el problema exige ese ajuste.”
- **Etiqueta:** Habilitaste
- **Alineación:** baja

**Qué estaba en juego:** Equilibrar la presión del cronograma con la posibilidad de que una voz crítica estuviera revelando una debilidad real del cambio.

**Para reflexionar:** ¿Cómo equilibraste el plazo con la calidad del cambio? · ¿Qué evidencia necesitabas antes de decidir?

**Qué está midiendo —solo facilitador:** Utilizar una voz crítica como información antes de decidir si el cambio debe modificarse.

**Sustento —Hodges, cap. 4, Opposition as a positive reaction:** la oposición puede revelar deficiencias en el plan y convertirse en una contribución útil. La alternativa B transforma la objeción en una hipótesis verificable y solo modifica el diseño si encuentra evidencia. La A posterga la verificación. La C incorpora parcialmente la objeción, pero actúa antes de comprobarla y crea una segunda forma de trabajar.

---

# PARTE 4 · Eventos entre situaciones

| Viene de | Aparece en | Texto |
|---|---|---|
| S1 · A Aclarar | S2 | Tres días después, el equipo ha avanzado, pero algunas personas hacen menos preguntas. No sabes si las dudas disminuyeron o si simplemente dejaron de expresarse. |
| S1 · B Probar | S2 | Tres días después, Bruno y quienes participaron en la prueba están más involucrados. Otros integrantes del equipo comienzan a pedir mayor participación. |
| S1 · C Explorar | S2 | Tres días después, las personas distinguen mejor qué les preocupa y llegan con preguntas más concretas. También esperan respuestas diferentes para problemas diferentes. |
| S2 · A Práctica compartida | S3 | Tres días después, durante una práctica grupal, tres personas señalan el mismo posible problema en casos urgentes y registran ejemplos similares. Todavía no saben si se reproduce de manera consistente. |
| S2 · B Exigir | S3 | Tres días después, un operador detecta algo extraño durante una práctica. Antes de plantearlo al equipo, busca a Bruno para comprobar que no sea simplemente otro error suyo. |
| S2 · C Tiempo protegido | S3 | Tres días después, una colaboradora que practicaba individualmente registra un retraso en un caso urgente. Tiene evidencia de un caso, pero todavía nadie sabe si el problema se repite. |
| S1 · B Probar | S3 | Durante la prueba del día 2, Bruno ya había señalado ese paso, pero entonces no hubo suficientes casos urgentes para comprobarlo. |

---

# PARTE 5 · Informe final

## Pregunta de cabecera

**¿Cómo estás gestionando la resistencia al cambio?**

## Regla de cálculo

El resultado depende **solo de las conductas D, A e I**. Los efectos no modifican el veredicto; explican las consecuencias del recorrido.

**Índice conductual = promedio de los nueve puntajes de conducta obtenidos en las tres situaciones.**

| Índice | Resultado |
|---:|---|
| **≥ 2,50** | **La estás gestionando de manera consistente.** |
| **2,00 a 2,49** | **La estás gestionando, aunque no siempre con la misma consistencia.** |
| **< 2,00** | **Tu gestión de la resistencia fue poco consistente y dejó aspectos importantes sin atender.** |

### Secciones del informe

1. **Qué ocurrió con el cambio:** lectura acumulada de Ap, Co, Aj y Ri.
2. **La relación entre la gestión y las consecuencias:** explica que un resultado operativo favorable no convierte automáticamente la decisión en una buena práctica de gestión del cambio, y viceversa.
3. **Qué puedes llevar a tu próxima gestión:** aplica una lógica distinta según el nivel de resultado:
   - **Resultado alto:** muestra siempre el texto integrado de **consolidación**, independientemente de que exista una conducta mínima única, un empate doble o un empate triple. No presenta la conducta mínima como una debilidad.
   - **Resultado medio o bajo + una conducta mínima:** muestra su recomendación específica.
   - **Resultado medio o bajo + dos conductas empatadas como mínimas:** muestra las dos recomendaciones específicas.
   - **Resultado medio o bajo + tres conductas empatadas:** muestra una recomendación integrada de desarrollo, no tres textos separados.

### Texto integrado de la sección 03

- **Resultado alto — consolidación:** “Mantén conectadas las tres decisiones: comprender qué está detrás de la oposición, ajustar la respuesta a la barrera identificada y comprobar qué información útil contiene una voz crítica antes de decidir.”
- **Resultado medio o bajo con triple empate — desarrollo:** “Antes de actuar, conecta tres preguntas: ¿qué está generando esta oposición?, ¿qué barrera necesita una respuesta específica? y ¿esta objeción contiene información que conviene comprobar antes de decidir?”

### Salvaguarda del resultado alto

El QA debe comprobar que **ninguna ruta clasificada como alta tenga D, A o I por debajo de 2,00**. Si una futura recalibración permitiera un resultado alto con alguna conducta < 2,00, la ruta se marca para revisión antes de aprobar el simulador. Esta salvaguarda evita que el mensaje de consolidación oculte una debilidad real.

### Explicación del resultado bajo

Cuando el resultado conductual es bajo pero existen consecuencias favorables parciales, la explicación utiliza la expresión **“abordaron aspectos puntuales”**. El QA no debe buscar esa frase literal: debe verificar que el motor seleccionó la variante lógica correcta según los efectos acumulados.

### Nota para facilitador

Una ruta sin claves puede producir indicadores operativos favorables y aun así obtener un resultado conductual bajo. Es intencional: las consecuencias de corto plazo y la calidad del proceso de gestión son constructos distintos.

---

# PARTE 6 · Matriz definitiva para el config

| Situación | Opción | D | A | I | Ap | Co | Aj | Ri | Alineación |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| S1 | A · Aclarar | 1 | 2 | 1 | 0 | +3 | 0 | −3 | Baja |
| S1 | B · Probar | 2 | 2 | 3 | +2 | +3 | +10 | +3 | Media |
| **S1** | **C · Explorar ✔** | **3** | **2** | **3** | **+12** | **+5** | **+4** | **+1** | **Alta** |
| **S2** | **A · Práctica ✔** | **2** | **3** | **2** | **+8** | **+15** | **+5** | **+1** | **Alta** |
| S2 | B · Exigir | 1 | 1 | 1 | −6 | +4 | 0 | −2 | Baja |
| S2 | C · Tiempo protegido | 2 | 2 | 2 | +2 | +8 | +1 | +2 | Media |
| S3 | A · Observar | 1 | 2 | 1 | +3 | 0 | −2 | −5 | Baja |
| **S3** | **B · Validar ✔** | **3** | **3** | **3** | **+8** | **+2** | **+12** | **+4** | **Alta** |
| S3 | C · Excepción | 1 | 1 | 2 | +5 | −2 | +5 | +1 | Baja |

---

# PARTE 7 · Cambios técnicos requeridos

1. Todo texto visible debe salir del config; eliminar textos duplicados o hardcodeados en el HTML.
2. El QA debe leer los umbrales `2.00` y `2.50` del config.
3. El panel no muestra números; muestra intensidad:
   - cambios absolutos de 1 a 3: “mejora/disminuye levemente”;
   - cambios absolutos mayores a 3: “mejora/disminuye”.
4. Para Ri, invertir la interpretación visual: disminuir riesgo = favorable; aumentar riesgo = desfavorable.
5. Mantener separadas las variables `behaviorScores` y `effects`.
6. En la sección “Qué puedes llevar a tu próxima gestión”, aplicar primero el **nivel del resultado** y después los mínimos: si el resultado es alto, mostrar siempre consolidación integrada; si es medio o bajo, una mínima = una recomendación específica, empate doble = dos recomendaciones y empate triple = texto integrado de desarrollo. Retirar la recomendación genérica antigua de empate.
7. El QA del informe debe validar **qué variante lógica seleccionó el motor** (por ejemplo, resultado bajo con consecuencias favorables parciales) y no depender de frases editoriales exactas.
8. Ejecutar QA automático de:
   - 27 rutas;
   - efectos adversos;
   - efectos nulos;
   - R2, R4, R6, R13, R14 y R17;
   - correspondencia entre umbrales del config y motor;
   - coherencia de signos y textos;
   - coherencia de tono del informe: toda ruta alta usa consolidación y ninguna tiene D, A o I < 2,00.
9. Eliminar utilidades sin uso (`chip()`, `dirText()`, `persist()` y lectura de `localStorage`) solo si la implementación final confirma que no tienen dependencias.

---

# PARTE 8 · Control de calidad final de la especificación

## Resultado global

**QA de diseño/especificación: APROBADO.**

No se encontraron contradicciones restantes entre pregunta, alternativa, clave, puntaje conductual, efecto y feedback en esta versión final optimizada.

### 1. Claves y sustento

- **S1 · C Explorar causas:** coherente con comprender interpretaciones y causas antes de intervenir.
- **S2 · A Práctica compartida:** coherente con reducir la *learning anxiety* mediante entorno seguro, práctica, apoyo y feedback.
- **S3 · B Validar antes:** coherente con tratar la oposición como información potencialmente útil y comprobarla antes de modificar el cambio.
- **Patrón de claves:** C · A · B. No existe pista por repetición de letra.

### 2. Longitud de alternativas — R6

Conteo aproximado sin títulos:

- S1: A 22 · B 26 · **C clave 21** → pasa.
- S2: **A clave 27** · B 30 · C 23 → pasa.
- S3: A 30 · **B clave 22** · C 28 → pasa.

### 3. Dominancia del panel — R13

Balance neto para QA = Ap + Co + Aj − Ri.

- **S1:** A = 6 · B = 12 · **C clave = 20**. Ningún distractor domina.
- **S2:** **A clave = 27** · B = 0 · C = 9. Ningún distractor domina.
- **S3:** A = 6 · **B clave = 18** · C = 7. Ningún distractor domina.

### 4. Riesgo de cronograma

En las 27 rutas:

- **13** terminan con mayor riesgo.
- **11** terminan con menor riesgo.
- **3** terminan sin cambio neto en riesgo.

Cada situación contiene al menos una alternativa que reduce Ri:

- S1-A = −3
- S2-B = −2
- S3-A = −5

La ruta de las tres claves **C-A-B** acumula **Ri = +6**: existe una presión de plazo real, pero ya no se convierte el tiempo empleado automáticamente en “riesgo”.

### 5. Conductas y resultado de las 27 rutas

Con los umbrales finales `≥2.50 / 2.00–2.49 / <2.00`:

- **3 rutas altas**
- **11 rutas medias**
- **13 rutas bajas**

Por número de claves:

- **3 claves:** 1 alta.
- **2 claves:** 2 altas y 4 medias.
- **1 clave:** 7 medias y 5 bajas.
- **0 claves:** 8 bajas.

Rutas altas:

- **C-A-B** — D 2,67 · A 2,67 · I 2,67.
- **B-A-B** — D 2,33 · A 2,67 · I 2,67.
- **C-C-B** — D 2,67 · A 2,33 · I 2,67.

Las tres rutas altas cumplen la salvaguarda de R17: **ninguna conducta está por debajo de 2,00**. En las tres, la sección 03 muestra el texto integrado de consolidación; no se presenta la conducta mínima como una debilidad.

Esto confirma que el simulador no funciona como un examen de “adivinar letras”: el resultado depende del patrón de conductas demostrado.

Empates triples detectados en QA:

- **C-A-B:** 8/8/8 → resultado alto → consolidación integrada.
- **C-B-A:** 5/5/5 → resultado bajo → recomendación integrada de desarrollo.
- **C-C-A:** 6/6/6 → resultado medio → recomendación integrada de desarrollo.

### 6. Ruta de las tres claves

Ruta **C-A-B**:

- D = **2,67**
- A = **2,67**
- I = **2,67**
- Índice global = **2,67 → consistente**
- Ap = **+28**
- Co = **+22**
- Aj = **+21**
- Ri = **+6**

La trayectoria más alineada queda equilibrada en las tres conductas y muestra un trade-off operativo creíble.

### 7. Equilibrio diagnóstico — R14

Rango observado en las 27 rutas:

- D: **1,00 a 2,67**
- A: **1,33 a 2,67**
- I: **1,00 a 2,67**

Las tres dimensiones pueden aparecer como el promedio mínimo de una ruta, solas o empatadas. Distribución exacta de las 27 rutas:

- **12 rutas** tienen una sola conducta mínima.
- **12 rutas** tienen empate doble en la conducta mínima.
- **3 rutas** tienen empate triple.

Detalle de mínimos únicos: D = 8 rutas · A = 4 rutas · I = 0 rutas. Empates dobles: D+I = 7 rutas · D+A = 5 rutas. Empates triples = 3 rutas.

Que I no aparezca como debilidad única no invalida el diagnóstico: sí aparece como dimensión mínima en empates y, con la nueva lógica de recomendaciones múltiples, su recomendación específica se muestra cuando corresponde. Los puntajes no se alteran artificialmente para forzar una distribución.

### 8. Coherencia de tono del informe — R17

Se revisaron las tres rutas clasificadas como altas:

- **B-A-B:** mínimo D = 2,33 → consolidación integrada.
- **C-A-B:** D = A = I = 2,67 → consolidación integrada.
- **C-C-B:** mínimo A = 2,33 → consolidación integrada.

Ninguna ruta alta contiene una conducta por debajo de **2,00**. Por tanto, el mensaje “La estás gestionando de manera consistente” no entra en conflicto con una recomendación correctiva en la sección 03.

Para resultados medio o bajo se mantiene el diagnóstico por mínimos:

- mínimo único → una recomendación específica;
- empate doble → dos recomendaciones específicas;
- empate triple → recomendación integrada de desarrollo.

### 9. Efectos adversos fuera de Ri

En **4 de 27 rutas** al menos uno de los indicadores Ap, Co o Aj termina por debajo del punto de partida. Esto evita que el simulador muestre mejoras automáticas independientemente de las decisiones.

### 10. Pruebas extremas

- **Efectos nulos:** el veredicto conductual continúa funcionando porque no depende de `effects`; el panel debe representar “sin cambio” en los cuatro indicadores.
- **Efectos adversos:** el motor debe poder describir consecuencias desfavorables sin alterar el veredicto conductual ni confundir el signo de Ri.

### 11. Alcance de este QA

Este control aprueba la **especificación final** y su matriz de 27 rutas. Una vez trasladada al `config` y al HTML/JS, debe ejecutarse nuevamente el QA automatizado de implementación para confirmar que el código reproduce exactamente esta especificación.

---

# DECISIÓN FINAL

**Versión conceptual y lógica: cerrada.**

Claves definitivas: **C → A → B**.  
Umbrales definitivos: **2,50 / 2,00**.  
El veredicto depende únicamente de D/A/I.  
Los efectos explican consecuencias, no determinan la calidad conductual de la decisión.  
La sección final se denomina **“Qué puedes llevar a tu próxima gestión”**. En resultados altos muestra siempre consolidación integrada; en resultados medio o bajo utiliza mínimos únicos, empates dobles o empate triple según la lógica definida en esta especificación. Ninguna ruta alta puede aprobar el QA si alguna conducta queda por debajo de 2,00.
