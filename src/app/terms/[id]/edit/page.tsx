import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { prisma } from "@/app/_libs/prisma";
import { notFound, redirect } from "next/navigation";
import EditTermForm from "../_components/EditTermForm";
import Link from "next/link";

export default async function UpdateTerm({
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
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!term) {
    notFound();
  }

  const tags = await prisma.tag.findMany({
    where: {
      userId: profile.id,
    },
  });

  return (
    <div>
      <Link href="/" className="text-sm text-gray-400 hover:text-[#1F2937]">
        ←　一覧に戻る
      </Link>
      <EditTermForm
      tags={tags}
        id={term.id}
        defaultValues={{
          itemName: term.itemName,
          itemContent: term.itemContent ?? "",
          referenceUrls: term.referenceUrls.map((url) => ({ value: url })),
          image: term.image ?? "",
          tags: term.tags.map((t) => t.tag.name),
        }}
      />
    </div>
  );
}
