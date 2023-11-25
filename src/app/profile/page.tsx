import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const Profile: NextPage = () => {
  const { data: session } = useSession();

  const id = session?.user.id;

  if (!id) return <div>not logged in</div>;
  return (
    <div className="-mt-20 flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-row flex-wrap items-end justify-center gap-10 px-8">
        profile page
      </div>
    </div>
  );
};

export default Profile;
