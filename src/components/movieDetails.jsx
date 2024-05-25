import { useEffect, useRef, useState } from "react";
import { useKey } from "../hook/useKey";
import { Error, Loader } from "./loaderError";
import StarRating from "./starRating";

export default function MovieDetail({
  selectedId,
  close,
  onAddHandler,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const count = useRef(0);

  const watchedUserRating = watched.find(
    (watched) => watched === movie
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Director: director,
    Actors: actors,
    imdbRating,
    Plot: plot,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Genre: genre,
  } = movie;

  function addClickHandler() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: runtime.split(" ").at(0),
      imdbRating,
      userRating,
      countRating: count.current,
    };
    onAddHandler(newMovie);
    close();
  }

  useKey("Escape", close);

  useEffect(
    function () {
      async function getMovie() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=f951de08&i=${selectedId}`
          );
          if (!res.ok)
            throw new Error("Something went wrong with the movie search");
          const data = await res.json();
          if (data.Response !== "True")
            throw new Error("Unable to fetch Movie details");
          setMovie(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovie();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(() => {
    if (userRating) count.current++;
  }, [userRating]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={close}>
              &larr;
            </button>
            <img src={poster} alt={`The poster for ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {watchedUserRating ? (
                <p>You have rated this Movie {watchedUserRating} ⭐ </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    setRate={setUserRating}
                  />
                  {userRating ? (
                    <button className="btn-add" onClick={addClickHandler}>
                      + Add Movie
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
            <p>{plot}</p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
