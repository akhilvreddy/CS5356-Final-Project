// db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, date, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }),
  phone_number: varchar("phone_number", { length: 20 }),
  created_at: timestamp("created_at").defaultNow(),
});

export const circles = pgTable("circles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  code: varchar("code", { length: 12 }).notNull().unique(),
  creator_id: uuid("creator_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const circle_members = pgTable("circle_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  circle_id: uuid("circle_id").notNull(),
}, (table) => ({
  userCircleUnique: uniqueIndex("user_circle_unique").on(table.user_id, table.circle_id),
}));

export const wordle_scores = pgTable("wordle_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  date: date("date").notNull(),
  guesses: integer("guesses").notNull(),
  raw_result: text("raw_result"),
  submitted_at: timestamp("submitted_at").defaultNow(),
}, (table) => ({
  userDateUnique: uniqueIndex("user_date_unique").on(table.user_id, table.date),
}));