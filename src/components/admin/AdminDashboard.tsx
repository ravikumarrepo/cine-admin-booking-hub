
import React from 'react';
import { useMovies } from '@/contexts/MovieContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Calendar, TicketIcon, Users } from 'lucide-react';
import AdminMovieList from './AdminMovieList';
import AdminShowtimeList from './AdminShowtimeList';
import AdminBookingList from './AdminBookingList';

const AdminDashboard: React.FC = () => {
  const { movies, showtimes, bookings } = useMovies();

  // Calculate total revenue
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  // Count seats sold
  const seatsSold = bookings.reduce((sum, booking) => sum + booking.seats.length, 0);
  
  // Count unique customers
  const uniqueCustomers = new Set(bookings.map(booking => booking.userId)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cinema-dark">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage movies, showtimes, and bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Movies</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <Film className="h-5 w-5 mr-2 text-cinema-primary" />
              {movies.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {movies.length} movies in the catalog
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Showtimes</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-cinema-primary" />
              {showtimes.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {showtimes.length} scheduled showtimes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tickets Sold</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <TicketIcon className="h-5 w-5 mr-2 text-cinema-primary" />
              {seatsSold}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {bookings.length} bookings, {seatsSold} tickets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              ${totalRevenue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From {uniqueCustomers} customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movies" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="movies">
          <AdminMovieList />
        </TabsContent>
        
        <TabsContent value="showtimes">
          <AdminShowtimeList />
        </TabsContent>
        
        <TabsContent value="bookings">
          <AdminBookingList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
