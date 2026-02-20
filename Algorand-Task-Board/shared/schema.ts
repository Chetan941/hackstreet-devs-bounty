import { pgTable, text, varchar, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
import { users } from "./models/auth";

export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  algorandAddress: varchar("algorand_address"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  rewardAmount: numeric("reward_amount").notNull(), // in Algos
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  workerId: varchar("worker_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default('OPEN'), // OPEN, CLAIMED, SUBMITTED, APPROVED
  proofText: text("proof_text"),
  proofFileUrl: text("proof_file_url"),
  contractAppId: integer("contract_app_id"), // Mocked Algorand App ID for the escrow
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  creator: one(users, {
    fields: [tasks.creatorId],
    references: [users.id],
    relationName: "taskCreator"
  }),
  worker: one(users, {
    fields: [tasks.workerId],
    references: [users.id],
    relationName: "taskWorker"
  })
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id]
  })
}));

export const insertTaskSchema = createInsertSchema(tasks).omit({ 
  id: true, 
  creatorId: true, 
  workerId: true, 
  status: true,
  proofText: true,
  proofFileUrl: true,
  contractAppId: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertUserProfileSchema = createInsertSchema(userProfiles);

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

// API Request/Response Types
export type CreateTaskRequest = InsertTask;
export type ClaimTaskRequest = {};
export type SubmitTaskRequest = { proofText?: string; proofFileUrl?: string };
export type ApproveTaskRequest = {};

// Responses
export type TaskResponse = Task & { creator?: any, worker?: any };
