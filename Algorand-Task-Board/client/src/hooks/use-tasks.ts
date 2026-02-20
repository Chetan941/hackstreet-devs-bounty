import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTask } from "@shared/schema";

// GET /api/tasks
export function useTasks(filters?: { status?: string; role?: 'creator' | 'worker' }) {
  return useQuery({
    queryKey: [api.tasks.list.path, filters],
    queryFn: async () => {
      const url = buildUrl(api.tasks.list.path);
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append("status", filters.status);
      if (filters?.role) queryParams.append("role", filters.role);
      
      const res = await fetch(`${url}?${queryParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.tasks.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/tasks/:id
export function useTask(id: number) {
  return useQuery({
    queryKey: [api.tasks.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tasks.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch task");
      return api.tasks.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/tasks
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTask) => {
      const validated = api.tasks.create.input.parse(data);
      const res = await fetch(api.tasks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Validation failed");
        }
        throw new Error("Failed to create task");
      }
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
    },
  });
}

// POST /api/tasks/:id/claim
export function useClaimTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tasks.claim.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to claim task");
      return api.tasks.claim.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tasks.get.path, data.id] });
    },
  });
}

// POST /api/tasks/:id/submit
export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, proofText, proofFileUrl }: { id: number; proofText?: string; proofFileUrl?: string }) => {
      const url = buildUrl(api.tasks.submit.path, { id });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofText, proofFileUrl }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to submit task");
      return api.tasks.submit.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tasks.get.path, data.id] });
    },
  });
}

// POST /api/tasks/:id/approve
export function useApproveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tasks.approve.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to approve task");
      return api.tasks.approve.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tasks.get.path, data.id] });
    },
  });
}
