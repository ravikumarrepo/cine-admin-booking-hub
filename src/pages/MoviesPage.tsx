
import React from 'react';
import MovieList from '@/components/movies/MovieList';
import Layout from '@/components/layout/Layout';

const MoviesPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cinema-dark">Movies</h1>
          <p className="text-gray-600 mt-2">Browse our selection of films and book your tickets</p>
        </div>
        <MovieList />
      </div>
    </Layout>
  );
};

export default MoviesPage;
