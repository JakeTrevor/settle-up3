import Image from "next/image";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import SignIn from "./SignIn";

export default async function Profile() {
  const session = await getServerAuthSession();
  const user = session?.user;

  return (
    <>
      {user ? (
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-link btn">
            <Image
              className="rounded-full object-cover object-center"
              alt="Profile Picture"
              width={60}
              height={60}
              src={user.image ?? "/default.jpg"}
            />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-slate-800 p-2 shadow"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/leaderboard">Leaderboard</Link>
            </li>
          </ul>
        </div>
      ) : (
        <SignIn />
      )}
    </>
  );
}
