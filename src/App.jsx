import "./App.css";
import MovieDetail from "./components/movieDetails";
import { Error, Loader } from "./components/loaderError";
import Navbar from "./components/navbar";
import { useMovies } from "./hook/useMovies";
import { useLocalStorageState } from "./hook/useLocalStorageState";
import { useState } from "react";
import PropTypes from "prop-types";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const GeneralPropTypes = {
  children: PropTypes.node,
  movies: PropTypes.array,
  movie: PropTypes.object,
  watched: PropTypes.array,
  setWatched: PropTypes.func,
  isOpen: PropTypes.array,
  setIsOpen: PropTypes.func,
  select: PropTypes.func,
  deleteHandler: PropTypes.func,
};

MoviesContainer.propTypes = GeneralPropTypes;
Main.propTypes = GeneralPropTypes;
Movies.propTypes = GeneralPropTypes;
Movie.propTypes = GeneralPropTypes;
Summary.propTypes = GeneralPropTypes;
WatchedMoviesList.propTypes = GeneralPropTypes;
WatchedMovie.propTypes = GeneralPropTypes;
Button.propTypes = GeneralPropTypes;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  console.log(watched);

  function handleClick(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleClose() {
    setSelectedId(null);
  }

  function handleAdd(watch) {
    setWatched((watched) => [...watched, watch]);
  }

  const { error, isLoading, movies } = useMovies(query);

  return (
    <>
      <Navbar setQuery={setQuery} query={query} movies={movies} />
      <Main selectedId={selectedId} handleClose={handleClose}>
        <MoviesContainer>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error message={error} />
          ) : (
            <Movies movies={movies} select={handleClick} />
          )}
        </MoviesContainer>
        <MoviesContainer>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              close={handleClose}
              onAddHandler={handleAdd}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMoviesList watched={watched} setWatched={setWatched} />
            </>
          )}
        </MoviesContainer>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MoviesContainer({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function Movies({ movies, select }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} select={select} />
      ))}
    </ul>
  );
}

function Movie({ movie, select }) {
  return (
    <li
      onClick={() => {
        select(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, setWatched }) {
  function watchedDelete(id) {
    setWatched((watched) => watched.filter((el) => el.imdbID !== id));
  }

  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          deleteHandler={watchedDelete}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, deleteHandler }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => deleteHandler(movie.imdbID)}
      >
        ⛔
      </button>
    </li>
  );
}

function Button({ isOpen, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
