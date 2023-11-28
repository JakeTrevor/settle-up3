import { getServerAuthSession } from "~/server/auth";

export default async function Profile() {
  const session = await getServerAuthSession();

  const id = session?.user.id;

  if (!id) return <div>not logged in</div>;
  return (
    <div className="-mt-20 flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-row flex-wrap items-end justify-center gap-10 px-8">
        profile page
      </div>
    </div>
  );
}
