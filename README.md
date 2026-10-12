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

## Ejecutar localmente

No abras `index.html` directamente con `file://`, porque el navegador puede bloquear la lectura del JSON. Puedes abrir la carpeta con Visual Studio Code y usar la extensión Live Server, o ejecutar un servidor estático desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta al repositorio.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta `/ (root)`.
5. Guarda los cambios.

Cada vez que edites el JSON o agregues carteles, sube los cambios al repositorio. GitHub Pages actualizará la cartelera.

## Nota

La web es estática y no incluye login ni backend. El catálogo se modifica editando el JSON y publicando los cambios en GitHub.
