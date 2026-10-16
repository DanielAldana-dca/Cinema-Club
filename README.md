# Cinema Club FIO

Sitio web de cartelera cinematográfica dedicado a los estudiantes de la UCI y, en especial, de la Facultad de Ingeniería Organizacional.

## Uso

Abre `index.html` mediante un servidor local o publica la carpeta en GitHub Pages. La página carga el catálogo desde `data/peliculas.json`; no debe abrirse como archivo local con `file://`, porque el navegador puede bloquear la lectura del JSON.

La sección «Próxima película a estrenar» selecciona automáticamente una película con fecha futura de proyección (`fechaEmision`) o estreno (`fechaEstreno`). Si existe una película con `"destacada": true`, esa selección manual tiene prioridad. Si no hay fechas futuras ni una selección manual, se muestra la primera película del catálogo como destacada.

## Seleccionar una película destacada

En `data/peliculas.json`, agrega `"destacada": true` al objeto de la película que quieras mostrar en el bloque superior. Asegúrate de que solo una película tenga ese valor para evitar ambigüedades.

## Añadir o editar películas

Edita el arreglo `peliculas` en `data/peliculas.json`. Cada objeto admite los campos `id`, `titulo`, `fechaEstreno`, `fechaEmision`, `duracion`, `genero`, `director`, `actores`, `sinopsis`, `imagen`, `trailer` y `lugar`.

Las fechas deben escribirse como `AAAA-MM-DD`. Guarda los carteles en `assets/carteles/` y utiliza una ruta relativa, por ejemplo: `"imagen": "assets/carteles/interstellar.jpg"`. Los nombres y las rutas deben coincidir exactamente, incluidas mayúsculas, minúsculas y espacios, cuando se publique en GitHub Pages.

## Grupo de WhatsApp

El botón «Unirse al grupo de WhatsApp» abre el enlace de invitación configurado en `index.html`. Para cambiarlo, reemplaza la URL en los enlaces con clase `whatsapp-link`.

## Estructura

- `index.html`: estructura de la página.
- `css/styles.css`: estilos y diseño adaptable.
- `js/app.js`: carga del catálogo, selección destacada, búsqueda, filtros y fichas.
- `data/peliculas.json`: datos editables de las películas.
- `assets/carteles/`: carteles de películas y cartel de reserva.
- `assets/`: debe contener también los logos institucionales y fondos visuales del proyecto original.

Este paquete incluye los archivos de código actualizados y el catálogo. Para conservar los logos y fondos originales, copia las carpetas `assets` de tu proyecto anterior sobre esta carpeta, manteniendo `assets/carteles/sin-cartel.svg`.
