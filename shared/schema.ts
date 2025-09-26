import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  skinType: text("skin_type").notNull(),
  concerns: json("concerns").$type<string[]>().notNull(),
  allergies: json("allergies").$type<string[]>().notNull(),
  lifestyle: json("lifestyle").$type<string[]>().notNull(),
  additionalInfo: text("additional_info").default(""),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  skinType: true,
  concerns: true,
  allergies: true,
  lifestyle: true,
  additionalInfo: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
