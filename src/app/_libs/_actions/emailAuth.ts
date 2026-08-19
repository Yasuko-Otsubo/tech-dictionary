"use server";

import { prisma } from "../prisma";
import { createSupabaseServerClient } from "../supabase-server";

type AuthResponse = { success: true } | { success: false; error: string };

export async function signUpWithEmail(
  prevState: AuthResponse | null,
  formData: FormData,
): Promise<AuthResponse> {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || !emailValue) {
    return { success: false, error: "メールアドレスを入力してしてください" };
  }

  const passwordValue = formData.get("password");

  if (typeof passwordValue !== "string" || !passwordValue) {
    return { success: false, error: "パスワードを入力してください" };
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { email: emailValue },
  });

  if (existingProfile) {
    if (existingProfile.authProvider === "GOOGLE") {
      return {
        success: false,
        error: "Googleで登録済みのメールアドレスです。",
      };
    }
    return {
      success: false,
      error: "このメールアドレスは既に登録されています",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: emailValue,
    password: passwordValue,
  });

  if (signUpError || !data.user) {
    return { success: false, error: "登録に失敗しました" };
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

export async function signInWithEmail(
  prevState: AuthResponse | null,
  formData: FormData,
): Promise<AuthResponse> {
  const emailValue = formData.get("email");

  if (typeof emailValue !== "string" || !emailValue) {
    return { success: false, error: "メールアドレスを入力してください" };
  }

  const passwordValue = formData.get("password");

  if (typeof passwordValue !== "string" || !passwordValue) {
    return { success: false, error: "パスワードを入力してください" };
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { email: emailValue },
  });

  if (existingProfile?.authProvider === "GOOGLE") {
    return {
      success: false,
      error:
        "Googleで登録されたメールアドレスです。Googleでログインしてください。",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: emailValue,
    password: passwordValue,
  });

  if (signInError || !data.user) {
    return { success: false, error: "ログインに失敗しました" };
  }

  return { success: true };
}
