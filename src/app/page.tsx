import { redirect } from "next/navigation";
import { getCurrentProfile } from "./_libs/getCurrentProfile";
import { prisma } from "./_libs/prisma";
import Link from "next/link";
import CreateTagButton from "./_components/CreateTagButton";

export default async function TermListPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string; tag?: string }>;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const { sort, q, tag } = await searchParams;

  const terms = await prisma.terms.findMany({
    where: {
      userId: profile.id,
      ...(q ? { itemName: { contains: q, mode: "insensitive" } } : {}),
      ...(tag ? { tags: { some: { tagId: Number(tag) } } } : {}),
    },
    orderBy: sort === "name" ? { itemName: "asc" } : { createdAt: "asc" },
  });

  const tags = await prisma.tag.findMany({
    where: {
      userId: profile.id,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center m-2">
        <h1>用語一覧</h1>
        <Link href="/terms/new">
          <button className="border-1">新規登録</button>
        </Link>
      </div>
      <div>
        {tags.map((t) => (
          <Link key={t.id} href={tag === String(t.id) ? "/" : `/?tag=${t.id}`}>
            {t.name}
          </Link>
        ))}
        <CreateTagButton hasTags={tags.length > 0} />
      </div>
      <div>
        <Link href="/">登録順</Link>
        <Link href="/?sort=name">あいうえお順</Link>
      </div>

      <hr className="mt-2 mb-2" />

      <form>
        <input
          className="border-1"
          type="text"
          name="q"
          defaultValue={q}
          placeholder="キーワードの一部でOK"
        />
        <button type="submit">検索</button>
      </form>

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
