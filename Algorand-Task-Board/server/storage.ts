import { db } from "./db";
import { tasks, userProfiles, type InsertTask, type InsertUserProfile, type Task, type UserProfile } from "@shared/schema";
import { eq, or } from "drizzle-orm";

export interface IStorage {
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUserId(userId: string): Promise<Task[]>;
  
  createTask(task: InsertTask): Promise<Task>;
  updateTaskStatus(id: number, status: string, workerId?: string, proofText?: string, proofFileUrl?: string): Promise<Task>;
}

export class DatabaseStorage implements IStorage {
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [upserted] = await db
      .insert(userProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: { algorandAddress: profile.algorandAddress }
      })
      .returning();
    return upserted;
  }

  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(tasks.createdAt);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(or(eq(tasks.creatorId, userId), eq(tasks.workerId, userId)));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values({
      ...task,
      contractAppId: Math.floor(Math.random() * 1000000) + 100000, // Mocked Algorand App ID
    }).returning();
    return created;
  }

  async updateTaskStatus(id: number, status: string, workerId?: string, proofText?: string, proofFileUrl?: string): Promise<Task> {
    const [updated] = await db.update(tasks).set({
      status,
      ...(workerId !== undefined ? { workerId } : {}),
      ...(proofText !== undefined ? { proofText } : {}),
      ...(proofFileUrl !== undefined ? { proofFileUrl } : {}),
      updatedAt: new Date()
    }).where(eq(tasks.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
