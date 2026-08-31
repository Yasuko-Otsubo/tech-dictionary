"use server"

import { redirect } from "next/navigation";
import { getCurrentProfile } from "../getCurrentProfile";
import { prisma } from "../prisma";

type TagResponse = { success: true } | { success: false; error: string };

export async function createTag(name: string): Promise<TagResponse>{
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!name || name.trim() === "" ) {
    return { success: false, error: "タグ名を入力してください" };
  }

  await prisma.tag.create({
    data: {
      name,
      userId: profile.id,
    },
  });

  return { success: true };
}