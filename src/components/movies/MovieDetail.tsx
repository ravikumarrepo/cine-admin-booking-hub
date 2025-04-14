
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '@/contexts/MovieContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Star, CalendarDays, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies } = useMovies();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

  if (!id) {
    return <div>Movie not found</div>;
  }

  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  // Group showtimes by date
  const showtimesByDate = movie.showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.date]) {
      acc[showtime.date] = [];
    }
    acc[showtime.date].push(showtime);
    return acc;
  }, {} as Record<string, typeof movie.showtimes>);

  // Sort dates
  const sortedDates = Object.keys(showtimesByDate).sort();

  const handleShowtimeClick = (showtimeId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to book tickets",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedShowtime(showtimeId);
    navigate(`/booking/${movie.id}/${showtimeId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/movies')} 
        className="mb-6 flex items-center gap-2 text-gray-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Movies
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="md:col-span-1">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-cinema-dark mb-2">{movie.title}</h1>
            <Badge className="bg-cinema-accent text-white hover:bg-cinema-accent/90 text-base py-1">
              <Star className="h-4 w-4 mr-1 fill-current" /> {movie.rating.toFixed(1)}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline" className="bg-gray-100">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> {movie.duration} mins
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> {movie.releaseDate}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
            <p className="text-gray-600">{movie.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Showtimes</h3>
            
            {sortedDates.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  No showtimes available for this movie.
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue={sortedDates[0]}>
                <TabsList className="mb-4 w-full flex overflow-x-auto">
                  {sortedDates.map(date => (
                    <TabsTrigger 
                      key={date} 
                      value={date}
                      className="flex items-center gap-1"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(new Date(date), 'E, MMM d')}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {sortedDates.map(date => (
                  <TabsContent key={date} value={date}>
                    <Card>
                      <CardContent className="py-6">
                        <div className="flex flex-col gap-4">
                          {showtimesByDate[date].map(showtime => (
                            <div key={showtime.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-start md:items-center gap-4 mb-3 md:mb-0">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-lg">{showtime.time}</span>
                                  <span className="text-sm text-gray-500">{showtime.theater}</span>
                                </div>
                                <Badge variant="outline" className="bg-gray-100">
                                  {showtime.seatsAvailable.length} seats available
                                </Badge>
                              </div>
                              <Button 
                                className="bg-cinema-primary hover:bg-cinema-secondary"
                                onClick={() => handleShowtimeClick(showtime.id)}
                                disabled={showtime.seatsAvailable.length === 0}
                              >
                                {showtime.seatsAvailable.length === 0 ? 'Sold Out' : 'Book Tickets'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
