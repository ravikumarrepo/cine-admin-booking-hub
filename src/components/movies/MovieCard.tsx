
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/contexts/MovieContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card className="movie-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="movie-poster w-full h-[320px] object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-cinema-accent text-white hover:bg-cinema-accent/90">
            <Star className="h-3 w-3 mr-1 fill-current" /> {movie.rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="movie-title text-lg font-bold mb-2 line-clamp-1">{movie.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{movie.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs bg-gray-100">
              {genre}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-3 w-3 mr-1" /> {movie.duration} mins
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-3 w-3 mr-1" /> {movie.releaseDate}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          asChild 
          className="w-full bg-cinema-primary hover:bg-cinema-secondary"
        >
          <Link to={`/movies/${movie.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
