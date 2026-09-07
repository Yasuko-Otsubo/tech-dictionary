import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { prisma } from "@/app/_libs/prisma";
import { notFound, redirect } from "next/navigation";
import DeleteTermButton from "./_components/DeleteTermButton";
import Link from "next/link";

export default async function DetailTerm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }

  const { id } = await params;

  const term = await prisma.terms.findFirst({
    where: {
      id: Number(id),
      userId: profile.id,
    },
  });

  if (!term) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <Link href={`/terms/${term.id}/edit`}>編集</Link>
        <DeleteTermButton id={term.id} />
      </div>
      <div className="p-2">
        <h1 className="text-2xl font-bold mb-2">{term.itemName}</h1>
        {term.itemContent && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">説明</p>
            <p className="text-gray-700">{term.itemContent}</p>
          </div>
        )}
        {term.image && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">画像</p>
            <img
              src={term.image}
              alt={term.itemName}
              className="max-w-full rounded-sm mb-4"
            />
          </div>
        )}
        {term.referenceUrls.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">参考URL</p>
            {term.referenceUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#1F2937] underline hover:text-[#6BA6CC] mb-1"
              >
                参考リンク{index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
