import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  director: varchar("director", { length: 255 }).notNull(),
  budget: varchar("budget", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  yearTime: varchar("year_time", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMovieSchema = createInsertSchema(movies, {
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  type: z.enum(["Movie", "TV Show"], { errorMap: () => ({ message: "Type must be either Movie or TV Show" }) }),
  director: z.string().min(1, "Director is required").max(255),
  budget: z.string().min(1, "Budget is required").max(100),
  location: z.string().min(1, "Location is required").max(255),
  duration: z.string().min(1, "Duration is required").max(50),
  yearTime: z.string().min(1, "Year/Time is required").max(50),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export interface PaginatedResponse<T> {
  status: boolean;
  message?: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}
