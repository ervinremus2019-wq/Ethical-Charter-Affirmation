import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const affirmations = pgTable("affirmations", {
  id: serial("id").primaryKey(),
  certificateId: text("certificate_id").unique().notNull(),
  fullName: text("full_name").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  consent: boolean("consent").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const insertAffirmationSchema = createInsertSchema(affirmations).omit({
  id: true,
  timestamp: true,
  certificateId: true,
}).extend({
  fullName: z.string().min(2, "Name is too short").max(100, "Name is too long"),
  consent: z.boolean().refine(v => v === true, "Consent is required"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertAffirmation = z.infer<typeof insertAffirmationSchema>;
export type Affirmation = typeof affirmations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
