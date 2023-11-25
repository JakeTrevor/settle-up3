import type { NextPage } from "next";
import { useSession } from "next-auth/react";

import SignIn from "./_components/SignIn";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div>
        {session?.user ? (
          <h1 className="font-mono text-xl text-white">
            Welcome <span className="text-sky-400">{session.user.name} </span>
            to <span className="font-bold">settle-up</span>
          </h1>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
};

export default Home;
