import {
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { commandHandler } from "~/server/bot/command";
import { verifyInteractionRequest } from "~/utils/validateRequest";

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge";

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(
    request,
    env.DISCORD_PUBLIC_KEY,
  );
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 });
  }
  const { interaction } = verifyResult;

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong });
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: await commandHandler.handler(interaction),
        flags: MessageFlags.Ephemeral,
      },
    });
  }

  return new NextResponse("Unknown command", { status: 400 });
}
