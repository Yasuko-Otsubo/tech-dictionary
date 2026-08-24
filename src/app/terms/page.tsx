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
    <ul>
      {terms.map((term) => (
        <li key={term.id}>
          <Link href={`/terms/${term.id}`}>{term.itemName}</Link>
        </li>
      ))}
    </ul>
  );
}
