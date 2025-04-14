
import React from 'react';
import { useMovies } from '@/contexts/MovieContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AdminBookingList: React.FC = () => {
  const { bookings, movies, showtimes } = useMovies();
  
  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Booking Management</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No bookings made yet</h3>
          <p className="text-gray-500 mt-2">Bookings will appear here once customers make reservations</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Booking ID</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Theater</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.map((booking) => {
                const movie = movies.find(m => m.id === booking.movieId);
                const showtime = showtimes.find(s => s.id === booking.showtimeId);
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-medium">{movie?.title || 'Unknown Movie'}</TableCell>
                    <TableCell>
                      {showtime ? (
                        <div>
                          <div>{showtime.date}</div>
                          <div className="text-gray-500 text-sm">{showtime.time}</div>
                        </div>
                      ) : (
                        'Unknown Showtime'
                      )}
                    </TableCell>
                    <TableCell>{showtime?.theater || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map(seat => (
                          <Badge key={seat} variant="outline" className="bg-gray-100">
                            {seat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {booking.userId.substring(0, 8)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(booking.bookingDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right font-medium">${booking.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingList;
