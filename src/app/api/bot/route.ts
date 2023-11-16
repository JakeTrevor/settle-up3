import { verifyKey } from "discord-interactions";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { commandHandler } from "~/server/bot/command";
import { interactionSchema } from "~/utils/bot";

export async function POST(req: NextRequest) {
  const message = interactionSchema.parse(await req.json());

  if (message.type === "ping") {
    return NextResponse.json({ type: 1 });
  } else if (message.type === "command") {
    const rawBody = (await req.body!.getReader().read()).value!;

    const isValidRequest = verifyKey(
      rawBody,
      req.headers.get("x-signature-ed25519")!,
      req.headers.get("x-signature-timestamp")!,
      env.DISCORD_PUBLIC_KEY,
    );

    if (!isValidRequest) {
      return NextResponse.json({ status: 401, error: "Bad request signature" });
    }

    return NextResponse.json({
      type: 4,
      data: {
        content: await commandHandler.handler(message),
      },
    });
  } else {
    console.error("Unknown Type");
    return NextResponse.json({ status: 400, error: "Unknown Type" });
  }
}
