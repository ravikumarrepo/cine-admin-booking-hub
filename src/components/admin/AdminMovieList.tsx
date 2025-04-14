
import React, { useState } from 'react';
import { useMovies, Movie } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type MovieFormData = Omit<Movie, 'id' | 'showtimes'>;

const initialFormData: MovieFormData = {
  title: '',
  poster: '',
  description: '',
  genres: [],
  duration: 0,
  releaseDate: '',
  rating: 0,
};

const AdminMovieList: React.FC = () => {
  const { movies, addMovie, updateMovie, deleteMovie } = useMovies();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MovieFormData>(initialFormData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'genres') {
      setFormData({
        ...formData,
        genres: value.split(',').map(genre => genre.trim()),
      });
    } else if (name === 'duration' || name === 'rating') {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedMovieId(null);
  };
  
  const handleAddMovie = () => {
    addMovie(formData);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Movie added",
      description: `"${formData.title}" has been added to the catalog`,
    });
  };
  
  const handleEditMovie = () => {
    if (selectedMovieId) {
      updateMovie(selectedMovieId, formData);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Movie updated",
        description: `"${formData.title}" has been updated`,
      });
    }
  };
  
  const handleDeleteMovie = () => {
    if (selectedMovieId) {
      const movieTitle = movies.find(m => m.id === selectedMovieId)?.title;
      deleteMovie(selectedMovieId);
      setIsDeleteDialogOpen(false);
      setSelectedMovieId(null);
      toast({
        title: "Movie deleted",
        description: `"${movieTitle}" has been removed from the catalog`,
      });
    }
  };
  
  const openEditDialog = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setFormData({
      title: movie.title,
      poster: movie.poster,
      description: movie.description,
      genres: movie.genres,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      rating: movie.rating,
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Movie Management</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-cinema-primary hover:bg-cinema-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Movie
        </Button>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No movies added yet</h3>
          <p className="text-gray-500 mt-2">Add your first movie to get started</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genres</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Showtimes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-mono text-xs">{movie.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="bg-gray-100 text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{movie.duration} mins</TableCell>
                  <TableCell>{movie.releaseDate}</TableCell>
                  <TableCell>{movie.rating.toFixed(1)}</TableCell>
                  <TableCell>{movie.showtimes.length}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => openEditDialog(movie)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => openDeleteDialog(movie.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Movie Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogDescription>
              Enter the details for the new movie. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="poster">Poster URL</Label>
              <Input 
                id="poster" 
                name="poster" 
                value={formData.poster} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="genres">Genres (comma separated)</Label>
                <Input 
                  id="genres" 
                  name="genres" 
                  value={formData.genres.join(', ')} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  value={formData.duration.toString()} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="releaseDate">Release Date</Label>
                <Input 
                  id="releaseDate" 
                  name="releaseDate" 
                  type="date" 
                  value={formData.releaseDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input 
                  id="rating" 
                  name="rating" 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.1" 
                  value={formData.rating.toString()} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMovie}
              className="bg-cinema-primary hover:bg-cinema-secondary"
            >
              Save Movie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>
              Update the movie details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-poster">Poster URL</Label>
              <Input 
                id="edit-poster" 
                name="poster" 
                value={formData.poster} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-genres">Genres (comma separated)</Label>
                <Input 
                  id="edit-genres" 
                  name="genres" 
                  value={formData.genres.join(', ')} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input 
                  id="edit-duration" 
                  name="duration" 
                  type="number" 
                  value={formData.duration.toString()} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-releaseDate">Release Date</Label>
                <Input 
                  id="edit-releaseDate" 
                  name="releaseDate" 
                  type="date" 
                  value={formData.releaseDate} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rating">Rating (0-10)</Label>
                <Input 
                  id="edit-rating" 
                  name="rating" 
                  type="number" 
                  min="0" 
                  max="10" 
                  step="0.1" 
                  value={formData.rating.toString()} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditMovie}
              className="bg-cinema-primary hover:bg-cinema-secondary"
            >
              Update Movie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Movie Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this movie? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMovie}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMovieList;
