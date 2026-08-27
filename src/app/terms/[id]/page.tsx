import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { prisma } from "@/app/_libs/prisma";
import { notFound, redirect } from "next/navigation";
import DeleteTermButton from "./_components/DeleteTermButton";

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
      <DeleteTermButton id={term.id}/>
      <div>
        <h1>{term.itemName}</h1>
        {term.itemContent && <p>{term.itemContent}</p>}
        {term.referenceUrl && (
          <a href={term.referenceUrl} target="_blank" rel="noopener noreferrer">
            参考リンク
          </a>
        )}
        {term.image && <img src={term.image} alt={term.itemName} />}
      </div>
    </div>
  );
}
