import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, type InsertMovie, type PaginatedResponse, type Movie, type ApiResponse } from "@shared/schema";
import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const idParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid movie ID format" }),
});

function calculatePagination(page: number, limit: number, total: number) {
  const pages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/movies?page=1&limit=10 - Get paginated movies
  app.get("/api/movies", async (req, res) => {
    try {
      const validation = paginationSchema.safeParse(req.query);
      
      if (!validation.success) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const { page, limit } = validation.data;
      
      const [movies, total] = await Promise.all([
        storage.getAllMovies(page, limit),
        storage.getMoviesCount(),
      ]);

      const pagination = calculatePagination(page, limit, total);

      const response: PaginatedResponse<Movie> = {
        status: true,
        message: "Movies retrieved successfully",
        data: movies,
        pagination,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching movies:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // POST /api/movies - Create new movie
  app.post("/api/movies", async (req, res) => {
    try {
      const validation = insertMovieSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        });
      }

      const movie = await storage.createMovie(validation.data);

      const response: ApiResponse<Movie> = {
        status: true,
        message: "Movie created successfully",
        data: movie,
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error("Error creating movie:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // GET /api/movies/:id - Get single movie by ID
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const paramValidation = idParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          status: false,
          message: "Invalid movie ID format",
          errors: paramValidation.error.flatten().fieldErrors,
        });
      }

      const { id } = paramValidation.data;
      const movie = await storage.getMovie(id);

      if (!movie) {
        return res.status(404).json({
          status: false,
          message: "Movie not found",
        });
      }

      const response: ApiResponse<Movie> = {
        status: true,
        message: "Movie retrieved successfully",
        data: movie,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching movie:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // PUT /api/movies/:id - Update movie
  app.put("/api/movies/:id", async (req, res) => {
    try {
      const paramValidation = idParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          status: false,
          message: "Invalid movie ID format",
          errors: paramValidation.error.flatten().fieldErrors,
        });
      }

      const updateSchema = insertMovieSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided for update" }
      );

      const bodyValidation = updateSchema.safeParse(req.body);

      if (!bodyValidation.success) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: bodyValidation.error.flatten().fieldErrors,
        });
      }

      const { id } = paramValidation.data;
      
      const existingMovie = await storage.getMovie(id);
      if (!existingMovie) {
        return res.status(404).json({
          status: false,
          message: "Movie not found",
        });
      }

      const updatedMovie = await storage.updateMovie(id, bodyValidation.data);

      const response: ApiResponse<Movie> = {
        status: true,
        message: "Movie updated successfully",
        data: updatedMovie,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error updating movie:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  // DELETE /api/movies/:id - Delete movie
  app.delete("/api/movies/:id", async (req, res) => {
    try {
      const paramValidation = idParamSchema.safeParse(req.params);

      if (!paramValidation.success) {
        return res.status(400).json({
          status: false,
          message: "Invalid movie ID format",
          errors: paramValidation.error.flatten().fieldErrors,
        });
      }

      const { id } = paramValidation.data;
      
      const existingMovie = await storage.getMovie(id);
      if (!existingMovie) {
        return res.status(404).json({
          status: false,
          message: "Movie not found",
        });
      }

      await storage.deleteMovie(id);

      const response: ApiResponse<null> = {
        status: true,
        message: "Movie deleted successfully",
        data: null,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error deleting movie:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
