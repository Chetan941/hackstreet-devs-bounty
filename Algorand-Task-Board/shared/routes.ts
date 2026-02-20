import { z } from 'zod';
import { insertTaskSchema, insertUserProfileSchema, tasks, userProfiles } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  profiles: {
    get: {
      method: 'GET' as const,
      path: '/api/profiles/me' as const,
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/profiles/me' as const,
      input: z.object({ algorandAddress: z.string() }),
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks' as const,
      input: z.object({
        status: z.string().optional(),
        role: z.enum(['creator', 'worker']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // TaskResponse
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tasks/:id' as const,
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks' as const,
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    claim: {
      method: 'POST' as const,
      path: '/api/tasks/:id/claim' as const,
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    submit: {
      method: 'POST' as const,
      path: '/api/tasks/:id/submit' as const,
      input: z.object({
        proofText: z.string().optional(),
        proofFileUrl: z.string().optional()
      }),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    },
    approve: {
      method: 'POST' as const,
      path: '/api/tasks/:id/approve' as const,
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TaskListResponse = z.infer<typeof api.tasks.list.responses[200]>;
