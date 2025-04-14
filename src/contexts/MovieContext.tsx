
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  description: string;
  genres: string[];
  duration: number; // in minutes
  releaseDate: string;
  rating: number; // out of 10
  showtimes: Showtime[];
};

export type Showtime = {
  id: string;
  movieId: string;
  date: string;
  time: string;
  theater: string;
  seatsAvailable: number[];
  seatsBooked: number[];
};

export type Booking = {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  seats: number[];
  totalPrice: number;
  bookingDate: string;
};

type MovieContextType = {
  movies: Movie[];
  showtimes: Showtime[];
  bookings: Booking[];
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  updateMovie: (id: string, updates: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  addShowtime: (showtime: Omit<Showtime, 'id'>) => void;
  updateShowtime: (id: string, updates: Partial<Showtime>) => void;
  deleteShowtime: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  getUserBookings: (userId: string) => Booking[];
};

const MovieContext = createContext<MovieContextType | null>(null);

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

// Initial mock data
const initialMovies: Movie[] = [
  {
    id: "movie-1",
    title: "Inception",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    duration: 148,
    releaseDate: "2010-07-16",
    rating: 8.8,
    showtimes: []
  },
  {
    id: "movie-2",
    title: "The Dark Knight",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genres: ["Action", "Crime", "Drama"],
    duration: 152,
    releaseDate: "2008-07-18",
    rating: 9.0,
    showtimes: []
  },
  {
    id: "movie-3",
    title: "Interstellar",
    poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    duration: 169,
    releaseDate: "2014-11-07",
    rating: 8.6,
    showtimes: []
  }
];

const initialShowtimes: Showtime[] = [
  {
    id: "showtime-1",
    movieId: "movie-1",
    date: "2025-04-15",
    time: "14:30",
    theater: "Theater 1",
    seatsAvailable: Array.from({ length: 50 }, (_, i) => i + 1),
    seatsBooked: []
  },
  {
    id: "showtime-2",
    movieId: "movie-1",
    date: "2025-04-15",
    time: "18:00",
    theater: "Theater 2",
    seatsAvailable: Array.from({ length: 50 }, (_, i) => i + 1),
    seatsBooked: []
  },
  {
    id: "showtime-3",
    movieId: "movie-2",
    date: "2025-04-15",
    time: "15:00",
    theater: "Theater 3",
    seatsAvailable: Array.from({ length: 50 }, (_, i) => i + 1),
    seatsBooked: []
  },
  {
    id: "showtime-4",
    movieId: "movie-3",
    date: "2025-04-16",
    time: "20:00",
    theater: "Theater 1",
    seatsAvailable: Array.from({ length: 50 }, (_, i) => i + 1),
    seatsBooked: []
  }
];

// Update movie showtimes references
initialMovies.forEach(movie => {
  movie.showtimes = initialShowtimes.filter(showtime => showtime.movieId === movie.id);
});

const initialBookings: Booking[] = [];

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [showtimes, setShowtimes] = useState<Showtime[]>(initialShowtimes);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMovies = localStorage.getItem('movies');
    const savedShowtimes = localStorage.getItem('showtimes');
    const savedBookings = localStorage.getItem('bookings');
    
    if (savedMovies) setMovies(JSON.parse(savedMovies));
    if (savedShowtimes) setShowtimes(JSON.parse(savedShowtimes));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
    localStorage.setItem('showtimes', JSON.stringify(showtimes));
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [movies, showtimes, bookings]);

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movie,
      id: `movie-${Date.now()}`,
      showtimes: []
    };
    
    setMovies(prev => [...prev, newMovie]);
    toast({
      title: "Movie added",
      description: `${movie.title} has been added to the catalog`,
    });
  };

  const updateMovie = (id: string, updates: Partial<Movie>) => {
    setMovies(prev => 
      prev.map(movie => 
        movie.id === id ? { ...movie, ...updates } : movie
      )
    );
    toast({
      title: "Movie updated",
      description: `Movie information has been updated`,
    });
  };

  const deleteMovie = (id: string) => {
    const movieToDelete = movies.find(m => m.id === id);
    if (!movieToDelete) return;
    
    // Delete associated showtimes
    setShowtimes(prev => prev.filter(st => st.movieId !== id));
    
    // Delete movie
    setMovies(prev => prev.filter(movie => movie.id !== id));
    
    toast({
      title: "Movie deleted",
      description: `${movieToDelete.title} has been removed from the catalog`,
    });
  };

  const addShowtime = (showtime: Omit<Showtime, 'id'>) => {
    const newShowtime: Showtime = {
      ...showtime,
      id: `showtime-${Date.now()}`,
      seatsAvailable: Array.from({ length: 50 }, (_, i) => i + 1),
      seatsBooked: []
    };
    
    setShowtimes(prev => [...prev, newShowtime]);
    
    // Update movie's showtimes
    setMovies(prev => 
      prev.map(movie => 
        movie.id === showtime.movieId 
          ? { ...movie, showtimes: [...movie.showtimes, newShowtime] } 
          : movie
      )
    );
    
    toast({
      title: "Showtime added",
      description: `A new showtime has been scheduled`,
    });
  };

  const updateShowtime = (id: string, updates: Partial<Showtime>) => {
    setShowtimes(prev => 
      prev.map(showtime => 
        showtime.id === id ? { ...showtime, ...updates } : showtime
      )
    );
    
    // Update movie's showtimes
    setMovies(prev => 
      prev.map(movie => ({
        ...movie,
        showtimes: movie.showtimes.map(showtime => 
          showtime.id === id ? { ...showtime, ...updates } : showtime
        )
      }))
    );
    
    toast({
      title: "Showtime updated",
      description: `Showtime information has been updated`,
    });
  };

  const deleteShowtime = (id: string) => {
    const showtimeToDelete = showtimes.find(st => st.id === id);
    if (!showtimeToDelete) return;
    
    setShowtimes(prev => prev.filter(showtime => showtime.id !== id));
    
    // Update movie's showtimes
    setMovies(prev => 
      prev.map(movie => ({
        ...movie,
        showtimes: movie.showtimes.filter(showtime => showtime.id !== id)
      }))
    );
    
    toast({
      title: "Showtime deleted",
      description: `Showtime has been removed from the schedule`,
    });
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    // Update showtime's available and booked seats
    setShowtimes(prev => 
      prev.map(showtime => {
        if (showtime.id === booking.showtimeId) {
          return {
            ...showtime,
            seatsAvailable: showtime.seatsAvailable.filter(seat => !booking.seats.includes(seat)),
            seatsBooked: [...showtime.seatsBooked, ...booking.seats]
          };
        }
        return showtime;
      })
    );
    
    // Also update the same showtime in the movie object
    setMovies(prev => 
      prev.map(movie => ({
        ...movie,
        showtimes: movie.showtimes.map(showtime => {
          if (showtime.id === booking.showtimeId) {
            return {
              ...showtime,
              seatsAvailable: showtime.seatsAvailable.filter(seat => !booking.seats.includes(seat)),
              seatsBooked: [...showtime.seatsBooked, ...booking.seats]
            };
          }
          return showtime;
        })
      }))
    );
    
    toast({
      title: "Booking confirmed",
      description: `Your booking has been confirmed!`,
    });
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  return (
    <MovieContext.Provider value={{
      movies,
      showtimes,
      bookings,
      addMovie,
      updateMovie,
      deleteMovie,
      addShowtime,
      updateShowtime,
      deleteShowtime,
      addBooking,
      getUserBookings
    }}>
      {children}
    </MovieContext.Provider>
  );
};
