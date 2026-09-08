import { getCurrentProfile } from "@/app/_libs/getCurrentProfile";
import { redirect } from "next/navigation";
import NewTermForm from "./_components/NewTermForm";
import { prisma } from "@/app/_libs/prisma";
import Link from "next/link";

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

  return (
    <div>
      <Link href="/" className="text-sm text-gray-400 hover:text-[#1F2937]">
        ←　一覧に戻る
      </Link>
      <NewTermForm tags={tags} />;
    </div>
  );
}
