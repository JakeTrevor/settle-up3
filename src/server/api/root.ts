import { createTRPCRouter } from "~/server/api/trpc";
import { tabRouter } from "./routers/tab";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tab: tabRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
