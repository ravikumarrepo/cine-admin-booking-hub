
import React from 'react';
import { useMovies } from '@/contexts/MovieContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Clock, Film, MapPin, Ticket } from 'lucide-react';

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const { getUserBookings, movies, showtimes } = useMovies();
  
  if (!user) {
    return null;
  }
  
  const userBookings = getUserBookings(user.id);
  
  // Sort bookings by date (newest first)
  const sortedBookings = [...userBookings].sort((a, b) => 
    new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cinema-dark">My Bookings</h1>
        <p className="text-gray-600 mt-2">View all your movie ticket bookings</p>
      </div>

      {sortedBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Ticket className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No bookings yet</h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              You haven't booked any movie tickets yet. Browse our movies and book your first ticket!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedBookings.map(booking => {
            const movie = movies.find(m => m.id === booking.movieId);
            const showtime = showtimes.find(s => s.id === booking.showtimeId);
            
            if (!movie || !showtime) return null;
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <div className="sm:flex">
                  <div className="hidden sm:block sm:w-32 h-auto">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{movie.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Film className="h-3 w-3 mr-1" />
                            {movie.genres.slice(0, 3).join(', ')}
                          </CardDescription>
                        </div>
                        <Badge className="bg-cinema-primary">
                          {booking.seats.length} {booking.seats.length === 1 ? 'Ticket' : 'Tickets'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-cinema-primary" />
                            <span className="mr-2">{showtime.date}</span>
                            <Clock className="h-4 w-4 mr-1 text-cinema-primary" />
                            <span>{showtime.time}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Theater</div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-cinema-primary" />
                            <span>{showtime.theater}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Seats</div>
                          <div className="flex flex-wrap gap-1">
                            {booking.seats.sort((a, b) => a - b).map(seatNumber => (
                              <Badge key={seatNumber} variant="outline" className="bg-gray-100">
                                Seat {seatNumber}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Booking Info</div>
                          <div className="text-sm">
                            <div className="mb-1">
                              <span className="font-medium">Booking ID:</span> {booking.id.substring(0, 8)}...
                            </div>
                            <div className="mb-1">
                              <span className="font-medium">Booked on:</span> {format(new Date(booking.bookingDate), 'PPP')}
                            </div>
                            <div>
                              <span className="font-medium">Amount Paid:</span> ${booking.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
