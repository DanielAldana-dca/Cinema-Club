const DATA_URL = "data/peliculas.json";
const FALLBACK_POSTER = "assets/carteles/sin-cartel.svg";

const grid = document.getElementById("movies-grid");
const count = document.getElementById("movie-count");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const emptyMessage = document.getElementById("empty-message");
const dialog = document.getElementById("movie-dialog");
const dialogContent = document.getElementById("dialog-content");
const closeDialog = document.getElementById("close-dialog");

let peliculas = [];

document.addEventListener("DOMContentLoaded", cargarPeliculas);
searchInput.addEventListener("input", mostrarPeliculasFiltradas);
genreFilter.addEventListener("change", mostrarPeliculasFiltradas);
closeDialog.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

async function cargarPeliculas() {
  try {
    const respuesta = await fetch(DATA_URL, { cache: "no-store" });
    if (!respuesta.ok) throw new Error("No se pudo leer data/peliculas.json");

    const datos = await respuesta.json();
    peliculas = Array.isArray(datos) ? datos : datos.peliculas;

    if (!Array.isArray(peliculas)) {
      throw new Error("El JSON debe contener una lista llamada peliculas.");
    }

    prepararFiltroGeneros();
    mostrarPeliculasFiltradas();
  } catch (error) {
    console.error(error);
    grid.innerHTML = "";
    const aviso = document.createElement("p");
    aviso.className = "loading-message";
    aviso.textContent = "No se pudo cargar la cartelera. Comprueba data/peliculas.json y abre el proyecto mediante un servidor local o GitHub Pages.";
    grid.appendChild(aviso);
    count.textContent = "Catálogo no disponible";
  }
}

function prepararFiltroGeneros() {
  const generos = [...new Set(peliculas.map((p) => p.genero).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));

  genreFilter.replaceChildren(new Option("Todos los géneros", "todos"));
  for (const genero of generos) {
    genreFilter.add(new Option(capitalizar(genero), genero));
  }
}

function mostrarPeliculasFiltradas() {
  const consulta = normalizar(searchInput.value.trim());
  const genero = genreFilter.value;

  const filtradas = peliculas.filter((pelicula) => {
    const texto = normalizar(`${pelicula.titulo || ""} ${pelicula.director || ""}`);
    const coincideTexto = texto.includes(consulta);
    const coincideGenero = genero === "todos" || pelicula.genero === genero;
    return coincideTexto && coincideGenero;
  });

  mostrarPeliculas(filtradas);
}

function mostrarPeliculas(lista) {
  grid.replaceChildren();
  count.textContent = `${lista.length} ${lista.length === 1 ? "película" : "películas"}`;
  emptyMessage.hidden = lista.length > 0;

  for (const pelicula of lista) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const posterButton = document.createElement("button");
    posterButton.className = "poster-button";
    posterButton.type = "button";
    posterButton.setAttribute("aria-label", `Ver detalles de ${pelicula.titulo || "película"}`);

    const img = document.createElement("img");
    img.className = "poster";
    img.src = rutaImagen(pelicula.imagen);
    img.alt = `Cartel de ${pelicula.titulo || "película"}`;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      img.src = FALLBACK_POSTER;
    }, { once: true });
    posterButton.appendChild(img);
    posterButton.addEventListener("click", () => mostrarDetalles(pelicula));

    const content = document.createElement("div");
    content.className = "movie-card-content";

    const genre = document.createElement("p");
    genre.className = "movie-genre";
    genre.textContent = capitalizar(pelicula.genero || "Sin género");

    const title = document.createElement("h3");
    title.className = "movie-title";
    title.textContent = pelicula.titulo || "Sin título";

    const meta = document.createElement("div");
    meta.className = "movie-meta";
    agregarDato(meta, "Estreno", formatearFecha(pelicula.fechaEstreno));
    agregarDato(meta, "Duración", pelicula.duracion ? `${pelicula.duracion} min` : "No especificada");
    agregarDato(meta, "Director", pelicula.director || "No especificado");
    if (pelicula.fechaEmision) agregarDato(meta, "Proyección", formatearFecha(pelicula.fechaEmision));

    const button = document.createElement("button");
    button.className = "details-button";
    button.type = "button";
    button.textContent = "Ver ficha";
    button.addEventListener("click", () => mostrarDetalles(pelicula));

    content.append(genre, title, meta, button);
    card.append(posterButton, content);
    grid.appendChild(card);
  }
}

function agregarDato(contenedor, etiqueta, valor) {
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${etiqueta}: `;
  p.append(strong, document.createTextNode(valor));
  contenedor.appendChild(p);
}

function mostrarDetalles(pelicula) {
  dialogContent.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "dialog-layout";

  const poster = document.createElement("img");
  poster.className = "dialog-poster";
  poster.src = rutaImagen(pelicula.imagen);
  poster.alt = `Cartel de ${pelicula.titulo || "película"}`;
  poster.addEventListener("error", () => {
    poster.src = FALLBACK_POSTER;
  }, { once: true });

  const info = document.createElement("div");
  info.className = "dialog-info";

  const genre = document.createElement("p");
  genre.className = "dialog-genre";
  genre.textContent = capitalizar(pelicula.genero || "Sin género");

  const title = document.createElement("h2");
  title.textContent = pelicula.titulo || "Sin título";

  const facts = document.createElement("div");
  facts.className = "dialog-facts";
  agregarDato(facts, "Fecha de estreno", formatearFecha(pelicula.fechaEstreno));
  agregarDato(facts, "Duración", pelicula.duracion ? `${pelicula.duracion} minutos` : "No especificada");
  agregarDato(facts, "Director", pelicula.director || "No especificado");
  agregarDato(facts, "Fecha de proyección", formatearFecha(pelicula.fechaEmision));
  agregarDato(facts, "Lugar", pelicula.lugar || "No especificado");
  if (pelicula.actores) agregarDato(facts, "Reparto", pelicula.actores);

  const synopsisTitle = document.createElement("h3");
  synopsisTitle.textContent = "Sinopsis";

  const synopsis = document.createElement("p");
  synopsis.className = "dialog-synopsis";
  synopsis.textContent = pelicula.sinopsis || "Sin sinopsis disponible.";

  info.append(genre, title, facts, synopsisTitle, synopsis);

  if (pelicula.trailer) {
    const trailer = document.createElement("a");
    trailer.href = pelicula.trailer;
    trailer.target = "_blank";
    trailer.rel = "noopener noreferrer";
    trailer.textContent = "Ver tráiler";
    trailer.className = "details-button";
    trailer.style.display = "inline-block";
    trailer.style.textDecoration = "none";
    info.appendChild(trailer);
  }

  layout.append(poster, info);
  dialogContent.appendChild(layout);
  dialog.showModal();
}

function rutaImagen(valor) {
  if (!valor) return FALLBACK_POSTER;
  return valor.replace(/^\.\//, "");
}

function formatearFecha(fecha) {
  if (!fecha) return "No especificada";
  const coincidencia = String(fecha).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (coincidencia) return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
  const date = new Date(fecha);
  return Number.isNaN(date.getTime()) ? String(fecha) : date.toLocaleDateString("es-ES");
}

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function capitalizar(texto) {
  return String(texto).replace(/-/g, " ").replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
}
