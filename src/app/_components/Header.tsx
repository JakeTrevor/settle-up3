import Link from "next/link";

import Profile from "./Profile";

export default function Header() {
  return (
    <div className="fixed flex h-20 w-full flex-row items-center justify-between bg-[#FFC517] p-2 px-10">
      <div className="flex flex-row items-center gap-10">
        <Link
          href="/"
          className="btn btn-link font-mono text-xl font-bold normal-case text-black no-underline"
        >
          Settle-up!
        </Link>
      </div>
      <Profile />
    </div>
  );
}
