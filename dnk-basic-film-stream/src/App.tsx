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

  function formatNumber(number: number): string {
    if (number === 0) {
      return "";
    }
    const suffixes = ["", "K", "M", "B", "T", "Q"];
    let suffixIndex = 0;
    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000;
      suffixIndex++;
    }  
    return number.toFixed(1).replace(/\.0$/, '') + suffixes[suffixIndex];
  }
   

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
            <span>&laquo;</span>
          </div>
          <div className="navigation" onClick={nextMovie}>
            <span>&raquo;</span>
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
        <h3>Number of pages</h3>
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <span>&laquo;</span>
          </button>
          <select value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <span>&raquo;</span>
          </button>
        </div>
      </div>
      <div className="filter-content-details">
        <h3>Filter</h3>
        <div className="filter">
          {Array.from(new Set(movies.map((movie) => movie.category))).map((category) => (
            <label key={category} className="checkbox-content">              
              <div className="checkbox-wrapper" >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onClick={() => FilterFilmByCategory(category)}
                />
                <svg viewBox="0 0 35.6 35.6">
                  <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                  <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                  <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                </svg>
              </div>
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
            <div className="title-cat">
              <h2><strong>{movie.title}</strong></h2>
              <p>{movie.category}</p>
            </div>
            <div className="like-bar">
              <div onClick={() => LikeMovie(movie.id)} className={`like ${movie.liked ? 'liked' : ''}`} style={{ backgroundColor: movie.liked ? 'gray' : '' }}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.444 1.35396C11.6474 0.955692 10.6814 1.33507 10.3687 2.16892L7.807 9.00001L4 9.00001C2.34315 9.00001 1 10.3432 1 12V20C1 21.6569 2.34315 23 4 23H18.3737C19.7948 23 21.0208 22.003 21.3107 20.6119L22.9773 12.6119C23.3654 10.7489 21.9433 9.00001 20.0404 9.00001H14.8874L15.6259 6.7846C16.2554 4.89615 15.4005 2.8322 13.62 1.94198L12.444 1.35396ZM9.67966 9.70225L12.0463 3.39119L12.7256 3.73083C13.6158 4.17595 14.0433 5.20792 13.7285 6.15215L12.9901 8.36755C12.5584 9.66261 13.5223 11 14.8874 11H20.0404C20.6747 11 21.1487 11.583 21.0194 12.204L20.8535 13H17C16.4477 13 16 13.4477 16 14C16 14.5523 16.4477 15 17 15H20.4369L20.0202 17H17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19H19.6035L19.3527 20.204C19.2561 20.6677 18.8474 21 18.3737 21H8V10.9907C8.75416 10.9179 9.40973 10.4221 9.67966 9.70225ZM6 11H4C3.44772 11 3 11.4477 3 12V20C3 20.5523 3.44772 21 4 21H6V11Z" fill="#0F0F0F"></path> </g></svg>                
                <span>{formatNumber(movie.likes)}</span>
              </div>
              <div onClick={() => DislikeMovie(movie.id)} className={`dislike ${movie.liked ? 'disliked' : ''}`} style={{ backgroundColor: movie.disliked ? 'gray' : '' }}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.556 22.646C12.3525 23.0443 13.3186 22.6649 13.6313 21.8311L16.193 15L20 15C21.6568 15 23 13.6569 23 12L23 4C23 2.34315 21.6568 1 20 1L5.62625 1C4.20523 1 2.97914 1.99698 2.68931 3.38814L1.02265 11.3881C0.634535 13.2511 2.05665 15 3.95959 15H9.11255L8.37409 17.2154C7.7446 19.1039 8.59952 21.1678 10.38 22.058L11.556 22.646ZM14.3203 14.2978L11.9537 20.6088L11.2744 20.2692C10.3842 19.8241 9.95671 18.7921 10.2715 17.8479L11.0099 15.6325C11.4416 14.3374 10.4777 13 9.11256 13H3.95959C3.32527 13 2.85124 12.417 2.98061 11.7961L3.14645 11L6.99998 11C7.55226 11 7.99998 10.5523 7.99998 10C7.99998 9.44772 7.55226 9.00001 6.99998 9.00001L3.56312 9.00001L3.97978 7.00001L6.99998 7.00001C7.55226 7.00001 7.99998 6.55229 7.99998 6.00001C7.99998 5.44772 7.55226 5.00001 6.99998 5.00001L4.39645 5.00001L4.64727 3.79605C4.74388 3.33233 5.15258 3 5.62625 3L16 3L16 13.0093C15.2458 13.0821 14.5903 13.5779 14.3203 14.2978ZM18 13H20C20.5523 13 21 12.5523 21 12L21 4C21 3.44772 20.5523 3 20 3L18 3L18 13Z" fill="#0F0F0F"></path> </g></svg>
                <span>{formatNumber(movie.dislikes)}</span>
              </div>
            </div>
            <button onClick={() => RemoveFilm(movie.id)} className="delete-button-box">
              <span className="text">Delete</span>
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                      d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                  </path>
                </svg>
              </span>
            </button>
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
