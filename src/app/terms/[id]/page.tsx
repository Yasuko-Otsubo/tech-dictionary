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
      <Link href={`/terms/${term.id}/edit`}>編集</Link>
      <DeleteTermButton id={term.id} />
      <div>
        <h1>{term.itemName}</h1>
        {term.itemContent && <p>{term.itemContent}</p>}
        {term.image && <img src={term.image} alt={term.itemName} />}

        {term.referenceUrls.map((url, index) => (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            参考リンク{index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
