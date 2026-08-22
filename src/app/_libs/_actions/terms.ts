"use server";

import { getCurrentProfile } from "../getCurrentProfile";
import { redirect } from "next/navigation";
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

  const itemName = formData.get("itemName");
  if (typeof itemName !== "string" || !itemName) {
    return { success: false, error: "用語名を入力してください" };
  }

  function toNullableString(value: FormDataEntryValue | null): string | null {
    return typeof value === "string" && value.trim() !== "" ? value : null;
  }

  const itemContentValue = toNullableString(formData.get("itemContent"));
  const referenceUrlValue = toNullableString(formData.get("referenceUrl"));
  const imageValue = toNullableString(formData.get("image"));

  await prisma.terms.create({
    data: {
      itemName,
      itemContent: itemContentValue,
      referenceUrl: referenceUrlValue,
      image: imageValue,
      userId: profile.id,
    },
  });
  return { success: true };
}
