import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { notFound, redirect } from "next/navigation";
import NewTermForm from "./_components/NewTermForm";
import { prisma } from "@/app/_libs/prisma";

export default async function NewTermPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const tags = await prisma.tag.findMany({
    where: {
      userId: profile.id,
    },
  });

  return <NewTermForm tags={tags}/>;
}
