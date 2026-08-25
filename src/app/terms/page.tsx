import { redirect } from "next/navigation";
import { getCurrentProfile } from "../_libs/getCurrentProfile";
import { prisma } from "../_libs/prisma";
import Link from "next/link";

export default async function TermListPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const terms = await prisma.terms.findMany({
    where: { userId: profile.id },
  });

  return (
    <div>
      <div className="flex justify-between items-center m-2">
        <h1>用語一覧</h1>
        <Link href="/terms/new">
          <button className="border-1">新規登録</button>
        </Link>
      </div>

      <hr className="mt-2 mb-2" />

      <ul>
        {terms.map((term) => (
          <li key={term.id}>
            <Link href={`/terms/${term.id}`}>{term.itemName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
