
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMovies } from "@/contexts/MovieContext";
import Layout from "@/components/layout/Layout";
import { Film, Ticket, Calendar, ArrowRight } from "lucide-react";

const Index = () => {
  const { movies } = useMovies();
  
  // Get featured movies (the latest 3)
  const featuredMovies = [...movies].sort((a, b) => {
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  }).slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cinema-dark to-cinema-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Book Your Movie Tickets Online
              </h1>
              <p className="text-lg mb-8 text-gray-200">
                Experience the magic of cinema with CineAdmin. Book your tickets hassle-free and enjoy the best movies in town.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-cinema-primary hover:bg-cinema-primary/90">
                  <Link to="/movies">Browse Movies</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-lg border-2 border-cinema-primary/50"></div>
                <img 
                  src="https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg" 
                  alt="Featured Movie" 
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cinema-dark mb-4">
              Why Choose CineAdmin?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a seamless movie booking experience with the best features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-cinema-primary/10 p-3 rounded-full mb-4">
                  <Film className="h-8 w-8 text-cinema-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Latest Movies</h3>
                <p className="text-gray-600">
                  Access to the latest blockbusters and indie films. Our catalog is updated regularly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-cinema-primary/10 p-3 rounded-full mb-4">
                  <Ticket className="h-8 w-8 text-cinema-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-gray-600">
                  Book your tickets in just a few clicks. Select your seats and confirm your booking instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="bg-cinema-primary/10 p-3 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-cinema-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Showtimes</h3>
                <p className="text-gray-600">
                  Multiple showtimes available for your convenience. Choose what works best for your schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-cinema-dark">Featured Movies</h2>
            <Button asChild variant="ghost" className="flex items-center gap-1 text-cinema-primary">
              <Link to="/movies">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMovies.map(movie => (
              <Card key={movie.id} className="movie-card overflow-hidden">
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="movie-poster"
                  />
                  <div className="absolute top-0 left-0 w-full p-2 flex justify-end">
                    <Badge className="bg-cinema-accent text-white">
                      {movie.rating.toFixed(1)} / 10
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="movie-title text-xl font-bold mb-2">{movie.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{movie.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.slice(0, 3).map(genre => (
                      <Badge key={genre} variant="outline" className="bg-gray-100">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full bg-cinema-primary hover:bg-cinema-secondary">
                    <Link to={`/movies/${movie.id}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cinema-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-cinema-dark mb-4">
            Ready for Your Movie Experience?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse our movie selection and book your tickets now. Enjoy the magic of cinema with CineAdmin.
          </p>
          <Button asChild size="lg" className="bg-cinema-primary hover:bg-cinema-secondary">
            <Link to="/movies">Browse All Movies</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
