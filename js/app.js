const DATA_URL = "data/peliculas.json";
const FALLBACK_POSTER = "assets/carteles/sin-cartel.svg";
const WHATSAPP_URL = "https://chat.whatsapp.com/D2LBLXnnmr8Bd5JabreBwc?s=cl&p=a&mlu=4&ilr=4";

const grid = document.getElementById("movies-grid");
const count = document.getElementById("movie-count");
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");
const emptyMessage = document.getElementById("empty-message");
const featuredContainer = document.getElementById("featured-movie");
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
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status} al cargar ${DATA_URL}`);

    const datos = await respuesta.json();
    const lista = Array.isArray(datos) ? datos : datos.peliculas;
    if (!Array.isArray(lista)) {
      throw new Error("El archivo JSON debe contener un arreglo llamado 'peliculas'.");
    }

    peliculas = lista.filter((pelicula) => pelicula && typeof pelicula === "object" && pelicula.titulo);
    prepararFiltroGeneros();
    mostrarPeliculaDestacada();
    mostrarPeliculasFiltradas();
  } catch (error) {
    console.error("No se pudo cargar la cartelera:", error);
    mostrarErrorCarga();
  }
}

function mostrarErrorCarga() {
  grid.replaceChildren();
  const aviso = document.createElement("p");
  aviso.className = "loading-message";
  aviso.textContent = "No se pudo cargar la cartelera. Comprueba que data/peliculas.json existe y abre el sitio mediante un servidor local o GitHub Pages.";
  grid.appendChild(aviso);
  count.textContent = "Catálogo no disponible";
  featuredContainer.replaceChildren();
  const featuredError = document.createElement("p");
  featuredError.className = "loading-message";
  featuredError.textContent = "No se pudo cargar la película destacada.";
  featuredContainer.appendChild(featuredError);
}

function prepararFiltroGeneros() {
  const generos = [...new Set(peliculas.map((p) => p.genero).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));

  genreFilter.replaceChildren(new Option("Todos los géneros", "todos"));
  for (const genero of generos) {
    genreFilter.add(new Option(capitalizar(genero), genero));
  }
}

function mostrarPeliculaDestacada() {
  featuredContainer.replaceChildren();
  if (peliculas.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "empty-message";
    aviso.textContent = "Todavía no hay películas en el catálogo.";
    featuredContainer.appendChild(aviso);
    return;
  }

  const hoy = fechaLocalISO(new Date());
  const destacadaManual = peliculas.find((pelicula) => pelicula.destacada === true);
  const proximas = peliculas
    .map((pelicula) => {
      const fecha = fechaValida(pelicula.fechaEmision) && pelicula.fechaEmision >= hoy
        ? pelicula.fechaEmision
        : fechaValida(pelicula.fechaEstreno) && pelicula.fechaEstreno >= hoy
          ? pelicula.fechaEstreno
          : "";
      return { pelicula, fecha };
    })
    .filter((item) => item.fecha)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const pelicula = destacadaManual || (proximas[0] && proximas[0].pelicula) || peliculas[0];
  const tieneFechaFutura = proximas.some((item) => item.pelicula.id === pelicula.id);
  const etiqueta = destacadaManual
    ? "Película seleccionada"
    : tieneFechaFutura
      ? "Próximo estreno"
      : "Película destacada";

  const article = document.createElement("article");
  article.className = "featured-card";

  const posterButton = document.createElement("button");
  posterButton.className = "featured-poster-button";
  posterButton.type = "button";
  posterButton.setAttribute("aria-label", `Ver ficha de ${pelicula.titulo}`);
  const poster = crearImagen(pelicula, "featured-poster");
  posterButton.appendChild(poster);
  posterButton.addEventListener("click", () => mostrarDetalles(pelicula));

  const info = document.createElement("div");
  info.className = "featured-info";

  const badge = document.createElement("p");
  badge.className = "featured-badge";
  badge.textContent = etiqueta;

  const genre = document.createElement("p");
  genre.className = "movie-genre";
  genre.textContent = capitalizar(pelicula.genero || "Sin género");

  const title = document.createElement("h3");
  title.className = "featured-title";
  title.textContent = pelicula.titulo || "Sin título";

  const synopsis = document.createElement("p");
  synopsis.className = "featured-synopsis";
  synopsis.textContent = pelicula.sinopsis || "La sinopsis de esta película todavía no está disponible.";

  const facts = document.createElement("dl");
  facts.className = "featured-facts";
  agregarFicha(facts, "Fecha de estreno", formatearFecha(pelicula.fechaEstreno));
  agregarFicha(facts, "Fecha de proyección", formatearFecha(pelicula.fechaEmision));
  agregarFicha(facts, "Duración", pelicula.duracion ? `${pelicula.duracion} minutos` : "No especificada");
  agregarFicha(facts, "Género", capitalizar(pelicula.genero || "No especificado"));
  agregarFicha(facts, "Dirección", pelicula.director || "No especificado");
  agregarFicha(facts, "Reparto", pelicula.actores || "No especificado");
  agregarFicha(facts, "Lugar", pelicula.lugar || "Por confirmar");

  const actions = document.createElement("div");
  actions.className = "featured-actions";
  const details = document.createElement("button");
  details.type = "button";
  details.className = "details-button";
  details.textContent = "Ver ficha completa";
  details.addEventListener("click", () => mostrarDetalles(pelicula));
  actions.appendChild(details);

  if (esUrlWeb(pelicula.trailer)) {
    const trailer = document.createElement("a");
    trailer.className = "trailer-link";
    trailer.href = pelicula.trailer;
    trailer.target = "_blank";
    trailer.rel = "noopener noreferrer";
    trailer.textContent = "Ver tráiler";
    actions.appendChild(trailer);
  }

  info.append(badge, genre, title, synopsis, facts, actions);
  article.append(posterButton, info);
  featuredContainer.appendChild(article);
}

function mostrarPeliculasFiltradas() {
  const consulta = normalizar(searchInput.value.trim());
  const genero = genreFilter.value;

  const filtradas = peliculas.filter((pelicula) => {
    const texto = normalizar(`${pelicula.titulo || ""} ${pelicula.director || ""} ${pelicula.actores || ""}`);
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

  if (lista.length === 0) return;

  for (const pelicula of lista) {
    const card = document.createElement("article");
    card.className = "movie-card";

    const posterButton = document.createElement("button");
    posterButton.className = "poster-button";
    posterButton.type = "button";
    posterButton.setAttribute("aria-label", `Ver detalles de ${pelicula.titulo || "película"}`);
    posterButton.appendChild(crearImagen(pelicula, "poster"));
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

function crearImagen(pelicula, clase) {
  const img = document.createElement("img");
  img.className = clase;
  img.src = rutaImagen(pelicula.imagen);
  img.alt = `Cartel de ${pelicula.titulo || "película"}`;
  if (clase === "poster") img.loading = "lazy";
  img.addEventListener("error", () => {
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = "true";
      img.src = FALLBACK_POSTER;
    }
  });
  return img;
}

function agregarDato(contenedor, etiqueta, valor) {
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${etiqueta}: `;
  p.append(strong, document.createTextNode(valor));
  contenedor.appendChild(p);
}

