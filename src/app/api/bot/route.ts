import { type NextRequest, NextResponse } from "next/server";
import { interactionSchema } from "~/utils/bot";

export async function POST(req: NextRequest) {
  const message = interactionSchema.parse(req.body);

  if (message.type === "ping") {
    return NextResponse.json({ type: 1 });
  } else if (message.type === "command") {
  } else {
    console.error("Unknown Type");
    return NextResponse.json({ error: "Unknown Type" });
  }
}
