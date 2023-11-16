import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

const uoweme = makeCommand(
  {
    name: "uoweme",
    description: "Adds to your tab with another person",
    options: {
      target: UserOption({
        description: "Person who owes you",
        required: true,
      }),
      payment: StringOption({
        description: "Amount they owe",
        required: true,
      }),
    },
  },

  (caller, { target, payment }) => {
    return "this isnt implemented yet! please check back later.";
  },
);

export default uoweme;
