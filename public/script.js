const API_KEY = "e90a698e37aa3baf0994e7184a27c64e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const LANGUAGE = "pt-BR";

const searchInput = document.getElementById("search");
const searchButton = document.getElementById("btnSearch");
const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");

async function fetchMovies(query = "") {
  const trimmedQuery = query.trim();
  const endpoint = trimmedQuery ? "/search/movie" : "/movie/popular";

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", LANGUAGE);
  url.searchParams.append("page", "1");

  if (trimmedQuery) {
    url.searchParams.append("query", trimmedQuery);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Não foi possível buscar os filmes. Verifique sua API Key ou tente novamente.");
  }

  const data = await response.json();
  return data.results || [];
}

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.classList.add("movie-card");

  const poster = document.createElement("img");
  poster.classList.add("movie-poster");
  poster.alt = `Poster do filme ${movie.title}`;
  poster.src = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/500x750?text=Sem+poster";

  const content = document.createElement("div");
  content.classList.add("movie-content");

  const title = document.createElement("h2");
  title.textContent = movie.title || "Título não informado";

  const releaseYear = document.createElement("p");
  releaseYear.classList.add("movie-info");
  releaseYear.textContent = `Ano: ${getReleaseYear(movie.release_date)}`;

  const voteAverage = document.createElement("p");
  voteAverage.classList.add("movie-info");
  voteAverage.textContent = `Nota média: ${formatVote(movie.vote_average)}`;

  const overview = document.createElement("p");
  overview.classList.add("movie-overview");
  overview.textContent = limitOverview(movie.overview);

  content.appendChild(title);
  content.appendChild(releaseYear);
  content.appendChild(voteAverage);
  content.appendChild(overview);

  card.appendChild(poster);
  card.appendChild(content);

  return card;
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (!movies.length) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    movieList.appendChild(card);
  });
}

function showMessage(text) {
  message.textContent = text;
}

async function handleSearch() {
  try {
    const query = searchInput.value;
    showMessage("Carregando filmes...");
    movieList.innerHTML = "";

    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (error) {
    movieList.innerHTML = "";
    showMessage(error.message);
  }
}

async function init() {
  if (API_KEY === "SUA_CHAVE_AQUI") {
    showMessage("Antes de usar, coloque sua API Key do TMDB no arquivo script.js.");
    return;
  }

  await handleSearch();
}

function getReleaseYear(releaseDate) {
  if (!releaseDate) {
    return "Não informado";
  }

  return releaseDate.split("-")[0];
}

function formatVote(vote) {
  if (vote === undefined || vote === null) {
    return "Sem nota";
  }

  return vote.toFixed(1);
}

function limitOverview(overview) {
  if (!overview) {
    return "Sinopse não disponível.";
  }

  if (overview.length <= 140) {
    return overview;
  }

  return `${overview.substring(0, 140)}...`;
}

searchButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

document.addEventListener("DOMContentLoaded", init);