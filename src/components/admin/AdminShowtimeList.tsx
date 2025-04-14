
import React, { useState } from 'react';
import { useMovies, Showtime } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ShowtimeFormData = Pick<Showtime, 'movieId' | 'date' | 'time' | 'theater'>;

const initialFormData: ShowtimeFormData = {
  movieId: '',
  date: '',
  time: '',
  theater: '',
};

const AdminShowtimeList: React.FC = () => {
  const { movies, showtimes, addShowtime, updateShowtime, deleteShowtime } = useMovies();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ShowtimeFormData>(initialFormData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedShowtimeId(null);
  };
  
  const handleAddShowtime = () => {
    addShowtime(formData);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Showtime added",
      description: `New showtime has been scheduled`,
    });
  };
  
  const handleEditShowtime = () => {
    if (selectedShowtimeId) {
      updateShowtime(selectedShowtimeId, formData);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Showtime updated",
        description: `Showtime has been updated`,
      });
    }
  };
  
  const handleDeleteShowtime = () => {
    if (selectedShowtimeId) {
      deleteShowtime(selectedShowtimeId);
      setIsDeleteDialogOpen(false);
      setSelectedShowtimeId(null);
      toast({
        title: "Showtime deleted",
        description: `Showtime has been removed from the schedule`,
      });
    }
  };
  
  const openEditDialog = (showtime: Showtime) => {
    setSelectedShowtimeId(showtime.id);
    setFormData({
      movieId: showtime.movieId,
      date: showtime.date,
      time: showtime.time,
      theater: showtime.theater,
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (showtimeId: string) => {
    setSelectedShowtimeId(showtimeId);
    setIsDeleteDialogOpen(true);
  };

  // Sort showtimes by date (newest first)
  const sortedShowtimes = [...showtimes].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Showtime Management</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-cinema-primary hover:bg-cinema-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Showtime
        </Button>
      </div>

      {showtimes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">No showtimes scheduled yet</h3>
          <p className="text-gray-500 mt-2">Add your first showtime to get started</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Theater</TableHead>
                <TableHead>Available Seats</TableHead>
                <TableHead>Booked Seats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedShowtimes.map((showtime) => {
                const movie = movies.find(m => m.id === showtime.movieId);
                return (
                  <TableRow key={showtime.id}>
                    <TableCell className="font-mono text-xs">{showtime.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-medium">{movie?.title || 'Unknown Movie'}</TableCell>
                    <TableCell>{showtime.date}</TableCell>
                    <TableCell>{showtime.time}</TableCell>
                    <TableCell>{showtime.theater}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {showtime.seatsAvailable.length} seats
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {showtime.seatsBooked.length} seats
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openEditDialog(showtime)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(showtime.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Showtime Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Showtime</DialogTitle>
            <DialogDescription>
              Schedule a new showtime for a movie. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="movieId">Movie</Label>
              <Select 
                value={formData.movieId} 
                onValueChange={(value) => handleSelectChange('movieId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  value={formData.time} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theater">Theater</Label>
              <Select 
                value={formData.theater} 
                onValueChange={(value) => handleSelectChange('theater', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theater" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theater 1">Theater 1</SelectItem>
                  <SelectItem value="Theater 2">Theater 2</SelectItem>
                  <SelectItem value="Theater 3">Theater 3</SelectItem>
                  <SelectItem value="Theater 4">Theater 4</SelectItem>
                  <SelectItem value="Theater 5">Theater 5</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={handleAddShowtime}
              className="bg-cinema-primary hover:bg-cinema-secondary"
              disabled={!formData.movieId || !formData.date || !formData.time || !formData.theater}
            >
              Schedule Showtime
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Showtime Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Showtime</DialogTitle>
            <DialogDescription>
              Update the showtime details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-movieId">Movie</Label>
              <Select 
                value={formData.movieId} 
                onValueChange={(value) => handleSelectChange('movieId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input 
                  id="edit-time" 
                  name="time" 
                  type="time" 
                  value={formData.time} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-theater">Theater</Label>
              <Select 
                value={formData.theater} 
                onValueChange={(value) => handleSelectChange('theater', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theater" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theater 1">Theater 1</SelectItem>
                  <SelectItem value="Theater 2">Theater 2</SelectItem>
                  <SelectItem value="Theater 3">Theater 3</SelectItem>
                  <SelectItem value="Theater 4">Theater 4</SelectItem>
                  <SelectItem value="Theater 5">Theater 5</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={handleEditShowtime}
              className="bg-cinema-primary hover:bg-cinema-secondary"
              disabled={!formData.movieId || !formData.date || !formData.time || !formData.theater}
            >
              Update Showtime
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Showtime Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this showtime? This action cannot be undone and will cancel any existing bookings.
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
              onClick={handleDeleteShowtime}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShowtimeList;
