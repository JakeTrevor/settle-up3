/**
 * Registers commands for your Discord bot.
 *
 * This file is meant to be run from the command line, and is not used by the
 * application server. It only needs to be run once.
 * Requires Node 18+ for built-in fetch, otherwise you need to polyfill fetch.
 *
 * ===== Usage =====
 * Run `yarn register-commands` from the root of the repository.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
 */

import "dotenv/config";

import { env } from "./env.mjs";
import { commands } from "./server/bot/command";

const URL = `https://discord.com/api/v10/applications/${env.DISCORD_CLIENT_ID}/commands`;

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
 */
async function main() {
  console.log(
    JSON.stringify(
      commands.map((e) => {
        const { options, ...rest } = e.meta;

        return {
          ...rest,
          options: Object.entries(options).map(([name, data]) => ({
            name,
            ...data,
          })),
        };
      }),
    ),
  );
  const response = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify(
      commands.map((e) => {
        const { options, ...rest } = e.meta;

        return {
          ...rest,
          options: Object.entries(options).map(([name, data]) => ({
            name,
            ...data,
          })),
        };
      }),
    ),
  });

  if (response.ok) {
    console.log("Registered all commands");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error("Error registering commands");
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) {
        errorText = `${errorText} \n\n ${error}`;
      }
    } catch (err) {
      console.error("Error reading body from request:", err);
    }
    console.error(errorText);
  }
}

void main();
