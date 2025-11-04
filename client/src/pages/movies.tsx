import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Film, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMovieSchema, type Movie, type InsertMovie } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertMovie>({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: "",
      type: "Movie",
      director: "",
      budget: "",
      location: "",
      duration: "",
      yearTime: "",
    },
  });

  const { data, isLoading, isFetching } = useQuery<{
    status: boolean;
    data: Movie[];
    pagination: { page: number; limit: number; total: number; pages: number; hasNext: boolean };
  }>({
    queryKey: ["/api/movies", page],
    queryFn: async () => {
      const res = await fetch(`/api/movies?page=${page}&limit=10`, {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    },
    enabled: hasMore,
  });

  useEffect(() => {
    if (data?.data) {
      setAllMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = data.data.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovies];
      });
      setHasMore(data.pagination.hasNext || false);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observerRef.current.observe(currentSentinel);
    }

    return () => {
      if (observerRef.current && currentSentinel) {
        observerRef.current.unobserve(currentSentinel);
      }
    };
  }, [loadMore]);

  const createMutation = useMutation({
    mutationFn: (data: InsertMovie) => apiRequest("POST", "/api/movies", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      setIsModalOpen(false);
      setAllMovies([]);
      setPage(1);
      setHasMore(true);
      form.reset();
      toast({
        title: "Success",
        description: "Movie created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create movie",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertMovie> }) =>
      apiRequest("PUT", `/api/movies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      setIsModalOpen(false);
      setEditingMovie(null);
      setAllMovies([]);
      setPage(1);
      setHasMore(true);
      form.reset();
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update movie",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/movies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      setDeletingMovie(null);
      setAllMovies([]);
      setPage(1);
      setHasMore(true);
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete movie",
        variant: "destructive",
      });
    },
  });

  const handleAddMovie = () => {
    setEditingMovie(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    form.reset({
      title: movie.title,
      type: movie.type as "Movie" | "TV Show",
      director: movie.director,
      budget: movie.budget,
      location: movie.location,
      duration: movie.duration,
      yearTime: movie.yearTime,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMovie = (movie: Movie) => {
    setDeletingMovie(movie);
  };

  const onSubmit = (data: InsertMovie) => {
    if (editingMovie) {
      updateMutation.mutate({ id: editingMovie.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (deletingMovie) {
      deleteMutation.mutate(deletingMovie.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MovieHub</h1>
            </div>
            <Button
              onClick={handleAddMovie}
              size="default"
              className="gap-2"
              data-testid="button-add-movie"
            >
              <Plus className="h-4 w-4" />
              Add Movie
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && allMovies.length === 0 ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-card animate-pulse rounded-lg border border-card-border"
              />
            ))}
          </div>
        ) : allMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Film className="h-20 w-20 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No movies yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Get started by adding your first movie or TV show to your collection.
            </p>
            <Button onClick={handleAddMovie} size="lg" className="gap-2" data-testid="button-add-first-movie">
              <Plus className="h-5 w-5" />
              Add Your First Movie
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Director</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Budget</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Year</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allMovies.map((movie, index) => (
                    <tr
                      key={movie.id}
                      className="border-b border-border hover-elevate transition-colors duration-150"
                      style={{
                        backgroundColor: index % 2 === 0 ? "hsl(var(--background))" : "hsl(var(--card))",
                      }}
                      data-testid={`row-movie-${movie.id}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground" data-testid={`text-title-${movie.id}`}>
                        {movie.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-type-${movie.id}`}>
                        {movie.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-director-${movie.id}`}>
                        {movie.director}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-budget-${movie.id}`}>
                        {movie.budget}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-location-${movie.id}`}>
                        {movie.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-duration-${movie.id}`}>
                        {movie.duration}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-year-${movie.id}`}>
                        {movie.yearTime}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMovie(movie)}
                            data-testid={`button-edit-${movie.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMovie(movie)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${movie.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {allMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-card border border-card-border rounded-lg p-6 space-y-4"
                  data-testid={`card-movie-${movie.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground">{movie.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditMovie(movie)}
                        data-testid={`button-edit-mobile-${movie.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMovie(movie)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-mobile-${movie.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Director</p>
                      <p className="text-foreground font-medium">{movie.director}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="text-foreground font-medium">{movie.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="text-foreground font-medium">{movie.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="text-foreground font-medium">{movie.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year</p>
                      <p className="text-foreground font-medium">{movie.yearTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isFetching && hasMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            <div ref={sentinelRef} className="h-4" />
          </>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" data-testid="dialog-movie-form">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingMovie ? "Edit Movie" : "Add New Movie"}
            </DialogTitle>
            <DialogDescription>
              {editingMovie
                ? "Update the movie details below."
                : "Fill in the details to add a new movie to your collection."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter movie title" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Movie">Movie</SelectItem>
                          <SelectItem value="TV Show">TV Show</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director</FormLabel>
                      <FormControl>
                        <Input placeholder="Director name" {...field} data-testid="input-director" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $5M" {...field} data-testid="input-budget" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Filming location" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 120 min" {...field} data-testid="input-duration" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2024" {...field} data-testid="input-year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMovie(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingMovie ? "Updating..." : "Creating..."}
                    </>
                  ) : editingMovie ? (
                    "Update Movie"
                  ) : (
                    "Add Movie"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingMovie} onOpenChange={() => setDeletingMovie(null)}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{deletingMovie?.title}</strong>"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
