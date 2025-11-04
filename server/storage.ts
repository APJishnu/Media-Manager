import { type Movie, type InsertMovie } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllMovies(page: number, limit: number): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  getMoviesCount(): Promise<number>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: string, movie: Partial<InsertMovie>): Promise<Movie>;
  deleteMovie(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private movies: Map<string, Movie>;

  constructor() {
    this.movies = new Map();
  }

  async getAllMovies(page: number, limit: number): Promise<Movie[]> {
    const skip = (page - 1) * limit;
    const allMovies = Array.from(this.movies.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return allMovies.slice(skip, skip + limit);
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMoviesCount(): Promise<number> {
    return this.movies.size;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const now = new Date();
    const movie: Movie = { 
      ...insertMovie, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.movies.set(id, movie);
    return movie;
  }

  async updateMovie(id: string, updateData: Partial<InsertMovie>): Promise<Movie> {
    const existingMovie = this.movies.get(id);
    if (!existingMovie) {
      throw new Error("Movie not found");
    }
    const updatedMovie: Movie = {
      ...existingMovie,
      ...updateData,
      updatedAt: new Date(),
    };
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }

  async deleteMovie(id: string): Promise<void> {
    this.movies.delete(id);
  }
}

export const storage = new MemStorage();
