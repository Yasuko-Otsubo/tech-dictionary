"use server"

import { redirect } from "next/navigation";
import { getCurrentProfile } from "../getCurrentProfile";
import { prisma } from "../prisma";

type TagResponse = { success: true } | { success: false; error: string };

export async function createTag(name: string, color: string): Promise<TagResponse>{
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!name || name.trim() === "" ) {
    return { success: false, error: "タグ名を入力してください" };
  }

  const existing = await prisma.tag.findFirst({
    where: { userId: profile.id, name },
  });

  if (existing) {
    return { success: false, error: "同じ名前のタグが既に存在します。"};
  }

  await prisma.tag.create({
    data: {
      name,
      color,
      userId: profile.id,
    },
  });

  return { success: true };
}

export async function deleteTag(id: number) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const tag = await prisma.tag.findFirst({
    where: { id, userId: profile.id },
  });

  if (!tag) {
    return;
  }

  await prisma.tag.delete({
    where: { id },
  });
}