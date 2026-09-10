import { redirect } from "next/navigation";
import { getCurrentProfile } from "./_libs/getCurrentProfile";
import { prisma } from "./_libs/prisma";
import Link from "next/link";
import CreateTagButton from "./_components/CreateTagButton";
import DeleteTagButton from "./_components/DeleteTagButton";
import { BUTTON_BASE, BUTTON_PRIMARY, LABEL_TEXT } from "./_libs/buttonStyles";
import MemorizedButton from "./_components/MemorizedButton";

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

  const [terms, tags] = await Promise.all([
    prisma.terms.findMany({
      where: {
        userId: profile.id,
        ...(q ? { itemName: { contains: q, mode: "insensitive" } } : {}),
        ...(tag ? { tags: { some: { tagId: Number(tag) } } } : {}),
      },
      orderBy: sort === "name" ? { itemName: "asc" } : { createdAt: "asc" },
    }),
    prisma.tag.findMany({
      where: {
        userId: profile.id,
      },
    }),
  ]);

  return (
    <div>
      <form>
        <Link href="/terms/new">
          <button className={`${BUTTON_PRIMARY} whitespace-nowrap`}>
            新規登録
          </button>
        </Link>
      </form>

      <div className="flex gap-2 justify-between items-center mt-2 mb-2">
        <div>
          {tags.map((t) => {
            const isActive = tag === String(t.id);
            return (
              <div
                key={t.id}
                style={{ backgroundColor: t.color }}
                className={`inline-block border rounded-sm px-2 py-1 mr-2 mb-2 text-[#1F2937] ${
                  isActive ? "ring-2 ring-offset-1 ring-gray-800 " : ""
                }`}
              >
                <Link href={isActive ? "/" : `/?tag=${t.id}`}>{t.name}</Link>
                <DeleteTagButton id={t.id} />
              </div>
            );
          })}
          <CreateTagButton hasTags={tags.length > 0} />
        </div>
      </div>
      <hr className="mt-2 mb-2" />

      <input
        className="border mr-2 px-2 py-1 rounded-sm"
        type="text"
        name="q"
        defaultValue={q}
        placeholder="キーワードの一部でOK"
      />
      <button
        type="submit"
        className={`inline-block ${BUTTON_BASE} hover:bg-[#E4F1F8] cursor-pointer `}
      >
        検索
      </button>

      <div className="flex justify-between items-center">
        <p className={LABEL_TEXT}>{terms.length}件</p>
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
            <li key={term.id} className="flex justify-between items-center lock px-2 py-2 hover:bg-gray-100">
              <Link
                href={`/terms/${term.id}`}
                className="block px-2 py-2 hover:bg-gray-100"
              >
                ・{term.itemName}
              </Link>
              <MemorizedButton id={term.id} isMemorized={term.isMemorized} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
