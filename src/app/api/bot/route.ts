import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";
import { commandHandler } from "~/server/bot/command";
import { verifyInteractionRequest } from "~/utils/validateRequest";

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
      data: await commandHandler.handler(interaction),
    });
  }

  return new NextResponse("Unknown command", { status: 400 });
}