function agregarFicha(contenedor, etiqueta, valor) {
  const wrapper = document.createElement("div");
  wrapper.className = "featured-fact";
  const dt = document.createElement("dt");
  dt.textContent = etiqueta;
  const dd = document.createElement("dd");
  dd.textContent = valor;
  wrapper.append(dt, dd);
  contenedor.appendChild(wrapper);
}

function mostrarDetalles(pelicula) {
  dialogContent.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "dialog-layout";

  const poster = crearImagen(pelicula, "dialog-poster");
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

  if (esUrlWeb(pelicula.trailer)) {
    const trailer = document.createElement("a");
    trailer.href = pelicula.trailer;
    trailer.target = "_blank";
    trailer.rel = "noopener noreferrer";
    trailer.textContent = "Ver tráiler";
    trailer.className = "details-button trailer-button";
    info.appendChild(trailer);
  }

  layout.append(poster, info);
  dialogContent.appendChild(layout);
  if (!dialog.open) dialog.showModal();
}

function rutaImagen(valor) {
  if (!valor || typeof valor !== "string") return FALLBACK_POSTER;
  const limpia = valor.replace(/^\.\//, "");
  return limpia.startsWith("http://") || limpia.startsWith("https://") ? limpia : limpia;
}

function esUrlWeb(valor) {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function fechaValida(valor) {
  return typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor) &&
    !Number.isNaN(Date.parse(`${valor}T00:00:00`));
}

function fechaLocalISO(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

function formatearFecha(fecha) {
  if (!fecha) return "Por confirmar";
  const coincidencia = String(fecha).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (coincidencia) return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
  const date = new Date(fecha);
  return Number.isNaN(date.getTime()) ? String(fecha) : date.toLocaleDateString("es-ES");
}

function normalizar(texto) {
  return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function capitalizar(texto) {
  return String(texto).replace(/-/g, " ").replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
}
