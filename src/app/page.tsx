import { getServerAuthSession } from "~/server/auth";
import SignIn from "./_components/SignIn";

export default async function Home() {
  const session = await getServerAuthSession();

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
}
