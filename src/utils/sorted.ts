import { type User } from "@prisma/client";

export default function sorted(a: User, b: User) {
  return a.id < b.id ? ([a, b, false] as const) : ([b, a, true] as const);
}
