import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const navigation = pgTable("navigation", {
  id: serial("id").primaryKey(),
  structure: jsonb("structure").notNull(),
});
