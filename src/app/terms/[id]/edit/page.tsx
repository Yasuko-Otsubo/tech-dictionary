import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { prisma } from "@/app/_libs/prisma";
import { notFound, redirect } from "next/navigation";
import EditTermForm from "../_components/EditTermForm";

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
  });

  if (!term) {
    notFound();
  }

  return (
    <div>
      <EditTermForm
        id={term.id}
        defaultValues={{
          itemName: term.itemName,
          itemContent: term.itemContent ?? "",
          referenceUrl: term.referenceUrl ?? "",
          image: term.image ?? "",
        }}
      />
    </div>
  );
}
