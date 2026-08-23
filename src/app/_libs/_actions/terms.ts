"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "../getCurrentProfile";
import { termSchema } from "./schemas/terms";
import { prisma } from "../prisma";

type TermResponse = { success: true } | { success: false; error: string };

export async function createTerm(
  prevState: TermResponse | null,
  formData: FormData,
): Promise<TermResponse> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  const parsed = termSchema.safeParse({
    itemName: formData.get("itemName"),
    itemContent: formData.get("itemContent"),
    referenceUrl: formData.get("referenceUrl"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.terms.create({
    data: {
      itemName: parsed.data.itemName,
      itemContent: parsed.data.itemContent,
      referenceUrl: parsed.data.referenceUrl,
      image: parsed.data.image,
      userId: profile.id,
    },
  });

  return { success: true };
}
