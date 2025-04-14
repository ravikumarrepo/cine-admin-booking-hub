
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '@/contexts/MovieContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Calendar, Clock, CreditCard, Film, Info } from 'lucide-react';

const SeatBooking: React.FC = () => {
  const { movieId, showtimeId } = useParams<{ movieId: string; showtimeId: string }>();
  const navigate = useNavigate();
  const { movies, showtimes, addBooking } = useMovies();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  
  const movie = movies.find(m => m.id === movieId);
  const showtime = showtimes.find(s => s.id === showtimeId);
  
  const TICKET_PRICE = 12.99;

  useEffect(() => {
    if (!movie || !showtime) {
      navigate('/movies');
      toast({
        title: "Invalid booking",
        description: "The movie or showtime you're trying to book doesn't exist.",
        variant: "destructive",
      });
    }
  }, [movie, showtime, navigate, toast]);

  if (!movie || !showtime || !user) {
    return null;
  }

  const handleSeatClick = (seatNumber: number) => {
    if (showtime.seatsBooked.includes(seatNumber)) {
      return; // Seat is already booked
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const getSeatClassName = (seatNumber: number) => {
    if (showtime.seatsBooked.includes(seatNumber)) {
      return 'seat seat-booked';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'seat seat-selected';
    }
    return 'seat seat-available';
  };

  const totalPrice = selectedSeats.length * TICKET_PRICE;

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to book.",
        variant: "destructive",
      });
      return;
    }

    setBookingInProgress(true);

    // Simulating API call
    setTimeout(() => {
      try {
        addBooking({
          userId: user.id,
          movieId: movie.id,
          showtimeId: showtime.id,
          seats: selectedSeats,
          totalPrice,
          bookingDate: new Date().toISOString(),
        });

        toast({
          title: "Booking successful!",
          description: `You have successfully booked ${selectedSeats.length} seat(s) for ${movie.title}.`,
        });

        navigate('/bookings');
      } catch (error) {
        toast({
          title: "Booking failed",
          description: "There was an error processing your booking. Please try again.",
          variant: "destructive",
        });
      } finally {
        setBookingInProgress(false);
      }
    }, 1500);
  };

  // Generate rows of seats (5 seats per row)
  const seatRows = [];
  const totalSeats = 50; // Assuming 50 seats total
  const seatsPerRow = 10;
  
  for (let i = 0; i < totalSeats; i += seatsPerRow) {
    const rowSeats = [];
    for (let j = 0; j < seatsPerRow; j++) {
      const seatNumber = i + j + 1;
      rowSeats.push(seatNumber);
    }
    seatRows.push(rowSeats);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/movies/${movie.id}`)} 
        className="mb-6 flex items-center gap-2 text-gray-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Movie
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Select Your Seats</CardTitle>
              <CardDescription>
                Choose seats for {movie.title} at {showtime.time} on {showtime.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="w-full bg-gray-200 p-2 text-center mb-6 rounded-md">
                  Screen
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  {seatRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map(seatNumber => (
                        <button
                          key={seatNumber}
                          className={getSeatClassName(seatNumber)}
                          onClick={() => handleSeatClick(seatNumber)}
                          disabled={showtime.seatsBooked.includes(seatNumber)}
                        >
                          {seatNumber}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-8">
                <div className="flex items-center">
                  <div className="seat-available w-6 h-6 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="seat-selected w-6 h-6 mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="seat-booked w-6 h-6 mr-2"></div>
                  <span className="text-sm">Booked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-12 flex-shrink-0">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="h-full w-full object-cover rounded"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{movie.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Film className="h-3 w-3 mr-1" /> {movie.genres.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{showtime.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{showtime.time}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Theater:</span> {showtime.theater}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="font-medium mb-2">Selected Seats:</div>
                {selectedSeats.length === 0 ? (
                  <div className="text-sm text-gray-500">No seats selected</div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.sort((a, b) => a - b).map(seat => (
                      <Badge key={seat} variant="outline" className="bg-cinema-primary/10">
                        Seat {seat}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets ({selectedSeats.length})</span>
                  <span>${(selectedSeats.length * TICKET_PRICE).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Fee</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full bg-cinema-accent hover:bg-cinema-accent/90"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingInProgress}
              >
                {bookingInProgress ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Confirm Booking
                  </span>
                )}
              </Button>
              <div className="flex items-center text-xs text-gray-500">
                <Info className="h-3 w-3 mr-1" />
                <span>
                  By proceeding, you agree to our terms and conditions for movie ticket purchases.
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
