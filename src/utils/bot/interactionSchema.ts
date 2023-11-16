import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  global_name: z.string().optional(),
  avatar: z.string().optional(),
  bot: z.boolean().optional(),
  system: z.boolean().optional(),
  mfa_enabled: z.boolean().optional(),
  banner: z.string().optional(),
  accent_color: z.number().int().optional(),
  locale: z.string().optional(),
  verified: z.boolean().optional(),
  email: z.string().optional(),
  flags: z.number().int().optional(),
  premium_type: z.number().int().optional(),
  public_flags: z.number().int().optional(),
  avatar_decoration: z.string().optional(),
});

export const memberSchema = z.object({
  user: userSchema.optional(),
  nick: z.string().optional(),
  avatar: z.string().optional(),
  roles: z.array(z.string()),
  joined_at: z.coerce.date(),
  premium_since: z.coerce.date().optional(),
  deaf: z.boolean(),
  mute: z.boolean(),
  flags: z.number(),
  pending: z.boolean().optional(),
  permissions: z.string().optional(),
  communication_disabled_until: z.coerce.date().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  channel_id: z.string(),
  author: userSchema.partial(),
  content: z.string(),
  timestamp: z.coerce.date(),
  edited_timestamp: z.coerce.date().optional(),
  tts: z.boolean(),
  mention_everyone: z.boolean(),
  // mentions	array of user objects	users specifically mentioned in the message
  // mention_roles	array of role object ids	roles specifically mentioned in this message
  // mention_channels?***	array of channel mention objects	channels specifically mentioned in this message
  // attachments**	array of attachment objects	any attached files
  // embeds**	array of embed objects	any embedded content
  // reactions?	array of reaction objects	reactions to the message
  // nonce?	integer or string	used for validating a message was sent
  pinned: z.boolean(),
  webhook_id: z.string().optional(),
  // type	integer	type of message
  // activity?	message activity object	sent with Rich Presence-related chat embeds
  // application?	partial application object	sent with Rich Presence-related chat embeds
  // application_id?	z.string().optional,
  // message_reference?	message reference object	data showing the source of a crosspost, channel follow add, pin, or reply message
  // flags?	integer	message flags combined as a bitfield
  // referenced_message?****	?message object	the message associated with the message_reference
  // interaction?	message interaction object	sent if the message is a response to an Interaction
  // thread?	channel object	the thread that was started from this message, includes thread member object
  // components?**	array of message components	sent if the message contains components like buttons, action rows, or other interactive components
  // sticker_items?	array of message sticker item objects	sent if the message contains stickers
  // stickers?	array of sticker objects	Deprecated the stickers sent with the message
  // position?	integer	A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread
  // role_subscription_data?	role subscription data object	data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message
  // resolved?	resolved data	data for users, members, channels, and roles in the message's auto-populated select menus
});

export const optionSchema = z.object({
  name: z.string(),
  type: z.number(),
  value: z.any(),
});

export const interactionSchema = z.object({
  id: z.string(),
  application_id: z.string(),
  type: z
    .number()
    .min(1)
    .max(5)
    .transform(
      (e) =>
        (["ping", "command", "component", "autocomplete", "submit"] as const)[
          e
        ],
    ),
  data: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    resolved: z.boolean().optional(),
    options: z.array(optionSchema).default([]),
  }),
  member: memberSchema.optional(),
  user: userSchema.optional(),
  token: z.string(),
  version: z.literal(1),
  message: messageSchema.optional(),
  app_permissions: z.string().optional(),
  locale: z.string().optional(),
  guild_locale: z.string().optional(),
});

export type DiscordInteraction = z.infer<typeof interactionSchema>;
export type DiscordUser = z.infer<typeof userSchema>;
export type DiscordMember = z.infer<typeof memberSchema>;
export type DiscordMessage = z.infer<typeof messageSchema>;
