import React, { useEffect, useState } from 'react';
import './App.css';
import { movies$ } from './movies';
import { Movie } from './movie';

const DEFAULT_BACKGROUND_URL = 'https://dididnk.github.io/Portfolio/include/img/Mybackground-1.jpg';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [paginatedMovies, setPaginatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    movies$.then((data: Movie[]) => {
      const updatedMovies = data.map(movie => ({
        ...movie,
        liked: false,
        disliked: false
      }));
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
      setCategories([...new Set(updatedMovies.map((movie) => movie.category))]);
      setCurrentMovieIndex(0);
      setPaginatedMovies(updatedMovies.slice(0, itemsPerPage)); 
    });
  }, [itemsPerPage]);

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    setPaginatedMovies(movies.slice(startIndex, startIndex + itemsPerPage));
  }, [movies, page, itemsPerPage]);

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));

  const startIndex = (page - 1) * itemsPerPage;
  
  const toggleLike = (id: string) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              likes: movie.liked ? movie.likes - 1 : movie.likes + 1,
              liked: !movie.liked,
              disliked: false,
              dislikes: movie.liked ? movie.dislikes - (movie.disliked ? 1 : 0) : movie.dislikes,
            }
          : movie
      )
    );
  };

  const toggleDislike = (id: string) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              dislikes: movie.disliked ? movie.dislikes - 1 : movie.dislikes + 1,
              disliked: !movie.disliked,
              liked: false,
              likes: movie.disliked ? movie.likes - (movie.liked ? 1 : 0) : movie.likes,
            }
          : movie
      )
    );
  };

  const deleteMovie = (id: string) => {
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    setCategories([...new Set(updatedMovies.map((movie) => movie.category))]);
    setCurrentMovieIndex(0); 
  };

  const handleFilterChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);

    const filtered = movies.filter(
      (movie) => updatedCategories.length === 0 || updatedCategories.includes(movie.category)
    );
    setFilteredMovies(filtered);
  };

  /** Components */
  /** Component : App header */
  const AppHeader: React.FC<{
    movie: Movie | null;
    filteredMovies: Movie[];
    currentMovieIndex: number;
    setCurrentMovieIndex: (index: number) => void;
  }> = ({ movie, filteredMovies, currentMovieIndex, setCurrentMovieIndex }) => {
    const backgroundUrl = movie ? movie.image : DEFAULT_BACKGROUND_URL;
    const title = movie ? movie.title : "Exercice Frontend : Listing de vidéos";
    const category = movie ? movie.category : "Codé par Emmanuel NGBAME";

    const previewMovie = () => {
      const newIndex = currentMovieIndex === 0
        ? filteredMovies.length - 1
        : currentMovieIndex - 1;
      setCurrentMovieIndex(newIndex);
    };

    const nextMovie = () => {
      const newIndex = currentMovieIndex === filteredMovies.length - 1
        ? 0
        : currentMovieIndex + 1;
      setCurrentMovieIndex(newIndex);
    };

    return (
      <div
        className="header"
        style={{
          background: `url('${backgroundUrl}') center center no-repeat`,
          backgroundSize: 'cover',
        }}
      >
        <div className="header-content">
          <div className="navigation" onClick={previewMovie}>
            <span>&#9204;</span>
          </div>
          <div className="details">
            <div className="title">
              <span>{title}</span>
            </div>
            <div className="category">
              <span>{category}</span>
            </div>
          </div>
          <div className="navigation" onClick={nextMovie}>
            <span>&#9205;</span>
          </div>
        </div>

        <div className="dot">
          {Array.from({ length: filteredMovies.length }).map((_, index) => (
            <input
              key={index}
              type="radio"
              name="position"
              checked={index === currentMovieIndex}
              onChange={() => setCurrentMovieIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  /** Componenet : Filter */
  const FilmFilter = () => {
    return <div className='filter-content'>
      <h3>Filtrer le film</h3>
      <div className="filter">
        {categories.map((category) => (
          <label key={category} className="checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleFilterChange(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
      <h3>Gérer l'affichage des films</h3>
      <div className="pagination">
        <button disabled={page === 1} onClick={handlePrevPage}>
          <span>&#9204;</span>
        </button>
        <select onChange={(e) => setItemsPerPage(parseInt(e.target.value))} value={itemsPerPage}>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
        </select>
        <button onClick={handleNextPage}>
          <span>&#9205;</span>
        </button>
      </div>
    </div>
  }

  /** Component : Movies (cards) */
  const MovieCards = () => {
    return (
      <div className="movies-grid">
        {paginatedMovies.map((movie, index) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie, startIndex + index)}
          >
            <div
              className="image"
              style={{
                background: `url(${movie.image}) no-repeat center center`,
                backgroundSize: 'cover',
              }}
            ></div>
            <div className="details">
              <div className="delete">
                <button onClick={() => deleteMovie(movie.id)}>✖</button>
              </div>
              <h2>
                <strong>{movie.title}</strong>
              </h2>
              <p>{movie.category}</p>
              <div className="like-bar">
                <div
                  className={movie.liked ? 'liked like' : 'like'}
                  style={{ backgroundColor: movie.liked ? 'green' : '' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(movie.id);
                  }}
                >
                  <span>&#128077;</span>
                  <span>{movie.likes}</span>
                </div>
                <div
                  className={movie.disliked ? 'disliked dislike' : 'dislike'}
                  style={{ backgroundColor: movie.disliked ? 'red' : '' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDislike(movie.id);
                  }}
                >
                  <span>&#128078;</span>
                  <span>{movie.dislikes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  /** Component : AppFooter */
  const AppFooter = () => {
    return <footer>
      <span>
        Conçu par Emmanuel Ngbame
      </span>
    </footer>
  }

  /** Component : Movie click handler */
  const handleMovieClick = (movie: Movie, index: number) => {
    setCurrentMovieIndex(index);
  }

  return (
    <div className="App">
      <AppHeader
        movie={filteredMovies[currentMovieIndex]}
        filteredMovies={filteredMovies}
        currentMovieIndex={currentMovieIndex}
        setCurrentMovieIndex={setCurrentMovieIndex}
      />
      <FilmFilter />
      <MovieCards />
      <AppFooter />
    </div>
  );
}

export default App;
