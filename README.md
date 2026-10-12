# Cinema Club FIO

Proyecto dedicado a los estudiantes de la UCI y, en especial, a los estudiantes de la Facultad de Ingeniería Organizacional.

## Estructura

- `index.html`: página principal.
- `css/styles.css`: estilos visuales.
- `js/app.js`: búsqueda, filtros y fichas de películas.
- `data/peliculas.json`: catálogo editable.
- `assets/`: logos institucionales, fondos y carteles.

## Añadir una película

Edita `data/peliculas.json` y agrega un objeto dentro del arreglo `peliculas`. Cada película puede incluir:

- `id`: identificador único.
- `titulo`: título de la película.
- `fechaEstreno`: fecha original de estreno, en formato `AAAA-MM-DD`.
- `fechaEmision`: fecha de proyección de la cartelera, en formato `AAAA-MM-DD`.
- `duracion`: duración en minutos.
- `genero`: género usado por el filtro.
- `director`: director.
- `actores`: reparto principal.
- `sinopsis`: sinopsis.
- `imagen`: ruta de la imagen dentro del proyecto.
- `trailer`: enlace opcional al tráiler.
- `lugar`: lugar de proyección.

Guarda los carteles dentro de `assets/carteles/`. Por ejemplo, si el archivo es `interstellar.jpg`, usa `"imagen": "assets/carteles/interstellar.jpg"`.

Las rutas distinguen mayúsculas y minúsculas al publicarse en GitHub Pages.

