
import React, { useState } from 'react';
import { useMovies } from '@/contexts/MovieContext';
import MovieCard from './MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

const MovieList: React.FC = () => {
  const { movies } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Extract all unique genres
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  ).sort();

  // Filter movies based on search term and selected genres
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres = selectedGenres.length === 0 || 
      selectedGenres.some(genre => movie.genres.includes(genre));
    return matchesSearch && matchesGenres;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {(searchTerm || selectedGenres.length > 0) && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Filter by Genre:</div>
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedGenres.includes(genre) 
                    ? "bg-cinema-primary hover:bg-cinema-secondary" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600">No movies found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
