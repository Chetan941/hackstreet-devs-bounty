import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.profiles.get.path, isAuthenticated, async (req: any, res) => {
    const profile = await storage.getUserProfile(req.user.claims.sub);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.profiles.upsert.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.profiles.upsert.input.parse(req.body);
      const profile = await storage.upsertUserProfile({ userId: req.user.claims.sub, algorandAddress: input.algorandAddress });
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.get(api.tasks.list.path, isAuthenticated, async (req: any, res) => {
    const role = req.query.role;
    if (role === 'creator' || role === 'worker') {
      const userTasks = await storage.getTasksByUserId(req.user.claims.sub);
      return res.json(userTasks);
    }
    const allTasks = await storage.getTasks();
    res.json(allTasks);
  });

  app.get(api.tasks.get.path, isAuthenticated, async (req: any, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  });

  app.post(api.tasks.create.path, isAuthenticated, async (req: any, res) => {
    try {
      // Ensure rewardAmount is passed as a string because Drizzle's numeric expects string
      const reqBody = { ...req.body, rewardAmount: String(req.body.rewardAmount) };
      const input = api.tasks.create.input.parse(reqBody);
      const task = await storage.createTask({ ...input, creatorId: req.user.claims.sub });
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.post(api.tasks.claim.path, isAuthenticated, async (req: any, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.status !== 'OPEN') return res.status(400).json({ message: "Task is not open" });
    if (task.creatorId === req.user.claims.sub) return res.status(400).json({ message: "Cannot claim own task" });

    const updatedTask = await storage.updateTaskStatus(task.id, 'CLAIMED', req.user.claims.sub);
    res.json(updatedTask);
  });

  app.post(api.tasks.submit.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.tasks.submit.input.parse(req.body);
      const task = await storage.getTask(Number(req.params.id));
      if (!task) return res.status(404).json({ message: "Task not found" });
      if (task.workerId !== req.user.claims.sub) return res.status(400).json({ message: "Only the claimed worker can submit" });
      if (task.status !== 'CLAIMED') return res.status(400).json({ message: "Task is not in claimed status" });

      const updatedTask = await storage.updateTaskStatus(task.id, 'SUBMITTED', undefined, input.proofText, input.proofFileUrl);
      res.json(updatedTask);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.post(api.tasks.approve.path, isAuthenticated, async (req: any, res) => {
    const task = await storage.getTask(Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.creatorId !== req.user.claims.sub) return res.status(400).json({ message: "Only creator can approve" });
    if (task.status !== 'SUBMITTED') return res.status(400).json({ message: "Task is not submitted" });

    const updatedTask = await storage.updateTaskStatus(task.id, 'APPROVED');
    res.json(updatedTask);
  });

  return httpServer;
}
