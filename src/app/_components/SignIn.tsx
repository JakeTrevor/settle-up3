import { signIn } from "next-auth/react";
import type { FC } from "react";

const SignIn: FC = () => {
  return (
    <button
      className="rounded-full bg-sky-400 px-6 py-3 font-mono text-xl font-semibold text-blue-950 transition-all duration-200 hover:scale-105 hover:bg-sky-500 hover:text-white"
      onClick={() => void signIn()}
    >
      Sign In
    </button>
  );
};

export default SignIn;
