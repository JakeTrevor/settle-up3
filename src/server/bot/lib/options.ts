type optionBase = { required?: boolean; description: string };

export const StringOption = <
  T extends optionBase &
    (
      | {
          max_length?: number;
          min_length?: number;
          choices?: {
            name: string;
            value: string;
          }[];
          autocomplete?: false;
        }
      | {
          max_length?: number;
          min_length?: number;
          autocomplete: true;
        }
    ),
>(
  args: T,
) => {
  return { ...args, type: 3 as const };
};

export const NumberOption = <
  T extends optionBase &
    (
      | {
          max?: number;
          min?: number;
          choices?: {
            name: string;
            value: number;
          }[];
          autocomplete?: false;
        }
      | {
          max?: number;
          min?: number;
          autocomplete: true;
        }
    ),
>(
  args: T,
) => {
  return { ...args, type: 10 as const };
};

export const IntegerOption = <
  T extends optionBase &
    (
      | {
          max?: number;
          min?: number;
          choices?: {
            name: string;
            value: number;
          }[];
          autocomplete?: false;
        }
      | {
          max?: number;
          min?: number;
          autocomplete: true;
        }
    ),
>(
  args: T,
) => {
  return { ...args, type: 4 as const };
};

// boilerplate options:
export const BooleanOption = <T extends optionBase>(args: T) => {
  return { ...args, type: 5 as const };
};

export const UserOption = <T extends optionBase>(args: T) => {
  return { ...args, type: 6 as const };
};

// export let RoleOption = <T extends optionBase>(args: T) => {
//   return { ...args, type: 8 };
// };

// export let MentionableOption = <T extends optionBase>(args: T) => {
//   return { ...args, type: 9 };
// };

// export let ChannelOption = <T extends optionBase>(args: T) => {
//   return { ...args, type: 7 };
// };

// export let AttachmentOption = <T extends optionBase>(args: T) => {
//   return { ...args, type: 11 };
// };

export type Option =
  | ReturnType<typeof StringOption>
  | ReturnType<typeof NumberOption>
  | ReturnType<typeof IntegerOption>
  | ReturnType<typeof BooleanOption>
  | ReturnType<typeof UserOption>;
// | ReturnType<typeof RoleOption>
// | ReturnType<typeof MentionableOption>
// | ReturnType<typeof ChannelOption>
// | ReturnType<typeof AttachmentOption>;
