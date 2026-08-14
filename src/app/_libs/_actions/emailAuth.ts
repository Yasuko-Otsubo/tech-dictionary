"use server";

import { prisma } from "../prisma";
import { createSupabaseServerClient } from "../supabase-server";

export async function signUpWithEmail(formData: FormData) {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || !emailValue) {
    return { error: "メールアドレスを入力してしてください" };
  }

  const passwordValue = formData.get("password");

  if (typeof passwordValue !== "string" || !passwordValue) {
    return { error: "パスワードを入力してください" };
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { email: emailValue },
  });

  if (existingProfile) {
    if (existingProfile.authProvider === "GOOGLE") {
      return { error: "Googleで登録済みのメールアドレスです。" };
    }
    return { error: "このメールアドレスは既に登録されています" };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: emailValue,
    password: passwordValue,
  });

  if (signUpError || !data.user) {
    return { error: "登録に失敗しました" };
  }

  const name = emailValue.split("@")[0];

  await prisma.profile.create({
    data: {
      name,
      email: emailValue,
      authProvider: "EMAIL",
      supabaseUserId: data.user.id,
    },
  });

  return { success: true };
}
