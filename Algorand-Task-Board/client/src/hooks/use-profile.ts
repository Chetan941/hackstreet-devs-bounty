import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// GET /api/profiles/me
export function useProfile() {
  return useQuery({
    queryKey: [api.profiles.get.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/profiles/me
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { algorandAddress: string }) => {
      const res = await fetch(api.profiles.upsert.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      return api.profiles.upsert.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.get.path] });
    },
  });
}
