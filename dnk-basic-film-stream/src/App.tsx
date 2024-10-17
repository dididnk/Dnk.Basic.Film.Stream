import React, { useState, useEffect } from 'react';
import './App.css';
import { movies$ as fetchMovies } from './movies';
import { Movie } from './movie';
import { MovieWithState } from './movie-with-state';

const App: React.FC = () => {
  const [movies, setMovies] = useState<MovieWithState[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MovieWithState[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  // Fetch movies data asynchronously and add "liked" and "disliked" states
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData = await fetchMovies;
        const moviesWithState = moviesData.map((movie: Movie[]) => ({
          ...movie,
          liked: false,
          disliked: false,
        }));
        setMovies(moviesWithState);
        setFilteredMovies(moviesWithState);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    getMovies();
  }, []);

  // Like a movie
  const LikeMovie = (id: string) => {
    const updatedMovies = filteredMovies.map((movie) => {
      if (movie.id === id) {
        if (movie.liked) {
          return { ...movie, likes: movie.likes - 1, liked: false };
        } else {
          const adjustedLikes = movie.disliked ? movie.likes + 1 : movie.likes + 1;
          const adjustedDislikes = movie.disliked ? movie.dislikes - 1 : movie.dislikes;
          return { ...movie, likes: adjustedLikes, dislikes: adjustedDislikes, liked: true, disliked: false };
        }
      }
      return movie;
    });
    setFilteredMovies(updatedMovies);
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, likes: updatedMovies.find((m) => m.id === id)?.likes!, dislikes: updatedMovies.find((m) => m.id === id)?.dislikes!, liked: updatedMovies.find((m) => m.id === id)?.liked!, disliked: updatedMovies.find((m) => m.id === id)?.disliked! }
          : movie
      )
    );
  };

  // Dislike a movie
  const DislikeMovie = (id: string) => {
    const updatedMovies = filteredMovies.map((movie) => {
      if (movie.id === id) {
        if (movie.disliked) {
          // If already disliked, undo the dislike
          return { ...movie, dislikes: movie.dislikes - 1, disliked: false };
        } else {
          // Dislike the movie, and remove like if previously liked
          const adjustedDislikes = movie.liked ? movie.dislikes + 1 : movie.dislikes + 1;
          const adjustedLikes = movie.liked ? movie.likes - 1 : movie.likes;
          return { ...movie, likes: adjustedLikes, dislikes: adjustedDislikes, liked: false, disliked: true };
        }
      }
      return movie;
    });
    setFilteredMovies(updatedMovies);
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, likes: updatedMovies.find((m) => m.id === id)?.likes!, dislikes: updatedMovies.find((m) => m.id === id)?.dislikes!, liked: updatedMovies.find((m) => m.id === id)?.liked!, disliked: updatedMovies.find((m) => m.id === id)?.disliked! }
          : movie
      )
    );
  };

  // Filter movies by selected categories
  const FilterFilmByCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filtered list by categories and preserve any removals/updates
  useEffect(() => {
    let updatedMovies = [...movies];

    if (selectedCategories.length > 0) {
      updatedMovies = updatedMovies.filter((movie) =>
        selectedCategories.includes(movie.category)
      );
    }

    setFilteredMovies(updatedMovies);
  }, [selectedCategories, movies]);

  // Remove a movie from both the original and filtered list
  const RemoveFilm = (id: string) => {
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
    setFilteredMovies(filteredMovies.filter((movie) => movie.id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredMovies.length / perPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /** Page components */
  // Header
  const AppHeader: React.FC<{
    movie: MovieWithState | null;
    filteredMovies: MovieWithState[];
    currentMovieIndex: number;
    setCurrentMovieIndex: (index: number) => void;
  }> = ({ movie, filteredMovies, currentMovieIndex, setCurrentMovieIndex }) => {
    const DEFAULT_BACKGROUND_URL = 'https://dididnk.github.io/Portfolio/include/img/Mybackground-1.jpg';

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

  // Movie filter and management view
  const MovieFilterSection = () => {
    return <div className="filter-content">
      <div className="filter-pagination-details">
        <h3>Gérer l'affichage des films</h3>
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <span>&#9204;</span>
          </button>
          <select value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <span>&#9205;</span>
          </button>
        </div>
      </div>
      <div className="filter-content-details">
        <h3>Filtrer le film</h3>
        <div className="filter">
          {Array.from(new Set(movies.map((movie) => movie.category))).map((category) => (
            <label key={category} className="checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onClick={() => FilterFilmByCategory(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  }

  // Movies
  const MovieCardSection = () => {
    return <div className="movies-grid" >
      {paginatedMovies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <div className="image" style={{ background: `url(${movie.image}) no-repeat center center`, backgroundSize: 'cover' }}></div>
          <div className="details">
            <div className="delete">
              <button onClick={() => RemoveFilm(movie.id)}>✖</button>
            </div>
            <h2><strong>{movie.title}</strong></h2>
            <p>{movie.category}</p>
            <div className="like-bar">
              <div onClick={() => LikeMovie(movie.id)} className={movie.liked ? 'liked like' : 'like'} style={{ backgroundColor: movie.liked ? 'green' : '' }}>
                <span>&#128077;</span>
                <span>{movie.likes}</span>
              </div>
              <div onClick={() => DislikeMovie(movie.id)} className={movie.disliked ? 'disliked dislike' : 'dislike'} style={{ backgroundColor: movie.disliked ? 'red' : '' }}>
                <span>&#128078;</span>
                <span>{movie.dislikes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  }

  // Footer
  const AppFooter = () => {
    return <footer>
      <span>
        Conçu par Emmanuel Ngbame
      </span>
    </footer>
  }

  return (
    <div className="App">
      <AppHeader
        movie={filteredMovies[currentMovieIndex]}
        filteredMovies={filteredMovies}
        currentMovieIndex={currentMovieIndex}
        setCurrentMovieIndex={setCurrentMovieIndex}
      />

      {filteredMovies.length > 0 && (
        <MovieFilterSection />
      )}

      {filteredMovies.length > 0 && (
        <MovieCardSection/>
      )}

      <AppFooter />
    </div>
  );
};

export default App;
