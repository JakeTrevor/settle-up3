import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

export const api = appRouter.createCaller({
  db,
  session: null,
  // @ts-expect-error headers can't be defined here because we aren't actually making a request
  headers: undefined,
});
