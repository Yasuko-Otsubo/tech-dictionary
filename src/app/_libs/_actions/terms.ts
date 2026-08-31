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

  const { tags: tagNames, referenceUrls, ...termData } = parsed.data;

  const selectedTags = await prisma.tag.findMany({
    where: {
      userId: profile.id,
      name: { in: tagNames ?? []},
    },
  });

  await prisma.terms.create({
    data: {
      ...termData,
      referenceUrls: referenceUrls?.map((r) => r.value) ?? [],
      userId: profile.id,
      tags: {
        create: selectedTags.map((tag) => ({ tagId: tag.id })),
      },
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

  const { tags: tagNames, referenceUrls,  ...termData } = parsed.data;

  const selectedTags = await prisma.tag.findMany({
    where: {
      userId: profile.id,
      name: { in: tagNames ?? [] },
    },
  });

  await prisma.terms.update({
    where: { id },
    data: {
      ...termData,
      referenceUrls: referenceUrls?.map((r) => r.value) ?? [],
      tags: {
        deleteMany: {},
        create: selectedTags.map((tag) => ({ tagId: tag.id })),
      },
    },
  });

  return { success: true };
}
