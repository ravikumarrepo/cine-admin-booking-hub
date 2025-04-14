
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cinema-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center mb-4">
              <Film className="h-8 w-8 text-cinema-primary" />
              <span className="ml-2 text-xl font-bold">CineAdmin</span>
            </div>
            <p className="text-sm text-gray-300">
              Your ultimate destination for booking movie tickets online. 
              Experience the best cinema has to offer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-sm text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Genres</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Action</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Comedy</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Drama</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Horror</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Sci-Fi</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Adventure</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Romance</span>
              <span className="text-xs bg-cinema-secondary/30 px-2 py-1 rounded-full">Animation</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 text-cinema-primary mr-2" />
                <span className="text-sm text-gray-300">123 Cinema Street, Movie City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-cinema-primary mr-2" />
                <span className="text-sm text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-cinema-primary mr-2" />
                <span className="text-sm text-gray-300">info@cineadmin.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CineAdmin Booking Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
