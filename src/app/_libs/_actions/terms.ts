"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "../getCurrentProfile";
import { TermFormValues, termSchema } from "./schemas/terms";
import { prisma } from "../prisma";

type TermResponse = { success: true } | { success: false; error: string };

export async function createTerm(data: TermFormValues): Promise<TermResponse> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const parsed = termSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.terms.create({
    data: {
      ...parsed.data,
      userId: profile.id,
    },
  });

  return { success: true };
}

export async function deleteTerm(id: number) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const term = await prisma.terms.findFirst({
    where: { id, userId: profile.id },
  });

  if (!term) {
    return;
  }

  await prisma.terms.delete({
    where: { id },
  });
}

export async function updateTerm(
  id: number,
  data: TermFormValues,
): Promise<TermResponse> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const parsed = termSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const term = await prisma.terms.findFirst({
    where: { id, userId: profile.id },
  });

  if (!term) {
    return { success: false, error: "更新対象が見つかりません" };
  }

  await prisma.terms.update({
    where: { id },
    data: {
      ...parsed.data,
    },
  });

  return { success: true };
}
