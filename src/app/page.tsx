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
      <h1 className="text-2xl font-bold p-2">用語一覧</h1>
      <form>
        <input
          className="border mr-2 px-2 py-1 rounded-sm"
          type="text"
          name="q"
          defaultValue={q}
          placeholder="キーワードの一部でOK"
        />
        <button
          type="submit"
          className="inline-block border rounded-sm px-2 py-1 hover:bg-[#E4F1F8] cursor-pointer "
        >
          検索
        </button>
      </form>

      <div className="flex gap-2 justify-between items-center mt-2 mb-2">
        <div>
          {tags.map((t) => {
            const isActive = tag === String(t.id);
            return (
              <Link
                key={t.id}
                href={isActive ? "/" : `/?tag=${t.id}`}
                className={`inline-block border rounded-sm px-2 py-1 mr-2 ${
                  isActive ? "bg-[#E4F1F8] text-[#1F2937] border-[#7FB9DE]" : ""
                }`}
              >
                {t.name}
              </Link>
            );
          })}
          <CreateTagButton hasTags={tags.length > 0} />
        </div>
        <Link href="/terms/new">
          <button className="border px-2 py-1 bg-[#7FB9DE] text-[#1F2937] rounded-sm hover:bg-[#6BA6CC] hover:text-white">
            新規登録
          </button>
        </Link>
      </div>
      <hr className="mt-2 mb-2" />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{terms.length}件</p>
        <div className="flex gap-2">
          <Link
            href="/"
            className={
              !sort || sort !== "name" ? "text-[#1F2937] font-semibold" : ""
            }
          >
            登録順
          </Link>
          <Link
            href="/?sort=name"
            className={sort === "name" ? "text-[#1F2937] font-semibold" : ""}
          >
            あいうえお順
          </Link>
        </div>
      </div>
      {terms.length === 0 ? (
        <p className="text-gray-500 mt-4">該当するものがありません</p>
      ) : (
        <ul>
          {terms.map((term) => (
            <li key={term.id}>
              <Link href={`/terms/${term.id}`} className="hover:bg-gray-100">
                {term.itemName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
